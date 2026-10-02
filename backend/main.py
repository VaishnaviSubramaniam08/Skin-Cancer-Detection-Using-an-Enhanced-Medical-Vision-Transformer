from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
import os

from database.database import async_client
from routes import auth, predictions, users
from models.model_manager import model_manager


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    # Create upload directories
    os.makedirs("uploads", exist_ok=True)
    os.makedirs("gradcam_results", exist_ok=True)
    
    # Load models
    model_manager.load_models()
    
    yield
    
    # Shutdown
    async_client.close()


app = FastAPI(
    title="AI Skin Classification API",
    description="Two-stage Vision Transformer pipeline for skin image screening and lesion classification",
    version="1.0.0",
    lifespan=lifespan
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static directories
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")
app.mount("/gradcam_results", StaticFiles(directory="gradcam_results"), name="gradcam_results")

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(predictions.router, prefix="/api/predictions", tags=["Predictions"])
app.include_router(users.router, prefix="/api/user", tags=["Users"])


@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "models_loaded": model_manager.is_loaded()}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
