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
            return <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 border border-gray-300">Past</span>;
        }
        if (isFull) {
            return <span className="inline-block px-2 py-1 text-xs font-medium bg-amber-50 text-amber-700 border border-amber-300">Full</span>;
        }
        return <span className="inline-block px-2 py-1 text-xs font-medium bg-green-50 text-green-700 border border-green-300">Open</span>;
    };

    const getAvailableSpots = () => {
        return event.maxParticipants - event.currentParticipants;
    };

    return (
        <div className="group bg-white border border-gray-200 hover:border-gray-300 transition-colors overflow-hidden">
            <div className="p-5">
                <div className="flex justify-between items-start gap-3 mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 flex-1">
                        {event.title}
                    </h3>
                    {getStatusBadge()}
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                    {truncateText(event.description, 120)}
                </p>

                <div className="space-y-2.5 mb-4">
                    <div className="flex items-center gap-2.5 text-gray-700">
                        <Calendar size={16} className="text-gray-500 flex-shrink-0" />
                        <span className="text-sm">{formatDate(event.date)}</span>
                    </div>

                    <div className="flex items-center gap-2.5 text-gray-700">
                        <MapPin size={16} className="text-gray-500 flex-shrink-0" />
                        <span className="text-sm flex-1 truncate">{event.location}</span>
                        {showDistance && event.distance !== undefined && (
                            <span className="inline-flex items-center gap-1 text-blue-600 text-xs font-medium bg-blue-50 border border-blue-200 px-2 py-0.5">
                                <Navigation size={12} />
                                {formatDistance(event.distance)}
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-2.5 text-gray-700">
                        <Users size={16} className="text-gray-500 flex-shrink-0" />
                        <span className="text-sm">
                            {event.currentParticipants} / {event.maxParticipants} participants
                        </span>
                    </div>

                    {!isPast && !isFull && (
                        <div className="flex items-center gap-2.5 text-green-700 bg-green-50 border border-green-200 px-3 py-1.5 mt-3">
                            <Clock size={14} className="flex-shrink-0" />
                            <span className="text-xs font-medium">
                                {getAvailableSpots()} spots available
                            </span>
                        </div>
                    )}
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                    <Link
                        to={`/events/${event._id}`}
                        className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm font-medium transition-colors"
                    >
                        View Details
                        <svg className="w-4 h-4 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>

                    <span className="text-xs text-gray-500">
                        {new Date(event.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default EventCard;