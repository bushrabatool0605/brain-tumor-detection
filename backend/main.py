from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from predict import router
from fastapi import FastAPI
from auth_routes import router as auth_router

app = FastAPI()

# include authentication routes
app.include_router(auth_router)
# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # production me specific domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)

@app.get("/")
def home():
    return {"message": "Brain Tumor Detection API Running"}
