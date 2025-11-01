/**
 * Express Application Configuration
 * 
 * Main application setup with middleware configuration.
 * 
 * Features:
 * - CORS configuration for cross-origin requests
 * - JSON and URL-encoded body parsing
 * - Cookie parsing
 * - Static file serving
 * - API routes mounting
 * - Global error handling
 * 
 * @module app
 */

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

// CORS configuration
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
  })
);

// Body parsing middleware
app.use(express.json({ limit: '16Kb' }));
app.use(express.urlencoded({ extended: true, limit: '16Kb' }));

// Static files and cookies
app.use(express.static('public'));
app.use(cookieParser());

// Import routes
import eventRouter from './routes/event.routes.js';
import { errorHandler } from './middlewares/errorHandler.js';

/**
 * Health check endpoint
 * 
 * @route   GET /api/health
 * @returns {Object} Server status and timestamp
 */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Backend server is running',
    timestamp: new Date().toISOString()
  });
});

// Mount routes
app.use('/api/events', eventRouter);

// Global error handler (must be last)
app.use(errorHandler);

export { app };
