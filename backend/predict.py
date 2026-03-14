from fastapi import APIRouter, UploadFile, File, Form
from database import SessionLocal, Scan
from datetime import datetime
import pytz
import numpy as np
from PIL import Image
import io

from model_loader import model, class_names

router = APIRouter()

# ✅ Helper function for preprocessing
def preprocess_image(contents):
    img = Image.open(io.BytesIO(contents)).convert("RGB")
    img = img.resize((224, 224))
    img_arr = np.array(img) / 255.0
    img_arr = np.expand_dims(img_arr, axis=0)
    return img_arr

@router.post("/predict")
async def predict(file: UploadFile = File(...)):
    contents = await file.read()
    img_arr = preprocess_image(contents)

    preds = model.predict(img_arr)
    class_id = np.argmax(preds)
    label = class_names[class_id]

    tumor = "No" if label == "notumor" else "Yes"
    confidence1 = float(np.max(preds))

    # ✅ Pakistan timezone
    pakistan_tz = pytz.timezone("Asia/Karachi")
    now = datetime.now(pakistan_tz)

    # ✅ Save to DB
    db = SessionLocal()
    scan = Scan(
        image_name=file.filename,
        tumor=tumor,
        tumor_type=label if tumor == "Yes" else None,
        detection_confidence=confidence1,
        date=now
    )
    db.add(scan)
    db.commit()
    db.refresh(scan)
    db.close()

    return {
        "tumor": tumor,
        "prediction": label,
        "confidence1": confidence1,
        "scan_id": scan.id   # ✅ return ID for classify update
    }

@router.post("/classify")
async def classify(file: UploadFile = File(...), scan_id: int = Form(...)):
    contents = await file.read()
    img_arr = preprocess_image(contents)

    preds = model.predict(img_arr)
    class_id = np.argmax(preds)
    label = class_names[class_id]
    confidence2 = float(np.max(preds))

    # ✅ Update DB record
    db = SessionLocal()
    scan = db.query(Scan).filter(Scan.id == scan_id).first()
    if scan:
        scan.tumor_type = label
        scan.classification_confidence = confidence2
        db.commit()
    db.close()

    return {
        "tumor_type": label,
        "confidence2": confidence2
    }

@router.get("/history")
def get_history():
    db = SessionLocal()
    scans = db.query(Scan).order_by(Scan.date.desc()).all()
    db.close()

    history = []
    for scan in scans:
        history.append({
            "image_name": scan.image_name,
            "tumor": scan.tumor,
            "tumor_type": scan.tumor_type,
            "detection_confidence": scan.detection_confidence,
            "classification_confidence": scan.classification_confidence,
            "date": scan.date.strftime("%d %b %Y, %I:%M %p")
        })
    return history
