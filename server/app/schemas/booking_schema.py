booking_table_sql = """
CREATE TABLE bookings (
    booking_id INTEGER PRIMARY KEY AUTO_INCREMENT,
    schedule_id INTEGER,
    customer_id INTEGER,
    seat_number INTEGER NOT NULL,
    booking_status VARCHAR(20) DEFAULT 'Pending',
    payment_status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (schedule_id) REFERENCES schedules(schedule_id),
    FOREIGN KEY (customer_id) REFERENCES users(user_id)
)
"""