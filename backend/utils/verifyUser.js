import jwt from 'jsonwebtoken';
import { errorHandler } from './error.js';

export const verifyToken = (req , res , next) => {

    const token = req.cookies.access_token;

    if(!token)
    {
        return next(errorHandler(401 , 'Please sign in to continue!'));
    }

    // In your verifyToken function, add:
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return next(errorHandler(401, 'Token has expired. Please sign in again.'));
            }
            return next(errorHandler(401, 'Unauthorized'));
        }
        req.user = user;
        next();
    });
}