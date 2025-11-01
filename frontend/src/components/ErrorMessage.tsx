import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorMessageProps {
    message: string;
    onRetry?: () => void;
}

const ErrorMessage = ({ message, onRetry }: ErrorMessageProps) => {
    return (
        <div className="bg-red-50 border border-red-200 p-5">
            <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-8 h-8 bg-red-100 flex-shrink-0 mt-0.5">
                    <AlertCircle size={18} className="text-red-600" />
                </div>
                <div className="flex-1">
                    <h3 className="text-red-900 font-medium text-sm mb-1">Error</h3>
                    <p className="text-red-800 text-sm mb-3">{message}</p>
                    {onRetry && (
                        <button
                            onClick={onRetry}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-colors"
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