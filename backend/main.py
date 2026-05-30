
from fastapi import FastAPI, File, UploadFile, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
from PIL import Image
import numpy as np
import tensorflow as tf
import io
from datetime import datetime
import cv2
import base64
from .database import get_db, hash_password, init_db
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os

#  Keras quantization_config monkey-patch 
# MRI_NOT_MRI.keras was saved with a newer Keras that includes quantization_config
# in Dense layer config. Our installed Keras doesn't know this field, so we patch
# the Dense __init__ to silently ignore it before loading the model.
import keras.src.layers.core.dense as _dense_module
_OriginalDenseInit = _dense_module.Dense.__init__

def _patched_dense_init(self, *args, quantization_config=None, **kwargs):
    _OriginalDenseInit(self, *args, **kwargs)

_dense_module.Dense.__init__ = _patched_dense_init


app = FastAPI(title="Brain Tumor Detection API")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=False, allow_methods=["*"], allow_headers=["*"])

@app.on_event("startup") #app start hote hi init_db() call hota hai
def startup_event():
    init_db()
    print("Database initialized.")

#  Tumor classification model 
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(BASE_DIR, "Model", "4Types_Brain.keras")
model_path2 = os.path.join(BASE_DIR, "Model", "MRI_NOT_MRI.keras")
tumor_model = tf.keras.models.load_model(model_path)
_last_conv  = tumor_model.get_layer("block5_conv3")
grad_model  = tf.keras.models.Model(
    inputs=tumor_model.input,
    outputs=[_last_conv.output, tumor_model.output]
)

#  MRI vs NOT_MRI model 
mri_checker = tf.keras.models.load_model(
    model_path2,
    compile=False
)
# class_indices:- MRI_IMG=0, NOT_MRI_IMG=1 

CLASS_NAMES  = ["glioma", "meningioma", "notumor", "pituitary"]
SEVERITY_MAP = {"glioma": "High", "meningioma": "Moderate", "pituitary": "Low",  "notumor": "N/A"}
LOCATION_MAP = {
    "glioma":      "Cerebral hemispheres",
    "meningioma":  "Meninges (brain lining)",
    "pituitary":   "Pituitary gland (base of brain)",
    "notumor":     "N/A",
}
NOTES_MAP = {
    "glioma":     "Glioma arises from glial cells and can vary widely in grade and aggressiveness.",
    "meningioma": "Meningioma is typically benign and grows slowly from the meninges.",
    "pituitary":  "Pituitary tumors are usually benign adenomas affecting hormone regulation.",
    "notumor":    "No abnormal mass detected in the scan.",
}


class LoginRequest(BaseModel): #Base Model parent clas yeah validate bhi krta hain. mean ke email string honi chiaye int ni. is trah.
    email: str #python objct me convert kr re
    password: str

class ChangePasswordRequest(BaseModel):
    email: str
    old_password: str
    new_password: str

class ScanRecord(BaseModel):
    id: str
    patient_name: str
    patient_age: Optional[str] = ""
    patient_gender: Optional[str] = ""
    result_label: Optional[str] = ""
    result_confidence: Optional[float] = 0.0
    result_severity: Optional[str] = ""
    result_location: Optional[str] = ""
    result_notes: Optional[str] = ""
    tumor_detected: Optional[str] = ""
    image_base64: Optional[str] = None
    gradcam_base64: Optional[str] = None
    saved_at: Optional[str] = ""


def preprocess(contents: bytes):
    """Returns (PIL image resized to 224x224, tf.constant tensor (1,224,224,3))""" # doc String
    img = Image.open(io.BytesIO(contents)).convert("RGB")
    img_resized = img.resize((224, 224))
    arr    = np.array(img_resized, dtype=np.float32) / 255.0
    tensor = tf.constant(np.expand_dims(arr, axis=0))
    return img_resized, tensor


def is_mri_image(tensor) -> tuple[bool, float]:
    """
    Returns (is_mri: bool, confidence: float).
    MobileNetV2 binary model: sigmoid output
      >= 0.5  ->  NOT_MRI_IMG  (class index 1)
      <  0.5  ->  MRI_IMG      (class index 0)
    """
    pred = float(mri_checker.predict(tensor)[0][0])
    is_mri     = pred < 0.5
    confidence = (1 - pred) if is_mri else pred
    return is_mri, round(confidence * 100, 1)


#  /analyze 
@app.post("/analyze")
async def analyze(file: UploadFile = File(...)):
    contents = await file.read()
    _, tensor = preprocess(contents)

    #  MRI validity check
    is_mri, mri_conf = is_mri_image(tensor)
    if not is_mri:
        return {
            "tumor":      "N/A",
            "type":       "not_mri",
            "confidence": mri_conf,
            "severity":   "N/A",
            "location":   "N/A",
            "notes":      "The uploaded image does not appear to be a brain MRI scan. Please upload a valid MRI image.",
        }

    #  Tumor classification
    preds      = tumor_model.predict(tensor)
    idx        = int(np.argmax(preds[0]))
    raw_confidence = float(np.max(preds[0])-0.10) * 100
    confidence = max(0.0, raw_confidence) 
    tumor_type = CLASS_NAMES[idx]

    return {
        "tumor":      "No" if tumor_type == "notumor" else "Yes",
        "type":       tumor_type,
        "confidence": round(confidence, 1),
        "severity":   SEVERITY_MAP[tumor_type],
        "location":   LOCATION_MAP[tumor_type],
        "notes":      NOTES_MAP[tumor_type],
    }


#  /gradcam 
@app.post("/gradcam")
async def get_gradcam(file: UploadFile = File(...)):
    contents = await file.read()
    img_resized, img_tensor = preprocess(contents)

   
    is_mri, _ = is_mri_image(img_tensor)
    if not is_mri:
        raise HTTPException(status_code=400, detail="Not a valid MRI image.")

    img_var = tf.Variable(img_tensor)
    with tf.GradientTape() as tape:
        outputs  = grad_model(img_var)
        preds_np = np.array(outputs[1])
        pred_idx = int(np.argmax(preds_np[0]))
        score    = tf.reduce_sum(outputs[1] * tf.one_hot([pred_idx], 4))

    
    with tf.GradientTape() as tape2:
        tape2.watch(img_tensor)
        outputs2  = grad_model(img_tensor)
        conv_out2 = outputs2[0]
        preds2    = outputs2[1]
        pred_idx2 = int(np.argmax(np.array(preds2)[0]))
        score2    = tf.reduce_sum(preds2 * tf.one_hot([pred_idx2], 4))

    grads2   = tape2.gradient(score2, conv_out2)
    pooled   = tf.reduce_mean(grads2, axis=(0, 1, 2))
    cam      = np.array(conv_out2[0]) @ np.array(pooled)

    cam = np.maximum(cam, 0)
    if cam.max() > 0:
        cam /= cam.max()

    cam_resized  = cv2.resize(cam, (224, 224))
    cam_colored  = cv2.applyColorMap(np.uint8(255 * cam_resized), cv2.COLORMAP_JET)
    original_bgr = cv2.cvtColor(np.array(img_resized, dtype=np.uint8), cv2.COLOR_RGB2BGR)
    superimposed = cv2.addWeighted(original_bgr, 0.45, cam_colored, 0.55, 0)

    _, buffer = cv2.imencode(".jpg", superimposed)
    b64 = base64.b64encode(buffer).decode("utf-8")
    return {"gradcam_image": f"data:image/jpeg;base64,{b64}"}


# Auth & History endpoints 
@app.post("/api/login")
def login(data: LoginRequest, db=Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("SELECT * FROM users WHERE email=? AND password=?", (data.email, hash_password(data.password)))
    user = cursor.fetchone()
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password!")
    return {"success": True, "user": {"id": user["id"], "email": user["email"], "role": user["role"]}}

class SignupRequest(BaseModel):
    email: str
    password: str

@app.post("/api/signup")
def signup(data: SignupRequest, db=Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("SELECT * FROM users WHERE email=?", (data.email,))
    if cursor.fetchone():
        raise HTTPException(status_code=400, detail="Email already registered!")
    if len(data.password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters!")
    cursor.execute(
        "INSERT INTO users (email, password, role) VALUES (?, ?, ?)",
        (data.email, hash_password(data.password), "user")
    )
    db.commit()
    return {"success": True, "message": "Account created successfully!"}

@app.post("/api/change-password")
def change_password(data: ChangePasswordRequest, db=Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("SELECT * FROM users WHERE email=? AND password=?", (data.email, hash_password(data.old_password)))
    user = cursor.fetchone()
    if not user:
        raise HTTPException(status_code=401, detail="Old password incorrect")
    cursor.execute("UPDATE users SET password=? WHERE email=?", (hash_password(data.new_password), data.email))
    db.commit()
    return {"success": True, "message": "Password changed successfully"}

@app.post("/api/scan-history")
def save_scan(record: ScanRecord, db=Depends(get_db)):
    cursor = db.cursor()
    cursor.execute(
        """INSERT OR REPLACE INTO scan_history
           (id, patient_name, patient_age, patient_gender, result_label, result_confidence,
            result_severity, result_location, result_notes, tumor_detected,
            image_base64, gradcam_base64, saved_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
        (record.id, record.patient_name, record.patient_age, record.patient_gender,
         record.result_label, record.result_confidence, record.result_severity,
         record.result_location, record.result_notes, record.tumor_detected,
         record.image_base64, record.gradcam_base64,
         record.saved_at or datetime.now().isoformat())
    )
    db.commit()
    return {"success": True, "message": "Scan saved successfully!", "id": record.id}

@app.get("/api/scan-history", response_model=List[ScanRecord])
def get_all_scans(db=Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("SELECT * FROM scan_history ORDER BY saved_at DESC")
    return [dict(row) for row in cursor.fetchall()]

@app.delete("/api/scan-history/{scan_id}")
def delete_scan(scan_id: str, db=Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("DELETE FROM scan_history WHERE id=?", (scan_id,))
    db.commit()
    if cursor.rowcount == 0:
        raise HTTPException(status_code=404, detail="Scan record not found!")
    return {"success": True, "message": "Scan deleted successfully!"}

@app.delete("/api/scan-history")
def clear_all_scans(db=Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("DELETE FROM scan_history")
    db.commit()
    return {"success": True, "message": "All scan history cleared!"}

# uvicorn main:app --
if os.path.exists("backend/static"):
    app.mount("/", StaticFiles(directory="backend/static", html=True), name="static")
    
    @app.exception_handler(404)
    async def not_found_handler(request, exc):
        return FileResponse("backend/static/index.html")