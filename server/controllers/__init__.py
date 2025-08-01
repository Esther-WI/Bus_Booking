from .auth_controller import auth_bp
from .booking_controller import booking_bp
from .bus_controller import bus_bp
from .route_controller import route_bp
from .schedule_controller import schedule_bp
from .offerrs_controller import offer_bp
from .admin_controller import admin_bp

def register_controllers(app):
    app.register_blueprint(auth_bp)
    app.register_blueprint(booking_bp)
    app.register_blueprint(bus_bp)
    app.register_blueprint(route_bp)
    app.register_blueprint(offer_bp)
    app.register_blueprint(admin_bp)
    app.register_blueprint(schedule_bp)

