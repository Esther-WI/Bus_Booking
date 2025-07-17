from flask import Blueprint, jsonify
from ..models import Bus

common_bp = Blueprint('common', __name__)

@common_bp.route('/available_buses', methods=['GET'])
def available_buses():
    buses = Bus.query.filter(Bus.number_of_seats > 0).all()
    return jsonify([bus.to_dict() for bus in buses]), 200