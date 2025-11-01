import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, Clock, Navigation } from 'lucide-react';
import type { Event } from '../types/event';
import { formatDate, truncateText, isEventInPast } from '../utils/helpers';
import { formatDistance } from '../utils/locationUtils';

interface EventCardProps {
    event: Event;
    showDistance?: boolean;
}

const EventCard = ({ event, showDistance = false }: EventCardProps) => {
    const isPast = isEventInPast(event.date);
    const isFull = event.currentParticipants >= event.maxParticipants;

    const getStatusBadge = () => {
        if (isPast) {
            return <span className="badge badge-danger">Past</span>;
        }
        if (isFull) {
            return <span className="badge badge-warning">Full</span>;
        }
        return <span className="badge badge-success">Open</span>;
    };

    const getAvailableSpots = () => {
        return event.maxParticipants - event.currentParticipants;
    };

    return (
        <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-200 overflow-hidden hover:-translate-y-1">
            <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
                        {event.title}
                    </h3>
                    {getStatusBadge()}
                </div>

                <p className="text-gray-600 mb-6 line-clamp-3 leading-relaxed">
                    {truncateText(event.description, 120)}
                </p>

                <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 text-gray-600">
                        <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-lg">
                            <Calendar size={16} className="text-blue-600" />
                        </div>
                        <span className="text-sm font-medium">{formatDate(event.date)}</span>
                    </div>

                    <div className="flex items-center gap-3 text-gray-600">
                        <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-lg">
                            <MapPin size={16} className="text-green-600" />
                        </div>
                        <span className="text-sm font-medium">{event.location}</span>
                        {showDistance && event.distance !== undefined && (
                            <span className="ml-auto flex items-center gap-1 text-blue-600 text-sm font-semibold bg-blue-50 px-2 py-1 rounded-lg">
                                <Navigation size={14} />
                                {formatDistance(event.distance)}
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-3 text-gray-600">
                        <div className="flex items-center justify-center w-8 h-8 bg-purple-100 rounded-lg">
                            <Users size={16} className="text-purple-600" />
                        </div>
                        <span className="text-sm font-medium">
                            {event.currentParticipants} / {event.maxParticipants} participants
                        </span>
                    </div>

                    {!isPast && !isFull && (
                        <div className="flex items-center gap-3 text-green-700 bg-green-50 px-3 py-2 rounded-lg">
                            <div className="flex items-center justify-center w-6 h-6 bg-green-200 rounded-full">
                                <Clock size={14} className="text-green-700" />
                            </div>
                            <span className="text-sm font-semibold">
                                {getAvailableSpots()} spots available
                            </span>
                        </div>
                    )}
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <Link
                        to={`/events/${event._id}`}
                        className="inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200"
                    >
                        View Details
                        <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>

                    <span className="text-xs text-gray-500 bg-gray-50 px-3 py-1 rounded-lg">
                        Created {new Date(event.createdAt).toLocaleDateString()}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default EventCard;