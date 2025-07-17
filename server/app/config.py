import secrets
from datetime import timedelta

DB_USER = ""  
DB_PASSWORD = ""
DB_HOST = ""
DB_PORT = ""
DB_NAME = ""

SQLALCHEMY_DATABASE_URI = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
SQLALCHEMY_TRACK_MODIFICATIONS = False

JWT_SECRET_KEY = secrets.token_hex(32)
JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=24)

SECRET_KEY = secrets.token_hex(16)