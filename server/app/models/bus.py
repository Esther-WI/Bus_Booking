from app.extensions import db

class Bus(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    driver_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    number_of_seats = db.Column(db.Integer, nullable=False)
    cost_per_seat = db.Column(db.Float, nullable=False)
    route = db.Column(db.String(120), nullable=False)
    time_of_travel = db.Column(db.String(50), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'driver_id': self.driver_id,
            'number_of_seats': self.number_of_seats,
            'cost_per_seat': self.cost_per_seat,
            'route': self.route,
            'time_of_travel': self.time_of_travel
        }