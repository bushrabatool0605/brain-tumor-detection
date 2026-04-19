# Stage 1: Frontend build
FROM node:18 AS build-stage
WORKDIR /frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Backend & Runtime
FROM python:3.10
WORKDIR /code

# Requirements copy aur install
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Baqi sara code copy karein
COPY . .

# Frontend build ko backend ke static folder mein daalna
COPY --from=build-stage /frontend/dist /code/backend/static

# Hugging Face port 7860 mangta hai
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "7860"]