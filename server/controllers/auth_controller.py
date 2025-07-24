from flask import Blueprint, request, jsonify
from server.models import User
from server.extensions import db
from sqlalchemy.exc import IntegrityError
from server.utils.auth import current_user
from flask_jwt_extended import create_access_token,jwt_required, get_jwt_identity

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")

@auth_bp.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    try:
        user = User(**data)
        db.session.add(user)
        db.session.commit()
        return jsonify(user.to_dict()), 201
    except IntegrityError:
        db.session.rollback()
        return {"error": "Username or email already exists"}, 400
    except ValueError as e:
        return {"error": str(e)}, 400

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(username=data.get("username")).first()
    if user and user.authenticate(data.get("password")):
        token = create_access_token(identity=user.id)
        return {"access_token": token, "user": user.to_dict()}, 200
    return {"error": "Invalid username or password"}, 401

@auth_bp.route("/me", methods=["PATCH"])
@jwt_required()
def update_profile():
    user = current_user()
    data = request.get_json()

    for field in ['username', 'email', 'phone_number']:
        if field in data:
            setattr(user, field, data[field])
    
    db.session.commit()
    return jsonify(user.to_dict())

@auth_bp.route("/me", methods=["GET"])
@jwt_required()
def get_me():
    return jsonify(current_user().to_dict())

