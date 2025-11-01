export interface Event {
    _id: string;
    title: string;
    description: string;
    location: string;
    date: string;
    maxParticipants: number;
    currentParticipants: number;
    createdAt: string;
    updatedAt: string;
    // Optional fields for distance calculation
    coordinates?: {
        lat: number;
        lng: number;
    };
    distance?: number; // in kilometers
}

export interface CreateEventData {
    title: string;
    description: string;
    location: string;
    date: string;
    maxParticipants: number;
    currentParticipants?: number;
}

export interface ApiResponse<T> {
    statusCode: number;
    data: T;
    message: string;
    success: boolean;
}

export interface SearchFilters {
    location: string;
    dateRange: 'all' | 'upcoming' | 'today' | 'this-week' | 'this-month';
    maxDistance?: number; // in kilometers
    sortBy: 'date' | 'distance' | 'participants' | 'created';
    sortOrder: 'asc' | 'desc';
}

export interface UserLocation {
    lat: number;
    lng: number;
    accuracy?: number;
    timestamp: number;
}