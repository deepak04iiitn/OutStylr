import React from 'react';
import { motion } from 'framer-motion';
import { Heart, ThumbsDown, Star, Calendar, ZoomIn } from 'lucide-react';
import AddToCart from './AddToCart';

function OutfitInfo({ 
    outfit, 
    currentUser, 
    addingToCart, 
    setAddingToCart, 
    quantity, 
    setQuantity, 
    notes, 
    setNotes, 
    showCartOptions, 
    setShowCartOptions 
}) {
    const scaleHover = { scale: 1.05, transition: { type: "spring", stiffness: 300, damping: 20 } };
    const buttonHover = {
        scale: 1.02,
        boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
        transition: { duration: 0.2 }
    };
    const isLiked = currentUser && outfit.likes.includes(currentUser.id);
    const isDisliked = currentUser && outfit.dislikes.includes(currentUser.id);

    const handleLike = async () => {
        if (!currentUser) return;
        try {
            const response = await fetch(`/backend/outfit/like/${outfit._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (response.ok) {
                const updatedOutfit = await response.json();
                setOutfit(updatedOutfit);
            }
        } catch (error) {
            console.error('Error toggling like:', error);
        }
    };

    const handleDislike = async () => {
        if (!currentUser) return;
        try {
            const response = await fetch(`/backend/outfit/dislike/${outfit._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (response.ok) {
                const updatedOutfit = await response.json();
                setOutfit(updatedOutfit);
            }
        } catch (error) {
            console.error('Error toggling dislike:', error);
        }
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <motion.div 
            className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6 lg:p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                <div className="flex-1">
                    <motion.h1 
                        className="text-3xl lg:text-4xl font-bold text-neutral-900 mb-3"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                    >
                        {outfit.category} Outfit
                    </motion.h1>
                    {/* User instruction note */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                        className="mb-4"
                    >
                        <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-3 py-2 text-xs text-blue-700">
                            <ZoomIn className="w-3 h-3" />
                            <span className="font-medium">Tip:</span>
                            <span>Click the outfit image to view full size</span>
                        </div>
                    </motion.div>
                    
                    <motion.div 
                        className="flex flex-wrap items-center gap-3"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                    >
                        <motion.span 
                            className="inline-flex items-center px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-semibold border border-indigo-200"
                            whileHover={scaleHover}
                        >
                            {outfit.section}
                        </motion.span>
                        <motion.div 
                            className="flex items-center gap-1 bg-amber-50 px-3 py-1 rounded-full border border-amber-200"
                            whileHover={scaleHover}
                        >
                            <Star className="w-4 h-4 text-amber-500 fill-current" />
                            <span className="font-semibold text-amber-800">{outfit.rateLook.toFixed(1)}</span>
                        </motion.div>
                    </motion.div>
                </div>
                <motion.div 
                    className="text-right"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                >
                    <motion.div 
                        className="text-3xl lg:text-4xl font-bold text-emerald-600"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                    >
                        ₹{outfit.totalPrice.toLocaleString()}
                    </motion.div>
                    <div className="text-sm text-neutral-500 font-medium">
                        {outfit.numberOfItems} {outfit.numberOfItems === 1 ? 'item' : 'items'}
                    </div>
                </motion.div>
            </div>

            {outfit.description && (
                <motion.div 
                    className="mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                >
                    <h3 className="text-lg font-bold text-neutral-900 mb-3">Description</h3>
                    <p className="text-neutral-700 leading-relaxed">{outfit.description}</p>
                </motion.div>
            )}

            {outfit.tags && outfit.tags.length > 0 && (
                <motion.div 
                    className="mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                >
                    <h3 className="text-lg font-bold text-neutral-900 mb-3">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                        {outfit.tags.map((tag, index) => (
                            <motion.span
                                key={index}
                                className="inline-flex items-center px-3 py-1 bg-neutral-100 text-neutral-700 rounded-full text-sm font-medium border border-neutral-200 hover:bg-neutral-200 transition-colors cursor-pointer"
                                whileHover={scaleHover}
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.1 * index, duration: 0.3 }}
                            >
                                #{tag}
                            </motion.span>
                        ))}
                    </div>
                </motion.div>
            )}

            <motion.div 
                className="flex flex-wrap gap-3 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
            >
                <motion.button
                    onClick={handleLike}
                    className={`cursor-pointer flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all duration-200 ${
                        isLiked 
                            ? 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100' 
                            : 'bg-neutral-100 hover:bg-red-50 text-neutral-700 hover:text-red-700 border border-neutral-200'
                    }`}
                    whileHover={buttonHover}
                    whileTap={{ scale: 0.95 }}
                >
                    <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                    {isLiked ? 'Liked' : 'Like'}
                </motion.button>
                <motion.button
                    onClick={handleDislike}
                    className={`cursor-pointer flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all duration-200 ${
                        isDisliked 
                            ? 'bg-neutral-200 text-neutral-800 border border-neutral-300' 
                            : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700 border border-neutral-200'
                    }`}
                    whileHover={buttonHover}
                    whileTap={{ scale: 0.95 }}
                >
                    <ThumbsDown className={`w-5 h-5 ${isDisliked ? 'fill-current' : ''}`} />
                    {isDisliked ? 'Disliked' : 'Dislike'}
                </motion.button>
            </motion.div>

            <AddToCart 
                outfit={outfit}
                currentUser={currentUser}
                addingToCart={addingToCart}
                setAddingToCart={setAddingToCart}
                quantity={quantity}
                setQuantity={setQuantity}
                notes={notes}
                setNotes={setNotes}
                showCartOptions={showCartOptions}
                setShowCartOptions={setShowCartOptions}
            />

            <motion.div 
                className="flex items-center gap-2 text-sm text-neutral-500 mt-6 pt-6 border-t border-neutral-200"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
            >
                <Calendar className="w-4 h-4" />
                Created on {formatDate(outfit.createdAt)}
            </motion.div>
        </motion.div>
    );
}

export default OutfitInfo;