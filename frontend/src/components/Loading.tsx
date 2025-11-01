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

    const iconSize = size === 'sm' ? 16 : size === 'lg' ? 24 : 20;

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