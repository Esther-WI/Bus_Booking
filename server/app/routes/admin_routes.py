from flask import Blueprint, jsonify
from app.controllers import AuthController
from flask_jwt_extended import jwt_required, get_jwt_identity

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/users', methods=['GET'])
@jwt_required()
def get_users():
    current_user = AuthController.get_current_user(get_jwt_identity())
    if current_user.role != "Admin":
        return jsonify({"error": "Admin access required"}), 403
    
    users = AuthController.get_all_users()
    return jsonify([{"id": u.id, "username": u.username} for u in users])

@admin_bp.route('/users/<int:user_id>', methods=['DELETE'])
@jwt_required()
def delete_user(user_id):
    current_user = AuthController.get_current_user(get_jwt_identity())
    if current_user.role != "Admin":
        return jsonify({"error": "Admin access required"}), 403
    
    try:
        AuthController.delete_user(user_id)
        return jsonify({"message": "User deleted"})
    except Exception as e:
        return jsonify({"error": str(e)}), 404