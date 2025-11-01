/**
 * Event Routes
 * 
 * Defines all API routes for event operations.
 * 
 * Routes:
 * - POST   /api/events      - Create a new event
 * - GET    /api/events      - Get all events (with optional location filter)
 * - GET    /api/events/:id  - Get a specific event by ID
 * 
 * @module routes/event
 */

import { Router } from 'express';
import { createEvent, getAllEvents, getEventById } from '../controllers/event.controllers.js';

const router = Router();

/**
 * @route   POST /api/events
 * @desc    Create a new event
 * @access  Public
 */
router.route('/').post(createEvent);

/**
 * @route   GET /api/events
 * @desc    Get all events with optional location filter
 * @query   location - Optional location filter (case-insensitive partial match)
 * @access  Public
 */
router.route('/').get(getAllEvents);

/**
 * @route   GET /api/events/:id
 * @desc    Get event details by ID
 * @param   id - MongoDB ObjectId of the event
 * @access  Public
 */
router.route('/:id').get(getEventById);

export default router;