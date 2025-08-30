import React, { useState, useEffect } from 'react';
import { Heart, ThumbsDown, MessageCircle, ShoppingCart, ExternalLink, Star, Calendar, Eye, Reply, Trash2, Send, Plus, Minus, Lock, UserCheck } from 'lucide-react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';

export default function OutfitDetails() {
    const [outfit, setOutfit] = useState(null);
    const [loading, setLoading] = useState(true);
    const [commentText, setCommentText] = useState('');
    const [replyTexts, setReplyTexts] = useState({});
    const [showReplyForm, setShowReplyForm] = useState(null);
    const [addingToCart, setAddingToCart] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [notes, setNotes] = useState('');
    const [showCartOptions, setShowCartOptions] = useState(false);
    
    // Get outfit ID from URL (simulate getting from route params)
    const outfitId = window.location.pathname.split('/').pop();

    useEffect(() => {
        fetchOutfit();
    }, [outfitId]);

    const { currentUser } = useSelector((state) => state.user);

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.6,
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 }
        }
    };

    const scaleHover = {
        scale: 1.05,
        transition: { type: "spring", stiffness: 300, damping: 20 }
    };

    const buttonHover = {
        scale: 1.02,
        boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
        transition: { duration: 0.2 }
    };

    const fetchOutfit = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/backend/outfit/${outfitId}`);
            const data = await response.json();
            
            if (response.ok) {
                setOutfit(data);
            } else {
                console.error('Error fetching outfit:', data.error);
            }
        } catch (error) {
            console.error('Error fetching outfit:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = async () => {
        if (!currentUser) {
            alert('Please login to add items to cart');
            return;
        }

        setAddingToCart(true);
        try {
            const response = await fetch('/backend/cart/add-outfit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    outfitId: outfit._id,
                    quantity,
                    notes: notes.trim()
                })
            });

            const data = await response.json();

            if (response.ok) {
                alert(`${data.outfitName} added to cart successfully!`);
                setShowCartOptions(false);
                setQuantity(1);
                setNotes('');
            } else {
                alert(data.error || 'Failed to add outfit to cart');
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            alert('Failed to add outfit to cart');
        } finally {
            setAddingToCart(false);
        }
    };

    const handleLike = async () => {
        if (!currentUser) return;
        
        try {
            const response = await fetch(`/backend/outfit/like/${outfitId}`, {
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
            const response = await fetch(`/backend/outfit/dislike/${outfitId}`, {
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

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!commentText.trim() || !currentUser) return;

        try {
            const response = await fetch(`/backend/outfit/comment/${outfitId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ text: commentText })
            });

            if (response.ok) {
                const updatedOutfit = await response.json();
                setOutfit(updatedOutfit);
                setCommentText('');
            }
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            const response = await fetch(`/backend/outfit/comment/${outfitId}/${commentId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.ok) {
                const updatedOutfit = await response.json();
                setOutfit(updatedOutfit);
            }
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };

    const handleCommentLike = async (commentId) => {
        try {
            const response = await fetch(`/backend/outfit/comment/like/${outfitId}/${commentId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.ok) {
                const updatedOutfit = await response.json();
                setOutfit(updatedOutfit);
            }
        } catch (error) {
            console.error('Error toggling comment like:', error);
        }
    };

    const handleCommentDislike = async (commentId) => {
        try {
            const response = await fetch(`/backend/outfit/comment/dislike/${outfitId}/${commentId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.ok) {
                const updatedOutfit = await response.json();
                setOutfit(updatedOutfit);
            }
        } catch (error) {
            console.error('Error toggling comment dislike:', error);
        }
    };

    const handleAddReply = async (commentId) => {
        const replyText = replyTexts[commentId];
        if (!replyText?.trim() || !currentUser) return;

        try {
            const response = await fetch(`/backend/outfit/reply/${outfitId}/${commentId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ text: replyText })
            });

            if (response.ok) {
                const updatedOutfit = await response.json();
                setOutfit(updatedOutfit);
                setReplyTexts(prev => ({ ...prev, [commentId]: '' }));
                setShowReplyForm(null);
            }
        } catch (error) {
            console.error('Error adding reply:', error);
        }
    };

    const handleDeleteReply = async (commentId, replyId) => {
        try {
            const response = await fetch(`/backend/outfit/reply/${outfitId}/${commentId}/${replyId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.ok) {
                const updatedOutfit = await response.json();
                setOutfit(updatedOutfit);
            }
        } catch (error) {
            console.error('Error deleting reply:', error);
        }
    };

    const handleReplyLike = async (commentId, replyId) => {
        try {
            const response = await fetch(`/backend/outfit/reply/like/${outfitId}/${commentId}/${replyId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.ok) {
                const updatedOutfit = await response.json();
                setOutfit(updatedOutfit);
            }
        } catch (error) {
            console.error('Error toggling reply like:', error);
        }
    };

    const handleReplyDislike = async (commentId, replyId) => {
        try {
            const response = await fetch(`/backend/outfit/reply/dislike/${outfitId}/${commentId}/${replyId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.ok) {
                const updatedOutfit = await response.json();
                setOutfit(updatedOutfit);
            }
        } catch (error) {
            console.error('Error toggling reply dislike:', error);
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

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <motion.div 
                    className="flex flex-col items-center gap-4"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <motion.div 
                        className="animate-spin rounded-full h-12 w-12 border-2 border-neutral-300 border-t-indigo-600"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    <motion.p 
                        className="text-neutral-600 font-medium"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                    >
                        Loading outfit details...
                    </motion.p>
                </motion.div>
            </div>
        );
    }

    if (!outfit) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <motion.div 
                    className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-8 text-center max-w-md w-full"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <motion.div 
                        className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6"
                        whileHover={scaleHover}
                    >
                        <MessageCircle className="w-8 h-8 text-neutral-400" />
                    </motion.div>
                    <h2 className="text-2xl font-bold text-neutral-800 mb-3">Outfit not found</h2>
                    <p className="text-neutral-600 mb-6">The outfit you're looking for doesn't exist or has been removed.</p>
                    <motion.button
                        onClick={() => window.location.href = '/outfit'}
                        className="w-full px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors duration-200"
                        whileHover={buttonHover}
                        whileTap={{ scale: 0.98 }}
                    >
                        Back to Outfits
                    </motion.button>
                </motion.div>
            </div>
        );
    }

    const isLiked = currentUser && outfit.likes.includes(currentUser.id);
    const isDisliked = currentUser && outfit.dislikes.includes(currentUser.id);

    return (
        <motion.div 
            className="min-h-screen mt-26"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 lg:gap-8">
                    {/* Left Column - Image and Stats */}
                    <div className="xl:col-span-5 space-y-6">
                        {/* Main Image */}
                        <motion.div 
                            className="relative group"
                            variants={itemVariants}
                        >
                            <motion.div 
                                className="aspect-[3/4] bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden"
                                whileHover={{ scale: 1.02 }}
                                transition={{ duration: 0.3 }}
                            >
                                <motion.img
                                    src={outfit.image}
                                    alt={`${outfit.category} outfit`}
                                    className="w-full h-full object-cover transition-transform duration-300"
                                    whileHover={{ scale: 1.1 }}
                                    transition={{ duration: 0.3 }}
                                />
                                {outfit.type !== 'Normal' && (
                                    <motion.div 
                                        className="absolute top-4 right-4"
                                        initial={{ opacity: 0, scale: 0 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.5, duration: 0.3 }}
                                    >
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                                            outfit.type === 'Sponsored' 
                                                ? 'bg-amber-100 text-amber-800 border border-amber-200' 
                                                : 'bg-blue-100 text-blue-800 border border-blue-200'
                                        }`}>
                                            {outfit.type}
                                        </span>
                                    </motion.div>
                                )}
                            </motion.div>
                        </motion.div>

                        {/* Stats Grid */}
                        <motion.div 
                            className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6"
                            variants={itemVariants}
                        >
                            <h3 className="text-lg font-bold text-neutral-900 mb-4">Engagement Statistics</h3>
                            <motion.div 
                                className="grid grid-cols-2 gap-4"
                                variants={containerVariants}
                            >
                                <motion.div 
                                    className="bg-red-50 rounded-xl p-4 text-center border border-red-100"
                                    variants={itemVariants}
                                    whileHover={scaleHover}
                                >
                                    <Heart className="w-6 h-6 text-red-500 mx-auto mb-2" />
                                    <motion.div 
                                        className="text-2xl font-bold text-neutral-900"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.3, type: "spring" }}
                                    >
                                        {outfit.numberOfLikes}
                                    </motion.div>
                                    <div className="text-sm font-medium text-neutral-600">Likes</div>
                                </motion.div>
                                <motion.div 
                                    className="bg-neutral-50 rounded-xl p-4 text-center border border-neutral-200"
                                    variants={itemVariants}
                                    whileHover={scaleHover}
                                >
                                    <ThumbsDown className="w-6 h-6 text-neutral-500 mx-auto mb-2" />
                                    <motion.div 
                                        className="text-2xl font-bold text-neutral-900"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.4, type: "spring" }}
                                    >
                                        {outfit.numberOfDislikes}
                                    </motion.div>
                                    <div className="text-sm font-medium text-neutral-600">Dislikes</div>
                                </motion.div>
                                <motion.div 
                                    className="bg-blue-50 rounded-xl p-4 text-center border border-blue-100"
                                    variants={itemVariants}
                                    whileHover={scaleHover}
                                >
                                    <MessageCircle className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                                    <motion.div 
                                        className="text-2xl font-bold text-neutral-900"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.5, type: "spring" }}
                                    >
                                        {outfit.numberOfComments}
                                    </motion.div>
                                    <div className="text-sm font-medium text-neutral-600">Comments</div>
                                </motion.div>
                                <motion.div 
                                    className="bg-emerald-50 rounded-xl p-4 text-center border border-emerald-100"
                                    variants={itemVariants}
                                    whileHover={scaleHover}
                                >
                                    <Eye className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
                                    <motion.div 
                                        className="text-2xl font-bold text-neutral-900"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.6, type: "spring" }}
                                    >
                                        {outfit.numberOfClicks}
                                    </motion.div>
                                    <div className="text-sm font-medium text-neutral-600">Views</div>
                                </motion.div>
                            </motion.div>
                        </motion.div>
                    </div>

                    {/* Right Column - Details */}
                    <div className="xl:col-span-7 space-y-6">
                        {/* Outfit Info */}
                        <motion.div 
                            className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6 lg:p-8"
                            variants={itemVariants}
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

                            {/* Description */}
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

                            {/* Tags */}
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

                            {/* Action Buttons */}
                            <motion.div 
                                className="flex flex-wrap gap-3 mb-6"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.7, duration: 0.5 }}
                            >
                                <motion.button
                                    onClick={handleLike}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all duration-200 ${
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
                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all duration-200 ${
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

                            {/* Add to Cart Section */}
                            <motion.div 
                                className="bg-neutral-50 rounded-xl p-4 lg:p-6 border border-neutral-200"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.8, duration: 0.5 }}
                            >
                                <AnimatePresence mode="wait">
                                    {!showCartOptions ? (
                                        <motion.button 
                                            onClick={() => setShowCartOptions(true)}
                                            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all duration-200 font-bold text-lg shadow-sm"
                                            whileHover={buttonHover}
                                            whileTap={{ scale: 0.98 }}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                        >
                                            <ShoppingCart className="w-6 h-6" />
                                            Add Complete Outfit to Cart
                                        </motion.button>
                                    ) : (
                                        <motion.div 
                                            className="space-y-4"
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <h4 className="text-lg font-bold text-neutral-900">Customize Your Order</h4>
                                            
                                            {/* Quantity Selector */}
                                            <div>
                                                <label className="block text-sm font-semibold text-neutral-700 mb-2">
                                                    Quantity
                                                </label>
                                                <div className="flex items-center gap-3">
                                                    <motion.button
                                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                        className="w-10 h-10 flex items-center justify-center bg-white hover:bg-neutral-100 border border-neutral-300 rounded-lg transition-colors"
                                                        whileHover={scaleHover}
                                                        whileTap={{ scale: 0.9 }}
                                                    >
                                                        <Minus className="w-4 h-4" />
                                                    </motion.button>
                                                    <motion.span 
                                                        className="w-16 text-center font-bold text-lg bg-white border border-neutral-300 rounded-lg py-2"
                                                        key={quantity}
                                                        initial={{ scale: 1.2 }}
                                                        animate={{ scale: 1 }}
                                                        transition={{ duration: 0.2 }}
                                                    >
                                                        {quantity}
                                                    </motion.span>
                                                    <motion.button
                                                        onClick={() => setQuantity(Math.min(10, quantity + 1))}
                                                        className="w-10 h-10 flex items-center justify-center bg-white hover:bg-neutral-100 border border-neutral-300 rounded-lg transition-colors"
                                                        whileHover={scaleHover}
                                                        whileTap={{ scale: 0.9 }}
                                                    >
                                                        <Plus className="w-4 h-4" />
                                                    </motion.button>
                                                </div>
                                            </div>

                                            {/* Notes */}
                                            <div>
                                                <label className="block text-sm font-semibold text-neutral-700 mb-2">
                                                    Special Instructions (Optional)
                                                </label>
                                                <motion.textarea
                                                    value={notes}
                                                    onChange={(e) => setNotes(e.target.value)}
                                                    placeholder="Any special instructions or preferences..."
                                                    className="w-full p-3 border border-neutral-300 rounded-xl resize-none text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                                    rows="3"
                                                    maxLength="200"
                                                    whileFocus={{ scale: 1.02 }}
                                                />
                                                <div className="text-xs text-neutral-500 mt-1 text-right">
                                                    {notes.length}/200
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex gap-3 pt-2">
                                                <motion.button
                                                    onClick={() => {
                                                        setShowCartOptions(false);
                                                        setQuantity(1);
                                                        setNotes('');
                                                    }}
                                                    className="flex-1 px-4 py-3 border border-neutral-300 text-neutral-700 rounded-xl hover:bg-neutral-100 transition-colors font-semibold"
                                                    whileHover={buttonHover}
                                                    whileTap={{ scale: 0.95 }}
                                                >
                                                    Cancel
                                                </motion.button>
                                                <motion.button
                                                    onClick={handleAddToCart}
                                                    disabled={addingToCart}
                                                    className="flex-2 flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:bg-indigo-400 transition-colors font-semibold"
                                                    whileHover={!addingToCart ? buttonHover : {}}
                                                    whileTap={!addingToCart ? { scale: 0.95 } : {}}
                                                >
                                                    {addingToCart ? (
                                                        <motion.div 
                                                            className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"
                                                            animate={{ rotate: 360 }}
                                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                        />
                                                    ) : (
                                                        <ShoppingCart className="w-5 h-5" />
                                                    )}
                                                    {addingToCart ? 'Adding to Cart...' : 'Add to Cart'}
                                                </motion.button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>

                            {/* Creation Date */}
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

                        {/* Items List - Protected Content */}
                        <motion.div 
                            className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6 lg:p-8"
                            variants={itemVariants}
                        >
                            <h2 className="text-2xl font-bold text-neutral-900 mb-6">Outfit Items</h2>
                            
                            {/* Show items if user is signed in, otherwise show sign-in prompt */}
                            <AnimatePresence>
                                {currentUser ? (
                                    <motion.div 
                                        className="space-y-4"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        {outfit.items.map((item, index) => (
                                            <motion.div 
                                                key={item.itemId} 
                                                className="group flex items-center gap-4 p-4 border border-neutral-200 rounded-xl hover:bg-neutral-50 hover:border-neutral-300 transition-all duration-200"
                                                initial={{ opacity: 0, x: -50 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.1, duration: 0.3 }}
                                                whileHover={scaleHover}
                                            >
                                                <motion.div 
                                                    className="flex-shrink-0 w-10 h-10 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold border border-indigo-200"
                                                    whileHover={{ rotate: 360 }}
                                                    transition={{ duration: 0.3 }}
                                                >
                                                    {index + 1}
                                                </motion.div>
                                                <div className="flex-grow min-w-0">
                                                    <h4 className="font-bold text-neutral-900 truncate">{item.itemName}</h4>
                                                    <p className="text-sm text-neutral-600 truncate">{item.sourceName}</p>
                                                </div>
                                                <div className="text-right flex-shrink-0">
                                                    <motion.div 
                                                        className="font-bold text-emerald-600 text-lg"
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        transition={{ delay: 0.2, type: "spring" }}
                                                    >
                                                        ₹{item.itemPrice.toLocaleString()}
                                                    </motion.div>
                                                    <motion.a
                                                        href={item.itemLink}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 text-sm font-semibold transition-colors"
                                                        onClick={(e) => e.stopPropagation()}
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                    >
                                                        View Item <ExternalLink className="w-3 h-3" />
                                                    </motion.a>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </motion.div>
                                ) : (
                                    // Sign-in to unlock message
                                    <motion.div 
                                        className="text-center py-16 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border-2 border-dashed border-indigo-200"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        <motion.div 
                                            className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6"
                                            whileHover={{ rotate: 10, scale: 1.1 }}
                                            transition={{ type: "spring", stiffness: 300 }}
                                        >
                                            <Lock className="w-8 h-8 text-indigo-600" />
                                        </motion.div>
                                        <motion.h3 
                                            className="text-2xl font-bold text-neutral-800 mb-3"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.2, duration: 0.5 }}
                                        >
                                            Sign in to unlock item links
                                        </motion.h3>
                                        <motion.p 
                                            className="text-neutral-600 mb-8 max-w-md mx-auto"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.3, duration: 0.5 }}
                                        >
                                            Create an account or sign in to access direct purchase links for each item in this outfit and enjoy the full shopping experience.
                                        </motion.p>
                                        <motion.div 
                                            className="flex flex-col sm:flex-row gap-4 justify-center"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.4, duration: 0.5 }}
                                        >
                                            <motion.button
                                                onClick={() => window.location.href = '/signin'}
                                                className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-semibold"
                                                whileHover={buttonHover}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                <UserCheck className="w-5 h-5" />
                                                Sign In
                                            </motion.button>
                                            <motion.button
                                                onClick={() => window.location.href = '/signup'}
                                                className="flex items-center justify-center gap-2 px-6 py-3 border border-indigo-600 text-indigo-600 rounded-xl hover:bg-indigo-50 transition-colors font-semibold"
                                                whileHover={buttonHover}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                Create Account
                                            </motion.button>
                                        </motion.div>
                                        
                                        {/* Preview of locked items */}
                                        <motion.div 
                                            className="mt-8 space-y-3"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.6, duration: 0.5 }}
                                        >
                                            <p className="text-sm text-neutral-500 font-semibold">Preview:</p>
                                            {outfit.items.slice(0, 3).map((item, index) => (
                                                <motion.div 
                                                    key={item.itemId} 
                                                    className="flex items-center gap-4 p-3 bg-white/50 rounded-lg border border-neutral-200/50 backdrop-blur-sm"
                                                    initial={{ opacity: 0, x: -30 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: 0.7 + (index * 0.1), duration: 0.3 }}
                                                >
                                                    <div className="flex-shrink-0 w-8 h-8 bg-neutral-200 text-neutral-400 rounded-full flex items-center justify-center font-bold text-sm">
                                                        {index + 1}
                                                    </div>
                                                    <div className="flex-grow min-w-0">
                                                        <h4 className="font-semibold text-neutral-600 truncate text-sm">{item.itemName}</h4>
                                                        <p className="text-xs text-neutral-400 truncate">{item.sourceName}</p>
                                                    </div>
                                                    <div className="flex-shrink-0 text-right">
                                                        <div className="font-bold text-emerald-600 text-sm">
                                                            ₹{item.itemPrice.toLocaleString()}
                                                        </div>
                                                        <div className="flex items-center gap-1 text-xs text-neutral-400">
                                                            <Lock className="w-3 h-3" />
                                                            Locked
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                            {outfit.items.length > 3 && (
                                                <motion.div 
                                                    className="text-sm text-neutral-500 italic"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ delay: 1, duration: 0.3 }}
                                                >
                                                    +{outfit.items.length - 3} more items available after sign in
                                                </motion.div>
                                            )}
                                        </motion.div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </div>
                </div>

                {/* Comments Section */}
                <motion.div 
                    className="mt-8 bg-white rounded-2xl shadow-sm border border-neutral-200"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9, duration: 0.6 }}
                >
                    <div className="p-6 lg:p-8 border-b border-neutral-200">
                        <h2 className="text-2xl font-bold text-neutral-900">
                            Comments ({outfit.numberOfComments})
                        </h2>
                    </div>

                    <div className="p-6 lg:p-8">
                        {/* Add Comment Form */}
                        {currentUser && (
                            <motion.div 
                                className="mb-8 bg-neutral-50 rounded-xl p-4 lg:p-6 border border-neutral-200"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.3, duration: 0.5 }}
                            >
                                <div className="flex gap-4">
                                    <motion.div 
                                        className="flex-shrink-0"
                                        whileHover={scaleHover}
                                    >
                                        <div className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">
                                            {currentUser.fullName?.charAt(0) || 'U'}
                                        </div>
                                    </motion.div>
                                    <div className="flex-grow">
                                        <motion.textarea
                                            value={commentText}
                                            onChange={(e) => setCommentText(e.target.value)}
                                            placeholder="Share your thoughts about this outfit..."
                                            className="w-full p-4 border border-neutral-300 rounded-xl resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                            rows="3"
                                            whileFocus={{ scale: 1.02 }}
                                        />
                                        <div className="flex justify-end mt-3">
                                            <motion.button
                                                onClick={handleAddComment}
                                                disabled={!commentText.trim()}
                                                className="px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:bg-neutral-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2 font-semibold"
                                                whileHover={!commentText.trim() ? {} : buttonHover}
                                                whileTap={!commentText.trim() ? {} : { scale: 0.95 }}
                                            >
                                                <Send className="w-4 h-4" />
                                                Post Comment
                                            </motion.button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Comments List */}
                        <div className="space-y-6">
                            <AnimatePresence>
                                {outfit.comments.map((comment, commentIndex) => (
                                    <motion.div 
                                        key={comment.commentId} 
                                        className="border border-neutral-200 rounded-xl p-4 lg:p-6"
                                        initial={{ opacity: 0, y: 50 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -50 }}
                                        transition={{ delay: commentIndex * 0.1, duration: 0.3 }}
                                        layout
                                    >
                                        {/* Comment Header */}
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-3">
                                                <motion.div 
                                                    className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold"
                                                    whileHover={scaleHover}
                                                >
                                                    {comment.username?.charAt(0) || comment.userFullName?.charAt(0) || 'U'}
                                                </motion.div>
                                                <div>
                                                    <div className="font-bold text-neutral-900">
                                                        {comment.username || comment.userFullName || 'Anonymous'}
                                                    </div>
                                                    <div className="text-sm text-neutral-500">{formatDate(comment.createdAt)}</div>
                                                </div>
                                            </div>
                                            {currentUser && (currentUser.isUserAdmin || comment.userId === currentUser.id) && (
                                                <motion.button
                                                    onClick={() => handleDeleteComment(comment.commentId)}
                                                    className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </motion.button>
                                            )}
                                        </div>

                                        {/* Comment Text */}
                                        <p className="text-neutral-700 leading-relaxed mb-4">{comment.text}</p>

                                        {/* Comment Actions */}
                                        <div className="flex items-center gap-6 mb-4">
                                            <motion.button
                                                onClick={() => handleCommentLike(comment.commentId)}
                                                className={`flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-semibold transition-colors ${
                                                    currentUser && comment.likes.includes(currentUser.id)
                                                        ? 'text-red-600 bg-red-50 border border-red-200' 
                                                        : 'text-neutral-600 hover:text-red-600 hover:bg-red-50'
                                                }`}
                                                whileHover={scaleHover}
                                                whileTap={{ scale: 0.9 }}
                                            >
                                                <Heart className={`w-4 h-4 ${currentUser && comment.likes.includes(currentUser.id) ? 'fill-current' : ''}`} />
                                                {comment.likes.length}
                                            </motion.button>
                                            <motion.button
                                                onClick={() => handleCommentDislike(comment.commentId)}
                                                className={`flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-semibold transition-colors ${
                                                    currentUser && comment.dislikes.includes(currentUser.id)
                                                        ? 'text-neutral-800 bg-neutral-200 border border-neutral-300' 
                                                        : 'text-neutral-600 hover:text-neutral-800 hover:bg-neutral-200'
                                                }`}
                                                whileHover={scaleHover}
                                                whileTap={{ scale: 0.9 }}
                                            >
                                                <ThumbsDown className={`w-4 h-4 ${currentUser && comment.dislikes.includes(currentUser.id) ? 'fill-current' : ''}`} />
                                                {comment.dislikes.length}
                                            </motion.button>
                                            {currentUser && (
                                                <motion.button
                                                    onClick={() => setShowReplyForm(showReplyForm === comment.commentId ? null : comment.commentId)}
                                                    className="flex items-center gap-2 px-3 py-1 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg text-sm font-semibold transition-colors"
                                                    whileHover={scaleHover}
                                                    whileTap={{ scale: 0.9 }}
                                                >
                                                    <Reply className="w-4 h-4" />
                                                    Reply
                                                </motion.button>
                                            )}
                                            <span className="text-sm text-neutral-500 font-medium">
                                                {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
                                            </span>
                                        </div>

                                        {/* Reply Form */}
                                        <AnimatePresence>
                                            {currentUser && showReplyForm === comment.commentId && (
                                                <motion.div 
                                                    className="ml-8 mb-4 bg-neutral-50 rounded-xl p-4 border border-neutral-200"
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: "auto" }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    transition={{ duration: 0.3 }}
                                                >
                                                    <div className="flex gap-3">
                                                        <motion.div 
                                                            className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-sm"
                                                            whileHover={scaleHover}
                                                        >
                                                            {currentUser.fullName?.charAt(0) || 'U'}
                                                        </motion.div>
                                                        <div className="flex-grow">
                                                            <motion.textarea
                                                                value={replyTexts[comment.commentId] || ''}
                                                                onChange={(e) => setReplyTexts(prev => ({ ...prev, [comment.commentId]: e.target.value }))}
                                                                placeholder="Write a reply..."
                                                                className="w-full p-3 border border-neutral-300 rounded-lg resize-none text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                                                rows="2"
                                                                whileFocus={{ scale: 1.02 }}
                                                            />
                                                            <div className="flex justify-end gap-2 mt-3">
                                                                <motion.button
                                                                    onClick={() => setShowReplyForm(null)}
                                                                    className="px-4 py-2 text-neutral-600 hover:bg-neutral-200 rounded-lg text-sm font-semibold transition-colors"
                                                                    whileHover={{ scale: 1.05 }}
                                                                    whileTap={{ scale: 0.95 }}
                                                                >
                                                                    Cancel
                                                                </motion.button>
                                                                <motion.button
                                                                    onClick={() => handleAddReply(comment.commentId)}
                                                                    disabled={!replyTexts[comment.commentId]?.trim()}
                                                                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg disabled:bg-neutral-300 text-sm font-semibold transition-colors hover:bg-indigo-700"
                                                                    whileHover={!replyTexts[comment.commentId]?.trim() ? {} : { scale: 1.05 }}
                                                                    whileTap={!replyTexts[comment.commentId]?.trim() ? {} : { scale: 0.95 }}
                                                                >
                                                                    Reply
                                                                </motion.button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        {/* Replies */}
                                        {comment.replies && comment.replies.length > 0 && (
                                            <div className="ml-8 space-y-4">
                                                <AnimatePresence>
                                                    {comment.replies.map((reply, replyIndex) => (
                                                        <motion.div 
                                                            key={reply.replyId} 
                                                            className="bg-neutral-50 rounded-xl p-4 border border-neutral-200"
                                                            initial={{ opacity: 0, x: -30 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            exit={{ opacity: 0, x: -30 }}
                                                            transition={{ delay: replyIndex * 0.1, duration: 0.3 }}
                                                            layout
                                                        >
                                                            <div className="flex justify-between items-start mb-3">
                                                                <div className="flex items-center gap-3">
                                                                    <motion.div 
                                                                        className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-sm"
                                                                        whileHover={scaleHover}
                                                                    >
                                                                        {reply.username?.charAt(0) || reply.userFullName?.charAt(0) || 'U'}
                                                                    </motion.div>
                                                                    <div>
                                                                        <div className="font-semibold text-neutral-900 text-sm">
                                                                            {reply.username || reply.userFullName || 'Anonymous'}
                                                                        </div>
                                                                        <div className="text-xs text-neutral-500">{formatDate(reply.createdAt)}</div>
                                                                    </div>
                                                                </div>
                                                                {currentUser && (currentUser.isUserAdmin || reply.userId === currentUser.id) && (
                                                                    <motion.button
                                                                        onClick={() => handleDeleteReply(comment.commentId, reply.replyId)}
                                                                        className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded-lg transition-colors"
                                                                        whileHover={{ scale: 1.1 }}
                                                                        whileTap={{ scale: 0.9 }}
                                                                    >
                                                                        <Trash2 className="w-3 h-3" />
                                                                    </motion.button>
                                                                )}
                                                            </div>
                                                            <p className="text-neutral-700 text-sm leading-relaxed mb-3">{reply.text}</p>
                                                            <div className="flex items-center gap-4">
                                                                <motion.button
                                                                    onClick={() => handleReplyLike(comment.commentId, reply.replyId)}
                                                                    className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold transition-colors ${
                                                                        currentUser && reply.likes.includes(currentUser.id)
                                                                            ? 'text-red-600 bg-red-50' 
                                                                            : 'text-neutral-600 hover:text-red-600 hover:bg-red-50'
                                                                    }`}
                                                                    whileHover={scaleHover}
                                                                    whileTap={{ scale: 0.9 }}
                                                                >
                                                                    <Heart className={`w-3 h-3 ${currentUser && reply.likes.includes(currentUser.id) ? 'fill-current' : ''}`} />
                                                                    {reply.likes.length}
                                                                </motion.button>
                                                                <motion.button
                                                                    onClick={() => handleReplyDislike(comment.commentId, reply.replyId)}
                                                                    className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold transition-colors ${
                                                                        currentUser && reply.dislikes.includes(currentUser.id)
                                                                            ? 'text-neutral-800 bg-neutral-200' 
                                                                            : 'text-neutral-600 hover:text-neutral-800 hover:bg-neutral-200'
                                                                    }`}
                                                                    whileHover={scaleHover}
                                                                    whileTap={{ scale: 0.9 }}
                                                                >
                                                                    <ThumbsDown className={`w-3 h-3 ${currentUser && reply.dislikes.includes(currentUser.id) ? 'fill-current' : ''}`} />
                                                                    {reply.dislikes.length}
                                                                </motion.button>
                                                            </div>
                                                        </motion.div>
                                                    ))}
                                                </AnimatePresence>
                                            </div>
                                        )}
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            {/* No Comments */}
                            {outfit.comments.length === 0 && (
                                <motion.div 
                                    className="text-center py-12"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.5, duration: 0.5 }}
                                >
                                    <motion.div 
                                        className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4"
                                        whileHover={{ rotate: 10, scale: 1.1 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        <MessageCircle className="w-8 h-8 text-neutral-400" />
                                    </motion.div>
                                    <h3 className="text-xl font-bold text-neutral-600 mb-2">No comments yet</h3>
                                    <p className="text-neutral-500">Be the first to share your thoughts about this outfit!</p>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}
