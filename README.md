# Bus Booking Backend

This is a backend API for a bus booking system built with Flask, SQLAlchemy, and PostgreSQL.

## Features
- User authentication (Customer, Driver, Admin roles)
- Bus, Route, Schedule, and Booking management
- JWT-based authentication
- PostgreSQL database support
- Database migrations with Flask-Migrate
- Environment variable support via `.env`

## Project Structure
```
server/
  app/
    models/         # SQLAlchemy models (User, Bus, Route, Schedule, Booking)
    controllers/    # API controllers
    routes/         # Route definitions
    schemas/        # Marshmallow schemas
    services/       # External services (Cloudinary, SendGrid, etc.)
    utils/          # Utility functions and error handlers
    config.py       # App configuration
    extensions.py   # Flask extensions (db, migrate, jwt, bcrypt)
    __init__.py     # App factory
    seed.py         # Database seeding script
  run.py            # App entry point
  migrations/       # Alembic migration scripts
  instance/         # Instance folder (optional)
  .env              # Environment variables
```

## Setup Instructions
1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd Bus_Booking
   ```

2. **Create and activate a virtual environment:**
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r server/requirements.txt
   ```

4. **Configure environment variables:**
   - Copy `server/.env.example` to `server/.env` and update values as needed.

5. **Set up the database:**
   - Ensure PostgreSQL is running and a database is created matching your `.env` settings.

6. **Run migrations:**
   ```bash
   export FLASK_APP=server/run.py
   flask db upgrade
   ```

7. **Seed the database (optional):**
   ```bash
   python3 server/app/seed.py
   ```

8. **Run the development server:**
   ```bash
   flask run
   # or
   python3 server/run.py
   ```

## API Endpoints
See the `controllers/` and `routes/` folders for available endpoints and usage.

