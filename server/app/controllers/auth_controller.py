from app.extensions import db, bcrypt
from app.models import User
from flask_jwt_extended import create_access_token
from flask import request, jsonify
import re

class AuthController:
    """Handles all auth and admin logic in one place"""

    # AUTHENTICATION LOGIC

    @staticmethod
    def register():
        """Register a new user"""
        print("Registration endpoint hit!")
        data = request.get_json()
        print("Received data:", data)
        
        try:
            required = ['username', 'email', 'password', 'Role']
            if not all(field in data for field in required):
                return jsonify({"error": "Missing required fields"}), 400

            # Pre-validate email format
            if '@' not in data['email'] or '.' not in data['email'].split('@')[-1]:
                return jsonify({"error": "Invalid email format"}), 400

            # Create user 
            user = User(
                username=data['username'],
                email=data['email'],
                password=data['password'],
                phone_number=data.get('phone'),  # Optional field
                Role=data['Role']  
            )
            
            db.session.add(user)
            db.session.commit()
            
            return jsonify({
                "message": "User created successfully",
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "role": user.Role
                }
            }), 201

        except Exception as e:
            print("Registration error:", str(e))
            db.session.rollback()
            return jsonify({"error": str(e)}), 500

    @staticmethod
    def login():
        """Login and return user with token"""
        data = request.get_json()
        try:
            email = data.get('email')
            password = data.get('password')
            
            if not email or not password:
                return jsonify({"error": "Email and password required"}), 400
                
            user = User.query.filter_by(email=email).first()
            if not user or not user.authenticate(password):
                return jsonify({"error": "Invalid credentials"}), 401
                
            token = create_access_token(identity=user.id)
            return jsonify({
                "message": "Login successful",
                "access_token": token,
                "user_id": user.id
            }), 200
            
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    @staticmethod
    def get_current_user(user_id):
        """Get user by ID (for protected routes)"""
        return User.query.get(user_id)

    # ADMIN LOGIC

    @staticmethod
    def get_all_users():
        """Get all users (admin only)"""
        return User.query.all()

    @staticmethod
    def delete_user(user_id):
        """Delete a user (admin only)"""
        user = User.query.get(user_id)
        if not user:
            raise ValueError("User not found")
        db.session.delete(user)
        db.session.commit()
        return True