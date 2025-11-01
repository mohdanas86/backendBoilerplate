import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Calendar, MapPin, Users, FileText } from 'lucide-react';
import { createEvent } from '../services/eventApi';
import { validateEventForm, getCurrentDateForInput } from '../utils/helpers';
import ErrorMessage from '../components/ErrorMessage';
import type { CreateEventData } from '../types/event';

interface FormErrors {
    title?: string;
    description?: string;
    location?: string;
    date?: string;
    maxParticipants?: string;
    currentParticipants?: string;
}

const CreateEvent = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState(false);
    const [errors, setErrors] = useState<FormErrors>({});

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        location: '',
        date: '',
        maxParticipants: '',
        currentParticipants: '0',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear specific field error when user starts typing
        if (errors[name as keyof FormErrors]) {
            setErrors(prev => ({
                ...prev,
                [name]: undefined
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess(false);

        // Validate form
        const validation = validateEventForm(formData);
        if (!validation.isValid) {
            setErrors(validation.errors);
            return;
        }

        setLoading(true);

        try {
            const eventData: CreateEventData = {
                title: formData.title.trim(),
                description: formData.description.trim(),
                location: formData.location.trim(),
                date: formData.date,
                maxParticipants: parseInt(formData.maxParticipants),
                currentParticipants: parseInt(formData.currentParticipants) || 0,
            };

            const newEvent = await createEvent(eventData);
            setSuccess(true);

            // Redirect to event detail after 2 seconds
            setTimeout(() => {
                navigate(`/events/${newEvent._id}`);
            }, 2000);

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create event');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-gray-50 pt-20">
                <div className="max-w-2xl mx-auto px-6 py-12">
                    <div className="bg-white border border-gray-200 p-8 text-center">
                        <div className="w-16 h-16 bg-green-100 flex items-center justify-center mx-auto mb-4">
                            <Calendar size={32} className="text-green-600" />
                        </div>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                            Event Created Successfully
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Your event has been created and is now visible to everyone.
                        </p>
                        <div className="bg-green-50 border border-green-200 p-3">
                            <p className="text-green-900 font-medium text-sm">
                                "{formData.title}" is now live
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-20">
            <div className="max-w-4xl mx-auto px-6 py-8">
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 transition-colors font-medium"
                    >
                        <ArrowLeft size={16} />
                        Cancel
                    </Link>
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">Create New Event</h1>
                        <p className="text-gray-600 text-sm mt-0.5">Fill in the details below</p>
                    </div>
                </div>

                {/* Error Message */}
                {error && <div className="mb-6"><ErrorMessage message={error} /></div>}

                {/* Form */}
                <div className="bg-white border border-gray-200 overflow-hidden">
                    <form onSubmit={handleSubmit}>
                        <div className="p-6 space-y-6">
                            {/* Title */}
                            <div>
                                <label htmlFor="title" className="flex items-center gap-2 text-sm font-medium text-gray-900 mb-2">
                                    <FileText size={14} className="text-blue-600" />
                                    Event Title *
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900 placeholder-gray-400"
                                    placeholder="Enter event title"
                                    maxLength={100}
                                />
                                {errors.title && <div className="text-red-600 text-sm mt-1">{errors.title}</div>}
                                <div className="text-gray-500 text-xs mt-1">
                                    {formData.title.length}/100 characters
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label htmlFor="description" className="flex items-center gap-2 text-sm font-medium text-gray-900 mb-2">
                                    <FileText size={14} className="text-blue-600" />
                                    Description *
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900 placeholder-gray-400 resize-vertical"
                                    placeholder="Describe your event"
                                    rows={4}
                                    maxLength={1000}
                                />
                                {errors.description && <div className="text-red-600 text-sm mt-1">{errors.description}</div>}
                                <div className="text-gray-500 text-xs mt-1">
                                    {formData.description.length}/1000 characters
                                </div>
                            </div>

                            {/* Location */}
                            <div>
                                <label htmlFor="location" className="flex items-center gap-2 text-sm font-medium text-gray-900 mb-2">
                                    <MapPin size={14} className="text-blue-600" />
                                    Location *
                                </label>
                                <input
                                    type="text"
                                    id="location"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900 placeholder-gray-400"
                                    placeholder="e.g., Central Park, New York or Online"
                                    maxLength={200}
                                />
                                {errors.location && <div className="text-red-600 text-sm mt-1">{errors.location}</div>}
                                <div className="text-gray-500 text-xs mt-1">
                                    Specify the venue or address
                                </div>
                            </div>

                            {/* Date and Time */}
                            <div>
                                <label htmlFor="date" className="flex items-center gap-2 text-sm font-medium text-gray-900 mb-2">
                                    <Calendar size={14} className="text-blue-600" />
                                    Date & Time *
                                </label>
                                <input
                                    type="datetime-local"
                                    id="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900"
                                    min={getCurrentDateForInput()}
                                />
                                {errors.date && <div className="text-red-600 text-sm mt-1">{errors.date}</div>}
                            </div>

                            {/* Participants */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="maxParticipants" className="flex items-center gap-2 text-sm font-medium text-gray-900 mb-2">
                                        <Users size={14} className="text-blue-600" />
                                        Max Participants *
                                    </label>
                                    <input
                                        type="number"
                                        id="maxParticipants"
                                        name="maxParticipants"
                                        value={formData.maxParticipants}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900"
                                        placeholder="e.g., 50"
                                        min="1"
                                        max="10000"
                                    />
                                    {errors.maxParticipants && <div className="text-red-600 text-sm mt-1">{errors.maxParticipants}</div>}
                                </div>

                                <div>
                                    <label htmlFor="currentParticipants" className="flex items-center gap-2 text-sm font-medium text-gray-900 mb-2">
                                        <Users size={14} className="text-blue-600" />
                                        Current Participants
                                    </label>
                                    <input
                                        type="number"
                                        id="currentParticipants"
                                        name="currentParticipants"
                                        value={formData.currentParticipants}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900"
                                        placeholder="0"
                                        min="0"
                                    />
                                    {errors.currentParticipants && <div className="text-red-600 text-sm mt-1">{errors.currentParticipants}</div>}
                                    <div className="text-gray-500 text-xs mt-1">
                                        Already registered (optional)
                                    </div>
                                </div>
                            </div>

                            {/* Preview */}
                            {formData.title && formData.date && (
                                <div className="bg-blue-50 border border-blue-200 p-4">
                                    <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                                        <FileText size={14} className="text-blue-600" />
                                        Preview
                                    </h4>
                                    <div className="space-y-2 text-sm text-gray-700">
                                        <p><strong className="text-gray-900">Title:</strong> {formData.title}</p>
                                        {formData.date && (
                                            <p><strong className="text-gray-900">Date:</strong> {new Date(formData.date).toLocaleString()}</p>
                                        )}
                                        {formData.location && (
                                            <p><strong className="text-gray-900">Location:</strong> {formData.location}</p>
                                        )}
                                        {formData.maxParticipants && (
                                            <p><strong className="text-gray-900">Capacity:</strong> {formData.maxParticipants} participants</p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="border-t border-gray-200 p-6 bg-gray-50">
                            <div className="flex flex-col sm:flex-row gap-3 justify-end">
                                <Link
                                    to="/"
                                    className="px-5 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium transition-colors text-center"
                                >
                                    Cancel
                                </Link>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Creating...
                                        </>
                                    ) : (
                                        <>
                                            <Save size={14} />
                                            Create Event
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Tips */}
                <div className="mt-6 bg-amber-50 border border-amber-200 p-5">
                    <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                        <FileText size={14} className="text-amber-600" />
                        Tips for a Great Event
                    </h3>
                    <ul className="text-gray-700 space-y-1.5 text-sm">
                        <li>• Write a clear, engaging title</li>
                        <li>• Include specific details about what participants can expect</li>
                        <li>• Provide accurate location information</li>
                        <li>• Set a realistic participant limit</li>
                        <li>• Consider time zones if this is an online event</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default CreateEvent;