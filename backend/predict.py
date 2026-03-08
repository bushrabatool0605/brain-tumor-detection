from fastapi import APIRouter, UploadFile, File
from database import SessionLocal, Scan
from datetime import datetime
import pytz
import numpy as np
from PIL import Image
import io

from model_loader import model, class_names

router = APIRouter()

@router.post("/predict")
async def predict(file: UploadFile = File(...)):
    contents = await file.read()

    img = Image.open(io.BytesIO(contents)).convert("RGB")
    img = img.resize((224, 224))

    img_arr = np.array(img) / 255.0
    img_arr = np.expand_dims(img_arr, axis=0)

    preds = model.predict(img_arr)
    class_id = np.argmax(preds)
    label = class_names[class_id]

    # Tumor detection logic
    if label == "notumor":
        tumor = "No"
    else:
        tumor = "Yes"

    print(preds)
    print("Predicted:", label)

    # ✅ Pakistan timezone fix
    pakistan_tz = pytz.timezone("Asia/Karachi")
    now = datetime.now(pakistan_tz)

    db = SessionLocal()
    scan = Scan(
        image_name=file.filename,
        tumor=tumor,
        tumor_type=label if tumor == "Yes" else None,
        date=now   # ✅ Correct local time
    )
    db.add(scan)
    db.commit()
    db.close()
    
    confidence = float(np.max(preds))  # highest probability
    return {
        "tumor": tumor,
        "prediction": label,
         "confidence": confidence
    }

@router.post("/classify")
async def classify(file: UploadFile = File(...)):
    contents = await file.read()

    img = Image.open(io.BytesIO(contents)).convert("RGB")
    img = img.resize((224, 224))

    img_arr = np.array(img) / 255.0
    img_arr = np.expand_dims(img_arr, axis=0)

    preds = model.predict(img_arr)
    class_id = np.argmax(preds)
    label = class_names[class_id]

    return {
        "tumor_type": label
    }

@router.get("/history")
def get_history():
    db = SessionLocal()
    scans = db.query(Scan).order_by(Scan.date.desc()).all()
    db.close()

    # Convert ORM objects to JSON
    history = []
    for scan in scans:
        history.append({
            "image_name": scan.image_name,
            "tumor": scan.tumor,
            "tumor_type": scan.tumor_type,
            "date": scan.date.strftime("%d %b %Y, %I:%M %p")
        })
    return history
