from flask import Blueprint, request, jsonify
from server.models import Offer
from server.extensions import db
from flask_jwt_extended import jwt_required
from server.utils.auth import role_required

offer_bp = Blueprint("offers", __name__, url_prefix="/api/offers")

@offer_bp.route("/", methods=["GET"])
def get_offers():
    offers = Offer.query.all()
    return jsonify([offer.to_dict() for offer in offers]), 200

@offer_bp.route("/", methods=["POST"])
@jwt_required()
@role_required("Admin")
def create_offer():
    data = request.get_json()
    try:
        offer = Offer(
            title=data["title"],
            description=data["description"],
            discount=data["discount"],
            terms=data.get("terms", "")
        )
        db.session.add(offer)
        db.session.commit()
        return jsonify(offer.to_dict()), 201
    except Exception as e:
        return {"error": str(e)}, 400
