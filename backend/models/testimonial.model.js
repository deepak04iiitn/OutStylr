import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';

// Testimonial Schema
const testimonialSchema = new mongoose.Schema({
    testimonialId: {
        type: String,
        default: uuidv4,
        unique: true
    },
    userId: {
        type: String,
        required: true
    },
    userFullName: {
        type: String,
        required: true
    },
    userProfilePicture: {
        type: String,
        default: ''
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    title: {
        type: String,
        required: true,
        maxlength: 100
    },
    content: {
        type: String,
        required: true,
        maxlength: 500
    },
    location: {
        type: String,
        maxlength: 100,
        default: ''
    },
    occupation: {
        type: String,
        maxlength: 100,
        default: ''
    },
    isApproved: {
        type: Boolean,
        default: false
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    },
    approvedBy: {
        type: String,
        default: null
    },
    approvedAt: {
        type: Date,
        default: null
    },
    likes: {
        type: [String],
        default: []
    },
    numberOfLikes: {
        type: Number,
        default: 0
    },
    displayOrder: {
        type: Number,
        default: 0
    }
}, { 
    timestamps: true 
});

// Database indexes for better performance
testimonialSchema.index({ userId: 1 });
testimonialSchema.index({ isApproved: 1 });
testimonialSchema.index({ isFeatured: 1 });
testimonialSchema.index({ isActive: 1 });
testimonialSchema.index({ rating: -1 });
testimonialSchema.index({ createdAt: -1 });
testimonialSchema.index({ displayOrder: 1 });

// Compound indexes
testimonialSchema.index({ isApproved: 1, isActive: 1, isFeatured: -1 });
testimonialSchema.index({ isApproved: 1, isActive: 1, rating: -1 });

// Create and export the model
const Testimonial = mongoose.model('Testimonial', testimonialSchema);
export default Testimonial;