# seed.py
from server.app import app
from server.extensions import db
from server.models import User, Route, Bus, Schedule, Booking, Offer
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
        User(username="driver3", Role="Driver", email="driver3@example.com", password="pass123"),
        User(username="rider1", Role="Customer", email="rider1@example.com", password="pass123"),
        User(username="rider2", Role="Customer", email="rider2@example.com", password="pass123"),
        User(username="rider3", Role="Customer", email="rider3@example.com", password="pass123"),
        User(username="rider4", Role="Customer", email="rider4@example.com", password="pass123"),
        User(username="rider5", Role="Customer", email="rider5@example.com", password="pass123"),
        User(username="rider6", Role="Customer", email="rider6@example.com", password="pass123"),
        User(username="business1", Role="Customer", email="business@example.com", password="pass123"),
    ]
    db.session.add_all(users)
    db.session.commit()

    print("✅ Seeding routes...")
    routes = [
        Route(origin="Nairobi", destination="Mombasa", distance=480.5, estimated_duration=300),
        Route(origin="Kisumu", destination="Nakuru", distance=180.0, estimated_duration=150),
        Route(origin="Eldoret", destination="Nairobi", distance=310.0, estimated_duration=210),
        Route(origin="Nairobi", destination="Kisumu", distance=265.0, estimated_duration=240),
        Route(origin="Mombasa", destination="Malindi", distance=105.0, estimated_duration=120),
        Route(origin="Nakuru", destination="Eldoret", distance=160.0, estimated_duration=135),
        Route(origin="Nairobi", destination="Thika", distance=45.0, estimated_duration=60),
        Route(origin="Nairobi", destination="Naivasha", distance=90.0, estimated_duration=90),
    ]
    db.session.add_all(routes)
    db.session.commit()

    print("✅ Seeding buses...")
    buses = [
        Bus(registration_number="KDA123A", capacity=40, model="Scania Interlink", driver_id=users[1].id),
        Bus(registration_number="KDB456B", capacity=45, model="Isuzu NPR", driver_id=users[2].id),
        Bus(registration_number="KDC789C", capacity=35, model="Toyota Coaster", driver_id=users[3].id),
        Bus(registration_number="KDD012D", capacity=50, model="Volvo B8R", driver_id=users[1].id),
        Bus(registration_number="KDE345E", capacity=30, model="Mercedes Sprinter", driver_id=users[2].id),
        Bus(registration_number="KDF678F", capacity=42, model="MAN Lion's Coach", driver_id=users[3].id),
    ]
    db.session.add_all(buses)
    db.session.commit()

    print("✅ Seeding schedules...")
    now = datetime.now()
    schedules = []
    
    # Generate schedules for the next 14 days
    for day in range(14):
        current_date = now + timedelta(days=day)
        
        # Nairobi-Mombasa route (morning and evening)
        schedules.append(Schedule(
            bus_id=buses[0].id,
            route_id=routes[0].id,
            departure_time=datetime(current_date.year, current_date.month, current_date.day, 8, 30),
            arrival_time=datetime(current_date.year, current_date.month, current_date.day, 13, 30),
            price_per_seat=1200,
            available_seats=60
        ))
        schedules.append(Schedule(
            bus_id=buses[3].id,
            route_id=routes[0].id,
            departure_time=datetime(current_date.year, current_date.month, current_date.day, 14, 0),
            arrival_time=datetime(current_date.year, current_date.month, current_date.day, 19, 0),
            price_per_seat=1200,
            available_seats=60
        ))
        
        # Kisumu-Nakuru route
        if day % 2 == 0:  # Every other day
            schedules.append(Schedule(
                bus_id=buses[1].id,
                route_id=routes[1].id,
                departure_time=datetime(current_date.year, current_date.month, current_date.day, 10, 0),
                arrival_time=datetime(current_date.year, current_date.month, current_date.day, 12, 30),
                price_per_seat=800,
                available_seats=50
            ))
        
        # Eldoret-Nairobi route
        schedules.append(Schedule(
            bus_id=buses[2].id,
            route_id=routes[2].id,
            departure_time=datetime(current_date.year, current_date.month, current_date.day, 7, 0),
            arrival_time=datetime(current_date.year, current_date.month, current_date.day, 10, 30),
            price_per_seat=900,
            available_seats=30
        ))
        
        # Nairobi-Kisumu route
        if day % 3 == 0:  # Every 3 days
            schedules.append(Schedule(
                bus_id=buses[5].id,
                route_id=routes[3].id,
                departure_time=datetime(current_date.year, current_date.month, current_date.day, 9, 0),
                arrival_time=datetime(current_date.year, current_date.month, current_date.day, 13, 0),
                price_per_seat=1000,
                available_seats=50
            ))
        
        # Mombasa-Malindi route (short trip)
        schedules.append(Schedule(
            bus_id=buses[4].id,
            route_id=routes[4].id,
            departure_time=datetime(current_date.year, current_date.month, current_date.day, 11, 0),
            arrival_time=datetime(current_date.year, current_date.month, current_date.day, 13, 0),
            price_per_seat=500,
            available_seats=40
        ))

    db.session.add_all(schedules)
    db.session.commit()

    print("✅ Seeding bookings...")
    bookings = []
    
    # Create bookings for various schedules
    for i in range(50):
        customer_id = random.choice([user.id for user in users if user.Role == "Customer"])
        schedule = random.choice(schedules)
        seat_number = random.randint(1, schedule.bus.capacity)
        
        # Ensure we don't double-book seats
        while Booking.query.filter_by(schedule_id=schedule.id, seat_number=seat_number).first():
            seat_number = random.randint(1, schedule.bus.capacity)
        
        bookings.append(Booking(
            customer_id=customer_id,
            schedule_id=schedule.id,
            seat_number=seat_number,)
        )
    
    # Add some specific bookings
    bookings.extend([
        Booking(customer_id=users[4].id, schedule_id=schedules[0].id, seat_number=1),
        Booking(customer_id=users[5].id, schedule_id=schedules[1].id, seat_number=2),
        Booking(customer_id=users[6].id, schedule_id=schedules[2].id, seat_number=3),
        Booking(customer_id=users[7].id, schedule_id=schedules[3].id, seat_number=4),
        Booking(customer_id=users[8].id, schedule_id=schedules[4].id, seat_number=5)
    ])

    db.session.add_all(bookings)
    db.session.commit()

    print("✅ Seeding offers...")
    offers = [
        Offer(title="Summer Sale", description="Get 20% off all routes in July!", discount="20% OFF", terms="Valid till July 31"),
        Offer(title="First Ride Bonus", description="Enjoy 15% off your first booking.", discount="15% OFF", terms="New users only"),
        Offer(title="Weekend Getaway", description="Special weekend rates to coastal towns", discount="25% OFF", terms="Weekend travel only"),
        Offer(title="Group Discount", description="Travel with 4+ people and save", discount="30% OFF", terms="Group bookings only"),
        Offer(title="Early Bird Special", description="Book 7+ days in advance and save", discount="15% OFF", terms="Limited seats available"),
        Offer(title="Student Discount", description="Exclusive offer for students", discount="10% OFF", terms="Valid student ID required"),
        Offer(title="Senior Citizen Discount", description="Special rates for seniors", discount="20% OFF", terms="Age 60+ only"),
    ]

    db.session.add_all(offers)
    db.session.commit()

    print("✅ Seeding complete!")