from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    APP_NAME: str = "Vedanth's Coding Classes API"
    APP_VERSION: str = "1.0.0"
    API_PORT: int = 8000
    API_HOST: str = "127.0.0.1"

    # CORS settings - allow React dev server
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",  # Vite default
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000"
    ]

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()
