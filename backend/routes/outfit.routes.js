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
    toggleOutfitStatus,
    getTrendingOutfits
} from '../controllers/outfit.controller.js';
import { verifyToken } from '../utils/verifyUser.js';
import { upload } from '../config/cloudinary.js';

const router = express.Router();

// Public routes
router.get('/getoutfits', getOutfits);
router.get('/trending', getTrendingOutfits); 

// Admin routes (move these up)
router.get('/admin/getalloutfits', verifyToken, getAllOutfitsAdmin); 
router.put('/admin/togglestatus/:outfitId', verifyToken, toggleOutfitStatus); 

// Protected routes (move these up)
router.post('/create', verifyToken, upload.single('image'), createOutfit); 
router.put('/update/:outfitId', verifyToken, upload.single('image'), updateOutfit); 
router.delete('/delete/:outfitId', verifyToken, deleteOutfit); 

// Comment routes (move these up)
router.post('/comment/:outfitId', verifyToken, addComment); 
router.delete('/comment/:outfitId/:commentId', verifyToken, deleteComment); 
router.put('/comment/like/:outfitId/:commentId', verifyToken, toggleCommentLike); 
router.put('/comment/dislike/:outfitId/:commentId', verifyToken, toggleCommentDislike); 

// Reply routes (move these up)
router.post('/reply/:outfitId/:commentId', verifyToken, addReply); 
router.delete('/reply/:outfitId/:commentId/:replyId', verifyToken, deleteReply); 
router.put('/reply/like/:outfitId/:commentId/:replyId', verifyToken, toggleReplyLike); 
router.put('/reply/dislike/:outfitId/:commentId/:replyId', verifyToken, toggleReplyDislike); 

// Outfit interaction routes (move these up)
router.put('/like/:outfitId', verifyToken, toggleLike); 
router.put('/dislike/:outfitId', verifyToken, toggleDislike); 

// This MUST be last - it's a catch-all route
router.get('/:outfitId', getOutfit);

export default router;