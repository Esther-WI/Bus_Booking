from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from server.models import User, Bus, Schedule
from server.utils.auth import role_required, current_user
from server.extensions import db
from sqlalchemy.exc import IntegrityError

admin_bp = Blueprint('admin', __name__, url_prefix='/api/admin')

@admin_bp.route('/dashboard-data', methods=['GET'])
@jwt_required()
@role_required("Admin")
def get_dashboard_data():
    """Endpoint optimized for admin dashboard loading"""
    try:
        users = User.query.all()
        buses = Bus.query.all()
        schedules = Schedule.query.all()
        
        return jsonify({
            'users': [user.to_dict() for user in users],
            'buses': [bus.to_dict() for bus in buses],
            'schedules': [schedule.to_dict() for schedule in schedules]
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@admin_bp.route('/users', methods=['GET'])
@jwt_required()
@role_required("Admin")
def get_all_users():
    try:
        users = User.query.all()
        return jsonify([user.to_dict() for user in users]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@admin_bp.route('/users/<int:user_id>', methods=['DELETE'])
@jwt_required()
@role_required("Admin")
def delete_user(user_id):
    try:
        user = User.query.get_or_404(user_id)
        
        # Prevent self-deletion
        if user.id == get_jwt_identity():
            return jsonify({"error": "Cannot delete your own account"}), 400
        
        # Check for assigned buses
        buses_driven = Bus.query.filter_by(driver_id=user.id).all()
        
        if buses_driven:
            # Find an alternate driver
            alternate_driver = User.query.filter(
                User.Role == 'Driver',
                User.id != user.id
            ).first()
            
            if not alternate_driver:
                return jsonify({
                    "error": "No alternate driver available",
                    "bus_ids": [bus.id for bus in buses_driven]
                }), 400
            
            # Reassign buses
            for bus in buses_driven:
                bus.driver_id = alternate_driver.id
        
        # Proceed with deletion
        db.session.delete(user)
        db.session.commit()
        
        return jsonify({
            "message": "User deleted successfully",
            "reassigned_buses": [bus.id for bus in buses_driven] if buses_driven else None
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
    
@admin_bp.route('/schedules/<int:schedule_id>', methods=['DELETE'])
@jwt_required()
@role_required("Admin")
def delete_schedule(schedule_id):
    try:
        schedule = Schedule.query.get_or_404(schedule_id)
        
        # Check for existing bookings
        if schedule.bookings:
            return jsonify({
                "error": "Schedule has existing bookings",
                "booking_ids": [b.id for b in schedule.bookings]
            }), 400
        
        db.session.delete(schedule)
        db.session.commit()
        
        return jsonify({"message": "Schedule deleted successfully"}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@admin_bp.route('/role', methods=['GET'])
@jwt_required()
def get_user_role():
    """Get role of current user"""
    try:
        return jsonify({"role": current_user().Role}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@admin_bp.route('/users/<int:user_id>', methods=['PATCH'])
@jwt_required()
@role_required("Admin")
def update_user(user_id):
    try:
        user = User.query.get_or_404(user_id)
        data = request.get_json()
        
        # Prevent changing admin status unless you want that
        if 'role' in data and data['role'] == 'admin':
            return jsonify({"error": "Cannot change admin status"}), 400
            
        for field in ['username', 'email', 'phone_number']:
            if field in data:
                setattr(user, field, data[field])
        
        db.session.commit()
        return jsonify(user.to_dict()), 200
    except IntegrityError:
        db.session.rollback()
        return jsonify({"error": "Username or email already exists"}), 400
    except ValueError as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500