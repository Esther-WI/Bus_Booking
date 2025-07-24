from flask import Blueprint, request, jsonify
from server.models import Bus
from server.extensions import db
from flask_jwt_extended import jwt_required, get_jwt_identity
from server.utils.auth import role_required, current_user

bus_bp = Blueprint("buses", __name__, url_prefix="/api/buses")

@bus_bp.route("/", methods=["GET"])
def get_buses():
    return jsonify([b.to_dict() for b in Bus.query.all()])


# only admins to add a bus(role based access) 
@bus_bp.route("/", methods=["POST"])
@jwt_required()
@role_required("Admin")
def create_bus():
    data = request.get_json()
    try:
        bus = Bus(**data)
        db.session.add(bus)
        db.session.commit()
        return jsonify(bus.to_dict()), 201
    except Exception as e:
        return {"error": str(e)}, 400
    
# Only drivers to view their buses(role based access)
@bus_bp.route("/my", methods=["GET"])
@jwt_required()
@role_required("Driver", "Admin")
def my_buses():
    user = current_user()
    buses = Bus.query.filter_by(driver_id=user.id).all()
    return jsonify([b.to_dict() for b in buses])


