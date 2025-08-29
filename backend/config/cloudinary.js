import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Cloudinary Storage for Multer
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'outfit-images', // Cloudinary folder name
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
        transformation: [
            {
                width: 1000,
                height: 1000,
                crop: 'limit',
                quality: 'auto:good'
            }
        ],
        public_id: (req, file) => {
            // Generate unique public_id
            return `outfit-${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        },
    },
});

// Configure Multer
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        // Check file type
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    },
});

// Function to delete image from Cloudinary
export const deleteImageFromCloudinary = async (publicId) => {
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        return result;
    } catch (error) {
        console.error('Error deleting image from Cloudinary:', error);
        throw error;
    }
};

// Function to extract public_id from Cloudinary URL
export const extractPublicIdFromUrl = (url) => {
    if (!url) return null;
    
    // Extract public_id from Cloudinary URL
    // Example URL: https://res.cloudinary.com/demo/image/upload/v1234567890/outfit-images/outfit-1234567890-123456789.jpg
    const regex = /\/([^\/]+)\.(jpg|jpeg|png|webp|gif)$/;
    const match = url.match(regex);
    
    if (match) {
        const filename = match[1];
        return `outfit-images/${filename}`;
    }
    
    return null;
};

export { cloudinary, upload };