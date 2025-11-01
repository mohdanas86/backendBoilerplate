import type { Event, CreateEventData, ApiResponse } from '../types/event';

const API_BASE_URL = 'http://localhost:8080/api/events';

class ApiError extends Error {
    public status: number;

    constructor(status: number, message: string) {
        super(message);
        this.status = status;
        this.name = 'ApiError';
    }
}

// Helper function to handle API responses
const handleResponse = async <T>(response: Response): Promise<ApiResponse<T>> => {
    const contentType = response.headers.get('content-type');

    // Check if response is HTML (error page) instead of JSON
    if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Received non-JSON response:', text);
        throw new ApiError(response.status, 'Server returned invalid response. Make sure the backend is running.');
    }

    try {
        const data = await response.json();

        if (!response.ok) {
            throw new ApiError(response.status, data.message || 'Something went wrong');
        }

        return data;
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        console.error('JSON parsing error:', error);
        throw new ApiError(500, 'Failed to parse server response');
    }
};

// Get all events with optional location filter
export const getAllEvents = async (location?: string): Promise<Event[]> => {
    try {
        const url = new URL(API_BASE_URL);
        if (location && location.trim()) {
            url.searchParams.append('location', location.trim());
        }

        const response = await fetch(url.toString(), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const result = await handleResponse<Event[]>(response);
        return result.data;
    } catch (error) {
        console.error('Error fetching events:', error);
        if (error instanceof TypeError && error.message.includes('fetch')) {
            throw new ApiError(0, 'Unable to connect to server. Please check if the backend is running.');
        }
        throw error;
    }
};

// Get single event by ID
export const getEventById = async (id: string): Promise<Event> => {
    try {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const result = await handleResponse<Event>(response);
        return result.data;
    } catch (error) {
        console.error('Error fetching event:', error);
        if (error instanceof TypeError && error.message.includes('fetch')) {
            throw new ApiError(0, 'Unable to connect to server. Please check if the backend is running.');
        }
        throw error;
    }
};

// Create new event
export const createEvent = async (eventData: CreateEventData): Promise<Event> => {
    try {
        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(eventData),
        });

        const result = await handleResponse<Event>(response);
        return result.data;
    } catch (error) {
        console.error('Error creating event:', error);
        throw error;
    }
};

export { ApiError };