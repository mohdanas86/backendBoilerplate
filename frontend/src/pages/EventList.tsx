import { useState, useEffect, useCallback, useMemo } from 'react';
import { Plus, Calendar, AlertCircle } from 'lucide-react';
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
    const [searchLoading, setSearchLoading] = useState(false);
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
        <div className="min-h-screen">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                            Discover Amazing Events
                        </h1>
                        <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
                            Find and join exciting events in your area. From conferences to workshops, discover what's happening around you.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Link
                                to="/create"
                                className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                            >
                                <Plus className="inline w-5 h-5 mr-2" />
                                Create Your Event
                            </Link>
                            <div className="text-blue-200">
                                Join 10,000+ event enthusiasts
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search Section */}
            <div className="max-w-7xl mx-auto px-6 lg:px-8 -mt-8 relative z-10">
                <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-8">
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
            <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
                {/* Loading State */}
                {loading && <Loading type="events" message="Discovering amazing events..." />}

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
                            <div className="text-center py-20">
                                <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Calendar className="w-12 h-12 text-blue-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                    No events found
                                </h3>
                                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                                    {filters.location
                                        ? `No events found matching your search criteria. Try adjusting your filters or create the first event in this area!`
                                        : 'No events available at the moment. Be the first to create one and start building your community!'
                                    }
                                </p>
                                {!filters.location && (
                                    <Link
                                        to="/create"
                                        className="inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200"
                                    >
                                        <Plus className="w-5 h-5 mr-2" />
                                        Create the First Event
                                    </Link>
                                )}
                            </div>
                        ) : (
                            <>
                                {/* Results Summary */}
                                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 mb-8">
                                    <div className="flex flex-wrap items-center gap-4 text-sm">
                                        <div className="flex items-center bg-white px-4 py-2 rounded-lg shadow-sm">
                                            <span className="font-semibold text-gray-900">
                                                {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''} found
                                            </span>
                                        </div>
                                        {filters.location && (
                                            <div className="flex items-center bg-white px-4 py-2 rounded-lg shadow-sm">
                                                <span className="text-gray-700">📍 {filters.location}</span>
                                            </div>
                                        )}
                                        {filters.dateRange !== 'all' && (
                                            <div className="flex items-center bg-white px-4 py-2 rounded-lg shadow-sm">
                                                <span className="text-gray-700">📅 {filters.dateRange.replace('-', ' ')}</span>
                                            </div>
                                        )}
                                        {userLocation && filters.maxDistance && (
                                            <div className="flex items-center bg-white px-4 py-2 rounded-lg shadow-sm">
                                                <span className="text-gray-700">📏 Within {filters.maxDistance}km</span>
                                            </div>
                                        )}
                                        {userLocation && (
                                            <div className="flex items-center bg-white px-4 py-2 rounded-lg shadow-sm">
                                                <span className="text-gray-700">🔄 Sorted by {filters.sortBy}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Upcoming Events */}
                                {upcomingEvents.length > 0 && (
                                    <section className="mb-16">
                                        <div className="flex items-center justify-between mb-8">
                                            <h2 className="text-3xl font-bold text-gray-900">
                                                Upcoming Events
                                                <span className="ml-3 text-lg font-normal text-gray-500">
                                                    ({upcomingEvents.length})
                                                </span>
                                            </h2>
                                            <div className="h-1 flex-1 ml-8 bg-gradient-to-r from-blue-200 to-transparent rounded"></div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                                        <div className="flex items-center justify-between mb-8">
                                            <h2 className="text-3xl font-bold text-gray-900">
                                                Past Events
                                                <span className="ml-3 text-lg font-normal text-gray-500">
                                                    ({pastEvents.length})
                                                </span>
                                            </h2>
                                            <div className="h-1 flex-1 ml-8 bg-gradient-to-r from-gray-200 to-transparent rounded"></div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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