from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

# Internal imports
from server.extensions import db, jwt, migrate
from server.config import Config
from server.controllers import (
    auth_bp, bus_bp, schedule_bp, booking_bp,
    route_bp, offer_bp, admin_bp
)

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

# Extensions
db.init_app(app)
migrate.init_app(app, db)
jwt.init_app(app)
CORS(
    app,
    origins=app.config["CORS_ORIGINS"],
    supports_credentials=app.config["CORS_SUPPORTS_CREDENTIALS"],
    allow_headers=[
        "Content-Type", 
        "Authorization", 
        "x-access-token",
        "x-refresh-token"
    ],
    expose_headers=app.config["CORS_EXPOSE_HEADERS"],
    methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    max_age=app.config["CORS_MAX_AGE"]
)


# Blueprints
app.register_blueprint(auth_bp, url_prefix="/api/auth")
app.register_blueprint(bus_bp, url_prefix="/api/buses")
app.register_blueprint(schedule_bp, url_prefix="/api/schedules")
app.register_blueprint(booking_bp, url_prefix="/api/bookings")
app.register_blueprint(route_bp, url_prefix="/api/routes")
app.register_blueprint(offer_bp, url_prefix="/api/offers")
app.register_blueprint(admin_bp, url_prefix="/api/admin")

    # Root route
    @app.route("/")
    def home():
        return {"message": "Bus Booking API running 🎉"}

    # 404 Error handler
    @app.errorhandler(404)
    def not_found(e):
        return {"error": "Not found"}, 404

    return app

# Only run this if file is executed directly (not imported)
if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)
