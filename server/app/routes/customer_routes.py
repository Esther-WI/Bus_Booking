from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models import Booking, Bus, User
from ..extensions import db

customer_bp = Blueprint('customer', __name__)

@customer_bp.route('/book_seat', methods=['POST'])
@jwt_required()
def book_seat():
    current_user_id = get_jwt_identity()
    data = request.get_json()
    bus = Bus.query.get(data['bus_id'])
    if not bus or bus.number_of_seats <= 0:
        return jsonify({"message": "No available seats"}), 400
    new_booking = Booking(customer_id=current_user_id, bus_id=data['bus_id'], seat_number=data['seat_number'], status='booked')
    bus.number_of_seats -= 1
    db.session.add(new_booking)
    db.session.commit()
    return jsonify({"message": "Seat booked"}), 201