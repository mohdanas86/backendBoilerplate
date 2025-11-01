import type { Event, UserLocation, SearchFilters } from '../types/event';

// Calculate distance between two coordinates using Haversine formula
export const calculateDistance = (
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLng = (lng2 - lng1) * (Math.PI / 180);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return Math.round(distance * 10) / 10; // Round to 1 decimal place
};

// Get user's current location
export const getUserLocation = (): Promise<UserLocation> => {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('Geolocation is not supported by this browser. Please update your browser or try a different one.'));
            return;
        }

        // Check if we're on HTTPS (required for geolocation in most browsers)
        if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
            reject(new Error('Location services require HTTPS. Please access this site via HTTPS or try searching by city name instead.'));
            return;
        }

        const options = {
            enableHighAccuracy: true,
            timeout: 15000, // Increased timeout
            maximumAge: 300000, // 5 minutes cache
        };

        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    accuracy: position.coords.accuracy,
                    timestamp: Date.now(),
                });
            },
            (error) => {
                let message = 'Unable to get your location';
                let suggestion = '';

                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        message = 'Location access denied';
                        suggestion = 'Please allow location access in your browser settings and try again. Look for the location icon in your browser\'s address bar.';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        message = 'Location information unavailable';
                        suggestion = 'Your device may not have location services enabled, or you may be in an area without GPS/WiFi positioning. Try searching by city name instead, or check if location services are enabled on your device.';
                        break;
                    case error.TIMEOUT:
                        message = 'Location request timed out';
                        suggestion = 'The location request took too long. Please check your internet connection and try again. You can also try searching by city name instead.';
                        break;
                }

                const errorWithSuggestion = new Error(message);
                (errorWithSuggestion as any).suggestion = suggestion;
                reject(errorWithSuggestion);
            },
            options
        );
    });
};

// Geocode location string to coordinates (mock implementation)
// In a real app, you'd use Google Maps API, OpenStreetMap, etc.
export const geocodeLocation = async (location: string): Promise<{ lat: number; lng: number } | null> => {
    // This is a mock implementation with some common cities
    // In production, use a real geocoding service
    const mockLocations: Record<string, { lat: number; lng: number }> = {
        'new york': { lat: 40.7128, lng: -74.0060 },
        'nyc': { lat: 40.7128, lng: -74.0060 },
        'london': { lat: 51.5074, lng: -0.1278 },
        'paris': { lat: 48.8566, lng: 2.3522 },
        'tokyo': { lat: 35.6762, lng: 139.6503 },
        'san francisco': { lat: 37.7749, lng: -122.4194 },
        'los angeles': { lat: 34.0522, lng: -118.2437 },
        'chicago': { lat: 41.8781, lng: -87.6298 },
        'boston': { lat: 42.3601, lng: -71.0589 },
        'seattle': { lat: 47.6062, lng: -122.3321 },
        'delhi': { lat: 28.7041, lng: 77.1025 },
        'mumbai': { lat: 19.0760, lng: 72.8777 },
        'bangalore': { lat: 12.9716, lng: 77.5946 },
        'hyderabad': { lat: 17.3850, lng: 78.4867 },
        'chennai': { lat: 13.0827, lng: 80.2707 },
        'pune': { lat: 18.5204, lng: 73.8567 },
    };

    const key = location.toLowerCase().trim();
    return mockLocations[key] || null;
};

// Filter and sort events based on search criteria
export const filterAndSortEvents = (
    events: Event[],
    filters: SearchFilters,
    userLocation?: UserLocation
): Event[] => {
    let filteredEvents = [...events];

    // Filter by date range
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisWeekStart = new Date(today);
    thisWeekStart.setDate(today.getDate() - today.getDay());
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    switch (filters.dateRange) {
        case 'upcoming':
            filteredEvents = filteredEvents.filter(event => new Date(event.date) >= now);
            break;
        case 'today':
            filteredEvents = filteredEvents.filter(event => {
                const eventDate = new Date(event.date);
                return eventDate >= today && eventDate < new Date(today.getTime() + 24 * 60 * 60 * 1000);
            });
            break;
        case 'this-week':
            filteredEvents = filteredEvents.filter(event => {
                const eventDate = new Date(event.date);
                return eventDate >= thisWeekStart && eventDate < new Date(thisWeekStart.getTime() + 7 * 24 * 60 * 60 * 1000);
            });
            break;
        case 'this-month':
            filteredEvents = filteredEvents.filter(event => {
                const eventDate = new Date(event.date);
                return eventDate >= thisMonthStart && eventDate.getMonth() === now.getMonth();
            });
            break;
    }

    // Filter by distance if user location and max distance are provided
    if (userLocation && filters.maxDistance && filters.maxDistance > 0) {
        filteredEvents = filteredEvents.filter(event => {
            if (!event.coordinates) return true; // Include events without coordinates
            const distance = calculateDistance(
                userLocation.lat,
                userLocation.lng,
                event.coordinates.lat,
                event.coordinates.lng
            );
            return distance <= filters.maxDistance!;
        });
    }

    // Sort events
    filteredEvents.sort((a, b) => {
        let comparison = 0;

        switch (filters.sortBy) {
            case 'date':
                comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
                break;
            case 'distance':
                if (a.distance !== undefined && b.distance !== undefined) {
                    comparison = a.distance - b.distance;
                } else if (a.distance !== undefined) {
                    comparison = -1;
                } else if (b.distance !== undefined) {
                    comparison = 1;
                }
                break;
            case 'participants':
                comparison = a.currentParticipants - b.currentParticipants;
                break;
            case 'created':
                comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
                break;
        }

        return filters.sortOrder === 'desc' ? -comparison : comparison;
    });

    return filteredEvents;
};

// Calculate distances for all events from user location
export const calculateEventDistances = (
    events: Event[],
    userLocation: UserLocation
): Event[] => {
    return events.map(event => {
        if (event.coordinates) {
            const distance = calculateDistance(
                userLocation.lat,
                userLocation.lng,
                event.coordinates.lat,
                event.coordinates.lng
            );
            return { ...event, distance };
        }
        return event;
    });
};

// Format distance for display
export const formatDistance = (distance: number): string => {
    if (distance < 1) {
        return `${Math.round(distance * 1000)}m`;
    } else if (distance < 10) {
        return `${distance.toFixed(1)}km`;
    } else {
        return `${Math.round(distance)}km`;
    }
};

// Debounce function for search input
export const debounce = <T extends (...args: any[]) => any>(
    func: T,
    wait: number
): ((...args: Parameters<T>) => void) => {
    let timeout: ReturnType<typeof setTimeout>;
    return (...args: Parameters<T>) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
};