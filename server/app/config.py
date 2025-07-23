import secrets
from datetime import timedelta

class Config:
    DB_USER = "busbooking_fidel"
    DB_PASSWORD = "fidel123"
    DB_HOST = "localhost"
    DB_PORT = "5432"
    DB_NAME = "fidel_user"

    SQLALCHEMY_DATABASE_URI = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    JWT_SECRET_KEY = secrets.token_hex(32)
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=24)

    SECRET_KEY = secrets.token_hex(16)


