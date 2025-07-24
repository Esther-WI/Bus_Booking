from server.extensions import db, bcrypt
from sqlalchemy.ext.hybrid import hybrid_property
import re
from sqlalchemy.orm import validates

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=True, nullable=False)
    _password_hash = db.Column(db.String)
    email = db.Column(db.String(100), unique=True, nullable=False)
    phone_number = db.Column(db.String(10))
    Role = db.Column(db.String(), nullable=False)

    bookings = db.relationship('Booking', back_populates='user', lazy=True, foreign_keys='Booking.customer_id')
    buses = db.relationship('Bus', back_populates='driver', lazy=True, foreign_keys='Bus.driver_id')

    DEFAULT_ROLES = {"Customer", "Driver", "Admin"}

    def __init__(self, username, password=None, email=None, phone_number=None, Role=None):
        self.username = username
        self.password_hash = password
        self.email = email
        self.phone_number = phone_number
        self.Role = Role


    @hybrid_property
    def password_hash(self):
        raise AttributeError("Password hashes cannot be viewed.")

    @password_hash.setter
    def password_hash(self, value):
        if not value or len(value) < 6:
            raise ValueError("Password must be at least 6 characters long.")
        password_hash = bcrypt.generate_password_hash(
            value.encode('utf-8'))
        self._password_hash = password_hash.decode('utf-8')

    def authenticate(self, password):
        return bcrypt.check_password_hash(
            self._password_hash, password.encode('utf-8'))

    @validates('username')
    def validate_username(self, key, username):
        if not username or len(username) < 3:
            raise ValueError("Username must be at least 3 characters long.")
        return username

    @validates('email')
    def validate_email(self, key, email):
        email_regex = r"^[\w\.-]+@[\w\.-]+\.\w+$"
        if not email or not re.match(email_regex, email):
            raise ValueError("Invalid email address.")
        return email

    @validates('phone_number')
    def validate_phone(self, key, phone_number):
        if phone_number and (not phone_number.isdigit() or len(phone_number) != 10):
            raise ValueError("Phone number must be exactly 10 digits.")
        return phone_number

    @validates('Role')
    def validate_role(self, key, role):
        if role not in self.DEFAULT_ROLES:
            raise ValueError(f"Role must be one of: {', '.join(self.DEFAULT_ROLES)}.")
        return role

    def get_token(self):
        from flask_jwt_extended import create_access_token
        return create_access_token(identity=self.id)
    
    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "bookings": [b.basic_info for b in self.bookings],
            "role": self.Role
        }
    
    @property
    def basic_info(self):
        return {
            "id": self.id,
            "username": self.username,
            "role": self.Role
        }

    def __repr__(self):
        return f"<User {self.username}>"