from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os
from predict import router
from auth_routes import router as auth_router

app = FastAPI()

# ✅ CORS configuration
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "*"  # Allows access from Hugging Face domain
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ API Routes (Pehle API routes define karein)
app.include_router(auth_router)
app.include_router(router)

# ✅ Static Files Setup (Ab static files serve karein)
# current_file_dir backend folder ko point karega
current_file_dir = os.path.dirname(os.path.abspath(__file__))
static_path = os.path.join(current_file_dir, "static")

if os.path.exists(static_path):
    # React ke build folders (assets) ko mount karein
    assets_path = os.path.join(static_path, "assets")
    if os.path.exists(assets_path):
        app.mount("/assets", StaticFiles(directory=assets_path), name="assets")

    # Root route par index.html serve karein
    @app.get("/")
    async def serve_index():
        return FileResponse(os.path.join(static_path, "index.html"))

    # React Router Fix: Har non-API request ko index.html par redirect karein
    @app.get("/{full_path:path}")
    async def serve_react_app(full_path: str):
        # Agar path 'api', 'predict', 'login' etc se start nahi ho raha toh React serve karein
        # Apne routes ke mutabiq niche list update kar sakti hain
        api_prefixes = ["auth", "predict", "docs", "openapi.json"] 
        if not any(full_path.startswith(prefix) for prefix in api_prefixes):
            return FileResponse(os.path.join(static_path, "index.html"))
        return {"detail": "Not Found"}
else:
    @app.get("/")
    def home():
        return {"message": "API is running, but static files were not found at " + static_path}