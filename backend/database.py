from sqlalchemy import create_engine, Column, Integer, String, DateTime,Float
from sqlalchemy.orm import declarative_base, sessionmaker
from datetime import datetime

# Database URL (SQLite file)
DATABASE_URL = "sqlite:///./scans.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()

# ✅ Scan table (for MRI history)
class Scan(Base):
    __tablename__ = "scans"

    id = Column(Integer, primary_key=True, index=True)
    patient_name = Column(String)
    patient_age = Column(Integer)
    image_name = Column(String)
    tumor = Column(String)
    tumor_type = Column(String)
    confidence1 = Column(Float)
    confidence2 = Column(Float)
    date = Column(DateTime, default=datetime.utcnow)

# ✅ User table (for authentication)
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)   # allowed email
    password = Column(String)                         # hashed password

# Create tables
Base.metadata.create_all(bind=engine)
