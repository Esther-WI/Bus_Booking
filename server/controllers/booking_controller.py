from flask import Blueprint, request, jsonify
from server.models import Booking
from server.extensions import db
from flask_jwt_extended import jwt_required, get_jwt_identity
from server.utils.auth import role_required, current_user

booking_bp = Blueprint("bookings", __name__, url_prefix="/api/bookings")

@booking_bp.route('/', methods=['GET'])
@jwt_required()
def index():
    bookings = Booking.query.all()
    return jsonify([b.to_dict() for b in bookings])

@booking_bp.route('/', methods=['POST'])
@jwt_required()
def create():
    data = request.get_json()
    current_user = get_jwt_identity()

    try:
        new_booking = Booking(
            schedule_id=data["schedule_id"],
            customer_id=current_user,
            seat_number=data["seat_number"],
            booking_status=data.get("booking_status", "Pending"),
            payment_status=data.get("payment_status", "pending")
        )
        db.session.add(new_booking)
        db.session.commit()
        return jsonify(new_booking.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return {"error": str(e)}, 400

@booking_bp.route("/my", methods=["GET"])
@jwt_required()
def user_bookings():
    user_id = get_jwt_identity()
    bookings = Booking.query.filter_by(customer_id=user_id).order_by(Booking.created_at.desc()).all()
    return jsonify([b.to_dict() for b in bookings])

@booking_bp.route("/<int:id>/cancel", methods=["PATCH"])
@jwt_required()
@role_required("Admin", "Customer")
def cancel_booking(id):
    user_id = get_jwt_identity()
    booking = Booking.query.get_or_404(id)

    if booking.customer_id != user_id:
        return {"error": "Unauthorized"}, 403

    if booking.booking_status == "Cancelled":
        return {"error": "Booking already cancelled"}, 400

    booking.booking_status = "Cancelled"
    db.session.commit()
    return jsonify(booking.to_dict()), 200

@booking_bp.route("/<int:id>", methods=["DELETE"])
@jwt_required()
@role_required("Customer", "Admin")
def delete_booking(id):
    user = current_user()
    booking = Booking.query.get_or_404(id)

    if booking.customer_id != user.id:
        return {"error": "Unauthorized"}, 403

    db.session.delete(booking)
    db.session.commit()
    return {"message": "Booking deleted"}, 200
