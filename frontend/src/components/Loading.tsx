import { Loader2, Search, MapPin, Calendar } from 'lucide-react';

interface LoadingProps {
    message?: string;
    type?: 'default' | 'search' | 'location' | 'events';
    size?: 'sm' | 'md' | 'lg';
}

const Loading = ({ message, type = 'default', size = 'md' }: LoadingProps) => {
    const getIcon = () => {
        switch (type) {
            case 'search':
                return <Search className="animate-pulse" size={size === 'sm' ? 16 : size === 'lg' ? 32 : 24} />;
            case 'location':
                return <MapPin className="animate-pulse" size={size === 'sm' ? 16 : size === 'lg' ? 32 : 24} />;
            case 'events':
                return <Calendar className="animate-pulse" size={size === 'sm' ? 16 : size === 'lg' ? 32 : 24} />;
            default:
                return <Loader2 className="animate-spin" size={size === 'sm' ? 16 : size === 'lg' ? 32 : 24} />;
        }
    };

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
            <div className="flex flex-col items-center gap-4">
                <div className="relative">
                    <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        {getIcon()}
                    </div>
                </div>
                <div className="text-center">
                    <span className={`text-gray-700 font-medium ${size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-lg' : 'text-base'}`}>
                        {getMessage()}
                    </span>
                    <div className="mt-2 flex justify-center">
                        <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Loading;