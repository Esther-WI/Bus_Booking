from flask import Blueprint, request, jsonify
from server.models import Schedule, Route, Bus,User
from server.extensions import db
from flask_jwt_extended import jwt_required, get_jwt_identity
from server.utils.auth import role_required
from sqlalchemy.orm import joinedload

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
    buses = Bus.query.filter_by(driver_id=user_id).all()
    bus_ids = [b.id for b in buses]

    schedules = Schedule.query.filter(Schedule.bus_id.in_(bus_ids)).options(
        joinedload(Schedule.route),
        joinedload(Schedule.bus).joinedload(Bus.driver)
    ).all()

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


@schedule_bp.route("/<int:id>/route", methods=["GET"])
def get_schedule_with_route(id):
    schedule = Schedule.query.options(
        joinedload(Schedule.route),
        joinedload(Schedule.bus)
    ).get_or_404(id)
    print(f"Schedule ID {id} not found!") 
    booked_seats = len(schedule.bookings)
    bus_capacity = schedule.bus.capacity if schedule.bus else 0
    available_seats = bus_capacity - booked_seats

    schedule.available_seats = available_seats

    return jsonify({
        **schedule.to_dict(),
        "route": schedule.route.to_dict()  # Frontend expects combined data
    })

@schedule_bp.route("/drivers", methods=["GET"])
@jwt_required()
@role_required("Admin", "Driver")  # Allow both admins and drivers
def get_drivers():
    drivers = User.query.filter_by(Role="Driver").all()
    return jsonify([driver.basic_info for driver in drivers])

@schedule_bp.route("/<int:id>", methods=["PATCH", "PUT"])
@jwt_required()
@role_required("Admin", "Driver")
def update_schedule(id):
    schedule = Schedule.query.get_or_404(id)
    data = request.get_json()

    try:
        # Update only the fields that are provided in the request
        if 'route_id' in data:
            schedule.route_id = data['route_id']
        if 'bus_id' in data:
            schedule.bus_id = data['bus_id']
        if 'departure_time' in data:
            schedule.departure_time = datetime.fromisoformat(data['departure_time'])
        if 'arrival_time' in data:
            schedule.arrival_time = datetime.fromisoformat(data['arrival_time'])
        if 'price_per_seat' in data:  # Changed from 'price' to 'price_per_seat'
            schedule.price_per_seat = data['price_per_seat']
        if 'available_seats' in data:  # Note: matches your model's field name
            schedule.available_seats = data['available_seats']

        # Validate departure is before arrival
        if schedule.departure_time >= schedule.arrival_time:
            return {"error": "Departure time must be before arrival time"}, 400

        db.session.commit()
        return jsonify(schedule.to_dict()), 200
    except ValueError as e:
        db.session.rollback()
        return {"error": str(e)}, 400
    except Exception as e:
        db.session.rollback()
        return {"error": "Failed to update schedule"}, 500