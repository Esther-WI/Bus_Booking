from app.models import User
from app.models import Bus
from app.models import Route
from app.models import Schedule
from app.models import Booking
from app.extensions import db
from run import app

def seed():
    with app.app_context():
        db.drop_all()
        db.create_all()

        # Users
        user1 = User(username='alice', password='password123', email='alice@example.com', phone_number='0712345678', Role='Customer')
        user2 = User(username='bob', password='password456', email='bob@example.com', phone_number='0798765432', Role='Driver')
        user3 = User(username='admin', password='adminpass', email='admin@example.com', phone_number='0700000000', Role='Admin')
        db.session.add_all([user1, user2, user3])
        db.session.commit()

        # Buses
        bus1 = Bus(driver_id=user2.id, registration_number='KCA765L', model='Toyota Coaster', status='Available')
        bus2 = Bus(driver_id=user2.id, registration_number='KCB123M', model='Isuzu NPR', status='Available')
        db.session.add_all([bus1, bus2])
        db.session.commit()

        # Routes
        route1 = Route(origin='Nairobi', destination='Mombasa', distance=485.0, estimated_duration=8)
        route2 = Route(origin='Kisumu', destination='Nairobi', distance=350.0, estimated_duration=6)
        db.session.add_all([route1, route2])
        db.session.commit()

        # Schedules
        from datetime import datetime, timedelta
        schedule1 = Schedule(bus_id=bus1.id, route_id=route1.id, departure_time=datetime.now()+timedelta(days=1), arrival_time=datetime.now()+timedelta(days=1, hours=8), price_per_seat=1500, status='available')
        schedule2 = Schedule(bus_id=bus2.id, route_id=route2.id, departure_time=datetime.now()+timedelta(days=2), arrival_time=datetime.now()+timedelta(days=2, hours=6), price_per_seat=1200, status='available')
        db.session.add_all([schedule1, schedule2])
        db.session.commit()

        # Bookings
        booking1 = Booking(schedule_id=schedule1.id, customer_id=user1.id, seat_number=1, booking_status='Confirmed', payment_status='paid')
        booking2 = Booking(schedule_id=schedule2.id, customer_id=user1.id, seat_number=2, booking_status='Pending', payment_status='pending')
        db.session.add_all([booking1, booking2])
        db.session.commit()

        print('Database seeded successfully!')