# app.py

from flask import Flask
from flask_cors import CORS
from extensions import db
from config import Config  
from controllers import *
from extensions import db, jwt, migrate

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

# Default route
@app.route("/")
def home():
    return {"message": "Bus Booking API running 🎉"}

# Error handler for 404s
@app.errorhandler(404)
def not_found(e):
    return {"error": "Not found"}, 404

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000,debug=True)
