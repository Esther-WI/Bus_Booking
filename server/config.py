import os
from dotenv import load_dotenv
from datetime import timedelta

load_dotenv()

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-fallback-key')
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', "postgresql://bus_fidel:fidel123@localhost:5432/bus_booking_db")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'jwt-dev-key')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(days=7)

    CORS_SUPPORTS_CREDENTIALS = True
    CORS_ORIGINS = os.getenv('CORS_ORIGINS', "http://localhost:5173,http://127.0.0.1:5173").split(',')
    CORS_SUPPORTS_CREDENTIALS = True
    CORS_MAX_AGE = 86400
    CORS_SEND_WILDCARD = False
    CORS_AUTOMATIC_OPTIONS = True
    CORS_EXPOSE_HEADERS = ["Content-Type", "Authorization", "x-access-token"]