# seed.py
from server.app import create_app
from server.extensions import db


from server.models import User, Route, Bus, Schedule, Booking, Offer

# from server.models import *
# from server.app import app

from datetime import datetime, timedelta
import random

app = create_app()

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
        Bus(registration_number="KDA123A", capacity=40, model="Scania", driver_id=users[1].id),
        Bus(registration_number="KDB456B", capacity=45, model="Isuzu", driver_id=users[2].id)
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

    print("✅ Seeding offers...")
    offers = [
        Offer(title="Summer Sale", description="Get 20% off all routes in July!", discount="20% OFF", terms="Valid till July 31"),
        Offer(title="First Ride Bonus", description="Enjoy 15% off your first booking.", discount="15% OFF", terms="New users only")
    ]

    db.session.add_all(offers)
    db.session.commit()

    print("✅ Seeding reviews...")
    reviews = [
        Review(
            text="The bus was very comfortable and arrived on time. Highly recommend!",
            comment="Great experience",
            rating=5,
            user_id=users[3].id,  # rider1
            bus_id=buses[0].id,    # First bus
            created_at=datetime(2025, 7, 20, 10, 30)
        ),
        Review(
            text="Decent ride but the AC wasn't working properly.",
            comment="AC issues",
            rating=3,
            user_id=users[4].id,  # rider2
            bus_id=buses[0].id,   # First bus
            created_at=datetime(2025, 7, 21, 14, 15)
        ),
        Review(
            text="Excellent service and friendly driver. Will book again!",
            comment="Perfect trip",
            rating=5,
            user_id=users[3].id,  # rider1
            bus_id=buses[1].id,   # Second bus
            created_at=datetime(2025, 7, 22, 9, 0)
        ),
        Review(
            text="The bus was clean but the seats were a bit cramped.",
            comment="Okay experience",
            rating=4,
            user_id=users[4].id,  # rider2
            bus_id=buses[1].id,   # Second bus
            created_at=datetime(2025, 7, 23, 16, 45)
        )
    ]

    db.session.add_all(reviews)
    db.session.commit()




print("✅ Seeding complete!")
