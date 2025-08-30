import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';

// Cart Outfit Schema - for complete outfits
const cartOutfitSchema = new mongoose.Schema({
    cartOutfitId: {
        type: String,
        default: uuidv4
    },
    outfitId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Outfit',
        required: true
    },
    // Outfit basic info (cached for performance)
    outfitImage: {
        type: String,
        required: true
    },
    outfitCategory: {
        type: String,
        required: true
    },
    outfitSection: {
        type: String,
        required: true
    },
    creatorName: {
        type: String,
        required: true
    },
    numberOfItems: {
        type: Number,
        required: true
    },
    totalOutfitPrice: {
        type: Number,
        required: true
    },
    // Customer selections
    quantity: {
        type: Number,
        required: true,
        min: 1,
        max: 10,
        default: 1
    },
    notes: {
        type: String,
        maxLength: 200,
        default: ''
    },
    addedAt: {
        type: Date,
        default: Date.now
    }
}, { 
    _id: false 
});

// Saved Outfit Schema - for saved for later outfits
const savedOutfitSchema = new mongoose.Schema({
    cartOutfitId: {
        type: String,
        required: true
    },
    outfitId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Outfit',
        required: true
    },
    outfitImage: String,
    outfitCategory: String,
    outfitSection: String,
    creatorName: String,
    numberOfItems: Number,
    totalOutfitPrice: Number,
    savedAt: {
        type: Date,
        default: Date.now
    }
}, { 
    _id: false 
});

// Main Cart Schema - Updated for outfit-first approach
const cartSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true
    },
    // Complete outfits in cart
    outfits: [cartOutfitSchema],
    
    // Cart totals
    totalOutfits: {
        type: Number,
        default: 0
    },
    totalItems: {
        type: Number,
        default: 0
    },
    totalPrice: {
        type: Number,
        default: 0
    },
    currency: {
        type: String,
        default: 'USD'
    },
    lastModified: {
        type: Date,
        default: Date.now
    },
    
    // For guest users (optional)
    sessionId: {
        type: String,
        default: null
    },
    
    // Saved outfits (saved for later)
    savedOutfits: [savedOutfitSchema]
}, { 
    timestamps: true 
});

// Pre-save middleware to calculate totals
cartSchema.pre('save', function(next) {
    // Calculate total outfits
    this.totalOutfits = this.outfits.reduce((total, outfit) => total + outfit.quantity, 0);
    
    // Calculate total items (all items in all outfits)
    this.totalItems = this.outfits.reduce((total, outfit) => 
        total + (outfit.numberOfItems * outfit.quantity), 0
    );
    
    // Calculate total price
    this.totalPrice = this.outfits.reduce((total, outfit) => 
        total + (outfit.totalOutfitPrice * outfit.quantity), 0
    );
    
    this.lastModified = new Date();
    next();
});

// Instance methods for outfit operations
cartSchema.methods.addCompleteOutfit = function(outfitData) {
    const existingOutfitIndex = this.outfits.findIndex(
        outfit => outfit.outfitId.toString() === outfitData.outfitId.toString()
    );

    if (existingOutfitIndex > -1) {
        // Update existing outfit quantity
        this.outfits[existingOutfitIndex].quantity += outfitData.quantity || 1;
        
        // Update notes if provided
        if (outfitData.notes) {
            this.outfits[existingOutfitIndex].notes = outfitData.notes;
        }
    } else {
        // Add new complete outfit
        this.outfits.push({
            ...outfitData,
            cartOutfitId: uuidv4(),
            addedAt: new Date()
        });
    }

    return this.save();
};

cartSchema.methods.removeOutfit = function(cartOutfitId) {
    this.outfits = this.outfits.filter(outfit => outfit.cartOutfitId !== cartOutfitId);
    return this.save();
};

cartSchema.methods.updateOutfitQuantity = function(cartOutfitId, quantity) {
    const outfit = this.outfits.find(outfit => outfit.cartOutfitId === cartOutfitId);
    if (outfit) {
        if (quantity <= 0) {
            return this.removeOutfit(cartOutfitId);
        } else if (quantity > 10) {
            throw new Error('Maximum 10 quantities allowed for complete outfits');
        } else {
            outfit.quantity = quantity;
            return this.save();
        }
    }
    throw new Error('Outfit not found in cart');
};

cartSchema.methods.updateOutfitNotes = function(cartOutfitId, notes = '') {
    const outfit = this.outfits.find(outfit => outfit.cartOutfitId === cartOutfitId);
    if (outfit) {
        outfit.notes = notes.substring(0, 200);
        return this.save();
    }
    throw new Error('Outfit not found in cart');
};

cartSchema.methods.clearCart = function() {
    this.outfits = [];
    return this.save();
};

cartSchema.methods.moveOutfitToSavedForLater = function(cartOutfitId) {
    const outfitIndex = this.outfits.findIndex(outfit => outfit.cartOutfitId === cartOutfitId);
    
    if (outfitIndex > -1) {
        const outfit = this.outfits[outfitIndex];
        
        // Add to saved for later
        this.savedOutfits.push({
            cartOutfitId: outfit.cartOutfitId,
            outfitId: outfit.outfitId,
            outfitImage: outfit.outfitImage,
            outfitCategory: outfit.outfitCategory,
            outfitSection: outfit.outfitSection,
            creatorName: outfit.creatorName,
            numberOfItems: outfit.numberOfItems,
            totalOutfitPrice: outfit.totalOutfitPrice,
            savedAt: new Date()
        });
        
        // Remove from cart
        this.outfits.splice(outfitIndex, 1);
        
        return this.save();
    }
    throw new Error('Outfit not found in cart');
};

cartSchema.methods.moveOutfitBackToCart = function(savedOutfitId, quantity = 1, notes = '') {
    const savedOutfitIndex = this.savedOutfits.findIndex(outfit => outfit.cartOutfitId === savedOutfitId);
    
    if (savedOutfitIndex > -1) {
        const savedOutfit = this.savedOutfits[savedOutfitIndex];
        
        // Add back to cart
        this.outfits.push({
            cartOutfitId: uuidv4(),
            outfitId: savedOutfit.outfitId,
            outfitImage: savedOutfit.outfitImage,
            outfitCategory: savedOutfit.outfitCategory,
            outfitSection: savedOutfit.outfitSection,
            creatorName: savedOutfit.creatorName,
            numberOfItems: savedOutfit.numberOfItems,
            totalOutfitPrice: savedOutfit.totalOutfitPrice,
            quantity,
            notes: notes,
            addedAt: new Date()
        });
        
        // Remove from saved for later
        this.savedOutfits.splice(savedOutfitIndex, 1);
        
        return this.save();
    }
    throw new Error('Saved outfit not found');
};

// Static methods
cartSchema.statics.createOrGetCart = async function(userId, sessionId = null) {
    let cart = await this.findOne({ userId });
    
    if (!cart) {
        cart = new this({
            userId,
            sessionId,
            outfits: [],
            totalOutfits: 0,
            totalItems: 0,
            totalPrice: 0
        });
        await cart.save();
    }
    
    return cart;
};

// Method to get detailed cart with all outfit items
cartSchema.methods.getDetailedCart = async function() {
    await this.populate('outfits.outfitId', 'image category section username items rateLook');
    await this.populate('savedOutfits.outfitId', 'image category section username items rateLook');
    
    // Transform outfits to include individual item details
    const detailedOutfits = this.outfits.map(cartOutfit => {
        const outfit = cartOutfit.outfitId;
        return {
            ...cartOutfit.toObject(),
            outfitDetails: outfit ? {
                items: outfit.items,
                rateLook: outfit.rateLook
            } : null
        };
    });
    
    return {
        ...this.toObject(),
        outfits: detailedOutfits
    };
};

// Indexes for better performance
cartSchema.index({ userId: 1 });
cartSchema.index({ sessionId: 1 });
cartSchema.index({ lastModified: -1 });
cartSchema.index({ 'outfits.outfitId': 1 });

// Create and export the model
const Cart = mongoose.model('Cart', cartSchema);
export default Cart;