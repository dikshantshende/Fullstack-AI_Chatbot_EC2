import os
from pathlib import Path
from pydantic import BaseModel
from dotenv import load_dotenv

# Find the .env file in the project root (2 levels up from app directory)
env_path = Path(__file__).resolve().parents[2] / '.env'
load_dotenv(env_path)

class Settings(BaseModel):
    app_name: str = "LLM Agent Chatbot"
    debug: bool = os.getenv("DEBUG", "false").lower() == "true"
    google_api_key: str | None = os.getenv("GOOGLE_API_KEY")
    supabase_jwt_secret: str | None = os.getenv("SUPABASE_JWT_SECRET")
    model: str = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")
    embeddings_model: str = os.getenv("EMBEDDINGS_MODEL", "models/embedding-001")
    port: int = int(os.getenv("PORT", "8000"))
    allow_origins: list[str] = os.getenv("CORS_ALLOW_ORIGINS", "*").split(",")
    # RAG
    vector_path: str = os.getenv("VECTOR_PATH", "data/vectorstore")
    kb_path: str = os.getenv("KB_PATH", "data/kb")
    # Search
    search_safe: str = os.getenv("SEARCH_SAFE", "moderate")
    # Weather
    weather_geocode_url: str = "https://geocoding-api.open-meteo.com/v1/search"
    weather_api_url: str = "https://api.open-meteo.com/v1/forecast"

settings = Settings()
