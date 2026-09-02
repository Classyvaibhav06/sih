"""
AdaptiveX AI — FastAPI Backend
Main application entry point
"""
import structlog
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware

from app.core.config import settings
from app.core.database import engine, Base
from app.api.v1.router import api_router

log = structlog.get_logger()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan: startup and shutdown events."""
    log.info("AdaptiveX AI starting up", env=settings.ENVIRONMENT)
    try:
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        log.info("Database tables verified")
    except Exception as e:
        log.warning("Database connection skipped or unavailable on startup", error=str(e))
    yield
    log.info("AdaptiveX AI shutting down")


def create_application() -> FastAPI:
    application = FastAPI(
        title="AdaptiveX AI API",
        description="Smart Education Adaptive Learning Platform API",
        version="1.0.0",
        docs_url="/api/docs",
        redoc_url="/api/redoc",
        openapi_url="/api/openapi.json",
        lifespan=lifespan,
    )

    # Middleware
    application.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=False,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    application.add_middleware(GZipMiddleware, minimum_size=1000)

    # Routers
    application.include_router(api_router, prefix="/api/v1")

    return application


app = create_application()
