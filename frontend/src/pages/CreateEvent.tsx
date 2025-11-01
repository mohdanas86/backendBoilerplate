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
            <div className="max-w-4xl mx-auto px-6 lg:px-8 py-12">
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-12">
                    <div className="text-center">
                        <div className="w-20 h-20 bg-gradient-to-r from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Calendar size={48} className="text-green-600" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            Event Created Successfully!
                        </h2>
                        <p className="text-gray-600 mb-8 text-lg">
                            Your event has been created and is now visible to everyone. You'll be redirected to the event page shortly.
                        </p>
                        <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
                            <p className="text-green-800 font-semibold">
                                Event "{formData.title}" created successfully!
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-6 lg:px-8 py-12">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-xl transition-all duration-200 font-medium"
                >
                    <ArrowLeft size={16} />
                    Cancel
                </Link>
                <div>
                    <h1 className="text-4xl font-bold text-gray-900">Create New Event</h1>
                    <p className="text-gray-600 text-lg mt-1">Fill in the details below to create your event</p>
                </div>
            </div>

            {/* Error Message */}
            {error && <ErrorMessage message={error} />}

            {/* Form */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <form onSubmit={handleSubmit}>
                    <div className="p-8 space-y-8">
                        {/* Title */}
                        <div>
                            <label htmlFor="title" className="block text-sm font-bold text-gray-900 mb-3">
                                <FileText size={16} className="inline mr-2 text-blue-600" />
                                Event Title *
                            </label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-500 text-lg"
                                placeholder="Enter a compelling event title"
                                maxLength={100}
                            />
                            {errors.title && <div className="text-red-600 text-sm mt-2 font-medium">{errors.title}</div>}
                            <div className="text-gray-500 text-sm mt-2">
                                {formData.title.length}/100 characters
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label htmlFor="description" className="block text-sm font-bold text-gray-900 mb-3">
                                <FileText size={16} className="inline mr-2 text-blue-600" />
                                Description *
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-500 text-lg resize-vertical"
                                placeholder="Describe your event in detail. What can participants expect?"
                                rows={4}
                                maxLength={1000}
                            />
                            {errors.description && <div className="text-red-600 text-sm mt-2 font-medium">{errors.description}</div>}
                            <div className="text-gray-500 text-sm mt-2">
                                {formData.description.length}/1000 characters
                            </div>
                        </div>

                        {/* Location */}
                        <div>
                            <label htmlFor="location" className="block text-sm font-bold text-gray-900 mb-3">
                                <MapPin size={16} className="inline mr-2 text-green-600" />
                                Location *
                            </label>
                            <input
                                type="text"
                                id="location"
                                name="location"
                                value={formData.location}
                                onChange={handleInputChange}
                                className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-500 text-lg"
                                placeholder="e.g., Central Park, New York or Online"
                                maxLength={200}
                            />
                            {errors.location && <div className="text-red-600 text-sm mt-2 font-medium">{errors.location}</div>}
                            <div className="text-gray-500 text-sm mt-2">
                                Specify the venue, address, or mention if it's online
                            </div>
                        </div>

                        {/* Date and Time */}
                        <div>
                            <label htmlFor="date" className="block text-sm font-bold text-gray-900 mb-3">
                                <Calendar size={16} className="inline mr-2 text-purple-600" />
                                Date & Time *
                            </label>
                            <input
                                type="datetime-local"
                                id="date"
                                name="date"
                                value={formData.date}
                                onChange={handleInputChange}
                                className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 text-gray-900 text-lg"
                                min={getCurrentDateForInput()}
                            />
                            {errors.date && <div className="text-red-600 text-sm mt-2 font-medium">{errors.date}</div>}
                            <div className="text-gray-500 text-sm mt-2">
                                Select the date and time when your event will take place
                            </div>
                        </div>

                        {/* Participants */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="maxParticipants" className="block text-sm font-bold text-gray-900 mb-3">
                                    <Users size={16} className="inline mr-2 text-orange-600" />
                                    Maximum Participants *
                                </label>
                                <input
                                    type="number"
                                    id="maxParticipants"
                                    name="maxParticipants"
                                    value={formData.maxParticipants}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 text-gray-900 text-lg"
                                    placeholder="e.g., 50"
                                    min="1"
                                    max="10000"
                                />
                                {errors.maxParticipants && <div className="text-red-600 text-sm mt-2 font-medium">{errors.maxParticipants}</div>}
                            </div>

                            <div>
                                <label htmlFor="currentParticipants" className="block text-sm font-bold text-gray-900 mb-3">
                                    <Users size={16} className="inline mr-2 text-orange-600" />
                                    Current Participants
                                </label>
                                <input
                                    type="number"
                                    id="currentParticipants"
                                    name="currentParticipants"
                                    value={formData.currentParticipants}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 text-gray-900 text-lg"
                                    placeholder="0"
                                    min="0"
                                />
                                {errors.currentParticipants && <div className="text-red-600 text-sm mt-2 font-medium">{errors.currentParticipants}</div>}
                                <div className="text-gray-500 text-sm mt-2">
                                    Number of people already registered (optional)
                                </div>
                            </div>
                        </div>

                        {/* Preview */}
                        {formData.title && formData.date && (
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6">
                                <h4 className="font-bold text-gray-900 mb-4 text-lg">📋 Preview</h4>
                                <div className="space-y-3 text-gray-700">
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

                    <div className="border-t border-gray-200 p-8">
                        <div className="flex flex-col sm:flex-row gap-4 justify-end">
                            <Link
                                to="/"
                                className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-all duration-200 text-center"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Creating...
                                    </>
                                ) : (
                                    <>
                                        <Save size={16} />
                                        Create Event
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            {/* Tips */}
            <div className="mt-8 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-xl p-6">
                <h3 className="font-bold text-amber-900 mb-4 text-lg">💡 Tips for a Great Event</h3>
                <ul className="text-amber-800 space-y-2">
                    <li>• Write a clear, engaging title that describes your event</li>
                    <li>• Include specific details about what participants can expect</li>
                    <li>• Provide accurate location information or meeting details</li>
                    <li>• Set a realistic participant limit based on your venue/activity</li>
                    <li>• Consider time zones if this is an online event</li>
                </ul>
            </div>
        </div>
    );
};

export default CreateEvent;