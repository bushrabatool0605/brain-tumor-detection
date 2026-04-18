import io
import cv2
import pytz
import base64
import numpy as np
import tensorflow as tf
from PIL import Image
from datetime import datetime
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from database import SessionLocal, Scan, Patient
from model_loader import model, class_names

router = APIRouter()

# --------------------------------------------------
# 1. PREPROCESSING
# --------------------------------------------------
def preprocess_image(contents):
    img = Image.open(io.BytesIO(contents))
    if img.mode != "RGB":
        img = img.convert("RGB")
    img = img.resize((224, 224))
    img_arr = np.array(img) / 255.0
    return np.expand_dims(img_arr, axis=0).astype(np.float32)


# --------------------------------------------------
# 2. GRAD-CAM  (fixed — works with functional models)
# --------------------------------------------------
def generate_gradcam(img_batch, model, last_conv_layer_name="block5_conv3"):
    try:
        grad_model = tf.keras.models.Model(
            inputs=model.inputs,
            outputs=[
                model.get_layer(last_conv_layer_name).output,
                model.output
            ]
        )

        img_tensor = tf.constant(img_batch, dtype=tf.float32)

        with tf.GradientTape() as tape:
            tape.watch(img_tensor)
            outputs = grad_model(img_tensor)
            conv_output = outputs[0]   # (1, 14, 14, 512)
            preds = outputs[1]         # tensor ya list

            # Handle list output
            if isinstance(preds, (list, tuple)):
                preds = tf.stack(preds, axis=0)
                preds = tf.reshape(preds, (1, -1))

            # Force 2D: (1, num_classes)
            preds = tf.reshape(preds, (1, -1))
            pred_index = int(np.argmax(preds.numpy()[0]))

            # ONE-HOT multiply — gradient ka sahi tarika
            one_hot = tf.one_hot([pred_index], preds.shape[-1])  # (1, 4)
            class_score = tf.reduce_sum(preds * one_hot)          # scalar tensor

        grads = tape.gradient(class_score, conv_output)  # (1, 14, 14, 512)
        
        # Check grads
        if grads is None:
            print("[GradCAM] grads is None!")
            return None

        pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2))  # (512,)

        conv_map = conv_output[0]                              # (14, 14, 512)
        heatmap = conv_map @ pooled_grads[..., tf.newaxis]    # (14, 14, 1)
        heatmap = tf.squeeze(heatmap).numpy()                 # (14, 14)

        heatmap = np.maximum(heatmap, 0)
        heatmap = heatmap / (heatmap.max() + 1e-10)

        # Original image
        original_img = np.clip(img_batch[0] * 255, 0, 255).astype(np.uint8)
        original_bgr = cv2.cvtColor(original_img, cv2.COLOR_RGB2BGR)

        heatmap_resized = cv2.resize(heatmap, (224, 224))
        heatmap_colored = cv2.applyColorMap(
            np.uint8(255 * heatmap_resized), cv2.COLORMAP_JET
        )

        overlayed = cv2.addWeighted(original_bgr, 0.5, heatmap_colored, 0.5, 0)

        # Contour
        high_mask = (heatmap_resized > 0.7).astype(np.uint8) * 255
        contours, _ = cv2.findContours(
            high_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE
        )
        if contours:
            cv2.drawContours(overlayed, contours, -1, (0, 255, 255), 2)

        _, buffer = cv2.imencode('.jpg', overlayed)
        return base64.b64encode(buffer).decode('utf-8')

    except Exception as e:
        print(f"[GradCAM Error] {e}")
        return None
# --------------------------------------------------
# 3. PREDICT ENDPOINT
# --------------------------------------------------
@router.post("/predict")
async def predict(
    file: UploadFile = File(...),
    patient_name: str = Form(...),
    patient_age: int = Form(...),
    patient_gender: str = Form(...)
):
    contents = await file.read()
    img_batch = preprocess_image(contents)

    preds = model.predict(img_batch)[0]          # shape: (num_classes,)

    notumor_idx = class_names.index('notumor') if 'notumor' in class_names else -1
    label = class_names[int(np.argmax(preds))]

    tumor_status = "Yes" if label != 'notumor' else "No"
    confidence = (
        float(1 - preds[notumor_idx])
        if tumor_status == "Yes"
        else float(preds[notumor_idx])
    )

    pakistan_tz = pytz.timezone("Asia/Karachi")
    now = datetime.now(pakistan_tz)

    db = SessionLocal()
    try:
        new_patient = Patient(
            name=patient_name,
            age=patient_age,
            gender=patient_gender
        )
        db.add(new_patient)
        db.commit()
        db.refresh(new_patient)

        scan = Scan(
            patient_id=new_patient.id,
            image_name=file.filename,
            tumor=tumor_status,
            tumor_type=None,
            detection_confidence=confidence,
            date=now
        )
        db.add(scan)
        db.commit()
        db.refresh(scan)
    finally:
        db.close()

    return {
        "tumor": tumor_status,
        "prediction": label,
        "confidence1": confidence,
        "scan_id": scan.id
    }


# --------------------------------------------------
# 4. CLASSIFY + GRAD-CAM ENDPOINT
# --------------------------------------------------
@router.post("/classify")
async def classify(
    file: UploadFile = File(...),
    scan_id: int = Form(...)
):
    contents = await file.read()
    img_batch = preprocess_image(contents)

    preds = model.predict(img_batch)[0]
    idx = int(np.argmax(preds))
    label = class_names[idx]
    confidence2 = float(preds[idx])
    tumor_type = "Unknown" if label == 'notumor' else label.capitalize()

    # DEBUG — yeh add karo temporarily
    print(f"DEBUG label: {label}")
    print(f"DEBUG img_batch shape: {img_batch.shape}")
    print(f"DEBUG img_batch dtype: {img_batch.dtype}")
    print(f"DEBUG img_batch min/max: {img_batch.min():.3f} / {img_batch.max():.3f}")
    
    heatmap_b64 = generate_gradcam(img_batch, model) if label != 'notumor' else None
    
    print(f"DEBUG heatmap result: {heatmap_b64 is not None}")
    # DEBUG END

    db = SessionLocal()
    try:
        scan = db.query(Scan).filter(Scan.id == scan_id).first()
        if scan:
            scan.tumor_type = tumor_type
            scan.classification_confidence = confidence2
            db.commit()
    finally:
        db.close()

    return {
        "tumor_type": tumor_type,
        "confidence2": confidence2,
        "heatmap": heatmap_b64
    }

# --------------------------------------------------
# 5. HISTORY ENDPOINT
# --------------------------------------------------
@router.get("/history")
def get_history():
    db = SessionLocal()
    try:
        scans = db.query(Scan).order_by(Scan.date.desc()).all()
        history = []
        for scan in scans:
            history.append({
                "scan_id": scan.id,
                "patient_name": scan.patient.name if scan.patient else "Unknown",
                "image_name": scan.image_name,
                "tumor": scan.tumor,
                "tumor_type": scan.tumor_type,
                "detection_confidence": scan.detection_confidence,
                "classification_confidence": scan.classification_confidence,
                "date": scan.date.strftime("%d %b %Y, %I:%M %p")
            })
        return history
    finally:
        db.close()


# --------------------------------------------------
# 6. DELETE ENDPOINT
# --------------------------------------------------
@router.delete("/history/{scan_id}")
def delete_scan(scan_id: int):
    db = SessionLocal()
    try:
        scan = db.query(Scan).filter(Scan.id == scan_id).first()
        if not scan:
            raise HTTPException(status_code=404, detail="Scan not found")
        db.delete(scan)
        db.commit()
        return {"message": "Record deleted successfully"}
    finally:
        db.close()