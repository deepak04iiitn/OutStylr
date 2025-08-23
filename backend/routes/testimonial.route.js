import express from 'express';
import {
    createTestimonial,
    getTestimonials,
    getTestimonial,
    updateTestimonial,
    deleteTestimonial,
    toggleLike,
    getMyTestimonial,
    getAllTestimonialsAdmin,
    approveTestimonial,
    toggleFeatured,
    updateDisplayOrder
} from '../controllers/testimonial.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

// Public routes
router.get('/gettestimonials', getTestimonials); 
router.get('/:testimonialId', getTestimonial); 

// Protected routes (require authentication)
router.post('/create', verifyToken, createTestimonial); 
router.get('/user/mytestimonial', verifyToken, getMyTestimonial); 
router.put('/update/:testimonialId', verifyToken, updateTestimonial); 
router.delete('/delete/:testimonialId', verifyToken, deleteTestimonial);
router.put('/like/:testimonialId', verifyToken, toggleLike); 

// Admin routes
router.get('/admin/getalltestimonials', verifyToken, getAllTestimonialsAdmin); 
router.put('/admin/approve/:testimonialId', verifyToken, approveTestimonial); 
router.put('/admin/togglefeatured/:testimonialId', verifyToken, toggleFeatured); 
router.put('/admin/updateorder', verifyToken, updateDisplayOrder); 

export default router;