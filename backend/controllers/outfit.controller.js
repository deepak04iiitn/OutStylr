import { errorHandler } from "../utils/error.js";
import Outfit from "../models/outfit.model.js";
import User from "../models/user.model.js";
import { v4 as uuidv4 } from 'uuid';
import { deleteImageFromCloudinary, extractPublicIdFromUrl } from '../config/cloudinary.js';

// Create new outfit (Admin only)
export const createOutfit = async (req, res, next) => {
    // Only admins can create outfits
    if (!req.user.isUserAdmin) {
        return next(errorHandler(403, 'Only admins can create outfits!'));
    }

    try {
        // Check if image was uploaded
        if (!req.file) {
            return next(errorHandler(400, 'Image is required!'));
        }

        const { 
            category, 
            section, 
            numberOfItems, 
            items, 
            rateLook,
            type = "Normal",
            tags = [],
            description
        } = req.body;

        // Parse items if it's a string (from form data)
        let parsedItems = items;
        if (typeof items === 'string') {
            try {
                parsedItems = JSON.parse(items);
            } catch (error) {
                return next(errorHandler(400, 'Invalid items format!'));
            }
        }

        // Parse tags if it's a string
        let parsedTags = tags;
        if (typeof tags === 'string') {
            try {
                parsedTags = JSON.parse(tags);
            } catch (error) {
                parsedTags = tags.split(',').map(tag => tag.trim());
            }
        }

        // Validation
        if (!category || !section || !numberOfItems || !parsedItems || rateLook === undefined) {
            return next(errorHandler(400, 'All required fields must be provided including rating!'));
        }

        const numItems = parseInt(numberOfItems);
        const rating = parseFloat(rateLook);

        if (rating < 0 || rating > 5) {
            return next(errorHandler(400, 'Rating must be between 0 and 5!'));
        }

        if (parsedItems.length !== numItems) {
            return next(errorHandler(400, 'Number of items must match the items array length!'));
        }

        // Validate items
        for (const item of parsedItems) {
            if (!item.sourceName || !item.itemName || !item.itemPrice || !item.itemLink) {
                return next(errorHandler(400, 'All item fields are required!'));
            }
        }

        const newOutfit = new Outfit({
            userId: req.user.id,
            image: req.file.path, // Cloudinary URL
            category,
            section,
            numberOfItems: numItems,
            items: parsedItems,
            rateLook: rating,
            type,
            tags: parsedTags,
            description
        });

        const savedOutfit = await newOutfit.save();
        res.status(201).json(savedOutfit);

    } catch (error) {
        next(error);
    }
};


// Get all outfits with filtering and pagination
export const getOutfits = async (req, res, next) => {
    try {
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 9;
        const sortDirection = req.query.sort === 'asc' ? 1 : -1;
        const sortBy = req.query.sortBy || 'createdAt';

        // Build filter object
        const filter = { isActive: true };
        
        if (req.query.userId) filter.userId = req.query.userId;
        if (req.query.category) filter.category = req.query.category;
        if (req.query.section) filter.section = req.query.section;
        if (req.query.type) filter.type = req.query.type;
        if (req.query.searchTerm) {
            filter.$or = [
                { description: { $regex: req.query.searchTerm, $options: 'i' } },
                { tags: { $in: [new RegExp(req.query.searchTerm, 'i')] } }
            ];
        }

        // Date filter
        if (req.query.date) {
            const start = new Date(req.query.date);
            if (!isNaN(start.getTime())) {
                const end = new Date(start);
                end.setDate(end.getDate() + 1);
                filter.createdAt = { $gte: start, $lt: end };
            }
        }

        const sortObj = {};
        sortObj[sortBy] = sortDirection;

        const outfits = await Outfit.find(filter)
            .sort(sortObj)
            .skip(startIndex)
            .limit(limit);

        const totalOutfits = await Outfit.countDocuments();
        const matchedCount = await Outfit.countDocuments(filter);

        // Get statistics
        const now = new Date();
        const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

        const lastMonthOutfits = await Outfit.countDocuments({
            createdAt: { $gte: oneMonthAgo },
            isActive: true
        });

        res.status(200).json({
            outfits,
            totalOutfits,
            lastMonthOutfits,
            matchedCount
        });

    } catch (error) {
        next(error);
    }
};


// Get single outfit by ID
export const getOutfit = async (req, res, next) => {
    try {
        const outfit = await Outfit.findById(req.params.outfitId);

        if (!outfit) {
            return next(errorHandler(404, 'Outfit not found!'));
        }

        // Increment click count
        await Outfit.findByIdAndUpdate(
            req.params.outfitId,
            { $inc: { numberOfClicks: 1 } }
        );

        res.status(200).json(outfit);

    } catch (error) {
        next(error);
    }
};


// Update outfit (Admin only)
export const updateOutfit = async (req, res, next) => {
    // Only admins can update outfits
    if (!req.user.isUserAdmin) {
        return next(errorHandler(403, 'Only admins can update outfits!'));
    }

    try {
        const outfit = await Outfit.findById(req.params.outfitId);

        if (!outfit) {
            return next(errorHandler(404, 'Outfit not found!'));
        }

        const updateData = { ...req.body };

        // Handle image update
        if (req.file) {
            // Delete old image from Cloudinary if it exists
            if (outfit.image) {
                const oldPublicId = extractPublicIdFromUrl(outfit.image);
                if (oldPublicId) {
                    try {
                        await deleteImageFromCloudinary(oldPublicId);
                    } catch (error) {
                        console.error('Error deleting old image:', error);
                        // Continue with update even if old image deletion fails
                    }
                }
            }
            updateData.image = req.file.path; // New Cloudinary URL
        }

        // Parse items if it's a string
        if (updateData.items && typeof updateData.items === 'string') {
            try {
                updateData.items = JSON.parse(updateData.items);
            } catch (error) {
                return next(errorHandler(400, 'Invalid items format!'));
            }
        }

        // Parse tags if it's a string
        if (updateData.tags && typeof updateData.tags === 'string') {
            try {
                updateData.tags = JSON.parse(updateData.tags);
            } catch (error) {
                updateData.tags = updateData.tags.split(',').map(tag => tag.trim());
            }
        }

        // Convert string numbers to actual numbers
        if (updateData.numberOfItems) {
            updateData.numberOfItems = parseInt(updateData.numberOfItems);
        }
        if (updateData.rateLook !== undefined) {
            updateData.rateLook = parseFloat(updateData.rateLook);
        }

        // Validate rating if being updated
        if (updateData.rateLook !== undefined && (updateData.rateLook < 0 || updateData.rateLook > 5)) {
            return next(errorHandler(400, 'Rating must be between 0 and 5!'));
        }

        // Validate items if being updated
        if (updateData.items) {
            if (updateData.numberOfItems && updateData.items.length !== updateData.numberOfItems) {
                return next(errorHandler(400, 'Number of items must match the items array length!'));
            }

            for (const item of updateData.items) {
                if (!item.sourceName || !item.itemName || !item.itemPrice || !item.itemLink) {
                    return next(errorHandler(400, 'All item fields are required!'));
                }
            }
        }

        const updatedOutfit = await Outfit.findByIdAndUpdate(
            req.params.outfitId,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        res.status(200).json(updatedOutfit);

    } catch (error) {
        next(error);
    }
};


// Delete outfit (Admin only)
export const deleteOutfit = async (req, res, next) => {
    // Only admins can delete outfits
    if (!req.user.isUserAdmin) {
        return next(errorHandler(403, 'Only admins can delete outfits!'));
    }

    try {
        const outfit = await Outfit.findById(req.params.outfitId);

        if (!outfit) {
            return next(errorHandler(404, 'Outfit not found!'));
        }

        // Delete image from Cloudinary
        if (outfit.image) {
            const publicId = extractPublicIdFromUrl(outfit.image);
            if (publicId) {
                try {
                    await deleteImageFromCloudinary(publicId);
                } catch (error) {
                    console.error('Error deleting image from Cloudinary:', error);
                    // Continue with outfit deletion even if image deletion fails
                }
            }
        }

        // Admin can hard delete
        await Outfit.findByIdAndDelete(req.params.outfitId);
        res.status(200).json('Outfit has been deleted permanently!');

    } catch (error) {
        next(error);
    }
};


// Like/Unlike outfit
export const toggleLike = async (req, res, next) => {
    try {
        const outfit = await Outfit.findById(req.params.outfitId);

        if (!outfit) {
            return next(errorHandler(404, 'Outfit not found!'));
        }

        const userId = req.user.id;
        const hasLiked = outfit.likes.includes(userId);
        const hasDisliked = outfit.dislikes.includes(userId);

        if (hasLiked) {
            // Remove like
            outfit.likes = outfit.likes.filter(id => id !== userId);
            outfit.numberOfLikes -= 1;
        } else {
            // Add like and remove dislike if exists
            outfit.likes.push(userId);
            outfit.numberOfLikes += 1;
            
            if (hasDisliked) {
                outfit.dislikes = outfit.dislikes.filter(id => id !== userId);
                outfit.numberOfDislikes -= 1;
            }
        }

        const updatedOutfit = await outfit.save();
        res.status(200).json(updatedOutfit);

    } catch (error) {
        next(error);
    }
};


// Dislike/Remove dislike outfit
export const toggleDislike = async (req, res, next) => {
    try {
        const outfit = await Outfit.findById(req.params.outfitId);

        if (!outfit) {
            return next(errorHandler(404, 'Outfit not found!'));
        }

        const userId = req.user.id;
        const hasLiked = outfit.likes.includes(userId);
        const hasDisliked = outfit.dislikes.includes(userId);

        if (hasDisliked) {
            // Remove dislike
            outfit.dislikes = outfit.dislikes.filter(id => id !== userId);
            outfit.numberOfDislikes -= 1;
        } else {
            // Add dislike and remove like if exists
            outfit.dislikes.push(userId);
            outfit.numberOfDislikes += 1;
            
            if (hasLiked) {
                outfit.likes = outfit.likes.filter(id => id !== userId);
                outfit.numberOfLikes -= 1;
            }
        }

        const updatedOutfit = await outfit.save();
        res.status(200).json(updatedOutfit);

    } catch (error) {
        next(error);
    }
};


// Add comment
export const addComment = async (req, res, next) => {
    try {
        const { text } = req.body;

        if (!text || text.trim().length === 0) {
            return next(errorHandler(400, 'Comment text is required!'));
        }

        // // Debug: Log the user object
        // console.log('req.user object:', req.user);
        // console.log('req.user.username:', req.user.username);
        // console.log('req.user.fullName:', req.user.fullName);

        const outfit = await Outfit.findById(req.params.outfitId);

        if (!outfit) {
            return next(errorHandler(404, 'Outfit not found!'));
        }

        // Ensure we have a valid username
        const username = req.user.username || req.user.fullName || req.user.name || 'Anonymous';
        
        if (!username || username === 'Anonymous') {
            return next(errorHandler(400, 'User must have a valid username or name!'));
        }

        const newComment = {
            commentId: uuidv4(),
            userId: req.user.id,
            username: username, // Use the validated username
            text: text.trim(),
            likes: [],
            dislikes: [],
            replies: [],
            createdAt: new Date(),
            updatedAt: new Date()
        };

        outfit.comments.push(newComment);
        outfit.numberOfComments += 1;

        const updatedOutfit = await outfit.save();
        res.status(200).json(updatedOutfit);

    } catch (error) {
        next(error);
    }
};


// Delete comment (Admin or comment owner)
export const deleteComment = async (req, res, next) => {
    try {
        const { commentId } = req.params;
        const outfit = await Outfit.findById(req.params.outfitId);

        if (!outfit) {
            return next(errorHandler(404, 'Outfit not found!'));
        }

        const commentIndex = outfit.comments.findIndex(
            comment => comment.commentId === commentId
        );

        if (commentIndex === -1) {
            return next(errorHandler(404, 'Comment not found!'));
        }

        const comment = outfit.comments[commentIndex];

        // Check permissions - admin can delete any comment, users can delete their own
        if (!req.user.isUserAdmin && comment.userId !== req.user.id) {
            return next(errorHandler(403, 'You can only delete your own comments!'));
        }

        outfit.comments.splice(commentIndex, 1);
        outfit.numberOfComments -= 1;

        const updatedOutfit = await outfit.save();
        res.status(200).json(updatedOutfit);

    } catch (error) {
        next(error);
    }
};


// Toggle like on comment
export const toggleCommentLike = async (req, res, next) => {
    try {
        const { outfitId, commentId } = req.params;
        const outfit = await Outfit.findById(outfitId);

        if (!outfit) {
            return next(errorHandler(404, 'Outfit not found!'));
        }

        const comment = outfit.comments.find(c => c.commentId === commentId);
        
        if (!comment) {
            return next(errorHandler(404, 'Comment not found!'));
        }

        const userId = req.user.id;
        const hasLiked = comment.likes.includes(userId);
        const hasDisliked = comment.dislikes.includes(userId);

        if (hasLiked) {
            // Remove like
            comment.likes = comment.likes.filter(id => id !== userId);
        } else {
            // Add like and remove dislike if exists
            comment.likes.push(userId);
            
            if (hasDisliked) {
                comment.dislikes = comment.dislikes.filter(id => id !== userId);
            }
        }

        comment.updatedAt = new Date();
        const updatedOutfit = await outfit.save();
        res.status(200).json(updatedOutfit);

    } catch (error) {
        next(error);
    }
};

// Toggle dislike on comment
export const toggleCommentDislike = async (req, res, next) => {
    try {
        const { outfitId, commentId } = req.params;
        const outfit = await Outfit.findById(outfitId);

        if (!outfit) {
            return next(errorHandler(404, 'Outfit not found!'));
        }

        const comment = outfit.comments.find(c => c.commentId === commentId);
        
        if (!comment) {
            return next(errorHandler(404, 'Comment not found!'));
        }

        const userId = req.user.id;
        const hasLiked = comment.likes.includes(userId);
        const hasDisliked = comment.dislikes.includes(userId);

        if (hasDisliked) {
            // Remove dislike
            comment.dislikes = comment.dislikes.filter(id => id !== userId);
        } else {
            // Add dislike and remove like if exists
            comment.dislikes.push(userId);
            
            if (hasLiked) {
                comment.likes = comment.likes.filter(id => id !== userId);
            }
        }

        comment.updatedAt = new Date();
        const updatedOutfit = await outfit.save();
        res.status(200).json(updatedOutfit);

    } catch (error) {
        next(error);
    }
};

// Add reply to comment
export const addReply = async (req, res, next) => {
    try {
        const { outfitId, commentId } = req.params;
        const { text } = req.body;

        if (!text || text.trim().length === 0) {
            return next(errorHandler(400, 'Reply text is required!'));
        }

        const outfit = await Outfit.findById(outfitId);

        if (!outfit) {
            return next(errorHandler(404, 'Outfit not found!'));
        }

        const comment = outfit.comments.find(c => c.commentId === commentId);
        
        if (!comment) {
            return next(errorHandler(404, 'Comment not found!'));
        }

        const newReply = {
            replyId: uuidv4(),
            userId: req.user.id,
            username: req.user.username,
            text: text.trim(),
            likes: [],
            dislikes: [],
            createdAt: new Date(),
            updatedAt: new Date()
        };

        comment.replies.push(newReply);
        comment.updatedAt = new Date();

        const updatedOutfit = await outfit.save();
        res.status(200).json(updatedOutfit);

    } catch (error) {
        next(error);
    }
};

// Delete reply (Admin or reply owner)
export const deleteReply = async (req, res, next) => {
    try {
        const { outfitId, commentId, replyId } = req.params;
        const outfit = await Outfit.findById(outfitId);

        if (!outfit) {
            return next(errorHandler(404, 'Outfit not found!'));
        }

        const comment = outfit.comments.find(c => c.commentId === commentId);
        
        if (!comment) {
            return next(errorHandler(404, 'Comment not found!'));
        }

        const replyIndex = comment.replies.findIndex(r => r.replyId === replyId);

        if (replyIndex === -1) {
            return next(errorHandler(404, 'Reply not found!'));
        }

        const reply = comment.replies[replyIndex];

        // Check permissions - admin can delete any reply, users can delete their own
        if (!req.user.isUserAdmin && reply.userId !== req.user.id) {
            return next(errorHandler(403, 'You can only delete your own replies!'));
        }

        comment.replies.splice(replyIndex, 1);
        comment.updatedAt = new Date();

        const updatedOutfit = await outfit.save();
        res.status(200).json(updatedOutfit);

    } catch (error) {
        next(error);
    }
};

// Toggle like on reply
export const toggleReplyLike = async (req, res, next) => {
    try {
        const { outfitId, commentId, replyId } = req.params;
        const outfit = await Outfit.findById(outfitId);

        if (!outfit) {
            return next(errorHandler(404, 'Outfit not found!'));
        }

        const comment = outfit.comments.find(c => c.commentId === commentId);
        
        if (!comment) {
            return next(errorHandler(404, 'Comment not found!'));
        }

        const reply = comment.replies.find(r => r.replyId === replyId);
        
        if (!reply) {
            return next(errorHandler(404, 'Reply not found!'));
        }

        const userId = req.user.id;
        const hasLiked = reply.likes.includes(userId);
        const hasDisliked = reply.dislikes.includes(userId);

        if (hasLiked) {
            // Remove like
            reply.likes = reply.likes.filter(id => id !== userId);
        } else {
            // Add like and remove dislike if exists
            reply.likes.push(userId);
            
            if (hasDisliked) {
                reply.dislikes = reply.dislikes.filter(id => id !== userId);
            }
        }

        reply.updatedAt = new Date();
        comment.updatedAt = new Date();
        
        const updatedOutfit = await outfit.save();
        res.status(200).json(updatedOutfit);

    } catch (error) {
        next(error);
    }
};

// Toggle dislike on reply
export const toggleReplyDislike = async (req, res, next) => {
    try {
        const { outfitId, commentId, replyId } = req.params;
        const outfit = await Outfit.findById(outfitId);

        if (!outfit) {
            return next(errorHandler(404, 'Outfit not found!'));
        }

        const comment = outfit.comments.find(c => c.commentId === commentId);
        
        if (!comment) {
            return next(errorHandler(404, 'Comment not found!'));
        }

        const reply = comment.replies.find(r => r.replyId === replyId);
        
        if (!reply) {
            return next(errorHandler(404, 'Reply not found!'));
        }

        const userId = req.user.id;
        const hasLiked = reply.likes.includes(userId);
        const hasDisliked = reply.dislikes.includes(userId);

        if (hasDisliked) {
            // Remove dislike
            reply.dislikes = reply.dislikes.filter(id => id !== userId);
        } else {
            // Add dislike and remove like if exists
            reply.dislikes.push(userId);
            
            if (hasLiked) {
                reply.likes = reply.likes.filter(id => id !== userId);
            }
        }

        reply.updatedAt = new Date();
        comment.updatedAt = new Date();
        
        const updatedOutfit = await outfit.save();
        res.status(200).json(updatedOutfit);

    } catch (error) {
        next(error);
    }
};


// Admin: Get all outfits (including inactive)
export const getAllOutfitsAdmin = async (req, res, next) => {
    if (!req.user.isUserAdmin) {
        return next(errorHandler(403, 'Access denied! Admin privileges required.'));
    }

    try {
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 9;
        const sortDirection = req.query.sort === 'asc' ? 1 : -1;

        const filter = {};
        if (req.query.userId) filter.userId = req.query.userId;
        if (req.query.category) filter.category = req.query.category;
        if (req.query.section) filter.section = req.query.section;
        if (req.query.type) filter.type = req.query.type;
        if (req.query.isActive !== undefined) filter.isActive = req.query.isActive === 'true';

        const outfits = await Outfit.find(filter)
            .sort({ createdAt: sortDirection })
            .skip(startIndex)
            .limit(limit);

        const totalOutfits = await Outfit.countDocuments();
        const activeOutfits = await Outfit.countDocuments({ isActive: true });
        const inactiveOutfits = await Outfit.countDocuments({ isActive: false });

        res.status(200).json({
            outfits,
            totalOutfits,
            activeOutfits,
            inactiveOutfits
        });

    } catch (error) {
        next(error);
    }
};

// Admin: Toggle outfit status
export const toggleOutfitStatus = async (req, res, next) => {
    if (!req.user.isUserAdmin) {
        return next(errorHandler(403, 'Access denied! Admin privileges required.'));
    }

    try {
        const outfit = await Outfit.findById(req.params.outfitId);

        if (!outfit) {
            return next(errorHandler(404, 'Outfit not found!'));
        }

        const updatedOutfit = await Outfit.findByIdAndUpdate(
            req.params.outfitId,
            { isActive: !outfit.isActive },
            { new: true }
        );

        res.status(200).json(updatedOutfit);

    } catch (error) {
        next(error);
    }
};

// Get trending outfits (top 10 by clicks)
export const getTrendingOutfits = async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        
        // Get top outfits by number of clicks, only active outfits
        const trendingOutfits = await Outfit.find({ isActive: true })
            .sort({ numberOfClicks: -1 })
            .limit(limit)
            .select('_id image category section numberOfClicks numberOfLikes numberOfComments rateLook totalPrice createdAt');

        // Get total count for statistics
        const totalActiveOutfits = await Outfit.countDocuments({ isActive: true });
        const totalClicks = await Outfit.aggregate([
            { $match: { isActive: true } },
            { $group: { _id: null, totalClicks: { $sum: "$numberOfClicks" } } }
        ]);

        res.status(200).json({
            trendingOutfits,
            totalActiveOutfits,
            totalClicks: totalClicks.length > 0 ? totalClicks[0].totalClicks : 0,
            limit
        });

    } catch (error) {
        next(error);
    }
};