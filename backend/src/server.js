const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

// Database connection
const { connectDB, checkHealth } = require('./config/database');

// Routes
const authRoutes = require('./routes/authRoutes');
const jobRoutes = require('./routes/jobRoutes');
const userRoutes = require('./routes/userRoutes');

// Error handling
const { errorHandler, notFound } = require('./utils/errorHandler');

const app = express();

// Connect to MongoDB Atlas
connectDB();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"]
    }
  },
  crossOriginEmbedderPolicy: false
}));

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Health check endpoint
app.get('/health', async (req, res) => {
  const health = await checkHealth();
  res.status(health.status === 'healthy' ? 200 : 503).json(health);
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/users', userRoutes);

// Welcome route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Job Portal API',
    version: '1.0.0',
    documentation: '/api-docs',
    health: '/health'
  });
});

// 404 handler
app.use('*', notFound);

// Global error handler
app.use(errorHandler);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  // Close server & exit process
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode`);
  console.log(`🌐 Listening on port ${PORT}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
});

// Handle graceful shutdown
const gracefulShutdown = () => {
  console.log('Received shutdown signal, closing server...');
  
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });

  // Force close after 10 seconds
  setTimeout(() => {
    console.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

module.exports = app;