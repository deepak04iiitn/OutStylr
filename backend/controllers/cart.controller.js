import { errorHandler } from "../utils/error.js";
import Cart from "../models/cart.model.js";
import Outfit from "../models/outfit.model.js";
import { v4 as uuidv4 } from 'uuid';

// Get user's cart
export const getCart = async (req, res, next) => {
    try {
        const cart = await Cart.findOne({ userId: req.user.id })
            .populate('outfits.outfitId', 'image category section username items rateLook')
            .populate('savedOutfits.outfitId', 'image category section username items rateLook');

        if (!cart) {
            // Create empty cart if doesn't exist
            const newCart = new Cart({
                userId: req.user.id,
                outfits: [],
                totalOutfits: 0,
                totalItems: 0,
                totalPrice: 0
            });
            
            const savedCart = await newCart.save();
            return res.status(200).json(savedCart);
        }

        res.status(200).json(cart);

    } catch (error) {
        next(error);
    }
};

// Add complete outfit to cart
export const addOutfitToCart = async (req, res, next) => {
    try {
        const { 
            outfitId, 
            quantity = 1,
            notes = ''
        } = req.body;

        // Validate required fields
        if (!outfitId) {
            return next(errorHandler(400, 'Outfit ID is required!'));
        }

        // Validate quantity
        if (quantity < 1 || quantity > 10) {
            return next(errorHandler(400, 'Quantity must be between 1 and 10 for complete outfits!'));
        }

        // Check if outfit exists and populate creator info
        const outfit = await Outfit.findById(outfitId).populate('userId', 'username fullName');
        if (!outfit) {
            return next(errorHandler(404, 'Outfit not found!'));
        }

        if (!outfit.isActive) {
            return next(errorHandler(400, 'This outfit is no longer available!'));
        }

        if (!outfit.items || outfit.items.length === 0) {
            return next(errorHandler(400, 'This outfit has no items!'));
        }

        // Get or create cart
        let cart = await Cart.findOne({ userId: req.user.id });
        if (!cart) {
            cart = new Cart({
                userId: req.user.id,
                outfits: [],
                totalOutfits: 0,
                totalItems: 0,
                totalPrice: 0
            });
        }

        // Check if outfit already exists in cart
        const existingOutfitIndex = cart.outfits.findIndex(
            cartOutfit => cartOutfit.outfitId.toString() === outfitId
        );

        // Get creator name - handle different possible field names
        let creatorName = 'Unknown Creator';
        if (outfit.username) {
            creatorName = outfit.username;
        } else if (outfit.userId && outfit.userId.username) {
            creatorName = outfit.userId.username;
        } else if (outfit.userId && outfit.userId.fullName) {
            creatorName = outfit.userId.fullName;
        }

        if (existingOutfitIndex > -1) {
            // Update existing outfit quantity
            cart.outfits[existingOutfitIndex].quantity += quantity;
            
            // Update notes if provided
            if (notes) {
                cart.outfits[existingOutfitIndex].notes = notes;
            }
        } else {
            // Add new complete outfit to cart
            const newCartOutfit = {
                cartOutfitId: uuidv4(),
                outfitId: outfitId,
                outfitImage: outfit.image,
                outfitCategory: outfit.category,
                outfitSection: outfit.section,
                creatorName: creatorName, // Use the resolved creator name
                numberOfItems: outfit.numberOfItems,
                totalOutfitPrice: outfit.totalPrice,
                quantity: quantity,
                notes: notes,
                addedAt: new Date()
            };
            
            cart.outfits.push(newCartOutfit);
        }

        const updatedCart = await cart.save();
        
        // Populate outfit data for response
        const populatedCart = await Cart.findById(updatedCart._id)
            .populate('outfits.outfitId', 'image category section username items rateLook');

        res.status(200).json({
            message: 'Complete outfit added to cart successfully!',
            outfitName: `${outfit.category} - ${outfit.section} Outfit by ${creatorName}`,
            itemsIncluded: outfit.numberOfItems,
            cart: populatedCart
        });

    } catch (error) {
        next(error);
    }
};

// Remove outfit from cart
export const removeOutfitFromCart = async (req, res, next) => {
    try {
        const { cartOutfitId } = req.params;

        if (!cartOutfitId) {
            return next(errorHandler(400, 'Cart outfit ID is required!'));
        }

        const cart = await Cart.findOne({ userId: req.user.id });

        if (!cart) {
            return next(errorHandler(404, 'Cart not found!'));
        }

        const outfitIndex = cart.outfits.findIndex(outfit => outfit.cartOutfitId === cartOutfitId);

        if (outfitIndex === -1) {
            return next(errorHandler(404, 'Outfit not found in cart!'));
        }

        const removedOutfit = cart.outfits[outfitIndex];
        cart.outfits.splice(outfitIndex, 1);
        const updatedCart = await cart.save();

        const populatedCart = await Cart.findById(updatedCart._id)
            .populate('outfits.outfitId', 'image category section username items rateLook');

        res.status(200).json({
            message: 'Outfit removed from cart successfully!',
            removedOutfit: {
                name: `${removedOutfit.outfitCategory} - ${removedOutfit.outfitSection} Outfit`,
                items: removedOutfit.numberOfItems
            },
            cart: populatedCart
        });

    } catch (error) {
        next(error);
    }
};

// Update outfit quantity in cart
export const updateOutfitQuantity = async (req, res, next) => {
    try {
        const { cartOutfitId } = req.params;
        const { quantity } = req.body;

        if (!cartOutfitId) {
            return next(errorHandler(400, 'Cart outfit ID is required!'));
        }

        if (!quantity || quantity < 1 || quantity > 10) {
            return next(errorHandler(400, 'Quantity must be between 1 and 10 for complete outfits!'));
        }

        const cart = await Cart.findOne({ userId: req.user.id });

        if (!cart) {
            return next(errorHandler(404, 'Cart not found!'));
        }

        const outfit = cart.outfits.find(outfit => outfit.cartOutfitId === cartOutfitId);

        if (!outfit) {
            return next(errorHandler(404, 'Outfit not found in cart!'));
        }

        outfit.quantity = quantity;
        const updatedCart = await cart.save();

        const populatedCart = await Cart.findById(updatedCart._id)
            .populate('outfits.outfitId', 'image category section username items rateLook');

        res.status(200).json({
            message: 'Outfit quantity updated successfully!',
            cart: populatedCart
        });

    } catch (error) {
        next(error);
    }
};

// Update outfit notes
export const updateOutfitNotes = async (req, res, next) => {
    try {
        const { cartOutfitId } = req.params;
        const { notes = '' } = req.body;

        if (!cartOutfitId) {
            return next(errorHandler(400, 'Cart outfit ID is required!'));
        }

        const cart = await Cart.findOne({ userId: req.user.id });

        if (!cart) {
            return next(errorHandler(404, 'Cart not found!'));
        }

        const outfit = cart.outfits.find(outfit => outfit.cartOutfitId === cartOutfitId);

        if (!outfit) {
            return next(errorHandler(404, 'Outfit not found in cart!'));
        }

        outfit.notes = notes.substring(0, 200); // Limit notes to 200 characters

        const updatedCart = await cart.save();

        const populatedCart = await Cart.findById(updatedCart._id)
            .populate('outfits.outfitId', 'image category section username items rateLook');

        res.status(200).json({
            message: 'Outfit notes updated successfully!',
            cart: populatedCart
        });

    } catch (error) {
        next(error);
    }
};

// Clear entire cart
export const clearCart = async (req, res, next) => {
    try {
        const cart = await Cart.findOne({ userId: req.user.id });

        if (!cart) {
            return next(errorHandler(404, 'Cart not found!'));
        }

        const clearedOutfitCount = cart.outfits.length;
        
        cart.outfits = [];
        
        const updatedCart = await cart.save();

        res.status(200).json({
            message: `Cart cleared successfully! Removed ${clearedOutfitCount} outfit${clearedOutfitCount !== 1 ? 's' : ''}.`,
            cart: updatedCart
        });

    } catch (error) {
        next(error);
    }
};

// Get cart summary/statistics
export const getCartSummary = async (req, res, next) => {
    try {
        const cart = await Cart.findOne({ userId: req.user.id });

        if (!cart) {
            return res.status(200).json({
                totalOutfits: 0,
                totalItems: 0,
                totalPrice: 0,
                currency: 'USD'
            });
        }

        const summary = {
            totalOutfits: cart.totalOutfits,
            totalItems: cart.totalItems,
            totalPrice: cart.totalPrice,
            currency: cart.currency,
            outfitBreakdown: cart.outfits.map(outfit => ({
                category: outfit.outfitCategory,
                section: outfit.outfitSection,
                creator: outfit.creatorName,
                items: outfit.numberOfItems,
                quantity: outfit.quantity,
                price: outfit.totalOutfitPrice * outfit.quantity
            }))
        };

        res.status(200).json(summary);

    } catch (error) {
        next(error);
    }
};

// Move outfit to saved for later
export const moveOutfitToSaved = async (req, res, next) => {
    try {
        const { cartOutfitId } = req.params;

        if (!cartOutfitId) {
            return next(errorHandler(400, 'Cart outfit ID is required!'));
        }

        const cart = await Cart.findOne({ userId: req.user.id });

        if (!cart) {
            return next(errorHandler(404, 'Cart not found!'));
        }

        const outfitIndex = cart.outfits.findIndex(outfit => outfit.cartOutfitId === cartOutfitId);

        if (outfitIndex === -1) {
            return next(errorHandler(404, 'Outfit not found in cart!'));
        }

        const outfit = cart.outfits[outfitIndex];
        
        // Add to saved outfits
        cart.savedOutfits.push({
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
        cart.outfits.splice(outfitIndex, 1);
        
        const updatedCart = await cart.save();

        const populatedCart = await Cart.findById(updatedCart._id)
            .populate('outfits.outfitId', 'image category section username items rateLook')
            .populate('savedOutfits.outfitId', 'image category section username items rateLook');

        res.status(200).json({
            message: 'Outfit moved to saved for later!',
            cart: populatedCart
        });

    } catch (error) {
        next(error);
    }
};

// Move outfit back to cart from saved
export const moveOutfitBackToCart = async (req, res, next) => {
    try {
        const { savedOutfitId } = req.params;
        const { quantity = 1, notes = '' } = req.body;

        if (!savedOutfitId) {
            return next(errorHandler(400, 'Saved outfit ID is required!'));
        }

        if (quantity < 1 || quantity > 10) {
            return next(errorHandler(400, 'Quantity must be between 1 and 10!'));
        }

        const cart = await Cart.findOne({ userId: req.user.id });

        if (!cart) {
            return next(errorHandler(404, 'Cart not found!'));
        }

        const savedOutfitIndex = cart.savedOutfits.findIndex(outfit => outfit.cartOutfitId === savedOutfitId);

        if (savedOutfitIndex === -1) {
            return next(errorHandler(404, 'Saved outfit not found!'));
        }

        const savedOutfit = cart.savedOutfits[savedOutfitIndex];
        
        // Add back to cart
        cart.outfits.push({
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
        
        // Remove from saved outfits
        cart.savedOutfits.splice(savedOutfitIndex, 1);
        
        const updatedCart = await cart.save();

        const populatedCart = await Cart.findById(updatedCart._id)
            .populate('outfits.outfitId', 'image category section username items rateLook')
            .populate('savedOutfits.outfitId', 'image category section username items rateLook');

        res.status(200).json({
            message: 'Outfit moved back to cart!',
            cart: populatedCart
        });

    } catch (error) {
        next(error);
    }
};

// Remove outfit from saved for later
export const removeSavedOutfit = async (req, res, next) => {
    try {
        const { savedOutfitId } = req.params;

        if (!savedOutfitId) {
            return next(errorHandler(400, 'Saved outfit ID is required!'));
        }

        const cart = await Cart.findOne({ userId: req.user.id });

        if (!cart) {
            return next(errorHandler(404, 'Cart not found!'));
        }

        const savedOutfitIndex = cart.savedOutfits.findIndex(outfit => outfit.cartOutfitId === savedOutfitId);

        if (savedOutfitIndex === -1) {
            return next(errorHandler(404, 'Saved outfit not found!'));
        }

        const removedOutfit = cart.savedOutfits[savedOutfitIndex];
        cart.savedOutfits.splice(savedOutfitIndex, 1);
        const updatedCart = await cart.save();

        const populatedCart = await Cart.findById(updatedCart._id)
            .populate('outfits.outfitId', 'image category section username items rateLook')
            .populate('savedOutfits.outfitId', 'image category section username items rateLook');

        res.status(200).json({
            message: 'Saved outfit removed successfully!',
            removedOutfit: {
                name: `${removedOutfit.outfitCategory} - ${removedOutfit.outfitSection} Outfit`,
                creator: removedOutfit.creatorName
            },
            cart: populatedCart
        });

    } catch (error) {
        next(error);
    }
};

// Get cart count (for header/navbar)
export const getCartCount = async (req, res, next) => {
    try {
        const cart = await Cart.findOne({ userId: req.user.id });

        const outfitCount = cart ? cart.totalOutfits : 0;
        const itemCount = cart ? cart.totalItems : 0;

        res.status(200).json({ 
            outfitCount,
            itemCount
        });

    } catch (error) {
        next(error);
    }
};