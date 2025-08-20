import express from 'express';
import {
    createOutfit,
    getOutfits,
    getOutfit,
    updateOutfit,
    deleteOutfit,
    toggleLike,
    toggleDislike,
    addComment,
    deleteComment,
    toggleCommentLike,
    toggleCommentDislike,
    addReply,
    deleteReply,
    toggleReplyLike,
    toggleReplyDislike,
    getAllOutfitsAdmin,
    toggleOutfitStatus
} from '../controllers/outfit.controller.js';
import { verifyToken } from '../utils/verifyUser.js';
import { upload } from '../config/cloudinary.js';

const router = express.Router();

// Public routes
router.get('/getoutfits', getOutfits); 
router.get('/:outfitId', getOutfit); 

// Protected routes (require authentication)
router.post('/create', verifyToken, upload.single('image'), createOutfit); 
router.put('/update/:outfitId', verifyToken, upload.single('image'), updateOutfit); 
router.delete('/delete/:outfitId', verifyToken, deleteOutfit); 

// Outfit interaction routes
router.put('/like/:outfitId', verifyToken, toggleLike); 
router.put('/dislike/:outfitId', verifyToken, toggleDislike); 

// Comment routes
router.post('/comment/:outfitId', verifyToken, addComment); 
router.delete('/comment/:outfitId/:commentId', verifyToken, deleteComment); 

// Comment interaction routes
router.put('/comment/like/:outfitId/:commentId', verifyToken, toggleCommentLike); 
router.put('/comment/dislike/:outfitId/:commentId', verifyToken, toggleCommentDislike); 

// Reply routes
router.post('/reply/:outfitId/:commentId', verifyToken, addReply); 
router.delete('/reply/:outfitId/:commentId/:replyId', verifyToken, deleteReply); 

// Reply interaction routes
router.put('/reply/like/:outfitId/:commentId/:replyId', verifyToken, toggleReplyLike); 
router.put('/reply/dislike/:outfitId/:commentId/:replyId', verifyToken, toggleReplyDislike); 

// Admin routes
router.get('/admin/getalloutfits', verifyToken, getAllOutfitsAdmin); 
router.put('/admin/togglestatus/:outfitId', verifyToken, toggleOutfitStatus); 
export default router;