# Healthpulse 💚

A comprehensive health and wellness tracking application built with the MERN stack (MongoDB, Express.js, React, Node.js).

## Features

### User Management
- User registration and login with JWT authentication
- Forgot password / Reset password functionality
- Profile management with personal health information

### Health Tracking
- **Fitness Goals**: Set, track, and manage your fitness goals with progress tracking
- **Activities**: Log workouts including type, duration, distance, calories burned, and intensity
- **Vital Signs**: Record and monitor vital signs like blood pressure, heart rate, temperature, etc.
- **Dashboard**: Overview of all health metrics with personalized recommendations

### Personalized Recommendations
- BMI calculation and categorization
- Health recommendations based on your data
- Progress insights and alerts

## Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **nodemailer** for email functionality

### Frontend
- **React 18** with React Router v6
- **Axios** for API calls
- **Chart.js** for data visualization
- **React Icons** for UI icons
- **React Toastify** for notifications
- Custom CSS with CSS variables for theming

## Project Structure

```
healthpulse/
├── server/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── fitnessController.js
│   │   ├── profileController.js
│   │   └── vitalSignsController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   └── User.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── fitness.js
│   │   ├── profile.js
│   │   └── vitalSigns.js
│   ├── utils/
│   │   └── sendEmail.js
│   ├── package.json
│   └── server.js
│
├── client/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   └── Layout/
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── pages/
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── Dashboard.js
│   │   │   ├── Profile.js
│   │   │   ├── FitnessGoals.js
│   │   │   ├── Activities.js
│   │   │   └── VitalSigns.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
│
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the server directory:
   ```bash
   cd healthpulse/server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/healthpulse
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRE=7d
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   CLIENT_URL=http://localhost:3001
   ```

4. Start the server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the client directory:
   ```bash
   cd healthpulse/client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open [http://localhost:3001](http://localhost:3001) in your browser

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/register` | Register a new user |
| POST | `/api/v1/auth/login` | Login user |
| POST | `/api/v1/auth/forgot-password` | Request password reset |
| POST | `/api/v1/auth/reset-password/:token` | Reset password |

### Profile
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/profile` | Get user profile |
| PUT | `/api/v1/profile` | Update user profile |

### Fitness Goals
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/fitness-goals` | Get fitness goals |
| POST | `/api/v1/fitness-goals` | Set fitness goals |
| PUT | `/api/v1/fitness-goals` | Update fitness goals |
| DELETE | `/api/v1/fitness-goals` | Delete all fitness goals |

### Activities
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/activities` | Get all activities |
| POST | `/api/v1/activities` | Log new activity |

### Vital Signs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/vital-signs` | Get all vital signs |
| POST | `/api/v1/vital-signs` | Record vital sign |
| DELETE | `/api/v1/vital-signs/:id` | Delete vital sign |

### Recommendations
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/recommendations` | Get health recommendations |

## Screenshots

The application features a modern, dark-themed UI with:
- Responsive design for mobile and desktop
- Gradient accents and smooth animations
- Interactive charts and progress bars
- Clean, intuitive navigation

## License

MIT License

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

