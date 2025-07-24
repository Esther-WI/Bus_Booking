# app.py

from flask import Flask
from flask_cors import CORS
from server.extensions import db
from server.config import Config  
from server.controllers import *
from server.extensions import db, jwt, migrate

app = Flask(__name__)
app.config.from_object(Config)

# Extensions
db.init_app(app)
migrate.init_app(app, db)
jwt.init_app(app)
CORS(app)

# Blueprints
app.register_blueprint(auth_bp, url_prefix="/api/auth")
app.register_blueprint(bus_bp, url_prefix="/api/buses")
app.register_blueprint(schedule_bp, url_prefix="/api/schedules")
app.register_blueprint(booking_bp, url_prefix="/api/bookings")
app.register_blueprint(route_bp, url_prefix="/api/routes")

# Default route
@app.route("/")
def home():
    return {"message": "Bus Booking API running 🎉"}

# Error handler for 404s
@app.errorhandler(404)
def not_found(e):
    return {"error": "Not found"}, 404

if __name__ == "__main__":
    app.run(debug=True)
