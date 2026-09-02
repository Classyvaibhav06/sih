from pathlib import Path
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).resolve().parent.parent.parent


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=str(BASE_DIR / ".env"),
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )

    # App
    APP_NAME: str = "AdaptiveX AI"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    SECRET_KEY: str = "change-me-in-production-use-256-bit-random-key"

    # Database
    DATABASE_URL: str = "postgresql+asyncpg://postgres:password@localhost:5432/adaptivex"
    DATABASE_ECHO: bool = False

    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"

    # Auth
    JWT_SECRET_KEY: str = "change-me-jwt-secret"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    REFRESH_TOKEN_EXPIRE_DAYS: int = 30

    # CORS
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:3001",
        "https://adaptivex.ai",
    ]

    # AI Providers
    AI_PROVIDER: str = "tokenrouter"  # tokenrouter | openai | gemini | fallback
    TOKENROUTER_API_KEY: str = "sk-5lvK2vHFpxB87oYrXGKWznj5hVoiPjaxGwfdaNbFUppNhTWT"
    TOKENROUTER_BASE_URL: str = "https://api.tokenrouter.com/v1"
    TOKENROUTER_MODEL: str = "z-ai/glm-5.3-free"
    OPENAI_API_KEY: str = "sk-5lvK2vHFpxB87oYrXGKWznj5hVoiPjaxGwfdaNbFUppNhTWT"
    OPENAI_BASE_URL: str = "https://api.tokenrouter.com/v1"
    OPENAI_MODEL: str = "z-ai/glm-5.3-free"
    GEMINI_API_KEY: str = ""
    EMBEDDING_MODEL: str = "text-embedding-3-small"

    # Feature flags
    ENABLE_VOICE: bool = True
    ENABLE_IMAGE_ANALYSIS: bool = True
    ENABLE_OFFLINE_SYNC: bool = True
    DEMO_MODE: bool = False  # Set to False since live TokenRouter is configured

    # Storage
    STORAGE_BUCKET: str = ""
    STORAGE_PROVIDER: str = "local"  # local | s3 | gcs

    # Email
    SMTP_HOST: str = ""
    SMTP_PORT: int = 587
    SMTP_USER: str = ""
    SMTP_PASSWORD: str = ""

    @property
    def async_database_url(self) -> str:
        return self.DATABASE_URL

    @property
    def ai_provider_available(self) -> bool:
        if self.AI_PROVIDER in ("tokenrouter", "openai"):
            return bool(self.TOKENROUTER_API_KEY or self.OPENAI_API_KEY)
        elif self.AI_PROVIDER == "gemini":
            return bool(self.GEMINI_API_KEY)
        return False


settings = Settings()
