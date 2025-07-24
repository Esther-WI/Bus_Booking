from server.extensions import db
from sqlalchemy.orm import validates

class Route(db.Model):
    __tablename__ = 'routes'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    origin = db.Column(db.String(50), nullable=False)
    destination = db.Column(db.String(50), nullable=False)
    distance = db.Column(db.Numeric(8, 2), nullable=False)
    estimated_duration = db.Column(db.Integer, nullable=False)

    schedules = db.relationship('Schedule', back_populates='route', lazy=True, foreign_keys='Schedule.route_id')

    def __init__(self, origin, destination, distance, estimated_duration):
        self.origin = origin
        self.destination = destination
        self.distance = distance
        self.estimated_duration = estimated_duration

    @validates('origin', 'destination')
    def validate_location(self, key, value):
        if not value or not value.strip():
            raise ValueError(f"{key.capitalize()} cannot be empty.")
        if len(value) > 50:
            raise ValueError(f"{key.capitalize()} must be at most 50 characters.")
        return value.strip()

    @validates('distance')
    def validate_distance(self, key, value):
        if value is None:
            raise ValueError("Distance cannot be None.")
        if float(value) <= 0:
            raise ValueError("Distance must be positive.")
        return value

    @validates('estimated_duration')
    def validate_estimated_duration(self, key, value):
        if value is None:
            raise ValueError("Estimated duration cannot be None.")
        if int(value) <= 0:
            raise ValueError("Estimated duration must be positive.")
        return value
    
    def to_dict(self):
        return {
            "id": self.id,
            "origin": self.origin,
            "destination": self.destination,
            "schedules": [s.basic_info for s in self.schedules]
        }
        
    @property
    def basic_info(self):
        return {
            "id": self.id,
            "origin": self.origin,
            "destination": self.destination,
            "distance": float(self.distance),
            "estimated_duration": self.estimated_duration
        }
    
    def __repr__(self):
        return f"<Route {self.origin} to {self.destination} - {self.distance}km>"
