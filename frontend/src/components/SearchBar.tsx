import { useState, useEffect } from 'react';
import {
    Search,
    MapPin,
    Calendar,
    Filter,
    X,
    Navigation,
    ChevronDown,
    Loader2
} from 'lucide-react';
import type { SearchFilters, UserLocation } from '../types/event';

interface SearchBarProps {
    filters: SearchFilters;
    onFiltersChange: (filters: SearchFilters) => void;
    onLocationRequest: () => void;
    userLocation?: UserLocation | null;
    locationLoading: boolean;
    locationError?: string;
    locationSuggestion?: string;
}

const SearchBar = ({
    filters,
    onFiltersChange,
    onLocationRequest,
    userLocation,
    locationLoading,
    locationError,
    locationSuggestion
}: SearchBarProps) => {
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [localLocation, setLocalLocation] = useState(filters.location);

    // Check if geolocation is supported
    const isGeolocationSupported = 'geolocation' in navigator;
    const isHttps = window.location.protocol === 'https:' || window.location.hostname === 'localhost';

    // Debounced location update
    useEffect(() => {
        const timer = setTimeout(() => {
            if (localLocation !== filters.location) {
                onFiltersChange({ ...filters, location: localLocation });
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [localLocation, filters, onFiltersChange]);

    const handleLocationChange = (value: string) => {
        setLocalLocation(value);
    };

    const clearFilters = () => {
        setLocalLocation('');
        onFiltersChange({
            location: '',
            dateRange: 'all',
            maxDistance: undefined,
            sortBy: 'date',
            sortOrder: 'asc'
        });
    };

    const hasActiveFilters =
        filters.location ||
        filters.dateRange !== 'all' ||
        filters.maxDistance ||
        filters.sortBy !== 'date' ||
        filters.sortOrder !== 'asc';

    return (
        <div className="space-y-6">
            {/* Main Search Controls */}
            <div className="flex flex-col lg:flex-row gap-4">
                {/* Location Search */}
                <div className="flex-1">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Search by Location
                    </label>
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            value={localLocation}
                            onChange={(e) => handleLocationChange(e.target.value)}
                            placeholder="Enter city, venue, or address..."
                            className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-500 bg-white shadow-sm"
                        />
                    </div>
                </div>

                {/* Location Services Button */}
                <div className="lg:w-48">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        &nbsp;
                    </label>
                    <button
                        onClick={onLocationRequest}
                        disabled={locationLoading || !isGeolocationSupported || !isHttps}
                        className={`w-full px-6 py-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-center gap-3 font-medium shadow-sm ${userLocation
                                ? 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100'
                                : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'
                            } ${locationLoading || !isGeolocationSupported || !isHttps ? 'opacity-50 cursor-not-allowed' : ''}`}
                        title={
                            !isGeolocationSupported
                                ? 'Geolocation is not supported by this browser'
                                : !isHttps
                                    ? 'Location requires HTTPS connection'
                                    : userLocation
                                        ? 'Location detected'
                                        : 'Use my location'
                        }
                    >
                        {locationLoading ? (
                            <Loader2 className="animate-spin" size={20} />
                        ) : (
                            <Navigation size={20} />
                        )}
                        <span className="hidden sm:inline">
                            {locationLoading ? 'Getting location...' :
                                !isGeolocationSupported ? 'Not supported' :
                                    !isHttps ? 'Requires HTTPS' :
                                        'Near Me'}
                        </span>
                    </button>
                </div>

                {/* Advanced Filters Toggle */}
                <div className="lg:w-48">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        &nbsp;
                    </label>
                    <button
                        onClick={() => setShowAdvanced(!showAdvanced)}
                        className={`w-full px-6 py-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-center gap-3 font-medium shadow-sm ${showAdvanced || hasActiveFilters
                                ? 'bg-blue-50 border-blue-300 text-blue-700'
                                : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'
                            }`}
                    >
                        <Filter size={20} />
                        <span className="hidden sm:inline">Filters</span>
                        <ChevronDown
                            size={16}
                            className={`transform transition-transform duration-200 ${showAdvanced ? 'rotate-180' : ''}`}
                        />
                    </button>
                </div>
            </div>

            {/* Location Error */}
            {locationError && (
                <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-6">
                    <div className="flex items-start gap-4">
                        <div className="flex items-center justify-center w-10 h-10 bg-amber-100 rounded-lg flex-shrink-0">
                            <Navigation size={20} className="text-amber-600" />
                        </div>
                        <div className="flex-1">
                            <h4 className="text-amber-800 font-semibold text-lg mb-2">
                                Location Access Issue
                            </h4>
                            <p className="text-amber-700 mb-3">{locationError}</p>
                            {locationSuggestion && (
                                <div className="bg-amber-100 rounded-lg p-4 mb-4">
                                    <p className="text-amber-800 text-sm">{locationSuggestion}</p>
                                </div>
                            )}
                            <div className="bg-amber-100 rounded-lg p-4">
                                <h5 className="text-amber-800 font-medium mb-2">💡 What you can try:</h5>
                                <ul className="text-amber-700 text-sm space-y-1">
                                    <li>• Enable location services on your device</li>
                                    <li>• Allow location access in your browser settings</li>
                                    <li>• Try using a different browser (Chrome, Firefox, etc.)</li>
                                    <li>• Search for events by typing a city name instead</li>
                                    <li>• Make sure you're connected to the internet</li>
                                </ul>
                            </div>
                            <div className="mt-4 flex gap-3">
                                <button
                                    onClick={onLocationRequest}
                                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-all duration-200 font-medium"
                                >
                                    Try Again
                                </button>
                                <button
                                    onClick={() => setLocalLocation('')}
                                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all duration-200 font-medium"
                                >
                                    Search by City
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Geolocation Not Supported Warning */}
            {(!isGeolocationSupported || !isHttps) && !locationError && (
                <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-lg">
                            <Navigation size={16} className="text-blue-600" />
                        </div>
                        <div className="flex-1">
                            <span className="text-blue-700 font-medium">
                                {!isGeolocationSupported
                                    ? 'Location services not supported by this browser'
                                    : 'Location requires HTTPS connection'
                                }
                            </span>
                            <p className="text-blue-600 text-sm mt-1">
                                You can still search for events by typing a city name above.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* User Location Info */}
            {userLocation && (
                <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-lg">
                            <MapPin size={16} className="text-green-600" />
                        </div>
                        <div className="flex-1">
                            <span className="text-green-700 font-medium">Location detected</span>
                            <p className="text-green-600 text-sm mt-1">
                                Showing events with distance • ±{Math.round(userLocation.accuracy || 0)}m accuracy
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Advanced Filters */}
            {showAdvanced && (
                <div className="border-2 border-gray-200 rounded-xl p-6 bg-gray-50/50 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Date Range Filter */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                📅 Date Range
                            </label>
                            <select
                                value={filters.dateRange}
                                onChange={(e) => onFiltersChange({
                                    ...filters,
                                    dateRange: e.target.value as SearchFilters['dateRange']
                                })}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900"
                            >
                                <option value="all">All Events</option>
                                <option value="upcoming">Upcoming Only</option>
                                <option value="today">Today</option>
                                <option value="this-week">This Week</option>
                                <option value="this-month">This Month</option>
                            </select>
                        </div>

                        {/* Distance Filter */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                📏 Max Distance
                            </label>
                            <select
                                value={filters.maxDistance || ''}
                                onChange={(e) => onFiltersChange({
                                    ...filters,
                                    maxDistance: e.target.value ? parseInt(e.target.value) : undefined
                                })}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={!userLocation}
                            >
                                <option value="">Any Distance</option>
                                <option value="1">Within 1km</option>
                                <option value="5">Within 5km</option>
                                <option value="10">Within 10km</option>
                                <option value="25">Within 25km</option>
                                <option value="50">Within 50km</option>
                                <option value="100">Within 100km</option>
                            </select>
                            {!userLocation && (
                                <p className="text-xs text-gray-500 mt-2">
                                    Enable location to filter by distance
                                </p>
                            )}
                        </div>

                        {/* Sort By */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                🔄 Sort By
                            </label>
                            <select
                                value={filters.sortBy}
                                onChange={(e) => onFiltersChange({
                                    ...filters,
                                    sortBy: e.target.value as SearchFilters['sortBy']
                                })}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900"
                            >
                                <option value="date">Date</option>
                                <option value="distance" disabled={!userLocation}>
                                    Distance {!userLocation && '(needs location)'}
                                </option>
                                <option value="participants">Participants</option>
                                <option value="created">Recently Added</option>
                            </select>
                        </div>

                        {/* Sort Order */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                ↕️ Sort Order
                            </label>
                            <select
                                value={filters.sortOrder}
                                onChange={(e) => onFiltersChange({
                                    ...filters,
                                    sortOrder: e.target.value as SearchFilters['sortOrder']
                                })}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900"
                            >
                                <option value="asc">
                                    {filters.sortBy === 'date' ? 'Earliest First' :
                                        filters.sortBy === 'distance' ? 'Nearest First' :
                                            filters.sortBy === 'participants' ? 'Fewest First' :
                                                'Oldest First'}
                                </option>
                                <option value="desc">
                                    {filters.sortBy === 'date' ? 'Latest First' :
                                        filters.sortBy === 'distance' ? 'Farthest First' :
                                            filters.sortBy === 'participants' ? 'Most First' :
                                                'Newest First'}
                                </option>
                            </select>
                        </div>
                    </div>

                    {/* Clear Filters */}
                    {hasActiveFilters && (
                        <div className="flex justify-end pt-4 border-t border-gray-200">
                            <button
                                onClick={clearFilters}
                                className="inline-flex items-center gap-2 px-6 py-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all duration-200 font-medium"
                            >
                                <X size={16} />
                                Clear all filters
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchBar;