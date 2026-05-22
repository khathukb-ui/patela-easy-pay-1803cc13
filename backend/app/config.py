from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://postgres:postgres@db:5432/patela"
    JWT_SECRET: str = "change-me"
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    JWT_REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    JWT_ALGORITHM: str = "HS256"

    REDIS_URL: str = "redis://redis:6379/0"

    IMS_BASE_URL: str = "https://your-ims.example.com"
    IMS_API_KEY: str = ""

    PAYMENT_PROVIDER: str = "stub"
    PAYMENT_WEBHOOK_SECRET: str = ""

    FEATURE_OTP_ENABLED: bool = False

    CORS_ORIGINS: List[str] = ["http://localhost:5173"]

    class Config:
        env_file = ".env"


settings = Settings()
