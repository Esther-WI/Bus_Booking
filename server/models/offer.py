from extensions import db
class Offer(db.Model):
    __tablename__ = 'offers'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    discount = db.Column(db.String(20), nullable=False)
    terms = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "discount": self.discount,
            "terms": self.terms,
        }
