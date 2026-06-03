 End-to-End Brain Tumor Detection & Diagnostic System
An enterprise-grade, full-stack medical imaging application designed for automated brain tumor detection from MRI scans. This system integrates deep learning computer vision architectures with a high-performance web ecosystem, complete with model interpretability (XAI) and containerized deployment.
 Live Demo Application:  https://bushrabatool0605-braintumordetectionsystem.hf.space 
Trained Models Download Links:
Brain Tumor Classification Model: https://drive.google.com/file/d/1myrvi024TMRiPx6PYasH5TEADNp15WJz/view?usp=sharing
 MRI Non-MRI Filtering Model: 
https://drive.google.com/file/d/1pcoYFl2kJM6bRSkBA3GCUfN0tITaFi9O/view?usp=sharing

 Key Features:
End-to-End Architecture: Fully integrated React.js frontend with a high-throughput, asynchronous FastAPI backend via secure RESTful APIs.
Dual-Model Specialization: Features specialized classification pathways for both MRI datasets and clinical non-MRI structural controls to maximize diagnostic accuracy.
Explainable AI (Grad-CAM): Implemented Gradient-weighted Class Activation Mapping (Grad-CAM) using TensorFlow's `GradientTape` to generate visual heatmaps, highlighting the exact structural boundaries influencing the model's decisions.
Robust Data Pipeline: Engineered a data preprocessing pipeline utilizing cryptographic image hashing to isolate and remove duplicate scans, mitigating data leakage risks.
Production Deployment: Fully containerized using Docker and deployed seamlessly to Hugging Face Spaces for stable, real-time inference latency.
Tech Stack
 Component 	 Technologies Used 
 Frontend 	 React.js, JavaScript (ES6+), HTML5, CSS3, Axios 
 Backend API 	 FastAPI, Uvicorn (Simple ASGI Server), Pydantic 
 Machine Learning 	 TensorFlow, Keras, Scikit-Learn, NumPy, OpenCV, PIL 
 DevOps & Cloud 	 Docker, Hugging Face Spaces, Git / GitHub 
System Architecture Flow:
1.  Client Layer: User uploads a brain scan image via the React UI wrapper.
2.  Network Layer: The image is securely dispatched via an HTTP POST request to the backend API.
3.  Processing Layer: FastAPI captures the payload, normalizes the tensor using OpenCV/PIL to match the input matrix dimensions, and passes it to the pre-trained weights network.
4.  Inference & Interpretation Layer: The model predicts the classification probability. Concurrently, Grad-CAM maps backpropagation gradients to extract feature localized heatmaps.
5.  Response Layer: The numerical prediction and interpreted image coordinates are returned as a dynamic JSON payload to update the frontend state.
Local Setup & Installation
1. Backend Setup (FastAPI)
 Navigate to backend directory
cd backend
 Install dependencies
pip install -r requirements.txt
 Start the Uvicorn production server
uvicorn app:app --reload
2. Frontend Setup (React)
 Navigate to frontend directory
cd react-app
 Install dependencies
npm install
 Run application locally
npm run dev
License
This project is developed for academic purposes as a final year presentation benchmark.
