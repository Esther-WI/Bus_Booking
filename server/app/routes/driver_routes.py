from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models import Bus, User
from ..extensions import db

driver_bp = Blueprint('driver', __name__)

@driver_bp.route('/register_bus', methods=['POST'])
@jwt_required()
def register_bus():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    if user.role != 'driver':
        return jsonify({"message": "Unauthorized"}), 403
    data = request.get_json()
    new_bus = Bus(driver_id=current_user_id, number_of_seats=data['number_of_seats'], cost_per_seat=data['cost_per_seat'], route=data['route'], time_of_travel=data['time_of_travel'])
    db.session.add(new_bus)
    db.session.commit()
    return jsonify({"message": "Bus registered"}), 201