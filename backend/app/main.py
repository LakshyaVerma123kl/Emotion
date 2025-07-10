# backend/app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.api.routes import emotion_router
from app.core.config import settings
from app.core.logging import get_logger
import uvicorn

logger = get_logger(__name__)

def create_application() -> FastAPI:
    """
    Create and configure FastAPI application
    """
    app = FastAPI(
        title=settings.PROJECT_NAME,
        description="A simple emotion reflection tool API",
        version="1.0.0",
        debug=settings.DEBUG,
        docs_url="/docs" if settings.DEBUG else None,
        redoc_url="/redoc" if settings.DEBUG else None,
    )
    
    # Configure CORS
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.ALLOWED_ORIGINS,
        allow_credentials=True,
        allow_methods=["GET", "POST", "PUT", "DELETE"],
        allow_headers=["*"],
    )
    
    # Include routers
    app.include_router(
        emotion_router,
        prefix="/api/v1/emotion",
        tags=["emotion"]
    )
    
    # Root endpoint
    @app.get("/")
    async def root():
        return {
            "message": "Emotion Reflection Tool API",
            "version": "1.0.0",
            "status": "running"
        }
    
    # Global exception handler
    @app.exception_handler(Exception)
    async def global_exception_handler(request, exc):
        logger.error(f"Global exception: {str(exc)}")
        return JSONResponse(
            status_code=500,
            content={"detail": "Internal server error"}
        )
    
    return app

# Create the application instance
app = create_application()

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
        log_level="info"
    )