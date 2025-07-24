from flask import Blueprint, request, jsonify
from server.models import Route
from server.extensions import db
route_bp = Blueprint("routes", __name__, url_prefix="/api/routes")
from server.utils.auth import role_required
from flask_jwt_extended import jwt_required

@route_bp.route("/", methods=["GET"])
def get_routes():
    return jsonify([r.to_dict() for r in Route.query.all()])

@route_bp.route("/", methods=["POST"])
@jwt_required()
@role_required("Admin")
def create_route():
    data = request.get_json()
    try:
        route = Route(**data)
        db.session.add(route)
        db.session.commit()
        return jsonify(route.to_dict()), 201
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

