schedule_table_sql = """
CREATE TABLE schedules (
    schedule_id INTEGER PRIMARY KEY AUTO_INCREMENT,
    bus_id INTEGER,
    route_id INTEGER,
    departure_time DATETIME NOT NULL,
    arrival_time DATETIME NOT NULL,
    price_per_seat INTEGER NOT NULL,
    status BOOLEAN DEFAULT available,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (bus_id) REFERENCES buses(bus_id),
    FOREIGN KEY (route_id) REFERENCES routes(route_id),
)
"""