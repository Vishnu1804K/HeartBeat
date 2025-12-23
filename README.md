# 💚 HeartBeat - Health & Wellness Tracker

A full-stack MERN application built with TypeScript for tracking your health and wellness journey.

## Features

### User Authentication
- ✅ User Registration & Login
- ✅ Forgot Password with Email Reset
- ✅ JWT-based Authentication
- ✅ Secure Password Hashing

### Health Tracking
- 📊 **Dashboard** - Overview of your health journey
- 👤 **Profile Management** - Personal information & BMI calculator
- 🎯 **Fitness Goals** - Set and track fitness goals
- 🏃 **Activity Logging** - Track workouts and exercises
- ❤️ **Vital Signs** - Monitor blood pressure, heart rate, etc.
- 💡 **Health Recommendations** - Personalized health tips

### Healthcare Management (User Story 5)
- 👨‍⚕️ **Healthcare Providers** - Manage doctors, hospitals, insurance
- 📅 **Appointments** - Schedule and track medical appointments

### Educational Resources (User Story 6)
- 📚 **Resource Library** - Articles, videos, and podcasts
- 🔍 **Search & Filter** - Find content by type or category
- 🔖 **Save to Library** - Bookmark favorite resources

## Tech Stack

### Backend
- Node.js with Express.js
- TypeScript
- MongoDB with Mongoose
- JWT Authentication
- Nodemailer for emails

### Frontend
- React 18
- TypeScript
- React Router v6
- Axios for API calls
- React Toastify for notifications
- React Icons

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Vishnu1804K/HeartBeat.git
cd HeartBeat
```

2. **Setup Backend**
```bash
cd server
cp .env.example .env
# Edit .env with your configuration
npm install
npm run dev
```

3. **Setup Frontend**
```bash
cd client
npm install
npm start
```

### Environment Variables

Create a `.env` file in the `server` directory:

```env
MONGODB_URI=mongodb://localhost:27017/heartbeat
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d
PORT=3000
NODE_ENV=development
CLIENT_URL=http://localhost:3001
```

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/register` | Register new user |
| POST | `/api/v1/auth/login` | Login user |
| POST | `/api/v1/auth/forgot-password` | Request password reset |
| POST | `/api/v1/auth/reset-password/:token` | Reset password |

### Profile
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/profile` | Get user profile |
| PUT | `/api/v1/profile` | Update profile |

### Fitness
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/fitness-goals` | Get fitness goals |
| POST | `/api/v1/fitness-goals` | Add fitness goals |
| PUT | `/api/v1/fitness-goals` | Update goals |
| DELETE | `/api/v1/fitness-goals` | Delete goals |
| GET | `/api/v1/activities` | Get activities |
| POST | `/api/v1/activities` | Log activity |

### Vital Signs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/vital-signs` | Get vital signs |
| POST | `/api/v1/vital-signs` | Add vital sign |
| DELETE | `/api/v1/vital-signs/:id` | Delete vital sign |
| GET | `/api/v1/recommendations` | Get health recommendations |

### Healthcare
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/healthcare-providers` | Get providers |
| POST | `/api/v1/healthcare-providers` | Add provider |
| PUT | `/api/v1/healthcare-providers/:id` | Update provider |
| DELETE | `/api/v1/healthcare-providers/:id` | Delete provider |
| GET | `/api/v1/appointments` | Get appointments |
| POST | `/api/v1/appointments` | Schedule appointment |
| PUT | `/api/v1/appointments/:id` | Update appointment |
| DELETE | `/api/v1/appointments/:id` | Delete appointment |

### Educational Resources
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/resources` | Get all resources |
| GET | `/api/v1/resources/categories` | Get categories |
| GET | `/api/v1/resources/:id` | Get single resource |
| GET | `/api/v1/resources/user/saved` | Get saved resources |
| POST | `/api/v1/resources/:id/save` | Save resource |
| DELETE | `/api/v1/resources/:id/save` | Unsave resource |

## Project Structure

```
healthpulse/
├── server/                 # Backend
│   ├── src/
│   │   ├── config/         # Database config
│   │   ├── controllers/    # Route handlers
│   │   ├── middleware/     # Auth middleware
│   │   ├── models/         # Mongoose models
│   │   ├── routes/         # Express routes
│   │   ├── types/          # TypeScript types
│   │   ├── utils/          # Utilities
│   │   └── server.ts       # Entry point
│   ├── package.json
│   └── tsconfig.json
│
├── client/                 # Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── context/        # Auth context
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── types/          # TypeScript types
│   │   ├── App.tsx
│   │   └── index.tsx
│   ├── package.json
│   └── tsconfig.json
│
└── README.md
```

## License

MIT

## Author

**Vishnu K**
- GitHub: [@Vishnu1804K](https://github.com/Vishnu1804K)
