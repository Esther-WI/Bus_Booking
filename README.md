# Bus Booking Web Application

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python](https://img.shields.io/badge/Python-3.9+-blue.svg)](https://python.org)
[![Node.js](https://img.shields.io/badge/Node.js-16+-green.svg)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18+-61DAFB.svg)](https://reactjs.org)

## Live Deployment

- **Frontend (Vercel)**: [https://bus-booking-mocha.vercel.app/](https://bus-booking-mocha.vercel.app/)
- **Backend (Render)**: [https://bus-booking-backend-krhk.onrender.com](https://bus-booking-backend-krhk.onrender.com)

## Table of Contents
- [Project Overview](#project-overview)
- [Team Members](#team-members)
- [Features](#features)
- [Technical Objectives](#technical-objectives)
- [Technologies](#technologies)
- [Installation](#installation)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

## Project Overview
The Bus Booking Web Application is designed to modernize and streamline the public transportation booking system in Kenya. This solution addresses the challenges faced by both travelers and bus operators by providing a centralized platform for bus scheduling, seat booking, and record management.

The application serves three primary user roles:
1. **Administrators** - Oversee system operations and user management
2. **Bus Operators/Drivers** - Manage bus schedules, routes, and pricing
3. **Customers** - Book and manage their travel arrangements

## Team Members

### Backend Team
- **Brian Baraka** - Backend engineer (Flask API development, database design)
- **Fidel Kipkoech** - Backend engineer (Authentication system, API endpoints)
- **Zaybe Maliq** - Backend engineer (Booking logic, payment integration)

### Frontend Team
- **George Mwazuna** - Frontend developer (React components, user interfaces)
- **Esther Irungu** - Frontend developer and Git traffic manager (State management, code reviews, branch management)

## Features

### User Authentication System
- Secure login for all user types (admin, drivers, customers)
- Role-based access control
- Password encryption and session management

### Admin Features
- Dashboard with system analytics
- User management capabilities
- System configuration options

### Driver/Bus Operator Features
- Bus registration (seats, pricing, routes, schedules)
- Real-time schedule management
- Pricing configuration per route
- Bus availability updates
- Booking management for their buses

### Customer Features
- Browse available buses and routes
- Seat selection and booking
- Booking management (create, update, cancel)
- View booking history
- Payment processing

## Technical Objectives

### Development Process
- ✔️ All commits must be descriptive
- ✔️ Code reviews required before merging (2 members + project lead)
- ✔️ Feature branch workflow (branches deleted after merge)
- ✔️ Modular architecture design

### Quality Assurance
- ✔️ Comprehensive test coverage (>85%)
- ✔️ Unit tests for all critical functions
- ✔️ UI tests for core user flows
- ✔️ Continuous integration pipeline

## Technologies

### Frontend
| Technology | Purpose |
|------------|---------|
| ReactJS (v18+) | Frontend framework |
| Redux Toolkit | State management |
| Axios | API communication |
| Material-UI | UI components |
| Jest | Testing framework |
| React Testing Library | UI tests |

### Backend
| Technology | Purpose |
|------------|---------|
| Flask | Python web framework |
| Flask-RESTful | API development |
| Flask-SQLAlchemy | ORM |
| Flask-JWT-Extended | Authentication |
| PostgreSQL | Database |
| Pytest | Unit testing |

### Other Tools
- Figma (wireframing and design)
- Git/GitHub (version control)
- Postman (API testing)
- Docker (containerization)

## Installation

### Prerequisites
- Node.js (v16+)
- Python (v3.9+)
- PostgreSQL (v12+)
- npm (v8+)
- pip (v21+)

### Backend Setup
```bash
# Clone the repository
git clone https://github.com/your-repo/bus-booking-app.git

# Navigate to backend directory
cd server

# Create and activate virtual environment
pipenv install pipenv shell

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
export FLASK_APP=server.app
# Edit config with your configuration

# Run migrations
flask db upgrade

# Start the server
flask run
```

### Frontend Setup
```bash
# Navigate to frontend directory
cd bus-booking frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```