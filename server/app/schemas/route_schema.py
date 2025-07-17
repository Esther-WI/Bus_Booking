route_table_sql = """ 
CREATE TABLE routes (
    route_id INTEGER PRIMARY KEY AUTO_INCREMENT,
    origin VARCHAR(50) NOT NULL,
    destination VARCHAR(50) NOT NULL,
    distance DECIMAL(8,2) NOT NULL,
    estimated_duration INTEGER NOT NULL
);
"""