# models/review.py

from server.extensions import db
from datetime import datetime
from sqlalchemy.orm import validates

class Review(db.Model):
    __tablename__ = 'reviews'

    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.Text, nullable=False)
    comment = db.Column(db.String, nullable=False)
    rating = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    bus_id = db.Column(db.Integer, db.ForeignKey('buses.id'), nullable=False)

    user = db.relationship('User', back_populates='reviews')
    bus = db.relationship('Bus', back_populates='reviews')

    def to_dict(self):
        return {
            "id": self.id,
            "text": self.text,
            "bus_id": self.bus_id,
            "user_id": self.user_id,
            "rating": self.rating,
            "comment": self.comment,
            "date": self.created_at.isoformat(),
            "user": {
                "id": self.user.id,
                "username": self.user.username,  # Assuming User model has these fields
                "email": self.user.email
            },
            "bus": {
                "id": self.bus.id,
                "model": self.bus.model,
                "registration_number":self.bus.registration_number,
                "capacity":self.bus.capacity,
                "status":self.bus.status
            }
        }
    
    @validates('text')
    def validate_text(self, key, text):
        if not text or len(text.strip()) < 10:
            raise ValueError("Review text must be at least 10 characters")
        return text

    @validates('rating')
    def validate_rating(self, key, rating):
        if not 1 <= rating <= 5:
            raise ValueError("Rating must be between 1 and 5")
        return rating
