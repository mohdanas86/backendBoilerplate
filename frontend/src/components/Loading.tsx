/**
 * Loading Component
 * 
 * Displays a loading spinner with customizable message and size.
 * 
 * Features:
 * - Multiple loading types (default, search, location, events)
 * - Configurable size (sm, md, lg)
 * - Custom messages
 * - Animated spinner
 * 
 * @component
 */

/**
 * Props for the Loading component
 */
interface LoadingProps {
    /** Custom loading message */
    message?: string;
    /** Type of loading indicator */
    type?: 'default' | 'search' | 'location' | 'events';
    /** Size of the loading indicator */
    size?: 'sm' | 'md' | 'lg';
}

/**
 * Loading indicator component with customizable appearance
 */
const Loading = ({ message, type = 'default', size = 'md' }: LoadingProps) => {
    /**
     * Get the appropriate message based on type or custom message
     */
    const getMessage = () => {
        if (message) return message;

        switch (type) {
            case 'search':
                return 'Searching events...';
            case 'location':
                return 'Getting your location...';
            case 'events':
                return 'Loading events...';
            default:
                return 'Loading...';
        }
    };

    const sizeClasses = {
        sm: 'p-4',
        md: 'p-8',
        lg: 'p-12'
    };

    return (
        <div className={`loading ${sizeClasses[size]}`}>
            <div className="flex flex-col items-center gap-3">
                <div className="relative">
                    <div className={`${size === 'sm' ? 'w-8 h-8 border-2' : size === 'lg' ? 'w-12 h-12 border-3' : 'w-10 h-10 border-2'} border-gray-300 border-t-blue-600 rounded-full animate-spin`}></div>
                </div>
                <span className={`text-gray-700 font-medium ${size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-lg' : 'text-base'}`}>
                    {getMessage()}
                </span>
            </div>
        </div>
    );
};

export default Loading;