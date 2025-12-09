# Easy Campus Life

A comprehensive campus management platform designed to facilitate student life with event management, mentoring programs, classroom tracking, and social features.

## Features

- **User Authentication**: Secure JWT-based authentication system with role-based access control
- **Event Management**: Create, manage, and participate in campus events
- **Mentoring System**: Connect students with mentors for academic support
- **Classroom Management**: Track classroom availability and capacity
- **Presence Tracking**: Monitor attendance for events and classes
- **Social Features**: Interactive social feed and community engagement
- **Admin Dashboard**: Modern administrative interface for managing users, events, and mentors
- **Real-time Chat**: AI-powered chatbot for student assistance
- **Responsive Design**: Mobile-friendly interface built with Tailwind CSS

## Tech Stack

### Backend
- **FastAPI** - Modern, fast web framework for building APIs
- **SQLAlchemy** - SQL toolkit and ORM
- **PostgreSQL** - Relational database
- **Alembic** - Database migration tool
- **Pydantic** - Data validation
- **python-jose** - JWT token handling
- **Passlib & bcrypt** - Password hashing

### Frontend
- **React 19** - UI library
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **React Markdown** - Markdown rendering

## Prerequisites

- **Python 3.8+**
- **Node.js 16+** and npm
- **PostgreSQL 12+**

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/easy-campus-life.git
cd easy-campus-life
```

### 2. Backend Setup

```bash
cd backend

# Create a virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create a .env file with your configuration
# DATABASE_URL=postgresql://user:password@localhost/campus_life
# SECRET_KEY=your-secret-key-here
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install
```

### 4. Database Setup

```bash
# Create PostgreSQL database
createdb campus_life

# Run migrations
cd backend
alembic upgrade head
```

## Running the Application

### Start the Backend Server

```bash
cd backend
python main.py
```

The API will be available at `http://localhost:8000`

API Documentation: `http://localhost:8000/docs`

### Start the Frontend Development Server

```bash
cd frontend
npm start
```

The application will open at `http://localhost:3000`

## Project Structure

```
easy-campus-life/
├── backend/
│   ├── alembic/              # Database migrations
│   ├── app/
│   │   ├── models/           # SQLAlchemy models
│   │   ├── routes/           # API endpoints
│   │   ├── utils/            # Helper functions
│   │   ├── database.py       # Database configuration
│   │   └── schemas.py        # Pydantic schemas
│   ├── main.py               # FastAPI application entry point
│   └── requirements.txt      # Python dependencies
│
└── frontend/
    ├── public/               # Static files
    ├── src/
    │   ├── admin/            # Admin dashboard components
    │   ├── components/       # Reusable UI components
    │   ├── contexts/         # React contexts
    │   ├── features/         # Feature-specific components
    │   │   ├── auth/         # Authentication pages
    │   │   ├── chat/         # Chat functionality
    │   │   ├── home/         # Home page
    │   │   ├── mentoring/    # Mentoring features
    │   │   ├── social/       # Social feed & events
    │   │   └── user/         # User profile
    │   ├── layouts/          # Layout components
    │   └── index.js          # Application entry point
    └── package.json          # Node dependencies
```

## API Endpoints

### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login user
- `GET /auth/me` - Get current user

### Users
- `GET /users` - List all users
- `GET /users/{id}` - Get user by ID
- `PUT /users/{id}` - Update user
- `DELETE /users/{id}` - Delete user

### Events
- `GET /events` - List all events
- `POST /events` - Create new event
- `GET /events/{id}` - Get event details
- `PUT /events/{id}` - Update event
- `DELETE /events/{id}` - Delete event

### Mentoring
- `GET /mentoring` - List mentoring sessions
- `POST /mentoring` - Create mentoring session
- `GET /mentoring/{id}` - Get session details
- `PUT /mentoring/{id}` - Update session
- `DELETE /mentoring/{id}` - Delete session

### Classrooms
- `GET /classrooms` - List all classrooms
- `POST /classrooms` - Create classroom
- `GET /classrooms/{id}` - Get classroom details

### Presences
- `GET /presences` - List attendance records
- `POST /presences` - Record attendance

## Test Credentials for Recruiters

Use these test credentials to explore the platform on the deployed version:

### Student Account
- **Email**: `demo@campus.fr`
- **Password**: `student123`
- **Access**: Student dashboard, events, mentoring, chat, and social features

### Admin Account
- **Email**: `admin@campus.fr`
- **Password**: `admin2024`
- **Access**: Full administrative dashboard with user management, event creation, mentor management, and analytics

**Note**: For local development, you can initialize the database with additional test data by sending a POST request to `/initialize-db`

<details>
<summary><strong>📋 Usage Guidelines & Best Practices</strong></summary>

### General Rules

1. **Authentication Required**
   - All routes except `/login` require authentication
   - JWT tokens expire after 24 hours
   - Store your token securely in localStorage or sessionStorage

2. **Role-Based Access Control**
   - **Students**: Can view events, participate, access mentoring, and use chat features
   - **Admins**: Have full access to the admin dashboard and can manage all platform resources
   - Attempting to access admin routes without proper credentials will redirect to login

3. **API Usage**
   - Base URL: `http://localhost:8000`
   - All API requests require the `Authorization: Bearer <token>` header
   - Response format: JSON
   - Error responses include descriptive messages

4. **Data Management**
   - Create operations require all mandatory fields
   - Update operations allow partial updates
   - Delete operations are permanent and cannot be undone
   - Some delete operations may fail if data is referenced elsewhere (foreign key constraints)

5. **Event Participation**
   - Students can register for upcoming events
   - Registration is tracked via the `event_participations` endpoint
   - Events have capacity limits (if configured)

6. **Mentoring System**
   - Mentors can be assigned to students
   - Sessions can be scheduled with date, time, and subject
   - Track mentoring progress through the admin dashboard

7. **Classroom & Presence Tracking**
   - Classrooms have defined capacity limits
   - Presence tracking helps monitor occupancy in real-time
   - Useful for managing campus resources efficiently

8. **Best Practices for Development**
   - Always validate input data before sending to API
   - Handle errors gracefully with user-friendly messages
   - Use loading states for async operations
   - Implement proper logout functionality to clear tokens

9. **Security Considerations**
   - Never commit `.env` files with real credentials
   - Use strong passwords in production
   - CORS is currently set to allow all origins (change in production)
   - Always use HTTPS in production environments

10. **Testing & Demo Data**
    - Use the `/initialize-db` endpoint to populate demo data
    - This is useful for testing and demonstrations
    - **Warning**: This endpoint should be removed or secured in production

</details>

## Development

### Running Tests

```bash
# Frontend tests
cd frontend
npm test

# Backend tests (if configured)
cd backend
pytest
```

### Code Style

- Backend follows PEP 8 guidelines
- Frontend uses ESLint with react-app configuration

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support, please open an issue in the GitHub repository.
