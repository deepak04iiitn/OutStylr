import express from 'express';
import {
    getCart,
    addOutfitToCart,
    removeOutfitFromCart,
    updateOutfitQuantity,
    updateOutfitNotes,
    clearCart,
    getCartSummary,
    moveOutfitToSaved,
    moveOutfitBackToCart,
    removeSavedOutfit,
    getCartCount
} from '../controllers/cart.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

// All cart routes require authentication
router.use(verifyToken);

// Basic cart operations
router.get('/', getCart);                                           
router.get('/count', getCartCount);                                 
router.get('/summary', getCartSummary);                            
router.post('/add-outfit', addOutfitToCart);                       
router.delete('/clear', clearCart);                                 

// Outfit operations in cart
router.delete('/outfit/:cartOutfitId', removeOutfitFromCart);       
router.put('/outfit/:cartOutfitId/quantity', updateOutfitQuantity); 
router.put('/outfit/:cartOutfitId/notes', updateOutfitNotes);       

// Saved outfits operations
router.post('/save-outfit/:cartOutfitId', moveOutfitToSaved);       
router.post('/move-to-cart/:savedOutfitId', moveOutfitBackToCart);  
router.delete('/saved/:savedOutfitId', removeSavedOutfit);          

export default router;