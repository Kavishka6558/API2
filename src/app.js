import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import sequelize, { connectDB } from './config/db.js';
import './models/index.js'; // To set associations
import busRoutes from './routes/buses.js';
import routeRoutes from './routes/routes.js';
import tripRoutes from './routes/trips.js';
import trackingRoutes from './routes/tracking.js';
import seedRoutes from './routes/seed.js';
import authRoutes from './routes/auth.js';

const app = express();

// Connect to Database (non-blocking)
connectDB().catch(err => {
  console.error('Initial database connection failed:', err.message);
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/buses', busRoutes);
app.use('/api/routes', routeRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/tracking', trackingRoutes);
app.use('/api/seed', seedRoutes);

// Health check endpoints
app.get('/health', async (req, res) => {
  const health = {
    status: 'OK',
    message: 'API is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  };

  // Check database connection
  try {
    await sequelize.authenticate();
    health.database = 'connected';
  } catch (error) {
    health.database = 'disconnected';
    health.database_error = error.message;
  }

  res.status(200).json(health);
});

app.get('/api/health', async (req, res) => {
  const health = {
    status: 'OK',
    message: 'API is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  };

  // Check database connection
  try {
    await sequelize.authenticate();
    health.database = 'connected';
  } catch (error) {
    health.database = 'disconnected';
    health.database_error = error.message;
  }

  res.status(200).json(health);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

export default app;