from server.extensions import db
from sqlalchemy.orm import validates

class Schedule(db.Model):
    __tablename__ = 'schedules'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    bus_id = db.Column(db.Integer, db.ForeignKey('buses.id'))
    route_id = db.Column(db.Integer, db.ForeignKey('routes.id'))
    departure_time = db.Column(db.DateTime, nullable=False)
    arrival_time = db.Column(db.DateTime, nullable=False)
    price_per_seat = db.Column(db.Integer, nullable=False)
    available_seats = db.Column(db.String(20), default='available')
    created_at = db.Column(db.DateTime, server_default=db.func.now())


    route = db.relationship('Route', back_populates='schedules')
    bus = db.relationship('Bus', back_populates='schedules')
    bookings = db.relationship('Booking', back_populates='schedule', lazy=True)

    def __init__(self, bus_id, route_id, departure_time, arrival_time, price_per_seat, available_seats='available', created_at=None):
        self.bus_id = bus_id
        self.route_id = route_id
        self.departure_time = departure_time
        self.arrival_time = arrival_time
        self.price_per_seat = price_per_seat
        self.available_seats = available_seats

    @validates('price_per_seat')
    def validate_price_per_seat(self, key, value):
        if value < 0:
            raise ValueError("Price per seat must be non-negative")
        return value

    @validates('status')
    def validate_status(self, key, value):
        allowed_statuses = ['available', 'unavailable', 'cancelled']
        if value not in allowed_statuses:
            raise ValueError(f"Status must be one of {allowed_statuses}")
        return value

    @validates('departure_time', 'arrival_time')
    def validate_times(self, key, value):
        if not value:
            raise ValueError(f"{key} cannot be empty")
        return value
    
    def to_dict(self):
        return {
            "id": self.id,
            "bus": self.basic_info if self.bus else None,
            "route": self.basic_info if self.route else None,
            "departure_time": self.departure_time.isoformat() if self.departure_time else None,
            "arrival_time": self.arrival_time.isoformat() if self.arrival_time else None,
            "bookings": [ b.basic_info for b in self.bookings ]
        }

    @property
    def basic_info(self):
        return {
            'id': self.id,
            'departure_time': self.departure_time.isoformat() if self.departure_time else None,
            'arrival_time': self.arrival_time.isoformat() if self.arrival_time else None,
            'price_per_seat': self.price_per_seat,
            'available_seats': self.available_seats,
            'bus_id': self.bus_id,
            'route_id': self.route_id
        }

    def __repr__(self):
        return f"<Schedule bus={self.bus_id} route={self.route_id} departs={self.departure_time}>"
