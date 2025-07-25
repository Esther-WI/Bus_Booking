# models/review.py

from server.extensions import db
from datetime import datetime

class Review(db.Model):
    __tablename__ = 'reviews'

    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.Text, nullable=False)
    comment = db.Column(db.Integer, nullable=False)
    rating = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    bus_id = db.Column(db.Integer, db.ForeignKey('buses.id'), nullable=False)

    user = db.relationship('User', back_populates='reviews')
    bus = db.relationship('Bus', back_populates='reviews')

    def to_dict(self):
        return {
            "id": self.id,
            "bus_id": self.bus_id,
            "user_id": self.user_id,
            "rating": self.rating,
            "comment": self.comment,
            "date": self.created_at.isoformat()
        }
