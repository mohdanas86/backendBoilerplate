import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
    Calendar,
    MapPin,
    Users,
    Clock,
    ArrowLeft,
    Share2,
    CheckCircle,
    XCircle
} from 'lucide-react';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import { getEventById } from '../services/eventApi';
import { formatDate, isEventInPast } from '../utils/helpers';
import type { Event } from '../types/event';

const EventDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [event, setEvent] = useState<Event | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        if (!id) {
            navigate('/');
            return;
        }

        const fetchEvent = async () => {
            try {
                setLoading(true);
                setError('');
                const data = await getEventById(id);
                setEvent(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch event details');
            } finally {
                setLoading(false);
            }
        };

        fetchEvent();
    }, [id, navigate]);

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: event?.title,
                    text: event?.description,
                    url: window.location.href,
                });
            } catch (err) {
                // User cancelled sharing
            }
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
        }
    };

    if (loading) {
        return <Loading message="Loading event details..." />;
    }

    if (error) {
        return (
            <div className="container mt-8">
                <ErrorMessage
                    message={error}
                    onRetry={() => window.location.reload()}
                />
                <Link to="/" className="btn btn-secondary mt-4">
                    <ArrowLeft size={20} />
                    Back to Events
                </Link>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="min-h-screen bg-gray-50 pt-20">
                <div className="max-w-4xl mx-auto px-6 py-12">
                    <div className="bg-white border border-gray-200 p-8 text-center">
                        <div className="w-16 h-16 bg-red-100 flex items-center justify-center mx-auto mb-4">
                            <XCircle className="w-8 h-8 text-red-600" />
                        </div>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                            Event not found
                        </h2>
                        <p className="text-gray-600 mb-6">
                            The event you're looking for doesn't exist or may have been removed.
                        </p>
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 font-medium transition-colors"
                        >
                            <ArrowLeft size={16} />
                            Back to Events
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const isPast = isEventInPast(event.date);
    const isFull = event.currentParticipants >= event.maxParticipants;
    const availableSpots = event.maxParticipants - event.currentParticipants;

    return (
        <div className="min-h-screen bg-gray-50 pt-20">
            <div className="max-w-6xl mx-auto px-6 py-8">
                {/* Back Navigation */}
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors font-medium"
                >
                    <ArrowLeft size={16} />
                    Back to Events
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        <div className="bg-white border border-gray-200 overflow-hidden">
                            <div className="p-6">
                                <div className="flex justify-between items-start gap-4 mb-6">
                                    <div className="flex-1">
                                        <h1 className="text-3xl font-semibold text-gray-900 mb-3">
                                            {event.title}
                                        </h1>
                                        <div className="flex items-center gap-2">
                                            {isPast ? (
                                                <span className="inline-flex items-center gap-1.5 border border-red-300 bg-red-50 text-red-700 px-3 py-1 text-xs font-medium">
                                                    <XCircle size={14} />
                                                    Event Ended
                                                </span>
                                            ) : isFull ? (
                                                <span className="inline-flex items-center gap-1.5 border border-yellow-300 bg-yellow-50 text-yellow-700 px-3 py-1 text-xs font-medium">
                                                    <Clock size={14} />
                                                    Fully Booked
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 border border-green-300 bg-green-50 text-green-700 px-3 py-1 text-xs font-medium">
                                                    <CheckCircle size={14} />
                                                    Open for Registration
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleShare}
                                        className="inline-flex items-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-3 py-2 transition-colors font-medium"
                                        title="Share this event"
                                    >
                                        <Share2 size={14} />
                                        Share
                                    </button>
                                </div>

                                <div className="mb-6">
                                    <h3 className="text-lg font-medium text-gray-900 mb-3">
                                        About this Event
                                    </h3>
                                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                        {event.description}
                                    </p>
                                </div>

                                {!isPast && !isFull && (
                                    <div className="bg-green-50 border border-green-200 p-5">
                                        <div className="flex items-center gap-2 text-green-800 mb-2">
                                            <CheckCircle size={16} className="text-green-600" />
                                            <h4 className="font-medium">Ready to Join?</h4>
                                        </div>
                                        <p className="text-green-700 text-sm mb-4">
                                            {availableSpots} {availableSpots === 1 ? 'spot' : 'spots'} still available
                                        </p>
                                        <button className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 font-medium transition-colors">
                                            Register for Event
                                        </button>
                                    </div>
                                )}

                                {isFull && !isPast && (
                                    <div className="bg-yellow-50 border border-yellow-200 p-5">
                                        <div className="flex items-center gap-2 text-yellow-800 mb-2">
                                            <Clock size={16} className="text-yellow-600" />
                                            <h4 className="font-medium">Event is Full</h4>
                                        </div>
                                        <p className="text-yellow-700 text-sm">
                                            This event has reached maximum capacity.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white border border-gray-200 overflow-hidden">
                            <div className="p-5">
                                <h3 className="text-lg font-medium text-gray-900 mb-5">
                                    Event Details
                                </h3>

                                <div className="space-y-5">
                                    {/* Date & Time */}
                                    <div className="flex items-start gap-3">
                                        <div className="flex items-center justify-center w-9 h-9 bg-blue-100 flex-shrink-0">
                                            <Calendar className="text-blue-600" size={16} />
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-gray-900 text-sm">Date & Time</h4>
                                            <p className="text-gray-700 text-sm mt-1">{formatDate(event.date)}</p>
                                        </div>
                                    </div>

                                    {/* Location */}
                                    <div className="flex items-start gap-3">
                                        <div className="flex items-center justify-center w-9 h-9 bg-blue-100 flex-shrink-0">
                                            <MapPin className="text-blue-600" size={16} />
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-gray-900 text-sm">Location</h4>
                                            <p className="text-gray-700 text-sm mt-1">{event.location}</p>
                                        </div>
                                    </div>

                                    {/* Participants */}
                                    <div className="flex items-start gap-3">
                                        <div className="flex items-center justify-center w-9 h-9 bg-blue-100 flex-shrink-0">
                                            <Users className="text-blue-600" size={16} />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-medium text-gray-900 text-sm">Participants</h4>
                                            <p className="text-gray-700 text-sm mt-1 mb-2">
                                                {event.currentParticipants} of {event.maxParticipants} registered
                                            </p>

                                            {/* Progress bar */}
                                            <div className="bg-gray-200 h-2 overflow-hidden">
                                                <div
                                                    className="bg-blue-600 h-2 transition-all duration-500"
                                                    style={{
                                                        width: `${(event.currentParticipants / event.maxParticipants) * 100}%`
                                                    }}
                                                ></div>
                                            </div>
                                            <p className="text-xs text-gray-600 mt-1.5">
                                                {Math.round((event.currentParticipants / event.maxParticipants) * 100)}% full
                                            </p>
                                        </div>
                                    </div>

                                    {/* Availability */}
                                    {!isPast && (
                                        <div className="border-t border-gray-200 pt-4">
                                            <div className="text-center">
                                                {isFull ? (
                                                    <span className="text-yellow-600 font-medium text-sm">
                                                        No spots available
                                                    </span>
                                                ) : (
                                                    <span className="text-green-600 font-medium text-sm">
                                                        {availableSpots} {availableSpots === 1 ? 'spot' : 'spots'} remaining
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="border-t border-gray-200 pt-4 mt-5">
                                    <div className="text-center text-xs text-gray-500">
                                        <p>Created {new Date(event.createdAt).toLocaleDateString()}</p>
                                        <p className="mt-1">Updated {new Date(event.updatedAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Additional Actions */}
                        <div className="mt-4">
                            <Link
                                to="/"
                                className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2.5 font-medium transition-colors flex items-center justify-center gap-2"
                            >
                                <ArrowLeft size={14} />
                                Browse More Events
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetail;