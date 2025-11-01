/**
 * Global Error Handler Middleware
 * 
 * Catches and processes all errors in the application.
 * Converts non-ApiError errors to ApiError format for consistency.
 * 
 * @module middlewares/errorHandler
 */

import { ApiError } from '../utils/apiError.js';

/**
 * Express error handling middleware
 * 
 * @param {Error} err - The error object
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 */
const errorHandler = (err, req, res, next) => {
    let error = err;

    // If error is not an ApiError, convert it
    if (!(error instanceof ApiError)) {
        const statusCode = error.statusCode || 500;
        const message = error.message || 'Something went wrong';
        error = new ApiError(statusCode, message, error.errors || [], error.stack);
    }

    const response = {
        statusCode: error.statusCode,
        message: error.message,
        success: false,
        data: null,
    };

    // Include stack trace in development
    if (process.env.NODE_ENV === 'development') {
        response.stack = error.stack;
    }

    console.error('Error:', error);

    res.status(error.statusCode).json(response);
};

export { errorHandler };