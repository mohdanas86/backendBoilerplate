import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorMessageProps {
    message: string;
    onRetry?: () => void;
}

const ErrorMessage = ({ message, onRetry }: ErrorMessageProps) => {
    return (
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
            <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-10 h-10 bg-red-100 rounded-lg flex-shrink-0">
                    <AlertCircle size={20} className="text-red-600" />
                </div>
                <div className="flex-1">
                    <h3 className="text-red-800 font-semibold text-lg mb-2">Something went wrong</h3>
                    <p className="text-red-700 mb-4">{message}</p>
                    {onRetry && (
                        <button
                            onClick={onRetry}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-200 font-medium shadow-sm hover:shadow-md"
                        >
                            <RefreshCw size={16} />
                            Try Again
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ErrorMessage;