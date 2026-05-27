# IntelliScan AI: Brain Tumor Detection Web Application
An end-to-end full-stack web application designed for automated brain tumor detection from MRI scans using Deep Learning (CNN) and Explainable AI concepts. The system features a robust Python/FastAPI backend and a highly responsive ReactJS frontend styled with Tailwind CSS.
 🔗 Project Assets & Trained Models
Due to GitHub's file size limitations for large binaries, the trained Deep Learning models and the core dataset are hosted securely on Google Drive. You can access them via the links below:
Dataset Link: [Download Brain Tumor MRI Dataset](https://drive.google.com/drive/folders/1XakPHzwnG96AlQT3iQLd0s6SydHTlQLN?usp=sharing)
MRI Verification Model: [Download MRI vs Non-MRI Classifier](https://drive.google.com/file/d/1pcoYFl2kJM6bRSkBA3GCUfN0tITaFi9O/view?usp=sharing) *(Validates if the uploaded image is a valid brain MRI scan)*
Classification Model: [Download 4-Class Brain Tumor Detection Model](https://drive.google.com/file/d/1myrvi024TMRiPx6PYasH5TEADNp15WJz/view?usp=sharing) *(Classifies scans into Glioma, Meningioma, Pituitary, or No Tumor)*
 🚀 Key Features
Two-Tier Verification Pipeline: Tier 1: Filters out invalid inputs using an MRI/Non-MRI classifier to prevent system abuse.
    Tier 2: Performs multi-class deep learning classification to isolate tumor types.
Intelligent UI Dashboard: A beautiful, responsive interface engineered using ReactJS and Tailwind CSS (v4) featuring step-by-step diagnostic workflows.
Asynchronous Processing: Powered by FastAPI to ensure zero-latency communication between the frontend client and heavy deep learning model wrappers.
Patient History Tracking: Local database mapping to store and review historical diagnostic scans.



 🛠️ Tech Stack & Architecture

# Frontend
Framework: ReactJS (Vite)
Styling: Tailwind CSS v4, FontAwesome Icons

# Backend
Framework: FastAPI (Python 3.13)
Database: SQLite (SQLAlchemy ORM)
Libraries: TensorFlow/Keras, OpenCV, Pillow, NumPy



 📦 Local Setup Instructions

Follow these steps to clone the repository and run the application locally on your machine:

# 1. Repository Cloning & Model Deployment
```bash
# Clone the repository
git clone [https://github.com/bushrabatool0605/brain-tumor-detection.git](https://github.com/bushrabatool0605/brain-tumor-detection.git)
cd brain-tumor-detection

# Create the Model Directory inside Backend
mkdir -p backend/Model
Note: Download the model files (.keras/.h5) from the links provided above and place them directly inside the backend/Model/ folder before launching the server.
2. Backend Server Execution (FastAPI)
Bash
cd backend
python -m venv venv
# Activate virtual environment (Windows)
.\venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the server
uvicorn main:app --reload
The backend server will live-stream API endpoints on http://localhost:8000.
3. Frontend Execution (React + Tailwind)
Bash
cd ../react-app
npm install
npm run dev
Open your browser and navigate to http://localhost:5173/ to view the running application.
Model Performance Metrics
The primary multi-class diagnostic system delivers high clinical confidence with optimized evaluations:
•	Classification Accuracy: ~96%
•	Precision Rate: ~94%
•	Recall Value: ~95%

