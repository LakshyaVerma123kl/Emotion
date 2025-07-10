# backend/app/api/routes/__init__.py
from .emotion import router as emotion_router

__all__ = ["emotion_router"]