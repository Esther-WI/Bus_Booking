from app import db

class Booking(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    bus_id = db.Column(db.Integer, db.ForeignKey('bus.id'), nullable=False)
    customer_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    seat_number = db.Column(db.Integer, nullable=False)
    status = db.Column(db.String(20), nullable=False)