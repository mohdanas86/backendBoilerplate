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
            <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
                <div className="text-center py-20">
                    <div className="w-24 h-24 bg-gradient-to-r from-red-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <XCircle className="w-12 h-12 text-red-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        Event not found
                    </h2>
                    <p className="text-gray-600 mb-8 max-w-md mx-auto">
                        The event you're looking for doesn't exist or may have been removed.
                    </p>
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200"
                    >
                        <ArrowLeft size={20} />
                        Back to Events
                    </Link>
                </div>
            </div>
        );
    }

    const isPast = isEventInPast(event.date);
    const isFull = event.currentParticipants >= event.maxParticipants;
    const availableSpots = event.maxParticipants - event.currentParticipants;

    return (
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
            {/* Back Navigation */}
            <Link
                to="/"
                className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-8 transition-colors font-medium"
            >
                <ArrowLeft size={20} />
                Back to Events
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Main Content */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                        <div className="p-8">
                            <div className="flex justify-between items-start gap-4 mb-6">
                                <div className="flex-1">
                                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                                        {event.title}
                                    </h1>
                                    <div className="flex items-center gap-3">
                                        {isPast ? (
                                            <span className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-medium">
                                                <XCircle size={16} />
                                                Event Ended
                                            </span>
                                        ) : isFull ? (
                                            <span className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full text-sm font-medium">
                                                <Clock size={16} />
                                                Fully Booked
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium">
                                                <CheckCircle size={16} />
                                                Open for Registration
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <button
                                    onClick={handleShare}
                                    className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-xl transition-all duration-200 font-medium"
                                    title="Share this event"
                                >
                                    <Share2 size={16} />
                                    Share
                                </button>
                            </div>

                            <div className="prose prose-lg max-w-none mb-8">
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                    About this Event
                                </h3>
                                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-lg">
                                    {event.description}
                                </p>
                            </div>

                            {!isPast && !isFull && (
                                <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
                                    <div className="flex items-center gap-3 text-green-800 mb-3">
                                        <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-lg">
                                            <CheckCircle size={20} className="text-green-600" />
                                        </div>
                                        <h4 className="font-bold text-lg">Ready to Join?</h4>
                                    </div>
                                    <p className="text-green-700 mb-4">
                                        {availableSpots} {availableSpots === 1 ? 'spot' : 'spots'} still available!
                                    </p>
                                    <button className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200">
                                        Register for Event
                                    </button>
                                </div>
                            )}

                            {isFull && !isPast && (
                                <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6">
                                    <div className="flex items-center gap-3 text-yellow-800 mb-3">
                                        <div className="flex items-center justify-center w-8 h-8 bg-yellow-100 rounded-lg">
                                            <Clock size={20} className="text-yellow-600" />
                                        </div>
                                        <h4 className="font-bold text-lg">Event is Full</h4>
                                    </div>
                                    <p className="text-yellow-700">
                                        This event has reached maximum capacity. Check back later for cancellations.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                        <div className="p-8">
                            <h3 className="text-2xl font-bold text-gray-900 mb-6">
                                Event Details
                            </h3>

                            <div className="space-y-8">
                                {/* Date & Time */}
                                <div className="flex items-start gap-4">
                                    <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl">
                                        <Calendar className="text-blue-600" size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 text-lg">Date & Time</h4>
                                        <p className="text-gray-700 mt-1">{formatDate(event.date)}</p>
                                    </div>
                                </div>

                                {/* Location */}
                                <div className="flex items-start gap-4">
                                    <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl">
                                        <MapPin className="text-green-600" size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 text-lg">Location</h4>
                                        <p className="text-gray-700 mt-1">{event.location}</p>
                                    </div>
                                </div>

                                {/* Participants */}
                                <div className="flex items-start gap-4">
                                    <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-xl">
                                        <Users className="text-purple-600" size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-gray-900 text-lg">Participants</h4>
                                        <p className="text-gray-700 mt-1 mb-3">
                                            {event.currentParticipants} of {event.maxParticipants} registered
                                        </p>

                                        {/* Progress bar */}
                                        <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
                                            <div
                                                className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500 ease-out"
                                                style={{
                                                    width: `${(event.currentParticipants / event.maxParticipants) * 100}%`
                                                }}
                                            ></div>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-2">
                                            {Math.round((event.currentParticipants / event.maxParticipants) * 100)}% full
                                        </p>
                                    </div>
                                </div>

                                {/* Availability */}
                                {!isPast && (
                                    <div className="border-t border-gray-200 pt-6">
                                        <div className="text-center">
                                            {isFull ? (
                                                <span className="text-yellow-600 font-semibold text-lg">
                                                    No spots available
                                                </span>
                                            ) : (
                                                <span className="text-green-600 font-semibold text-lg">
                                                    {availableSpots} {availableSpots === 1 ? 'spot' : 'spots'} remaining
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="border-t border-gray-200 pt-6 mt-8">
                                <div className="text-center text-sm text-gray-500">
                                    <p>Created on {new Date(event.createdAt).toLocaleDateString()}</p>
                                    <p className="mt-1">Last updated {new Date(event.updatedAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Additional Actions */}
                    <div className="mt-6">
                        <Link
                            to="/"
                            className="w-full bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-800 px-6 py-4 rounded-xl font-semibold transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-2"
                        >
                            <ArrowLeft size={16} />
                            Browse More Events
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetail;