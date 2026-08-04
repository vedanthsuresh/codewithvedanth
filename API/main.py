from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routers import lessons

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="API for Vedanth's Coding Classes - Lessons and Student Portal"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(lessons.router)


@app.get("/")
async def root():
    return {
        "message": "Vedanth's Coding Classes API",
        "version": settings.APP_VERSION,
        "docs": "/docs",
        "endpoints": {
            "lessons": "/lessons",
            "health": "/health"
        }
    }


@app.get("/health")
async def health_check():
    return {"status": "healthy"}
