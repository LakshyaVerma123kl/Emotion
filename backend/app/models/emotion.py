from pydantic import BaseModel, Field, validator
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum

class EmotionType(str, Enum):
    """Enumeration of supported emotion types"""
    HAPPY = "Happy"
    SAD = "Sad"
    ANXIOUS = "Anxious"
    ANGRY = "Angry"
    EXCITED = "Excited"
    CONFUSED = "Confused"
    CALM = "Calm"
    FRUSTRATED = "Frustrated"
    NEUTRAL = "Neutral"
    HOPEFUL = "Hopeful"
    DISAPPOINTED = "Disappointed"
    OVERWHELMED = "Overwhelmed"
    CONFIDENT = "Confident"
    WORRIED = "Worried"
    GRATEFUL = "Grateful"
    LONELY = "Lonely"
    STRESSED = "Stressed"
    PROUD = "Proud"
    GUILTY = "Guilty"
    JEALOUS = "Jealous"

class EmotionAnalysisRequest(BaseModel):
    """Request model for emotion analysis"""
    text: str = Field(
        ..., 
        min_length=1, 
        max_length=1000, 
        description="Text to analyze for emotions"
    )
    include_suggestions: bool = Field(
        True, 
        description="Whether to include suggestions in response"
    )
    use_real_model: bool = Field(
        False, 
        description="If true, use real transformer model"
    )
    @validator('text')
    def validate_text(cls, v):
        if not v.strip():
            raise ValueError('Text cannot be empty or just whitespace')
        
        # Check for potentially harmful content
        harmful_keywords = ['suicide', 'kill myself', 'end it all', 'hurt myself']
        text_lower = v.lower()
        if any(keyword in text_lower for keyword in harmful_keywords):
            raise ValueError('This service is not equipped to handle crisis situations. Please contact a mental health professional.')
        
        return v.strip()

class EmotionAnalysisResponse(BaseModel):
    """Response model for emotion analysis"""
    emotion: str = Field(..., description="Primary detected emotion")
    confidence: float = Field(..., ge=0.0, le=1.0, description="Confidence score (0-1)")
    secondary_emotions: List[str] = Field(
        default_factory=list, 
        description="Additional emotions detected"
    )
    suggestions: List[str] = Field(
        default_factory=list, 
        description="Helpful suggestions based on emotion"
    )
    emotion_intensity: str = Field(
        ..., 
        description="Intensity level: low, medium, high"
    )
    timestamp: str = Field(..., description="Analysis timestamp")
    processing_time: float = Field(..., ge=0.0, description="Processing time in seconds")
    analysis_id: str = Field(..., description="Unique analysis identifier")

class EmotionStats(BaseModel):
    """Statistics about emotion analysis"""
    total_analyses: int = Field(..., description="Total number of analyses")
    most_common_emotion: str = Field(..., description="Most frequently detected emotion")
    average_confidence: float = Field(..., description="Average confidence score")
    processing_time_avg: float = Field(..., description="Average processing time")

class HealthCheckResponse(BaseModel):
    """Health check response model"""
    status: str = Field(..., description="Service status")
    message: str = Field(..., description="Status message")
    timestamp: str = Field(..., description="Health check timestamp")
    version: str = Field(..., description="API version")
    uptime: str = Field(..., description="Service uptime")
    environment: str = Field(..., description="Environment (dev/prod)")

class ErrorResponse(BaseModel):
    """Standardized error response model"""
    error: str = Field(..., description="Error type")
    message: str = Field(..., description="Error message")
    details: Optional[Dict[str, Any]] = Field(None, description="Additional error details")
    timestamp: str = Field(..., description="Error timestamp")
    path: Optional[str] = Field(None, description="Request path that caused error")
    request_id: Optional[str] = Field(None, description="Request ID for tracking")

class EmotionConfig(BaseModel):
    """Configuration for emotion analysis"""
    supported_emotions: List[EmotionType] = Field(
        default_factory=lambda: list(EmotionType), 
        description="List of supported emotions"
    )
    confidence_threshold: float = Field(0.3, description="Minimum confidence threshold")
    max_suggestions: int = Field(4, description="Maximum number of suggestions to return")
    enable_secondary_emotions: bool = Field(True, description="Enable secondary emotion detection")