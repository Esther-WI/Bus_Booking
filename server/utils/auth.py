from flask_jwt_extended import get_jwt_identity
from server.models import User

def current_user():
    user_id = get_jwt_identity()
    return User.query.get(user_id)

def role_required(*roles):
    def wrapper(fn):
        from functools import wraps
        @wraps(fn)
        def decorated(*args, **kwargs):
            user = current_user()
            if user.Role not in roles:
                return {"error": f"{user.Role} not authorized"}, 403
            return fn(*args, **kwargs)
        return decorated
    return wrapper
