# Step 1: React Frontend ko build karna
FROM node:20 AS frontend-builder
WORKDIR /app/frontend
COPY react-app/package*.json ./
RUN npm install
COPY react-app/ ./
RUN npm run build

# Step 2: Python/FastAPI Backend aur Final Setup
FROM python:3.13-slim
WORKDIR /app

# System dependencies install karna (OpenCV ke liye zaroori hain)
RUN apt-get update && apt-get install -y \
    libgl1 \
    libglib2.0-0 \
    wget \
    && rm -rf /var/lib/apt/lists/*

# Backend dependencies install karna
COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Backend aur Built Frontend files copy karna
COPY backend/ ./backend/
COPY --from=frontend-builder /app/frontend/dist ./backend/static

# Step 3: Google Drive se Models automatic download karna
# (Aapke links se file IDs nikal kar wget ke zariye download)
# Step 3: Just make sure Model folder exists inside backend
# Model folder banayein aur local laptop se dono models ko lazmi copy karein
RUN mkdir -p backend/Model
# COPY backend/Model/*.keras ./backend/Model/
# Port expose karna jo Hugging Face use karta hai
EXPOSE 7860

# FastAPI ko chalana aur port 7860 par static files render karna
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "7860"]