from sqlalchemy import create_engine, Column, Integer, String, DateTime, Float, ForeignKey
from sqlalchemy.orm import declarative_base, sessionmaker, relationship
from datetime import datetime

# Database URL (SQLite file)
DATABASE_URL = "sqlite:///./scans.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()

# ✅ Patient table (master record)
class Patient(Base):
    __tablename__ = "patients"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    age = Column(Integer, nullable=False)
    gender = Column(String, nullable=True)

    # Relationship: one patient → many scans
    scans = relationship("Scan", back_populates="patient")

# ✅ Scan table (linked to patient)
class Scan(Base):
    __tablename__ = "scans"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"))   # link to Patient
    image_name = Column(String)
    tumor = Column(String)
    tumor_type = Column(String)
    detection_confidence = Column(Float)
    classification_confidence = Column(Float)
    date = Column(DateTime, default=datetime.utcnow)

    # Relationship back to patient
    patient = relationship("Patient", back_populates="scans")

# ✅ User table (for authentication)
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)

# Create tables
Base.metadata.create_all(bind=engine)
