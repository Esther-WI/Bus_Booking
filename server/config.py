import os
from dotenv import load_dotenv
from datetime import timedelta

# Load environment variables from .env file if present
load_dotenv()

class Config:
    # General config
    SECRET_KEY = os.getenv('SECRET_KEY', 'fallback-secret-key')  # fallback is optional

    # Database config
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL')
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # JWT config
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'fallback-jwt-key')  # fallback optional
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(days=7)

    # CORS (cross-origin requests — important for frontend-backend communication)
    CORS_SUPPORTS_CREDENTIALS = True
    CORS_ORIGINS = os.getenv('CORS_ORIGINS', '').split(',')



class DevelopmentConfig(Config):
    DEBUG = True


class ProductionConfig(Config):
    DEBUG = False
    # Optionally enable secure cookies, force HTTPS, etc.


# You can load this in app.py like:
# app.config.from_object('config.ProductionConfig')
