import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';

// Reply Schema 
const replySchema = new mongoose.Schema({
    replyId: {
        type: String,
        default: uuidv4
    },
    userId: {
        type: String,
        required: true
    },
    userFullName: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    likes: {
        type: [String],
        default: []
    },
    dislikes: {
        type: [String],
        default: []
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, { 
    _id: false 
});

// Item Schema
const itemSchema = new mongoose.Schema({
    itemId: {
        type: String,
        default: uuidv4
    },
    sourceName: {
        type: String,
        required: true
    },
    itemName: {
        type: String,
        required: true
    },
    itemPrice: {
        type: Number,
        required: true
    },
    itemLink: {
        type: String,
        required: true
    }
}, { 
    _id: false 
});

// Comment Schema
const commentSchema = new mongoose.Schema({
    commentId: {
        type: String,
        default: uuidv4
    },
    userId: {
        type: String,
        required: true
    },
    userFullName: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    likes: {
        type: [String],
        default: []
    },
    dislikes: {
        type: [String],
        default: []
    },
    replies: [replySchema],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, { 
    _id: false 
});

// Main Outfit Schema
const outfitSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    userFullName: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: [
            "Casual", 
            "Formal", 
            "Party", 
            "Wedding", 
            "Festival", 
            "Ethnic", 
            "Western", 
            "Sports", 
            "Office", 
            "Date", 
            "Travel", 
            "Beach", 
            "Winter", 
            "Summer", 
            "Monsoon"
        ]
    },
    section: {
        type: String,
        required: true,
        enum: ["Men", "Women", "Kids", "Unisex"]
    },
    numberOfItems: {
        type: Number,
        required: true,
        min: 1,
        max: 20
    },
    items: {
        type: [itemSchema],
        required: true,
        validate: {
            validator: function(items) {
                return items.length === this.numberOfItems;
            },
            message: 'Number of items must match numberOfItems field'
        }
    },
    rateLook: {
        type: Number,
        required: true,
        min: 0,
        max: 5
    },
    numberOfClicks: {
        type: Number,
        default: 0
    },
    type: {
        type: String,
        required: true,
        enum: ["Normal", "Sponsored", "Promoted"],
        default: "Normal"
    },
    likes: {
        type: [String],
        default: []
    },
    numberOfLikes: {
        type: Number,
        default: 0
    },
    dislikes: {
        type: [String],
        default: []
    },
    numberOfDislikes: {
        type: Number,
        default: 0
    },
    comments: {
        type: [commentSchema],
        default: []
    },
    numberOfComments: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    },
    tags: {
        type: [String],
        default: []
    },
    description: {
        type: String,
        maxlength: 500
    },
    totalPrice: {
        type: Number,
        default: 0
    }
}, { 
    timestamps: true 
});

// Pre-save middleware to calculate total price
outfitSchema.pre('save', function(next) {
    if (this.items && this.items.length > 0) {
        this.totalPrice = this.items.reduce((total, item) => total + item.itemPrice, 0);
    }
    next();
});

// Pre-update middleware to calculate total price
outfitSchema.pre('findOneAndUpdate', function(next) {
    const update = this.getUpdate();
    if (update.$set && update.$set.items) {
        const totalPrice = update.$set.items.reduce((total, item) => total + item.itemPrice, 0);
        update.$set.totalPrice = totalPrice;
    }
    next();
});

// Database indexes for better performance
outfitSchema.index({ userId: 1 });
outfitSchema.index({ category: 1 });
outfitSchema.index({ section: 1 });
outfitSchema.index({ type: 1 });
outfitSchema.index({ createdAt: -1 });
outfitSchema.index({ numberOfLikes: -1 });
outfitSchema.index({ numberOfClicks: -1 });

// Create and export the model
const Outfit = mongoose.model('Outfit', outfitSchema);
export default Outfit;