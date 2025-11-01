import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        location: {
            type: String,
            required: true,
            trim: true,
        },
        date: {
            type: Date,
            required: true,
        },
        maxParticipants: {
            type: Number,
            required: true,
            min: 1,
        },
        currentParticipants: {
            type: Number,
            default: 0,
            min: 0,
        },
    },
    {
        timestamps: true,
    }
);

// Ensure currentParticipants doesn't exceed maxParticipants
eventSchema.pre('save', function (next) {
    if (this.currentParticipants > this.maxParticipants) {
        const error = new Error('Current participants cannot exceed maximum participants');
        return next(error);
    }
    next();
});

export const Event = mongoose.model('Event', eventSchema);