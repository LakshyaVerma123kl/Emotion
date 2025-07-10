# backend/app/api/routes/emotion.py
from fastapi import APIRouter, HTTPException, Depends, Request
from fastapi.responses import JSONResponse
from datetime import datetime
import uuid
from typing import Optional
from app.models.emotion import (
    EmotionAnalysisRequest, 
    EmotionAnalysisResponse,
    EmotionStats,
    HealthCheckResponse,
    ErrorResponse
)
from app.services.emotion_analyzer import emotion_analyzer
from app.core.logging import get_logger
from app.core.config import settings

logger = get_logger(__name__)
router = APIRouter()

# Track service start time for uptime calculation
service_start_time = datetime.now()

@router.post("/analyze", response_model=EmotionAnalysisResponse)
async def analyze_emotion(
    request: EmotionAnalysisRequest,
    client_request: Request
):
    """
    Analyze emotion from text input
    
    This endpoint accepts text input and returns a comprehensive emotion analysis
    including primary emotion, confidence score, secondary emotions, and suggestions.
    """
    request_id = str(uuid.uuid4())
    client_ip = client_request.client.host
    
    logger.info(f"Emotion analysis request {request_id} from {client_ip}")
    
    try:
        # Validate request
        if not request.text.strip():
            raise HTTPException(
                status_code=400,
                detail="Text input cannot be empty"
            )
        
        # Analyze emotion
        result = emotion_analyzer.analyze_emotion(request)
        
        logger.info(f"Request {request_id} completed successfully: {result.emotion}")
        
        return result
        
    except ValueError as e:
        logger.warning(f"Validation error for request {request_id}: {str(e)}")
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"Unexpected error for request {request_id}: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Internal server error occurred during emotion analysis"
        )

@router.get("/stats", response_model=EmotionStats)
async def get_emotion_stats():
    """
    Get emotion analysis statistics
    
    Returns statistics about the emotion analysis service including
    total analyses performed and most common emotions detected.
    """
    try:
        stats = emotion_analyzer.get_stats()
        logger.info("Emotion stats retrieved successfully")
        return stats
    except Exception as e:
        logger.error(f"Error retrieving stats: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Failed to retrieve emotion analysis statistics"
        )

@router.get("/health", response_model=HealthCheckResponse)
async def health_check():
    """
    Health check endpoint
    
    Returns the current health status of the emotion analysis service.
    """
    try:
        uptime = datetime.now() - service_start_time
        uptime_str = str(uptime).split('.')[0]  # Remove microseconds
        
        return HealthCheckResponse(
            status="healthy",
            message="Emotion analysis service is running normally",
            timestamp=datetime.now().isoformat(),
            version=settings.VERSION,
            uptime=uptime_str,
            environment=settings.ENVIRONMENT
        )
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Health check failed"
        )

@router.get("/emotions", response_model=list)
async def get_supported_emotions():
    """
    Get list of supported emotions
    
    Returns a list of all emotions that the service can detect.
    """
    try:
        from app.models.emotion import EmotionType
        emotions = [emotion.value for emotion in EmotionType]
        return emotions
    except Exception as e:
        logger.error(f"Error retrieving supported emotions: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Failed to retrieve supported emotions"
        )