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
        <div className="space-y-4">
            {/* Main Search Controls */}
            <div className="flex flex-col lg:flex-row gap-3">
                {/* Location Search */}
                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Search Location
                    </label>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            value={localLocation}
                            onChange={(e) => handleLocationChange(e.target.value)}
                            placeholder="City, venue, or address"
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors text-gray-900 placeholder-gray-500 bg-white"
                        />
                    </div>
                </div>

                {/* Location Services Button */}
                <div className="lg:w-40">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        &nbsp;
                    </label>
                    <button
                        onClick={onLocationRequest}
                        disabled={locationLoading || !isGeolocationSupported || !isHttps}
                        className={`w-full px-4 py-2.5 border transition-colors flex items-center justify-center gap-2 font-medium ${userLocation
                            ? 'bg-green-50 border-green-600 text-green-700 hover:bg-green-100'
                            : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
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
                            <Loader2 className="animate-spin" size={18} />
                        ) : (
                            <Navigation size={18} />
                        )}
                        <span className="hidden sm:inline text-sm">
                            {locationLoading ? 'Locating...' :
                                !isGeolocationSupported ? 'Not supported' :
                                    !isHttps ? 'HTTPS Required' :
                                        'Near Me'}
                        </span>
                    </button>
                </div>

                {/* Advanced Filters Toggle */}
                <div className="lg:w-32">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        &nbsp;
                    </label>
                    <button
                        onClick={() => setShowAdvanced(!showAdvanced)}
                        className={`w-full px-4 py-2.5 border transition-colors flex items-center justify-center gap-2 font-medium ${showAdvanced || hasActiveFilters
                            ? 'bg-blue-50 border-blue-600 text-blue-700'
                            : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                            }`}
                    >
                        <Filter size={18} />
                        <span className="text-sm">Filters</span>
                        <ChevronDown
                            size={14}
                            className={`transform transition-transform ${showAdvanced ? 'rotate-180' : ''}`}
                        />
                    </button>
                </div>
            </div>

            {/* Location Error */}
            {locationError && (
                <div className="bg-amber-50 border border-amber-200 p-4">
                    <div className="flex items-start gap-3">
                        <div className="flex items-center justify-center w-8 h-8 bg-amber-100 flex-shrink-0 mt-0.5">
                            <Navigation size={16} className="text-amber-700" />
                        </div>
                        <div className="flex-1">
                            <h4 className="text-amber-900 font-medium text-sm mb-1">
                                Location Access Issue
                            </h4>
                            <p className="text-amber-800 text-sm mb-2">{locationError}</p>
                            {locationSuggestion && (
                                <p className="text-amber-700 text-xs mb-3 bg-amber-100/50 p-2">
                                    {locationSuggestion}
                                </p>
                            )}
                            <div className="flex gap-2">
                                <button
                                    onClick={onLocationRequest}
                                    className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-medium transition-colors"
                                >
                                    Try Again
                                </button>
                                <button
                                    onClick={() => setLocalLocation('')}
                                    className="px-3 py-1.5 bg-white border border-amber-300 hover:bg-amber-50 text-amber-900 text-xs font-medium transition-colors"
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
                <div className="bg-blue-50 border border-blue-200 p-3">
                    <div className="flex items-start gap-2">
                        <Navigation size={16} className="text-blue-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                            <p className="text-blue-900 font-medium text-sm">
                                {!isGeolocationSupported
                                    ? 'Location services not supported'
                                    : 'Location requires HTTPS connection'}
                            </p>
                            <p className="text-blue-700 text-xs mt-0.5">
                                Search for events by typing a city name above.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* User Location Info */}
            {userLocation && (
                <div className="bg-green-50 border border-green-200 p-3">
                    <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-green-600" />
                        <div className="flex-1">
                            <span className="text-green-900 font-medium text-sm">Location detected</span>
                            <p className="text-green-700 text-xs mt-0.5">
                                ±{Math.round(userLocation.accuracy || 0)}m accuracy
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Advanced Filters */}
            {showAdvanced && (
                <div className="border border-gray-300 p-4 bg-gray-50 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Date Range Filter */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                <Calendar size={16} />
                                Date Range
                            </label>
                            <select
                                value={filters.dateRange}
                                onChange={(e) => onFiltersChange({
                                    ...filters,
                                    dateRange: e.target.value as SearchFilters['dateRange']
                                })}
                                className="w-full px-3 py-2 border border-gray-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors bg-white text-gray-900 text-sm"
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
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                <Navigation size={16} />
                                Max Distance
                            </label>
                            <select
                                value={filters.maxDistance || ''}
                                onChange={(e) => onFiltersChange({
                                    ...filters,
                                    maxDistance: e.target.value ? parseInt(e.target.value) : undefined
                                })}
                                className="w-full px-3 py-2 border border-gray-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors bg-white text-gray-900 text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100"
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
                                <p className="text-xs text-gray-500 mt-1">
                                    Enable location to use
                                </p>
                            )}
                        </div>

                        {/* Sort By */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                <Filter size={16} />
                                Sort By
                            </label>
                            <select
                                value={filters.sortBy}
                                onChange={(e) => onFiltersChange({
                                    ...filters,
                                    sortBy: e.target.value as SearchFilters['sortBy']
                                })}
                                className="w-full px-3 py-2 border border-gray-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors bg-white text-gray-900 text-sm"
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
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                <ChevronDown size={16} />
                                Sort Order
                            </label>
                            <select
                                value={filters.sortOrder}
                                onChange={(e) => onFiltersChange({
                                    ...filters,
                                    sortOrder: e.target.value as SearchFilters['sortOrder']
                                })}
                                className="w-full px-3 py-2 border border-gray-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors bg-white text-gray-900 text-sm"
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
                        <div className="flex justify-end pt-3 border-t border-gray-300">
                            <button
                                onClick={clearFilters}
                                className="inline-flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-200 transition-colors font-medium"
                            >
                                <X size={16} />
                                Clear Filters
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchBar;