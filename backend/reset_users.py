from database import SessionLocal, User

db = SessionLocal()

# ❌ Delete all users
db.query(User).delete()

db.commit()
db.close()

print("All users deleted successfully!")
#terminal ma run krny y reset ho jayn gy python reset_users.py
#es k baad create users run krna

