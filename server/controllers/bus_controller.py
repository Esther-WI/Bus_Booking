from flask import Blueprint, request, jsonify
from server.models import Bus,Review,User
from server.extensions import db
from flask_jwt_extended import jwt_required, get_jwt_identity
from server.utils.auth import role_required, current_user
from datetime import datetime

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

# Reviews
@bus_bp.route("/<int:bus_id>/reviews", methods = ["POST"])
@jwt_required()
@role_required("Customer","Admin")
def post_bus_review(bus_id):
    data = request.get_json()
    user = current_user()

    # Ensure bus exists
    bus = Bus.query.get(bus_id)
    if not bus:
        return {"error": "Bus not found"}, 404

    try:
        rating = data.get("rating")
        comment = data.get("comment")

        if not rating or not comment:
            return {"error": "Rating and comment are required."}, 400

        # Prevent duplicate reviews per user per bus (optional)
        existing = Review.query.filter_by(user_id=user.id, bus_id=bus_id).first()
        if existing:
            return {"error": "You have already reviewed this bus."}, 400
        
        # Validate required fields
        required_fields = ['text', 'rating', 'user_id']
        if not all(field in data for field in required_fields):
            return {'error': 'Missing required fields'}, 400

        review = Review(
            text=data['text'],
            user_id=data['user_id'],
            bus_id=data['bus_id'],
            rating=data['rating'],
            comment=data['comment'],
        )

        db.session.add(review)
        db.session.commit()

        return jsonify(review.to_dict()), 201

    except Exception as e:
        return {"error": str(e)}, 500

@bus_bp.route("/reviews", methods = ["GET"])
@jwt_required()
@role_required("Customer","Driver","Admin")
def get_bus_review(bus_id):
    bus = Bus.query.get(bus_id)
    if not bus:
        return {"error": "Bus not found"}, 404

    reviews = Review.query.filter_by(bus_id=bus_id).all()
    return jsonify([r.to_dict() for r in reviews]), 200

@bus_bp.route("/search", methods=["GET"])
@jwt_required()
def search_buses():
    query = Bus.query
    registration_number = request.args.get("registration_number")
    model = request.args.get("model")
    status = request.args.get("status")

    if registration_number:
        query = query.filter(Bus.registration_number.ilike(f"%{registration_number}%"))
    if model:
        query = query.filter(Bus.model.ilike(f"%{model}%"))
    if status:
        query = query.filter(Bus.status.ilike(f"%{status}%"))

    buses = query.all()
    return jsonify([b.to_dict() for b in buses]), 200

@bus_bp.route("/<int:bus_id>", methods=["PATCH"])
@jwt_required()
@role_required("Admin")
def update_bus(bus_id):
    bus = Bus.query.get_or_404(bus_id)
    data = request.get_json()
    
    try:
        # Update only allowed fields
        allowed_fields = ['registration_number', 'model', 'capacity', 'status', 'driver_id']
        for field in allowed_fields:
            if field in data:
                setattr(bus, field, data[field])
        
        db.session.commit()
        return jsonify(bus.to_dict()), 200
    except ValueError as e:
        db.session.rollback()
        return {"error": str(e)}, 400
    except Exception as e:
        db.session.rollback()
        return {"error": "Failed to update bus"}, 500




