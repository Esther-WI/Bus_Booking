from flask import Blueprint

admin_bp = Blueprint('admin', __name__)
 
 
@admin_bp.route('/test', methods=['GET'])
def test():
    return "Admin route is working!"