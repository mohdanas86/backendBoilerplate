import { Router } from 'express';
import { createEvent, getAllEvents, getEventById } from '../controllers/event.controllers.js';

const router = Router();

// POST /api/events - Create an event
router.route('/').post(createEvent);

// GET /api/events - List all events (with optional location filter)
router.route('/').get(getAllEvents);

// GET /api/events/:id - Get event details
router.route('/:id').get(getEventById);

export default router;