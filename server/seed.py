# seed.py
from server.app import app
from server.extensions import db
from server.models import User, Route, Bus, Schedule, Booking
from server.app import app
from datetime import datetime, timedelta
import random

with app.app_context():
    print("🔄 Dropping and creating all tables...")
    db.drop_all()
    db.create_all()

    print("✅ Seeding users...")
    users = [
        User(username="admin", Role="Admin", email="admin@example.com", password="admin123"),
        User(username="driver1", Role="Driver", email="driver1@example.com", password="pass123"),
        User(username="driver2", Role="Driver", email="driver2@example.com", password="pass123"),
        User(username="rider1", Role="Customer", email="rider1@example.com", password="pass123"),
        User(username="rider2", Role="Customer", email="rider2@example.com", password="pass123")
    ]
    db.session.add_all(users)
    db.session.commit()

    print("✅ Seeding routes...")
    routes = [
        Route(origin="Nairobi", destination="Mombasa", distance=480.5, estimated_duration=300),
        Route(origin="Kisumu", destination="Nakuru", distance=180.0, estimated_duration=150),
        Route(origin="Eldoret", destination="Nairobi", distance=310.0, estimated_duration=210),
    ]
    db.session.add_all(routes)
    db.session.commit()

    print("✅ Seeding buses...")
    buses = [
        Bus(registration_number="KDA123A", model="Scania", driver_id=users[1].id),
        Bus(registration_number="KDB456B", model="Isuzu", driver_id=users[2].id)
    ]
    db.session.add_all(buses)
    db.session.commit()

    print("✅ Seeding schedules...")
    now = datetime.now()
    schedules = [
        Schedule(
            bus_id=buses[0].id,
            route_id=routes[0].id,
            departure_time=datetime(2025, 7, 25, 8, 30),
            arrival_time=datetime(2025, 7, 25, 12, 30),
            price_per_seat=1000
        ),
        Schedule(
            bus_id=buses[1].id,
            route_id=routes[1].id,
            departure_time=datetime(2025, 7, 26, 10, 0),
            arrival_time=datetime(2025, 7, 26, 16, 0),
            price_per_seat=1500
        ),
        Schedule(
            bus_id=buses[0].id,
            route_id=routes[1].id,
            departure_time=datetime(2025, 7, 27, 9, 0),
            arrival_time=datetime(2025, 7, 27, 14, 30),
            price_per_seat=1200
        )
    ]

    db.session.add_all(schedules)
    db.session.commit()

    print("✅ Seeding bookings...")
    bookings = [
        Booking(customer_id=users[3].id, schedule_id=schedules[0].id, seat_number=1),
        Booking(customer_id=users[4].id, schedule_id=schedules[1].id, seat_number=2),
        Booking(customer_id=users[1].id, schedule_id=schedules[2].id, seat_number=3)
    ]

    db.session.add_all(bookings)
    db.session.commit()

print("✅ Seeding complete!")
