# app/core/config.py
from pydantic_settings import BaseSettings
from pydantic import Field, validator
from typing import List
import json

class Settings(BaseSettings):
    PROJECT_NAME: str = Field("Emotion Reflection API", env="PROJECT_NAME")
    VERSION: str = Field("1.0.0", env="VERSION")
    DEBUG: bool = Field(False, env="DEBUG")
    ENVIRONMENT: str = Field("development", env="ENVIRONMENT")
    HOST: str = Field("0.0.0.0", env="HOST")
    PORT: int = Field(8000, env="PORT")
    API_V1_STR: str = Field("/api/v1", env="API_V1_STR")
    ALLOWED_ORIGINS: List[str] = Field(
        [
            "http://localhost:3000",
            "http://127.0.0.1:3000",
            "http://localhost:3001",
            "http://127.0.0.1:3001",
        ],
        env="ALLOWED_ORIGINS"
    )
    RATE_LIMIT_REQUESTS: int = Field(100, env="RATE_LIMIT_REQUESTS")
    RATE_LIMIT_PERIOD: int = Field(3600, env="RATE_LIMIT_PERIOD")
    LOG_LEVEL: str = Field("INFO", env="LOG_LEVEL")
    LOG_FILE: str = Field("app.log", env="LOG_FILE")

    @validator("ALLOWED_ORIGINS", pre=True)
    def assemble_cors_origins(cls, v):
        if isinstance(v, str):
            try:
                # Try parsing as JSON first
                parsed = json.loads(v)
                if isinstance(parsed, list):
                    return [str(item).strip() for item in parsed]
            except json.JSONDecodeError:
                # Fallback to comma-separated string
                return [i.strip() for i in v.split(",") if i.strip()]
        return v

    @validator("LOG_LEVEL")
    def validate_log_level(cls, v):
        valid_levels = ["DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL"]
        if v.upper() not in valid_levels:
            raise ValueError(f"LOG_LEVEL must be one of: {valid_levels}")
        return v.upper()

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()