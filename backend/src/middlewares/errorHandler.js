import { ApiError } from '../utils/apiError.js';

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