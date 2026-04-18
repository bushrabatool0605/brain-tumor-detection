from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from predict import router
from auth_routes import router as auth_router

app = FastAPI()

# ✅ Authentication routes
app.include_router(auth_router)

# ✅ CORS configuration
origins = [
    "http://localhost:5173",   # React dev server
    "http://127.0.0.1:5173",   # alternate dev server
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,     # production me specific domain use karo
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Prediction routes
app.include_router(router)

@app.get("/")
def home():
    return {"message": "Brain Tumor Detection API Running"}
