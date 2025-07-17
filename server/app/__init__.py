from flask import Flask
from .config import Config
from .extensions import db, jwt, ma

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Initialize extensions
    db.init_app(app)
    jwt.init_app(app)
    ma.init_app(app)

    # Register blueprints
    from .routes.auth_routes import auth_bp
    from .routes.admin_routes import admin_bp
    from .routes.driver_routes import driver_bp
    from .routes.customer_routes import customer_bp
    from .routes.common_routes import common_bp

    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(admin_bp, url_prefix='/api/admin')
    app.register_blueprint(driver_bp, url_prefix='/api/driver')
    app.register_blueprint(customer_bp, url_prefix='/api/customer')
    app.register_blueprint(common_bp, url_prefix='/api/common')

    return app