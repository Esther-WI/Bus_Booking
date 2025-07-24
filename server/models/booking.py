from server.extensions import db
from sqlalchemy.orm import validates
import uuid

class Booking(db.Model):
    __tablename__ = 'bookings'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    schedule_id = db.Column(db.Integer, db.ForeignKey('schedules.id'))
    customer_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    seat_number = db.Column(db.Integer, nullable=False)
    booking_status = db.Column(db.String(20), default='Pending')
    payment_status = db.Column(db.String(20), default='pending')
    reference = db.Column(db.String(10), unique=True, default=lambda: str(uuid.uuid4())[:8])
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    schedule = db.relationship('Schedule', back_populates='bookings', lazy=True)
    user = db.relationship('User', back_populates = 'bookings', foreign_keys=[customer_id])

    def __init__(self, schedule_id, customer_id, seat_number, booking_status='Pending', payment_status='pending', created_at=None):
        self.schedule_id = schedule_id
        self.customer_id = customer_id
        self.seat_number = seat_number
        self.booking_status = booking_status
        self.payment_status = payment_status
        self.created_at = created_at


    @validates('seat_number')
    def validate_seat_number(self, key, seat_number):
        if not isinstance(seat_number, int) or seat_number <= 0:
            raise ValueError("Seat number must be a positive integer")
        return seat_number

    @validates('booking_status')
    def validate_booking_status(self, key, booking_status):
        allowed_statuses = ['Pending', 'Confirmed', 'Cancelled']
        if booking_status not in allowed_statuses:
            raise ValueError(f"Booking status must be one of {allowed_statuses}")
        return booking_status

    @validates('payment_status')
    def validate_payment_status(self, key, payment_status):
        allowed_statuses = ['pending', 'paid', 'failed']
        if payment_status not in allowed_statuses:
            raise ValueError(f"Payment status must be one of {allowed_statuses}")
        return payment_status
    
    def to_dict(self):
        return {
            "id": self.id,
            "schedule_id": self.schedule_id,
            # If you need schedule details, serialize them manually:
            "schedule": {
                "id": self.schedule.id,
                "departure_time": self.schedule.departure_time.isoformat(),
                # Add other Schedule fields as needed
            } if self.schedule else None,
            "customer_id": self.customer_id,
            "seat_number": self.seat_number,
            "booking_status": self.booking_status,
            "payment_status": self.payment_status,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }

    
    @property
    def basic_info(self):
        return {
            "id": self.id,
            "seat_number": self.seat_number,
            "booking_status": self.booking_status,
            "payment_status": self.payment_status,
            "reference": self.reference
        }
    
    def __repr__(self):
        return f"<Booking id={self.id} seat={self.seat_number} status={self.booking_status}>"
    