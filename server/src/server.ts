import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app: Express = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3001',
    credentials: true
}));

// Route files
import authRoutes from './routes/auth';
import profileRoutes from './routes/profile';
import fitnessRoutes from './routes/fitness';
import vitalSignsRoutes from './routes/vitalSigns';
import healthcareRoutes from './routes/healthcare';
import resourcesRoutes from './routes/resources';

// Mount routers
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/profile', profileRoutes);
app.use('/api/v1', fitnessRoutes);
app.use('/api/v1', vitalSignsRoutes);
app.use('/api/v1', healthcareRoutes);
app.use('/api/v1', resourcesRoutes);

// Health check endpoint
app.get('/api/v1/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok', message: 'HeartBeat API is running' });
});

// Error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});

export default app;

