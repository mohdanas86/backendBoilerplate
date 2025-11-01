# Enhanced Search & Location Features

## 🔍 New Search Features

### Advanced Search Bar
- **Location Search**: Search events by location, venue, or address
- **Date Range Filters**: Filter by upcoming, today, this week, this month
- **Distance Filter**: Find events within specific distance (requires location access)
- **Sorting Options**: Sort by date, distance, participants, or creation date
- **Real-time Search**: Debounced search with instant results

### Location Services
- **Geolocation Support**: Use "Near me" to find events based on your location
- **Distance Calculation**: Shows distance to each event when location is enabled
- **Location Accuracy**: Displays GPS accuracy information
- **Fallback Handling**: Graceful handling when location services are unavailable

### Enhanced Loading States
- **Contextual Loading**: Different loading indicators for search, location, events
- **Progress Feedback**: Clear indication of what's happening
- **Error Recovery**: Retry options for failed operations

## 🧭 Distance Calculation

The app uses the **Haversine formula** to calculate distances between coordinates:
- Accurate calculation of distances in kilometers
- Handles edge cases and coordinate validation
- Optimized for performance with caching

### Mock Geocoding
Currently includes mock coordinates for common cities:
- New York, London, Paris, Tokyo
- San Francisco, Los Angeles, Chicago
- Delhi, Mumbai, Bangalore, etc.

*In production, replace with real geocoding service (Google Maps, OpenStreetMap)*

## 🎯 Search Filters

### Date Range Options
- **All Events**: Show all events regardless of date
- **Upcoming Only**: Events scheduled for the future
- **Today**: Events happening today
- **This Week**: Events in the current week
- **This Month**: Events in the current month

### Distance Options (when location enabled)
- Within 1km, 5km, 10km, 25km, 50km, 100km
- Automatically filters out events without coordinates
- Shows "Any Distance" when location is disabled

### Sorting Options
- **Date**: Earliest/Latest first
- **Distance**: Nearest/Farthest first (requires location)
- **Participants**: Fewest/Most participants first
- **Created**: Oldest/Newest events first

## 📱 User Experience

### Enhanced Event Cards
- **Distance Display**: Shows distance when location is available
- **Status Indicators**: Clear visual status (Open/Full/Past)
- **Responsive Design**: Adapts to different screen sizes

### Search Results
- **Results Summary**: Shows count and applied filters
- **Filter Indicators**: Clear indication of active filters
- **Clear Filters**: Easy reset of all search criteria

### Loading & Error States
- **Contextual Messages**: Specific messages for different operations
- **Retry Functionality**: Easy recovery from errors
- **Progressive Enhancement**: Works without location services

## 🔧 Technical Implementation

### Performance Optimizations
- **Debounced Search**: Prevents excessive API calls
- **Memoized Filtering**: Efficient re-computation of filtered results
- **Callback Optimization**: Prevents unnecessary re-renders
- **Location Caching**: 5-minute cache for location data

### Error Handling
- **Graceful Degradation**: App works without location access
- **User-Friendly Messages**: Clear explanation of errors
- **Fallback Options**: Alternative workflows when features fail

### Accessibility
- **Keyboard Navigation**: Full keyboard support
- **Screen Reader**: Proper ARIA labels and descriptions
- **Focus Management**: Clear focus indicators
- **High Contrast**: Supports high contrast mode

## 🚀 Usage Examples

### Basic Search
```typescript
// Search by location
filters.location = "New York"

// Filter by date range
filters.dateRange = "upcoming"

// Sort by date
filters.sortBy = "date"
filters.sortOrder = "asc"
```

### Location-Based Search
```typescript
// Get user location
const location = await getUserLocation();

// Calculate distances
const eventsWithDistance = calculateEventDistances(events, location);

// Filter by distance
filters.maxDistance = 10; // 10km radius
```

### Advanced Filtering
```typescript
// Complex filter example
const filters = {
  location: "San Francisco",
  dateRange: "this-week",
  maxDistance: 25,
  sortBy: "distance",
  sortOrder: "asc"
};

const results = filterAndSortEvents(events, filters, userLocation);
```

## 🛠️ Future Enhancements

### Planned Features
- **Real Geocoding**: Integration with Google Maps API
- **Category Filters**: Filter events by category/type
- **Price Range**: Filter by ticket price
- **Saved Searches**: Save frequently used search criteria
- **Push Notifications**: Alert when new events match saved searches

### Performance Improvements
- **Virtual Scrolling**: Handle large numbers of events
- **Infinite Scroll**: Progressive loading of events
- **Search Analytics**: Track popular searches
- **Caching Strategy**: Improved caching for better performance

## 🧪 Testing

### Test Location Features
1. **Enable Location**: Click "Near me" button
2. **Grant Permission**: Allow location access in browser
3. **Verify Distance**: Check that events show distance information
4. **Test Filters**: Use distance filter to narrow results

### Test Search Features
1. **Text Search**: Enter location in search bar
2. **Date Filters**: Try different date range options
3. **Sorting**: Test different sorting options
4. **Clear Filters**: Reset all filters and verify

### Error Testing
1. **Deny Location**: Test behavior when location is denied
2. **Network Errors**: Test with network disconnected
3. **Invalid Searches**: Test edge cases and invalid inputs

---

**Note**: Some features use mock data for demonstration. In production, integrate with real geocoding and mapping services for full functionality.