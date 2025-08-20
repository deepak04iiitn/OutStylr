import { errorHandler } from "../utils/error.js"
import bcryptjs from 'bcryptjs'
import User from "../models/user.model.js";

export const updateUser = async(req, res, next) => {
    try {
        // Only allow users to update their own profile 
        if (req.user.id !== req.params.userId) {
            return next(errorHandler(403, 'You are not allowed to update this user!'));
        }

        // Password validation
        if (req.body.password) {
            if (req.body.password.length < 6) {
                return next(errorHandler(400, 'Password must be at least 6 characters!'));
            }
            req.body.password = bcryptjs.hashSync(req.body.password, 10);
        }

        // Username validation
        if (req.body.username) {
            if (req.body.username.length < 7 || req.body.username.length > 20) {
                return next(errorHandler(400, 'Username must be between 7 and 20 characters!'));
            }
            if (req.body.username.includes(' ')) {
                return next(errorHandler(400, 'Username cannot contain spaces!'));
            }
            if (req.body.username !== req.body.username.toLowerCase()) {
                return next(errorHandler(400, 'Username must be lowercase!'));
            }
            if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
                return next(errorHandler(400, 'Username can only contain letters and numbers!'));
            }
        }

        // Gender validation 
        if (req.body.gender && !['Male', 'Female'].includes(req.body.gender)) {
            return next(errorHandler(400, 'Invalid gender specified! Must be Male or Female.'));
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.params.userId,
            {
                $set: {
                    username: req.body.username,
                    email: req.body.email,
                    password: req.body.password,
                    fullName: req.body.fullName,
                    gender: req.body.gender,
                }
            },
            { new: true }
        );
        
        const { password, ...rest } = updatedUser._doc;
        res.status(200).json(rest);
        
    } catch (error) {
        next(error);
    }
}

export const deleteUser = async(req, res, next) => {
    try {
        // Allow admin to delete any user, but regular users can only delete their own account
        if (!req.user.isUserAdmin && req.user.id !== req.params.userId) {
            return next(errorHandler(403, 'You are not allowed to delete this account!'));
        }

        // Prevent admin from deleting their own account
        const userToDelete = await User.findById(req.params.userId);
        if (userToDelete.isUserAdmin) {
            return next(errorHandler(403, 'Admin account cannot be deleted!'));
        }

        await User.findByIdAndDelete(req.params.userId);
        res.status(200).json('User has been deleted!');
    } catch (error) {
        next(error);
    }
}

export const signout = async(req, res, next) => {
    try {
        res
          .clearCookie('access_token', {
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production',
          })
          .status(200)
          .json('User has been signed out!');
    } catch (error) {
        next(error);
    }
}

export const getUser = async(req, res, next) => {
    try {
        const user = await User.findById(req.params.userId);

        if(!user) {
            return next(errorHandler(404, 'User not found!'));
        }

        const { password, ...rest } = user._doc;
        res.status(200).json(rest);

    } catch (error) {
        next(error);
    }
}

export const getusers = async(req, res, next) => {
    if(!req.user.isUserAdmin) {
        return next(errorHandler(403, 'You are not allowed to see all users!'));
    }

    try {
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 9;
        const sortDirection = req.query.sort === 'asc' ? 1 : -1;

        // Optional filter by a specific calendar date (YYYY-MM-DD)
        const { date } = req.query;
        const filter = {};
        if (date) {
            const start = new Date(date);
            if (!isNaN(start.getTime())) {
                const end = new Date(start);
                end.setDate(end.getDate() + 1);
                filter.createdAt = { $gte: start, $lt: end };
            }
        }

        const users = await User.find(filter)
            .sort({ createdAt: sortDirection })
            .skip(startIndex)
            .limit(limit);

        const usersWithoutPassword = users.map((user) => {
            const { password, ...rest } = user._doc;
            return rest;
        });

        const totalUsers = await User.countDocuments();
        const matchedCount = await User.countDocuments(filter);

        const now = new Date();
        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth()-1,
            now.getDate()
        );

        const lastMonthUsers = await User.countDocuments({
            createdAt: { $gte: oneMonthAgo },
        });

        res.status(200).json({
            users: usersWithoutPassword,
            totalUsers,
            lastMonthUsers,
            matchedCount,
        });
    } catch (error) {
        next(error);
    }
}