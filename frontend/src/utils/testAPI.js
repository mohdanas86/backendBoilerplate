// Simple test to check API connectivity
// Run this in browser console when the app is running

const testAPI = async () => {
    console.log('Testing API connectivity...');

    try {
        // Test health endpoint
        const healthResponse = await fetch('http://localhost:8080/api/health');
        const healthData = await healthResponse.json();
        console.log('✅ Health check:', healthData);

        // Test events endpoint
        const eventsResponse = await fetch('http://localhost:8080/api/events');
        const eventsData = await eventsResponse.json();
        console.log('✅ Events endpoint:', eventsData);

        return { success: true, health: healthData, events: eventsData };
    } catch (error) {
        console.error('❌ API test failed:', error);
        return { success: false, error: error.message };
    }
};

// Export for testing
window.testAPI = testAPI;

export default testAPI;