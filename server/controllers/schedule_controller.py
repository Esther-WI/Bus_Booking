from flask import Blueprint, request, jsonify
from server.models import Schedule, Route
from server.extensions import db
from flask_jwt_extended import jwt_required, get_jwt_identity
from server.utils.auth import role_required

schedule_bp = Blueprint("schedules", __name__, url_prefix="/api/schedules")

@schedule_bp.route("/", methods=["GET"])
def get_schedules():
    return jsonify([s.to_dict() for s in Schedule.query.all()])

@schedule_bp.route("/", methods=["POST"])
@jwt_required()
@role_required("Admin", "Driver", "Customer")
def create_schedule():
    data = request.get_json()
    try:
        schedule = Schedule(**data)
        db.session.add(schedule)
        db.session.commit()
        return jsonify(schedule.to_dict()), 201
    except Exception as e:
        return {"error": str(e)}, 400
    
@schedule_bp.route("/<int:id>/available_seats", methods=["GET"])
def get_available_seats(id):
    schedule = Schedule.query.get_or_404(id)
    return jsonify({"available_seats": schedule.available_seats})

from datetime import datetime

@schedule_bp.route("/route/<int:route_id>/upcoming", methods=["GET"])
def upcoming_schedules(route_id):
    now = datetime.utcnow()
    schedules = Schedule.query.filter(
        Schedule.route_id == route_id,
        Schedule.departure_time > now
    ).all()
    return jsonify([s.to_dict() for s in schedules])

@schedule_bp.route("/driver/my", methods=["GET"])
@jwt_required()
def driver_schedules():
    user_id = get_jwt_identity()
    from models import Bus
    bus_ids = [b.id for b in Bus.query.filter_by(driver_id=user_id).all()]
    schedules = Schedule.query.filter(Schedule.bus_id.in_(bus_ids)).all()
    return jsonify([s.to_dict() for s in schedules])

@schedule_bp.route("/search", methods=["GET"])
def search_schedules():
    origin = request.args.get("origin")
    destination = request.args.get("destination")
    date = request.args.get("date") 

    schedules = Schedule.query.join(Route).filter(
        Route.origin.ilike(f"%{origin}%"),
        Route.destination.ilike(f"%{destination}%"),
        db.func.date(Schedule.departure_time) == date
    ).all()
    return jsonify([s.to_dict() for s in schedules])




