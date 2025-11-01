import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/apiError.js';
import { Event } from '../models/event.model.js';

// Create an event
const createEvent = asyncHandler(async (req, res) => {
    const { title, description, location, date, maxParticipants, currentParticipants } = req.body;

    // Validate required fields
    if (!title || !description || !location || !date || !maxParticipants) {
        throw new ApiError(400, 'All fields (title, description, location, date, maxParticipants) are required');
    }

    // Validate date
    const eventDate = new Date(date);
    if (isNaN(eventDate.getTime())) {
        throw new ApiError(400, 'Invalid date format');
    }

    // Validate maxParticipants
    if (maxParticipants < 1) {
        throw new ApiError(400, 'Maximum participants must be at least 1');
    }

    // Validate currentParticipants if provided
    if (currentParticipants !== undefined && (currentParticipants < 0 || currentParticipants > maxParticipants)) {
        throw new ApiError(400, 'Current participants must be between 0 and maximum participants');
    }

    // Create the event
    const event = await Event.create({
        title,
        description,
        location,
        date: eventDate,
        maxParticipants,
        currentParticipants: currentParticipants || 0,
    });

    return res.status(201).json(new ApiResponse(201, event, 'Event created successfully'));
});

// Get all events with optional location filter
const getAllEvents = asyncHandler(async (req, res) => {
    const { location } = req.query;

    // Build filter object
    const filter = {};
    if (location) {
        filter.location = { $regex: location, $options: 'i' }; // Case-insensitive partial match
    }

    // Get events from database
    const events = await Event.find(filter).sort({ date: 1 }); // Sort by date ascending

    return res.status(200).json(new ApiResponse(200, events, 'Events retrieved successfully'));
});

// Get event details by ID
const getEventById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Validate if ID is a valid MongoDB ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        throw new ApiError(400, 'Invalid event ID format');
    }

    // Find event by ID
    const event = await Event.findById(id);

    if (!event) {
        throw new ApiError(404, 'Event not found');
    }

    return res.status(200).json(new ApiResponse(200, event, 'Event details retrieved successfully'));
});

export { createEvent, getAllEvents, getEventById };