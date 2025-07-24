from server.extensions import db
from sqlalchemy.orm import validates

class Bus(db.Model):
    __tablename__ = 'buses'

    id = db.Column(db.Integer, primary_key=True)
    driver_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    registration_number = db.Column(db.String(10), unique=True, nullable=False)
    model = db.Column(db.String(100), nullable=False)
    status = db.Column(db.String(20), default='Available')
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    schedules = db.relationship('Schedule', back_populates='bus', lazy=True, foreign_keys='Schedule.bus_id')
    driver = db.relationship('User', back_populates='buses', foreign_keys = [driver_id])

    def __init__(self, driver_id, registration_number, model, status='Available', created_at=None):
        self.driver_id = driver_id
        self.registration_number = registration_number
        self.model = model
        self.status = status
        self.created_at = created_at


    @validates('registration_number')
    def validate_registration_number(self, key, registration_number):
        if not registration_number or len(registration_number) < 6:
            raise ValueError("Registration number must be at least 6 characters long, e.g., KCA 765L.")
        return registration_number

    @validates('model')
    def validate_model(self, key, model):
        if not model:
            raise ValueError("Model field should not be empty.")
        return model
    
    def to_dict(self):
        return {
            "id": self.id,
            "model": self.model,
            "registration_number": self.registration_number,
            "status": self.status,
            "driver_id": self.basic_info if self.driver_id else None,
            "schedules": [s.basic_info for s in self.schedules]
        }

    @property
    def basic_info(self):
        return {
            "id": self.id,
            "registration_number": self.registration_number,
            "model": self.model,
            "status": self.status
        }
    
    def __repr__(self):
        return f"<Bus model={self.model} driver_id={self.driver_id}>"

    
