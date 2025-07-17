bus_table_sql = """
CREATE TABLE buses (
    bus_id INTEGER PRIMARY KEY AUTO_INCREMENT,
    driver_id INTEGER,
    registration_number VARCHAR(10) UNIQUE NOT NULL,
    model VARCHAR(100) NOT NULL,
    status BOOLEAN DEFAULT Available,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (driver_id) REFERENCES users(user_id)
)
"""