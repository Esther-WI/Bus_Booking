from flask import Blueprint, request, jsonify
from server.models import Route,Schedule,Bus
from server.extensions import db
from server.utils.auth import role_required
from flask_jwt_extended import jwt_required
from datetime import datetime

route_bp = Blueprint("routes", __name__, url_prefix="/api/routes")

@route_bp.route("/", methods=["GET"])
def get_routes():
    from_city = request.args.get('from')
    to_city = request.args.get('to')
    date = request.args.get('date')
    
    query = Route.query
    
    if from_city:
        query = query.filter(Route.origin.ilike(f'%{from_city}%'))
    if to_city:
        query = query.filter(Route.destination.ilike(f'%{to_city}%'))
    
    routes = query.all()
    
    result = []
    for route in routes:
        route_data = route.to_dict()
        
        buses = Bus.query.join(Schedule).filter(
            Schedule.route_id == route.id
        ).all()
        
        route_data['buses'] = []
        for bus in buses:
            bus_data = bus.to_dict()
            bus_data['schedules'] = [
                s.to_dict() for s in bus.schedules 
                if not date or s.departure_time.date() == datetime.strptime(date, '%Y-%m-%d').date()
            ]
            if bus_data['schedules']:  # Only include buses with matching schedules
                route_data['buses'].append(bus_data)
        
        result.append(route_data)
    
    return jsonify(result)

@route_bp.route("/", methods=["POST"])
@jwt_required()
@role_required("Admin")
def create_route():
    data = request.get_json()
    try:
        route_data = {
            "origin": data.get("origin"),
            "destination": data.get("destination"),
            "distance": float(data.get("distance", 0)),
            "estimated_duration": int(data.get("estimated_duration", 0))
        }
        
        route = Route(**route_data)
        db.session.add(route)
        db.session.commit()
        return jsonify(route.to_dict()), 201
    except ValueError as e:
        return {"error": f"Invalid numeric value: {str(e)}"}, 400
    except Exception as e:
        return {"error": str(e)}, 400
    
@route_bp.route("/search", methods=["GET"])
def search_routes():
    origin = request.args.get("origin")
    destination = request.args.get("destination")

    if not origin or not destination:
        return {"error": "Origin and destination are required."}, 400

    routes = Route.query.filter(
        Route.origin.ilike(f"%{origin}%"),
        Route.destination.ilike(f"%{destination}%")
    ).all()
    return jsonify([r.to_dict() for r in routes])

# Popular routes
@route_bp.route("/popular", methods=["GET"])
@jwt_required()
@role_required("Admin","Customer","Driver")
def popular_routes():
    popular = Route.query.order_by(Route.bookings_count.desc()).limit(5).all()
    return jsonify([r.to_dict() for r in popular])

@route_bp.route('/buses', methods=['GET'])
@jwt_required()
def get_buses_for_route():
    origin = request.args.get('from')
    destination = request.args.get('to')
    date = request.args.get('date')  
    
    # Query buses with schedules for this route
    buses = db.session.query(Bus).join(Schedule).join(Route).filter(
        Route.origin == origin,
        Route.destination == destination
    ).all()
    
    return jsonify([bus.to_dict() for bus in buses])


