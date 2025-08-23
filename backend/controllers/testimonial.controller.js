import { errorHandler } from "../utils/error.js";
import Testimonial from "../models/testimonial.model.js";
import User from "../models/user.model.js";

// Create new testimonial (authenticated users)
export const createTestimonial = async (req, res, next) => {
    try {
        const { rating, title, content, location, occupation } = req.body;

        // Validation
        if (!rating || !title || !content) {
            return next(errorHandler(400, 'Rating, title, and content are required!'));
        }

        const ratingNum = parseInt(rating);
        if (ratingNum < 1 || ratingNum > 5) {
            return next(errorHandler(400, 'Rating must be between 1 and 5!'));
        }

        // Check if user already has a testimonial
        const existingTestimonial = await Testimonial.findOne({ 
            userId: req.user.id, 
            isActive: true 
        });

        if (existingTestimonial) {
            return next(errorHandler(400, 'You can only submit one testimonial!'));
        }

        // Get user profile picture
        const user = await User.findById(req.user.id);

        const newTestimonial = new Testimonial({
            userId: req.user.id,
            userFullName: req.user.fullName,
            userProfilePicture: user.profilePicture || '',
            rating: ratingNum,
            title: title.trim(),
            content: content.trim(),
            location: location ? location.trim() : '',
            occupation: occupation ? occupation.trim() : ''
        });

        const savedTestimonial = await newTestimonial.save();
        res.status(201).json({
            message: 'Testimonial submitted successfully! It will be reviewed by our team.',
            testimonial: savedTestimonial
        });

    } catch (error) {
        next(error);
    }
};

// Get approved testimonials for public display
export const getTestimonials = async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit) || 6;
        const featured = req.query.featured === 'true';
        const sortBy = req.query.sortBy || 'displayOrder';
        const sortDirection = req.query.sort === 'desc' ? -1 : 1;

        // Build filter for approved and active testimonials
        const filter = { 
            isApproved: true, 
            isActive: true 
        };

        if (featured) {
            filter.isFeatured = true;
        }

        // Build sort object
        const sortObj = {};
        if (sortBy === 'displayOrder') {
            sortObj.displayOrder = 1; // Featured testimonials first
            sortObj.createdAt = -1; // Then by newest
        } else if (sortBy === 'rating') {
            sortObj.rating = sortDirection;
            sortObj.createdAt = -1;
        } else if (sortBy === 'likes') {
            sortObj.numberOfLikes = sortDirection;
            sortObj.createdAt = -1;
        } else {
            sortObj.createdAt = sortDirection;
        }

        const testimonials = await Testimonial.find(filter)
            .sort(sortObj)
            .limit(limit)
            .select('-likes'); // Don't include likes array for public view

        const totalTestimonials = await Testimonial.countDocuments(filter);
        const averageRating = await Testimonial.aggregate([
            { $match: filter },
            { $group: { _id: null, avgRating: { $avg: '$rating' } } }
        ]);

        res.status(200).json({
            testimonials,
            totalTestimonials,
            averageRating: averageRating.length > 0 ? Math.round(averageRating[0].avgRating * 10) / 10 : 0
        });

    } catch (error) {
        next(error);
    }
};

// Get single testimonial
export const getTestimonial = async (req, res, next) => {
    try {
        const testimonial = await Testimonial.findOne({
            testimonialId: req.params.testimonialId,
            isActive: true
        });

        if (!testimonial) {
            return next(errorHandler(404, 'Testimonial not found!'));
        }

        // Only show approved testimonials to non-admin users
        if (!testimonial.isApproved && (!req.user || !req.user.isUserAdmin)) {
            return next(errorHandler(404, 'Testimonial not found!'));
        }

        res.status(200).json(testimonial);

    } catch (error) {
        next(error);
    }
};

// Update testimonial (user can update their own, admin can update any)
export const updateTestimonial = async (req, res, next) => {
    try {
        const testimonial = await Testimonial.findOne({
            testimonialId: req.params.testimonialId,
            isActive: true
        });

        if (!testimonial) {
            return next(errorHandler(404, 'Testimonial not found!'));
        }

        // Check permissions
        if (!req.user.isUserAdmin && testimonial.userId !== req.user.id) {
            return next(errorHandler(403, 'You can only update your own testimonial!'));
        }

        const { rating, title, content, location, occupation } = req.body;
        const updateData = {};

        // User updates (require re-approval)
        if (!req.user.isUserAdmin) {
            if (rating !== undefined) {
                const ratingNum = parseInt(rating);
                if (ratingNum < 1 || ratingNum > 5) {
                    return next(errorHandler(400, 'Rating must be between 1 and 5!'));
                }
                updateData.rating = ratingNum;
            }
            
            if (title) updateData.title = title.trim();
            if (content) updateData.content = content.trim();
            if (location !== undefined) updateData.location = location.trim();
            if (occupation !== undefined) updateData.occupation = occupation.trim();

            // If content is changed, require re-approval
            if (title || content || rating !== undefined) {
                updateData.isApproved = false;
                updateData.approvedBy = null;
                updateData.approvedAt = null;
            }
        } else {
            // Admin updates (can update any field)
            if (rating !== undefined) updateData.rating = parseInt(rating);
            if (title) updateData.title = title.trim();
            if (content) updateData.content = content.trim();
            if (location !== undefined) updateData.location = location.trim();
            if (occupation !== undefined) updateData.occupation = occupation.trim();
            if (req.body.isApproved !== undefined) updateData.isApproved = req.body.isApproved;
            if (req.body.isFeatured !== undefined) updateData.isFeatured = req.body.isFeatured;
            if (req.body.displayOrder !== undefined) updateData.displayOrder = parseInt(req.body.displayOrder);
        }

        const updatedTestimonial = await Testimonial.findOneAndUpdate(
            { testimonialId: req.params.testimonialId },
            { $set: updateData },
            { new: true, runValidators: true }
        );

        res.status(200).json(updatedTestimonial);

    } catch (error) {
        next(error);
    }
};

// Delete testimonial (user can delete their own, admin can delete any)
export const deleteTestimonial = async (req, res, next) => {
    try {
        const testimonial = await Testimonial.findOne({
            testimonialId: req.params.testimonialId,
            isActive: true
        });

        if (!testimonial) {
            return next(errorHandler(404, 'Testimonial not found!'));
        }

        // Check permissions
        if (!req.user.isUserAdmin && testimonial.userId !== req.user.id) {
            return next(errorHandler(403, 'You can only delete your own testimonial!'));
        }

        // Soft delete for users, hard delete for admins
        if (req.user.isUserAdmin) {
            await Testimonial.findOneAndDelete({ testimonialId: req.params.testimonialId });
            res.status(200).json('Testimonial has been deleted permanently!');
        } else {
            await Testimonial.findOneAndUpdate(
                { testimonialId: req.params.testimonialId },
                { isActive: false }
            );
            res.status(200).json('Testimonial has been deleted!');
        }

    } catch (error) {
        next(error);
    }
};

// Like/Unlike testimonial
export const toggleLike = async (req, res, next) => {
    try {
        const testimonial = await Testimonial.findOne({
            testimonialId: req.params.testimonialId,
            isActive: true,
            isApproved: true
        });

        if (!testimonial) {
            return next(errorHandler(404, 'Testimonial not found!'));
        }

        const userId = req.user.id;
        const hasLiked = testimonial.likes.includes(userId);

        if (hasLiked) {
            // Remove like
            testimonial.likes = testimonial.likes.filter(id => id !== userId);
            testimonial.numberOfLikes -= 1;
        } else {
            // Add like
            testimonial.likes.push(userId);
            testimonial.numberOfLikes += 1;
        }

        const updatedTestimonial = await testimonial.save();
        res.status(200).json(updatedTestimonial);

    } catch (error) {
        next(error);
    }
};

// Get user's own testimonial
export const getMyTestimonial = async (req, res, next) => {
    try {
        const testimonial = await Testimonial.findOne({
            userId: req.user.id,
            isActive: true
        });

        if (!testimonial) {
            return res.status(200).json({ testimonial: null });
        }

        res.status(200).json({ testimonial });

    } catch (error) {
        next(error);
    }
};

// ADMIN ROUTES

// Get all testimonials for admin
export const getAllTestimonialsAdmin = async (req, res, next) => {
    if (!req.user.isUserAdmin) {
        return next(errorHandler(403, 'Access denied! Admin privileges required.'));
    }

    try {
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 10;
        const sortDirection = req.query.sort === 'asc' ? 1 : -1;

        // Build filter
        const filter = {};
        if (req.query.isApproved !== undefined) filter.isApproved = req.query.isApproved === 'true';
        if (req.query.isFeatured !== undefined) filter.isFeatured = req.query.isFeatured === 'true';
        if (req.query.isActive !== undefined) filter.isActive = req.query.isActive === 'true';
        if (req.query.rating) filter.rating = parseInt(req.query.rating);
        if (req.query.searchTerm) {
            filter.$or = [
                { userFullName: { $regex: req.query.searchTerm, $options: 'i' } },
                { title: { $regex: req.query.searchTerm, $options: 'i' } },
                { content: { $regex: req.query.searchTerm, $options: 'i' } }
            ];
        }

        const testimonials = await Testimonial.find(filter)
            .sort({ createdAt: sortDirection })
            .skip(startIndex)
            .limit(limit);

        const totalTestimonials = await Testimonial.countDocuments();
        const pendingApproval = await Testimonial.countDocuments({ 
            isApproved: false, 
            isActive: true 
        });
        const approvedTestimonials = await Testimonial.countDocuments({ 
            isApproved: true, 
            isActive: true 
        });
        const featuredTestimonials = await Testimonial.countDocuments({ 
            isFeatured: true, 
            isActive: true 
        });

        // Get last month statistics
        const now = new Date();
        const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        const lastMonthTestimonials = await Testimonial.countDocuments({
            createdAt: { $gte: oneMonthAgo },
            isActive: true
        });

        res.status(200).json({
            testimonials,
            totalTestimonials,
            pendingApproval,
            approvedTestimonials,
            featuredTestimonials,
            lastMonthTestimonials
        });

    } catch (error) {
        next(error);
    }
};

// Approve testimonial
export const approveTestimonial = async (req, res, next) => {
    if (!req.user.isUserAdmin) {
        return next(errorHandler(403, 'Access denied! Admin privileges required.'));
    }

    try {
        const testimonial = await Testimonial.findOne({
            testimonialId: req.params.testimonialId,
            isActive: true
        });

        if (!testimonial) {
            return next(errorHandler(404, 'Testimonial not found!'));
        }

        const updatedTestimonial = await Testimonial.findOneAndUpdate(
            { testimonialId: req.params.testimonialId },
            {
                isApproved: true,
                approvedBy: req.user.id,
                approvedAt: new Date()
            },
            { new: true }
        );

        res.status(200).json(updatedTestimonial);

    } catch (error) {
        next(error);
    }
};

// Toggle featured status
export const toggleFeatured = async (req, res, next) => {
    if (!req.user.isUserAdmin) {
        return next(errorHandler(403, 'Access denied! Admin privileges required.'));
    }

    try {
        const testimonial = await Testimonial.findOne({
            testimonialId: req.params.testimonialId,
            isActive: true
        });

        if (!testimonial) {
            return next(errorHandler(404, 'Testimonial not found!'));
        }

        const updatedTestimonial = await Testimonial.findOneAndUpdate(
            { testimonialId: req.params.testimonialId },
            { isFeatured: !testimonial.isFeatured },
            { new: true }
        );

        res.status(200).json(updatedTestimonial);

    } catch (error) {
        next(error);
    }
};

// Bulk update display order
export const updateDisplayOrder = async (req, res, next) => {
    if (!req.user.isUserAdmin) {
        return next(errorHandler(403, 'Access denied! Admin privileges required.'));
    }

    try {
        const { testimonials } = req.body; // Array of { testimonialId, displayOrder }

        if (!Array.isArray(testimonials)) {
            return next(errorHandler(400, 'Testimonials must be an array!'));
        }

        const updatePromises = testimonials.map(item => 
            Testimonial.findOneAndUpdate(
                { testimonialId: item.testimonialId },
                { displayOrder: item.displayOrder }
            )
        );

        await Promise.all(updatePromises);
        res.status(200).json({ message: 'Display order updated successfully!' });

    } catch (error) {
        next(error);
    }
};