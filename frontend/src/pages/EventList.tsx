import { useState, useEffect, useCallback, useMemo } from 'react';
import { Plus, Calendar, MapPin, Navigation } from 'lucide-react';
import { Link } from 'react-router-dom';
import EventCard from '../components/EventCard';
import SearchBar from '../components/SearchBar';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import { getAllEvents } from '../services/eventApi';
import {
    getUserLocation,
    geocodeLocation,
    calculateEventDistances,
    filterAndSortEvents
} from '../utils/locationUtils';
import type { Event, SearchFilters, UserLocation } from '../types/event';

const EventList = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [locationLoading, setLocationLoading] = useState(false);
    const [error, setError] = useState<string>('');
    const [locationError, setLocationError] = useState<string>('');
    const [locationSuggestion, setLocationSuggestion] = useState<string>('');
    const [userLocation, setUserLocation] = useState<UserLocation | null>(null);

    const [filters, setFilters] = useState<SearchFilters>({
        location: '',
        dateRange: 'all',
        sortBy: 'date',
        sortOrder: 'asc'
    });

    // Fetch events from API
    const fetchEvents = useCallback(async () => {
        try {
            setLoading(true);
            setError('');
            const data = await getAllEvents(filters.location || undefined);

            let processedEvents = data;

            // Add coordinates to events (mock implementation)
            processedEvents = await Promise.all(
                data.map(async (event) => {
                    const coords = await geocodeLocation(event.location);
                    return coords ? { ...event, coordinates: coords } : event;
                })
            );

            // Calculate distances if user location is available
            if (userLocation) {
                processedEvents = calculateEventDistances(processedEvents, userLocation);
            }

            setEvents(processedEvents);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch events');
        } finally {
            setLoading(false);
        }
    }, [filters.location, userLocation]);

    // Get user location
    const handleLocationRequest = useCallback(async () => {
        try {
            setLocationLoading(true);
            setLocationError('');
            setLocationSuggestion('');
            const location = await getUserLocation();
            setUserLocation(location);
        } catch (err) {
            const error = err as any;
            setLocationError(error.message || 'Failed to get location');
            setLocationSuggestion(error.suggestion || '');
        } finally {
            setLocationLoading(false);
        }
    }, []);

    // Filter and sort events based on current filters
    const filteredEvents = useMemo(() => {
        return filterAndSortEvents(events, filters, userLocation || undefined);
    }, [events, filters, userLocation]);

    // Separate upcoming and past events
    const { upcomingEvents, pastEvents } = useMemo(() => {
        const now = new Date();
        const upcoming = filteredEvents.filter(event => new Date(event.date) > now);
        const past = filteredEvents.filter(event => new Date(event.date) <= now);
        return { upcomingEvents: upcoming, pastEvents: past };
    }, [filteredEvents]);

    // Load events on component mount and when dependencies change
    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="bg-blue-600 text-white">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 md:py-16">
                    <div className="text-center">
                        <h1 className="text-3xl md:text-5xl font-bold mb-4">
                            Discover Amazing Events
                        </h1>
                        <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                            Find and join exciting events in your area. From conferences to workshops, discover what's happening around you.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Link
                                to="/create"
                                className="inline-flex items-center bg-white text-blue-600 px-6 py-3 font-medium hover:bg-blue-50 transition-colors"
                            >
                                <Plus className="w-5 h-5 mr-2" />
                                Create Event
                            </Link>
                            <span className="text-blue-100 text-sm">
                                Join 10,000+ event enthusiasts
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search Section */}
            <div className="max-w-7xl mx-auto px-6 lg:px-8 -mt-6 relative z-10">
                <div className="bg-white border border-gray-200 p-6">
                    <SearchBar
                        filters={filters}
                        onFiltersChange={setFilters}
                        onLocationRequest={handleLocationRequest}
                        userLocation={userLocation}
                        locationLoading={locationLoading}
                        locationError={locationError}
                        locationSuggestion={locationSuggestion}
                    />
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
                {/* Loading State */}
                {loading && <Loading type="events" message="Loading events..." />}

                {/* Error State */}
                {error && (
                    <ErrorMessage
                        message={error}
                        onRetry={fetchEvents}
                    />
                )}

                {/* Events Content */}
                {!loading && !error && (
                    <>
                        {filteredEvents.length === 0 ? (
                            <div className="text-center py-16 bg-white border border-gray-200 p-8">
                                <div className="w-16 h-16 bg-gray-100 flex items-center justify-center mx-auto mb-4">
                                    <Calendar className="w-8 h-8 text-gray-400" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    No events found
                                </h3>
                                <p className="text-gray-600 mb-6 max-w-md mx-auto text-sm">
                                    {filters.location
                                        ? `No events found matching your search criteria. Try adjusting your filters.`
                                        : 'No events available at the moment. Be the first to create one!'
                                    }
                                </p>
                                {!filters.location && (
                                    <Link
                                        to="/create"
                                        className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 font-medium transition-colors"
                                    >
                                        <Plus className="w-5 h-5 mr-2" />
                                        Create Event
                                    </Link>
                                )}
                            </div>
                        ) : (
                            <>
                                {/* Results Summary */}
                                <div className="bg-blue-50 border border-blue-200 p-4 mb-6">
                                    <div className="flex flex-wrap items-center gap-2 text-xs">
                                        <div className="inline-flex items-center bg-white border border-gray-200 px-3 py-1.5">
                                            <span className="font-medium text-gray-900">
                                                {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''}
                                            </span>
                                        </div>
                                        {filters.location && (
                                            <div className="inline-flex items-center gap-1.5 bg-white border border-gray-200 px-3 py-1.5">
                                                <MapPin size={14} className="text-gray-500" />
                                                <span className="text-gray-700">{filters.location}</span>
                                            </div>
                                        )}
                                        {filters.dateRange !== 'all' && (
                                            <div className="inline-flex items-center gap-1.5 bg-white border border-gray-200 px-3 py-1.5">
                                                <Calendar size={14} className="text-gray-500" />
                                                <span className="text-gray-700">{filters.dateRange.replace('-', ' ')}</span>
                                            </div>
                                        )}
                                        {userLocation && filters.maxDistance && (
                                            <div className="inline-flex items-center gap-1.5 bg-white border border-gray-200 px-3 py-1.5">
                                                <Navigation size={14} className="text-gray-500" />
                                                <span className="text-gray-700">Within {filters.maxDistance}km</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Upcoming Events */}
                                {upcomingEvents.length > 0 && (
                                    <section className="mb-12">
                                        <div className="flex items-center gap-4 mb-6">
                                            <h2 className="text-2xl font-semibold text-gray-900">
                                                Upcoming Events
                                            </h2>
                                            <span className="text-sm text-gray-500">
                                                ({upcomingEvents.length})
                                            </span>
                                            <div className="h-px flex-1 bg-gray-200"></div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {upcomingEvents.map((event) => (
                                                <EventCard
                                                    key={event._id}
                                                    event={event}
                                                    showDistance={!!userLocation}
                                                />
                                            ))}
                                        </div>
                                    </section>
                                )}

                                {/* Past Events */}
                                {pastEvents.length > 0 && (
                                    <section>
                                        <div className="flex items-center gap-4 mb-6">
                                            <h2 className="text-2xl font-semibold text-gray-900">
                                                Past Events
                                            </h2>
                                            <span className="text-sm text-gray-500">
                                                ({pastEvents.length})
                                            </span>
                                            <div className="h-px flex-1 bg-gray-200"></div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {pastEvents.map((event) => (
                                                <EventCard
                                                    key={event._id}
                                                    event={event}
                                                    showDistance={!!userLocation}
                                                />
                                            ))}
                                        </div>
                                    </section>
                                )}
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}; export default EventList;