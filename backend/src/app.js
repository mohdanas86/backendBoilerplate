import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
  })
);
app.use(express.json({ limit: '16Kb' }));
app.use(express.urlencoded({ extended: true, limit: '16Kb' }));
app.use(express.static('public'));
app.use(cookieParser());

// import routes here
import eventRouter from './routes/event.routes.js';
import { errorHandler } from './middlewares/errorHandler.js';

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Backend server is running',
    timestamp: new Date().toISOString()
  });
});

// Use routes
app.use('/api/events', eventRouter);

// Global error handler (must be last)
app.use(errorHandler);

export { app };
