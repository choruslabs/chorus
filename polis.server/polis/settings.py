from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str = "sqlite:///polis.db"

    client_origin: str = "http://localhost:5173"
    allowed_origins: list[str] = [client_origin]

    class Config:
        env_file = ".env"


settings = Settings()


def get_settings() -> Settings:
    return settings
