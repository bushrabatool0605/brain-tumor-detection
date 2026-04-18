from fastapi import APIRouter, HTTPException
from pydantic import BaseModel # pydantc for data validatio and parsing
from database import SessionLocal, User
from passlib.context import CryptContext# password hashing k liyay

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
#encryption technique define ad store ke
# Request models
class LoginRequest(BaseModel):#base model is used to create custom models
    email: str
    password: str
class ChangePasswordRequest(BaseModel):
    email: str
    old_password: str
    new_password: str
# Login route
@router.post("/login")
def login(request: LoginRequest):#routedecorator ke vja sy automatc call ho ga
    db = SessionLocal()
    user = db.query(User).filter(User.email == request.email).first()
    db.close()
#encrypted password original form ma ne vapis aa skta verify sy krty usko verify
    if not user or not pwd_context.verify(request.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    return {"message": "Login successful"}

# ✅ Change password route
@router.post("/change-password")
def change_password(request: ChangePasswordRequest):
    db = SessionLocal()
    user = db.query(User).filter(User.email == request.email).first()

    if not user or not pwd_context.verify(request.old_password, user.password):
        db.close()
        raise HTTPException(status_code=401, detail="Invalid credentials")

    user.password = pwd_context.hash(request.new_password)
    db.commit()#save changes
    db.close()

    return {"message": "Password updated successfully"}
