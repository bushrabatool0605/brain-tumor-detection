from database import SessionLocal, User
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# ✅ Allowed users list
allowed_users = [
    {"email": "doctor1@example.com", "password": "secure123"},
    {"email": "doctor2@example.com", "password": "secure456"},
    {"email": "admin@example.com", "password": "admin789"},
]

db = SessionLocal()

for u in allowed_users:
    hashed_pw = pwd_context.hash(u["password"])
    user = User(email=u["email"], password=hashed_pw)
    db.add(user)

db.commit()
db.close()

print("Users created successfully!")
