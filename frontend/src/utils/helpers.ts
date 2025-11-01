// Format date for display
export const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

// Format date for input field (YYYY-MM-DDTHH:MM)
export const formatDateForInput = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16);
};

// Get current date in input format
export const getCurrentDateForInput = (): string => {
    const now = new Date();
    return now.toISOString().slice(0, 16);
};

// Check if event date is in the past
export const isEventInPast = (dateString: string): boolean => {
    return new Date(dateString) < new Date();
};

// Validate form data
export const validateEventForm = (data: {
    title: string;
    description: string;
    location: string;
    date: string;
    maxParticipants: string;
    currentParticipants: string;
}): { isValid: boolean; errors: Record<string, string> } => {
    const errors: Record<string, string> = {};

    // Title validation
    if (!data.title.trim()) {
        errors.title = 'Title is required';
    } else if (data.title.trim().length < 3) {
        errors.title = 'Title must be at least 3 characters';
    }

    // Description validation
    if (!data.description.trim()) {
        errors.description = 'Description is required';
    } else if (data.description.trim().length < 10) {
        errors.description = 'Description must be at least 10 characters';
    }

    // Location validation
    if (!data.location.trim()) {
        errors.location = 'Location is required';
    }

    // Date validation
    if (!data.date) {
        errors.date = 'Date is required';
    } else if (new Date(data.date) <= new Date()) {
        errors.date = 'Date must be in the future';
    }

    // Max participants validation
    const maxParticipants = parseInt(data.maxParticipants);
    if (!data.maxParticipants || isNaN(maxParticipants) || maxParticipants < 1) {
        errors.maxParticipants = 'Maximum participants must be at least 1';
    }

    // Current participants validation
    const currentParticipants = parseInt(data.currentParticipants);
    if (data.currentParticipants && (isNaN(currentParticipants) || currentParticipants < 0)) {
        errors.currentParticipants = 'Current participants must be 0 or greater';
    } else if (currentParticipants > maxParticipants) {
        errors.currentParticipants = 'Current participants cannot exceed maximum participants';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    };
};

// Truncate text with ellipsis
export const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};