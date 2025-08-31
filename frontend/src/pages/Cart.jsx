import React, { useState, useEffect, useMemo } from 'react';
import { 
    ShoppingCart, 
    Plus, 
    Minus, 
    Trash2, 
    Heart, 
    ArrowRight, 
    Package, 
    ExternalLink,

    Save,
    X,
    Star,
    Sparkles,
    ShoppingBag,
    Gift,
    Zap,
    Crown,
    ChevronLeft,
    ChevronRight,
    Search,
    Filter,
    Eye,
    Menu,
    Grid,
    List,
    AlertTriangle,
    CheckCircle
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

export default function CartPage() {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updatingItem, setUpdatingItem] = useState(null);

    const [confirmationModal, setConfirmationModal] = useState({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: null,
        type: 'warning' // 'warning', 'danger', 'info'
    });
    
    // Pagination and Display States
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const [viewMode, setViewMode] = useState('table'); // table or card
    const [showFilters, setShowFilters] = useState(false);

    const { currentUser } = useSelector((state) => state.user);

    // Filter and sort cart items
    const filteredAndSortedOutfits = useMemo(() => {
        if (!cart?.outfits) return [];
        
        let filtered = cart.outfits.filter(outfit =>
            outfit.outfitCategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
            outfit.outfitSection.toLowerCase().includes(searchQuery.toLowerCase())
        );

        switch (sortBy) {
            case 'oldest':
                return filtered.sort((a, b) => new Date(a.addedAt) - new Date(b.addedAt));
            case 'price-high':
                return filtered.sort((a, b) => b.totalOutfitPrice - a.totalOutfitPrice);
            case 'price-low':
                return filtered.sort((a, b) => a.totalOutfitPrice - b.totalOutfitPrice);
            case 'newest':
            default:
                return filtered.sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt));
        }
    }, [cart?.outfits, searchQuery, sortBy]);

    // Pagination calculations
    const totalPages = Math.ceil(filteredAndSortedOutfits.length / itemsPerPage);
    const paginatedOutfits = filteredAndSortedOutfits.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Reset page when search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, sortBy]);

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30, scale: 0.95 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 120,
                damping: 15
            }
        },
        exit: {
            opacity: 0,
            y: -30,
            scale: 0.95,
            transition: { duration: 0.3 }
        }
    };

    const buttonVariants = {
        hover: { 
            scale: 1.05,
            boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
            transition: { type: "spring", stiffness: 400, damping: 10 }
        },
        tap: { scale: 0.95 }
    };

    useEffect(() => {
        if (currentUser) {
            fetchCart();
        }
    }, [currentUser]);

    const fetchCart = async () => {
        setLoading(true);
        try {
            const response = await fetch('/backend/cart', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                setCart(data);
            }
        } catch (error) {
            console.error('Error fetching cart:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateQuantity = async (cartOutfitId, newQuantity) => {
        if (newQuantity < 1 || newQuantity > 10) return;
        
        setUpdatingItem(cartOutfitId);
        try {
            const response = await fetch(`/backend/cart/outfit/${cartOutfitId}/quantity`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ quantity: newQuantity })
            });

            if (response.ok) {
                const data = await response.json();
                setCart(data.cart);
                
                // Dispatch custom event to update cart count in header
                window.dispatchEvent(new CustomEvent('cartUpdated'));
                
                toast.success('Quantity updated successfully!', {
                    duration: 2000,
                    position: 'top-center',
                    style: {
                        background: '#10b981',
                        color: 'white',
                        fontWeight: 'bold',
                    },
                });
            } else {
                toast.error('Failed to update quantity', {
                    duration: 3000,
                    position: 'top-center',
                    style: {
                        background: '#ef4444',
                        color: 'white',
                        fontWeight: 'bold',
                    },
                });
            }
        } catch (error) {
            console.error('Error updating quantity:', error);
        } finally {
            setUpdatingItem(null);
        }
    };

    const removeOutfit = (cartOutfitId) => {
        const outfit = cart.outfits.find(o => o.cartOutfitId === cartOutfitId);
        setConfirmationModal({
            isOpen: true,
            title: 'Remove Outfit',
            message: `Are you sure you want to remove "${outfit?.outfitCategory}" from your cart?`,
            type: 'danger',
            onConfirm: async () => {
                try {
                    const response = await fetch(`/backend/cart/outfit/${cartOutfitId}`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
                    });

                    if (response.ok) {
                        const data = await response.json();
                        setCart(data.cart);
                        
                        // Dispatch custom event to update cart count in header
                        window.dispatchEvent(new CustomEvent('cartUpdated'));
                        
                        toast.success('Outfit removed from cart successfully!', {
                            duration: 3000,
                            position: 'top-center',
                            style: {
                                background: '#10b981',
                                color: 'white',
                                fontWeight: 'bold',
                            },
                        });
                    } else {
                        toast.error('Failed to remove outfit from cart', {
                            duration: 3000,
                            position: 'top-center',
                            style: {
                                background: '#ef4444',
                                color: 'white',
                                fontWeight: 'bold',
                            },
                        });
                    }
                } catch (error) {
                    console.error('Error removing outfit:', error);
                    toast.error('An error occurred while removing the outfit', {
                        duration: 3000,
                        position: 'top-center',
                        style: {
                            background: '#ef4444',
                            color: 'white',
                            fontWeight: 'bold',
                        },
                    });
                }
                setConfirmationModal({ isOpen: false, title: '', message: '', onConfirm: null, type: 'warning' });
            }
        });
    };



    const clearCart = () => {
        setConfirmationModal({
            isOpen: true,
            title: 'Clear Cart',
            message: 'Are you sure you want to clear your entire cart? This action cannot be undone.',
            type: 'danger',
            onConfirm: async () => {
                try {
                    const response = await fetch('/backend/cart/clear', {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
                    });

                    if (response.ok) {
                        const data = await response.json();
                        setCart(data.cart);
                        
                        // Dispatch custom event to update cart count in header
                        window.dispatchEvent(new CustomEvent('cartUpdated'));
                        
                        toast.success('Cart cleared successfully!', {
                            duration: 3000,
                            position: 'top-center',
                            style: {
                                background: '#10b981',
                                color: 'white',
                                fontWeight: 'bold',
                            },
                        });
                    } else {
                        toast.error('Failed to clear cart', {
                            duration: 3000,
                            position: 'top-center',
                            style: {
                                background: '#ef4444',
                                color: 'white',
                                fontWeight: 'bold',
                            },
                        });
                    }
                } catch (error) {
                    console.error('Error clearing cart:', error);
                    toast.error('An error occurred while clearing the cart', {
                        duration: 3000,
                        position: 'top-center',
                        style: {
                            background: '#ef4444',
                            color: 'white',
                            fontWeight: 'bold',
                        },
                    });
                }
                setConfirmationModal({ isOpen: false, title: '', message: '', onConfirm: null, type: 'warning' });
            }
        });
    };



    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Navigate to outfit detail page
    const viewOutfitDetails = (outfitUrl) => {
        if (!outfitUrl) {
            console.error('Invalid outfit URL');
            return;
        }
        window.location.href = outfitUrl;
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-30">
                    {[...Array(25)].map((_, i) => (
                        <motion.div
                            key={i}
                            animate={{
                                y: [-20, -50, -20],
                                x: [-10, 10, -10],
                                opacity: [0.2, 0.6, 0.2],
                                scale: [1, 1.3, 1],
                                rotate: [0, 360]
                            }}
                            transition={{
                                duration: 4 + Math.random() * 3,
                                repeat: Infinity,
                                delay: i * 0.3
                            }}
                            className="absolute"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`
                            }}
                        >
                            <div className="w-2 h-2 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full blur-sm" />
                        </motion.div>
                    ))}
                </div>
                
                <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className="relative"
                >
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                        className="h-16 w-16 sm:h-20 sm:w-20 border-4 border-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full p-1"
                    >
                        <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                            <ShoppingBag className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-600" />
                        </div>
                    </motion.div>
                </motion.div>
                
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="absolute mt-24 sm:mt-32 text-gray-600 font-medium text-base sm:text-lg text-center px-4"
                >
                    Loading your cart...
                </motion.p>
            </div>
        );
    }

    if (!currentUser) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    {[...Array(30)].map((_, i) => (
                        <motion.div
                            key={i}
                            animate={{
                                y: [-30, -80, -30],
                                opacity: [0.3, 1, 0.3],
                                scale: [1, 1.3, 1],
                                rotate: [0, 180, 360]
                            }}
                            transition={{
                                duration: 6,
                                repeat: Infinity,
                                delay: i * 0.3
                            }}
                            className="absolute"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`
                            }}
                        >
                            {i % 3 === 0 ? (
                                <Heart className="w-4 h-4 text-pink-400" />
                            ) : i % 3 === 1 ? (
                                <Star className="w-4 h-4 text-indigo-400" />
                            ) : (
                                <Sparkles className="w-4 h-4 text-purple-400" />
                            )}
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 100, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ type: "spring", stiffness: 100, damping: 15 }}
                    className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-6 sm:p-10 max-w-sm sm:max-w-md w-full text-center border border-white/60"
                >
                    <motion.div
                        animate={{ 
                            rotate: [0, -15, 15, -15, 0],
                            scale: [1, 1.1, 1, 1.1, 1]
                        }}
                        transition={{ duration: 4, repeat: Infinity, repeatDelay: 2 }}
                    >
                        <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-6 sm:mb-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center shadow-xl">
                            <ShoppingBag className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                        </div>
                    </motion.div>
                    
                    <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
                        Please Sign In
                    </h2>
                    
                    <p className="text-gray-600 mb-6 sm:mb-8 text-base sm:text-lg">
                        Access your personalized cart
                    </p>
                    
                    <motion.button
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                        onClick={() => window.location.href = '/sign-in'}
                        className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-bold shadow-xl"
                    >
                        Sign In Now
                    </motion.button>
                </motion.div>
            </div>
        );
    }

    const hasCartItems = cart?.outfits?.length > 0;

    // Confirmation Modal Component
    const ConfirmationModal = () => (
        <AnimatePresence>
            {confirmationModal.isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                    onClick={() => setConfirmationModal({ isOpen: false, title: '', message: '', onConfirm: null, type: 'warning' })}
                >
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <div className={`p-3 rounded-full ${
                                confirmationModal.type === 'danger' ? 'bg-red-100' : 
                                confirmationModal.type === 'warning' ? 'bg-yellow-100' : 'bg-blue-100'
                            }`}>
                                <AlertTriangle className={`w-6 h-6 ${
                                    confirmationModal.type === 'danger' ? 'text-red-600' : 
                                    confirmationModal.type === 'warning' ? 'text-yellow-600' : 'text-blue-600'
                                }`} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">{confirmationModal.title}</h3>
                        </div>
                        
                        <p className="text-gray-600 mb-6">{confirmationModal.message}</p>
                        
                        <div className="flex gap-3 justify-end">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setConfirmationModal({ isOpen: false, title: '', message: '', onConfirm: null, type: 'warning' })}
                                className="cursor-pointer px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
                            >
                                Cancel
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={confirmationModal.onConfirm}
                                className={`cursor-pointer px-6 py-2 rounded-lg font-medium text-white transition-colors ${
                                    confirmationModal.type === 'danger' ? 'bg-red-600 hover:bg-red-700' : 
                                    confirmationModal.type === 'warning' ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-blue-600 hover:bg-blue-700'
                                }`}
                            >
                                Confirm
                            </motion.button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );

    // Card View Component for Mobile
    const CardView = ({ outfit }) => (
        <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100"
        >
            <div className="flex flex-col sm:flex-row gap-4">
                {/* Image and Quick Actions */}
                <div className="relative flex-shrink-0 mx-auto sm:mx-0">
                    <img
                        src={outfit.outfitImage}
                        alt={`${outfit.outfitCategory} outfit`}
                        className="w-24 h-24 sm:w-20 sm:h-20 object-cover rounded-xl shadow-md"
                    />
                    {/* View Details Icon */}
                    <motion.button
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                        onClick={() => viewOutfitDetails(outfit.outfitUrl)}
                        className="absolute -top-2 -right-2 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-indigo-700 transition-colors"
                    >
                        <Eye className="w-4 h-4" />
                    </motion.button>
                </div>

                {/* Content */}
                <div className="flex-1 space-y-3">
                    {/* Title and Badges */}
                    <div className="text-center sm:text-left">
                        <h3 className="font-bold text-lg text-gray-900 mb-2">
                            {outfit.outfitCategory}
                        </h3>
                        <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                            <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">
                                {outfit.numberOfItems} items
                            </span>
                            <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                                {outfit.outfitSection}
                            </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-2 flex items-center justify-center sm:justify-start gap-1">
                            <Heart className="w-3 h-3 text-pink-400" />
                            Added {formatDate(outfit.addedAt)}
                        </p>
                    </div>

                    {/* Price and Quantity Row */}
                    <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-1">
                            <motion.button
                                variants={buttonVariants}
                                whileHover="hover"
                                whileTap="tap"
                                onClick={() => updateQuantity(outfit.cartOutfitId, outfit.quantity - 1)}
                                disabled={outfit.quantity <= 1 || updatingItem === outfit.cartOutfitId}
                                className="w-8 h-8 flex items-center justify-center bg-white hover:bg-indigo-50 disabled:bg-gray-50 disabled:cursor-not-allowed rounded-lg transition-colors duration-200 shadow-sm"
                            >
                                <Minus className="w-3 h-3 text-indigo-600" />
                            </motion.button>
                            
                            <div className="w-8 text-center font-bold">
                                {updatingItem === outfit.cartOutfitId ? (
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ repeat: Infinity, duration: 1 }}
                                        className="h-4 w-4 border-2 border-t-indigo-600 border-gray-200 rounded-full mx-auto"
                                    />
                                ) : (
                                    <motion.span
                                        key={outfit.quantity}
                                        initial={{ scale: 1.3 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        {outfit.quantity}
                                    </motion.span>
                                )}
                            </div>
                            
                            <motion.button
                                variants={buttonVariants}
                                whileHover="hover"
                                whileTap="tap"
                                onClick={() => updateQuantity(outfit.cartOutfitId, outfit.quantity + 1)}
                                disabled={outfit.quantity >= 10 || updatingItem === outfit.cartOutfitId}
                                className="w-8 h-8 flex items-center justify-center bg-white hover:bg-indigo-50 disabled:bg-gray-50 disabled:cursor-not-allowed rounded-lg transition-colors duration-200 shadow-sm"
                            >
                                <Plus className="w-3 h-3 text-indigo-600" />
                            </motion.button>
                        </div>

                        {/* Price */}
                        <div className="text-center sm:text-right">
                            
                            <motion.div
                                key={outfit.totalOutfitPrice * outfit.quantity}
                                initial={{ scale: 1.1, color: "#8b5cf6" }}
                                animate={{ scale: 1, color: "#059669" }}
                                transition={{ duration: 0.3 }}
                                className="text-lg font-black text-emerald-600"
                            >
                                ₹{(outfit.totalOutfitPrice * outfit.quantity).toLocaleString()}
                            </motion.div>
                        </div>
                    </div>



                    {/* Actions */}
                    <div className="flex gap-2 justify-center sm:justify-start">
                        <motion.button
                            variants={buttonVariants}
                            whileHover="hover"
                            whileTap="tap"
                            onClick={() => removeOutfit(outfit.cartOutfitId)}
                            className="flex items-center gap-1 px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg text-sm font-medium transition-all duration-200 border border-red-200 hover:border-red-300"
                        >
                            <Trash2 className="w-4 h-4" />
                            Remove
                        </motion.button>
                    </div>
                </div>
            </div>
        </motion.div>
    );

    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
                {[...Array(15)].map((_, i) => (
                    <motion.div
                        key={i}
                        animate={{
                            y: [-10, -30, -10],
                            x: [-5, 5, -5],
                            opacity: [0.2, 0.5, 0.2],
                            scale: [1, 1.2, 1]
                        }}
                        transition={{
                            duration: 5 + i * 0.5,
                            repeat: Infinity,
                            delay: i * 0.4
                        }}
                        className="absolute"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`
                        }}
                    >
                        <div className="w-2 h-2 bg-gradient-to-r from-indigo-300 to-purple-300 rounded-full blur-sm" />
                    </motion.div>
                ))}
            </div>

            <div className="container mx-auto px-4 py-8 sm:py-12 lg:px-8 relative mt-30">
                

                {hasCartItems ? (
                    <div className="space-y-6 sm:space-y-8">
                        {/* Enhanced Controls Section */}
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white/90 backdrop-blur-xl rounded-2xl p-4 sm:p-6 shadow-lg border border-white/60"
                        >
                            {/* Mobile Controls Toggle */}
                            <div className="lg:hidden mb-4">
                                <button
                                    onClick={() => setShowFilters(!showFilters)}
                                    className="flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-xl font-medium"
                                >
                                    <Filter className="w-4 h-4" />
                                    Filters & Sort
                                    <ChevronRight className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-90' : ''}`} />
                                </button>
                            </div>

                            {/* Controls - Always visible on desktop, toggleable on mobile */}
                            <div className={`${showFilters ? 'block' : 'hidden'} lg:block space-y-4`}>
                                {/* First Row - Search */}
                                <div className="w-full">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input
                                            type="text"
                                            placeholder="Search outfits..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white"
                                        />
                                    </div>
                                </div>

                                {/* Second Row - Sort, Items per page, View mode, Clear */}
                                <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
                                    <div className="flex flex-col sm:flex-row gap-3 flex-1">
                                        <select
                                            value={sortBy}
                                            onChange={(e) => setSortBy(e.target.value)}
                                            className="px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white text-sm sm:text-base"
                                        >
                                            <option value="newest">Newest First</option>
                                            <option value="oldest">Oldest First</option>
                                            <option value="price-high">Price: High to Low</option>
                                            <option value="price-low">Price: Low to High</option>
                                        </select>

                                        <select
                                            value={itemsPerPage}
                                            onChange={(e) => {
                                                setItemsPerPage(Number(e.target.value));
                                                setCurrentPage(1);
                                            }}
                                            className="px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white text-sm sm:text-base"
                                        >
                                            <option value={5}>5 per page</option>
                                            <option value={10}>10 per page</option>
                                            <option value={20}>20 per page</option>
                                        </select>

                                        {/* View Mode Toggle */}
                                        <div className="hidden sm:flex items-center gap-2 bg-gray-100 rounded-xl p-1">
                                            <motion.button
                                                variants={buttonVariants}
                                                whileHover="hover"
                                                whileTap="tap"
                                                onClick={() => setViewMode('table')}
                                                className={`p-2 rounded-lg transition-all duration-200 ${
                                                    viewMode === 'table' 
                                                        ? 'bg-white shadow-sm text-indigo-600' 
                                                        : 'text-gray-600 hover:text-indigo-600'
                                                }`}
                                            >
                                                <List className="w-4 h-4" />
                                            </motion.button>
                                            <motion.button
                                                variants={buttonVariants}
                                                whileHover="hover"
                                                whileTap="tap"
                                                onClick={() => setViewMode('card')}
                                                className={`p-2 rounded-lg transition-all duration-200 ${
                                                    viewMode === 'card' 
                                                        ? 'bg-white shadow-sm text-indigo-600' 
                                                        : 'text-gray-600 hover:text-indigo-600'
                                                }`}
                                            >
                                                <Grid className="w-4 h-4" />
                                            </motion.button>
                                        </div>
                                    </div>

                                    <motion.button
                                        variants={buttonVariants}
                                        whileHover="hover"
                                        whileTap="tap"
                                        onClick={clearCart}
                                        className="cursor-pointer flex items-center justify-center gap-2 px-4 py-2 sm:py-3 text-red-500 hover:text-red-600 font-semibold rounded-xl hover:bg-red-50/80 backdrop-blur-sm transition-all duration-300 border border-red-200/60 text-sm sm:text-base"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Clear Cart
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>

                        {/* Content Area - Responsive Table/Card View */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/60 overflow-hidden"
                        >
                            {/* Mobile Card View or Desktop Table View */}
                            {viewMode === 'card' || window.innerWidth < 1024 ? (
                                <>
                                    {/* Card View Content */}
                                    <div className="p-4 sm:p-6">
                                        <AnimatePresence mode="wait">
                                            <motion.div
                                                key={`${currentPage}-${searchQuery}-${sortBy}`}
                                                variants={containerVariants}
                                                initial="hidden"
                                                animate="visible"
                                                exit="exit"
                                                className="space-y-4 sm:space-y-6"
                                            >
                                                {paginatedOutfits.length === 0 ? (
                                                    <div className="p-8 sm:p-12 text-center">
                                                        <Search className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-4" />
                                                        <p className="text-lg sm:text-xl text-gray-500">No outfits found matching your criteria</p>
                                                        <button
                                                            onClick={() => {
                                                                setSearchQuery('');
                                                                setSortBy('newest');
                                                            }}
                                                            className="mt-4 px-4 sm:px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors text-sm sm:text-base"
                                                        >
                                                            Clear Filters
                                                        </button>
                                                    </div>
                                                ) : (
                                                    paginatedOutfits.map((outfit) => (
                                                        <CardView key={outfit.cartOutfitId} outfit={outfit} />
                                                    ))
                                                )}
                                            </motion.div>
                                        </AnimatePresence>
                                    </div>
                                </>
                            ) : (
                                <>
                                    {/* Desktop Table View */}
                                    <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-6 sm:px-8 py-4 sm:py-6">
                                        <div className="hidden lg:grid grid-cols-12 gap-4 items-center text-white font-bold">
                                            <div className="col-span-4 text-base lg:text-lg">Product Details</div>
                                            <div className="col-span-2 text-center text-base lg:text-lg">Quantity</div>
                                            <div className="col-span-2 text-center text-base lg:text-lg">Unit Price</div>
                                            <div className="col-span-2 text-center text-base lg:text-lg">Total Price</div>
                                            <div className="col-span-2 text-center text-base lg:text-lg">Actions</div>
                                        </div>
                                    </div>

                                    <div className="max-h-96 overflow-y-auto overflow-x-hidden">
                                        <AnimatePresence mode="wait">
                                            <motion.div
                                                key={`${currentPage}-${searchQuery}-${sortBy}`}
                                                variants={containerVariants}
                                                initial="hidden"
                                                animate="visible"
                                                exit="exit"
                                                className="divide-y divide-gray-100"
                                            >
                                                {paginatedOutfits.length === 0 ? (
                                                    <div className="p-8 sm:p-12 text-center">
                                                        <Search className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-4" />
                                                        <p className="text-lg sm:text-xl text-gray-500">No outfits found matching your criteria</p>
                                                        <button
                                                            onClick={() => {
                                                                setSearchQuery('');
                                                                setSortBy('newest');
                                                            }}
                                                            className="mt-4 px-4 sm:px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
                                                        >
                                                            Clear Filters
                                                        </button>
                                                    </div>
                                                ) : (
                                                    paginatedOutfits.map((outfit) => (
                                                        <motion.div
                                                            key={outfit.cartOutfitId}
                                                            variants={itemVariants}
                                                            whileHover={{ 
                                                                backgroundColor: "rgba(139, 92, 246, 0.02)",
                                                                
                                                            }}
                                                            className="grid grid-cols-12 gap-4 items-center p-4 sm:p-6 transition-all duration-500"
                                                        >
                                                            {/* Product Details */}
                                                            <div className="col-span-4">
                                                                <div className="flex items-center gap-4 sm:gap-6">
                                                                    <motion.div
                                                                        whileHover={{ scale: 1.1, rotate: 2 }}
                                                                        className="relative flex-shrink-0"
                                                                    >
                                                                        <img
                                                                            src={outfit.outfitImage}
                                                                            alt={`${outfit.outfitCategory} outfit`}
                                                                            className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-2xl shadow-lg cursor-pointer transition-all duration-300"
                                                                            onClick={() => viewOutfitDetails(outfit.outfitUrl)}
                                                                        />
                                                                        {/* View Details Overlay */}
                                                                        <motion.div
                                                                            initial={{ opacity: 0 }}
                                                                            whileHover={{ opacity: 1 }}
                                                                            className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center"
                                                                        >
                                                                            <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                                                                        </motion.div>
                                                                        
                                                                        {/* Quick View Icon */}
                                                                        <motion.button
                                                                            variants={buttonVariants}
                                                                            whileHover="hover"
                                                                            whileTap="tap"
                                                                            onClick={() => viewOutfitDetails(outfit.outfitUrl)}
                                                                            className="cursor-pointer absolute -top-2 -right-2 w-6 h-6 sm:w-7 sm:h-7 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-indigo-700 transition-colors"
                                                                        >
                                                                            <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
                                                                        </motion.button>
                                                                    </motion.div>
                                                                    
                                                                    <div className="min-w-0 flex-1">
                                                                        <motion.h3
                                                                            whileHover={{ x: 5 }}
                                                                            className="text-base sm:text-lg font-bold text-gray-900 mb-2 cursor-pointer"
                                                                            onClick={() => viewOutfitDetails(outfit.outfitUrl)}
                                                                        >
                                                                            {outfit.outfitCategory}
                                                                        </motion.h3>
                                                                        
                                                                        <div className="flex flex-wrap gap-1 sm:gap-2 mb-2">
                                                                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">
                                                                                <Package className="w-3 h-3" />
                                                                                {outfit.numberOfItems} items
                                                                            </span>
                                                                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                                                                                <Star className="w-3 h-3" />
                                                                                {outfit.outfitSection}
                                                                            </span>
                                                                        </div>
                                                                        
                                                                        <p className="text-xs text-gray-500 flex items-center gap-1">
                                                                            <Heart className="w-3 h-3 text-pink-400" />
                                                                            Added {formatDate(outfit.addedAt)}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Quantity */}
                                                            <div className="col-span-2 flex justify-center">
                                                                <div className="flex items-center gap-1 bg-gray-50 rounded-xl p-1">
                                                                    <motion.button
                                                                        variants={buttonVariants}
                                                                        whileHover="hover"
                                                                        whileTap="tap"
                                                                        onClick={() => updateQuantity(outfit.cartOutfitId, outfit.quantity - 1)}
                                                                        disabled={outfit.quantity <= 1 || updatingItem === outfit.cartOutfitId}
                                                                        className="cursor-pointer w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-white hover:bg-indigo-50 disabled:bg-gray-50 disabled:cursor-not-allowed rounded-lg transition-colors duration-200 shadow-sm"
                                                                    >
                                                                        <Minus className="w-3 h-3 text-indigo-600" />
                                                                    </motion.button>
                                                                    
                                                                    <div className="w-8 sm:w-10 text-center font-bold text-sm sm:text-base">
                                                                        {updatingItem === outfit.cartOutfitId ? (
                                                                            <motion.div
                                                                                animate={{ rotate: 360 }}
                                                                                transition={{ repeat: Infinity, duration: 1 }}
                                                                                className="h-4 w-4 border-2 border-t-indigo-600 border-gray-200 rounded-full mx-auto"
                                                                            />
                                                                        ) : (
                                                                            <motion.span
                                                                                key={outfit.quantity}
                                                                                initial={{ scale: 1.3 }}
                                                                                animate={{ scale: 1 }}
                                                                                transition={{ type: "spring", stiffness: 300 }}
                                                                            >
                                                                                {outfit.quantity}
                                                                            </motion.span>
                                                                        )}
                                                                    </div>
                                                                    
                                                                    <motion.button
                                                                        variants={buttonVariants}
                                                                        whileHover="hover"
                                                                        whileTap="tap"
                                                                        onClick={() => updateQuantity(outfit.cartOutfitId, outfit.quantity + 1)}
                                                                        disabled={outfit.quantity >= 10 || updatingItem === outfit.cartOutfitId}
                                                                        className="cursor-pointer w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-white hover:bg-indigo-50 disabled:bg-gray-50 disabled:cursor-not-allowed rounded-lg transition-colors duration-200 shadow-sm"
                                                                    >
                                                                        <Plus className="w-3 h-3 text-indigo-600" />
                                                                    </motion.button>
                                                                </div>
                                                            </div>

                                                            {/* Unit Price */}
                                                            <div className="col-span-2 text-center">
                                                                <div className="text-sm sm:text-lg font-bold text-gray-900">
                                                                    ₹{outfit.totalOutfitPrice.toLocaleString()}
                                                                </div>
                                                                <div className="text-xs text-gray-500">per outfit</div>
                                                            </div>

                                                            {/* Total Price */}
                                                            <div className="col-span-2 text-center">
                                                                <motion.div
                                                                    key={outfit.totalOutfitPrice * outfit.quantity}
                                                                    initial={{ scale: 1.1, color: "#8b5cf6" }}
                                                                    animate={{ scale: 1, color: "#059669" }}
                                                                    transition={{ duration: 0.3 }}
                                                                    className="text-sm sm:text-lg font-black text-emerald-600"
                                                                >
                                                                    ₹{(outfit.totalOutfitPrice * outfit.quantity).toLocaleString()}
                                                                </motion.div>
                                                            </div>



                                                            {/* Actions */}
                                                            <div className="col-span-2 flex justify-center">
                                                                <motion.button
                                                                    variants={buttonVariants}
                                                                    whileHover="hover"
                                                                    whileTap="tap"
                                                                    onClick={() => removeOutfit(outfit.cartOutfitId)}
                                                                    className="cursor-pointer flex items-center gap-2 px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg text-sm font-medium transition-all duration-200 border border-red-200 hover:border-red-300"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                    Remove
                                                                </motion.button>
                                                            </div>
                                                        </motion.div>
                                                    ))
                                                )}
                                            </motion.div>
                                        </AnimatePresence>
                                    </div>
                                </>
                            )}

                            {/* Enhanced Pagination Controls - Always responsive */}
                            {totalPages > 1 && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                    className="bg-gradient-to-r from-gray-50 to-gray-100 px-4 sm:px-8 py-3 sm:py-4 border-t border-gray-200"
                                >
                                    <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0">
                                        <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-600 order-2 sm:order-1">
                                            <span>Showing</span>
                                            <span className="font-semibold text-indigo-600">
                                                {(currentPage - 1) * itemsPerPage + 1}
                                            </span>
                                            <span>to</span>
                                            <span className="font-semibold text-indigo-600">
                                                {Math.min(currentPage * itemsPerPage, filteredAndSortedOutfits.length)}
                                            </span>
                                            <span>of</span>
                                            <span className="font-semibold text-indigo-600">
                                                {filteredAndSortedOutfits.length}
                                            </span>
                                            <span className="hidden sm:inline">outfits</span>
                                        </div>

                                        <div className="flex items-center gap-1 sm:gap-2 order-1 sm:order-2">
                                            <motion.button
                                                variants={buttonVariants}
                                                whileHover="hover"
                                                whileTap="tap"
                                                onClick={() => setCurrentPage(page => Math.max(page - 1, 1))}
                                                disabled={currentPage === 1}
                                                className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 bg-white border border-gray-200 rounded-lg sm:rounded-xl hover:bg-indigo-50 hover:border-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-xs sm:text-sm"
                                            >
                                                <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                                                <span className="hidden sm:inline">Previous</span>
                                            </motion.button>

                                            {/* Page Numbers - Responsive */}
                                            <div className="flex items-center gap-1">
                                                {[...Array(totalPages)].map((_, index) => {
                                                    const page = index + 1;
                                                    const isActive = page === currentPage;
                                                    
                                                    // Show fewer pages on mobile
                                                    const showOnMobile = page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1);
                                                    const showOnDesktop = page === 1 || page === totalPages || (page >= currentPage - 2 && page <= currentPage + 2);
                                                    
                                                    if (window.innerWidth < 640 ? showOnMobile : showOnDesktop) {
                                                        return (
                                                            <motion.button
                                                                key={page}
                                                                variants={buttonVariants}
                                                                whileHover={!isActive ? "hover" : {}}
                                                                whileTap={!isActive ? "tap" : {}}
                                                                onClick={() => setCurrentPage(page)}
                                                                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl font-medium transition-all duration-200 text-xs sm:text-sm ${
                                                                    isActive
                                                                        ? 'bg-indigo-600 text-white shadow-lg'
                                                                        : 'bg-white border border-gray-200 hover:bg-indigo-50 hover:border-indigo-200'
                                                                }`}
                                                            >
                                                                {page}
                                                            </motion.button>
                                                        );
                                                    } else if (
                                                        (page === currentPage - 3 && window.innerWidth >= 640) ||
                                                        (page === currentPage + 3 && window.innerWidth >= 640) ||
                                                        (page === currentPage - 2 && window.innerWidth < 640) ||
                                                        (page === currentPage + 2 && window.innerWidth < 640)
                                                    ) {
                                                        return <span key={page} className="text-gray-400 px-1 sm:px-2">...</span>;
                                                    }
                                                    return null;
                                                })}
                                            </div>

                                            <motion.button
                                                variants={buttonVariants}
                                                whileHover="hover"
                                                whileTap="tap"
                                                onClick={() => setCurrentPage(page => Math.min(page + 1, totalPages))}
                                                disabled={currentPage === totalPages}
                                                className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 bg-white border border-gray-200 rounded-lg sm:rounded-xl hover:bg-indigo-50 hover:border-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-xs sm:text-sm"
                                            >
                                                <span className="hidden sm:inline">Next</span>
                                                <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
                                            </motion.button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Table Footer - Summary */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.7 }}
                                className="bg-gradient-to-r from-indigo-50 to-purple-50 px-4 sm:px-8 py-4 sm:py-6 border-t border-gray-200"
                            >
                                <div className="grid grid-cols-2 sm:grid-cols-12 gap-4 items-center">
                                    <div className="col-span-2 sm:col-span-4">
                                        <div className="flex items-center gap-2 sm:gap-3">
                                            <Gift className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" />
                                            <span className="font-bold text-gray-900 text-base sm:text-lg">Cart Summary</span>
                                        </div>
                                    </div>
                                    <div className="col-span-2 sm:col-span-2 text-center sm:text-left">
                                        <div className="font-bold text-base sm:text-lg text-gray-900">
                                            {cart.totalOutfits} outfit{cart.totalOutfits !== 1 ? 's' : ''}
                                        </div>
                                        <div className="text-xs sm:text-sm text-gray-600">{cart.totalItems} total items</div>
                                    </div>
                                    <div className="hidden sm:block sm:col-span-2"></div>
                                    <div className="col-span-2 text-center">
                                        <motion.div
                                            key={cart.totalPrice}
                                            initial={{ scale: 1.2, backgroundPosition: "0% 50%" }}
                                            animate={{ scale: 1, backgroundPosition: "100% 50%" }}
                                            transition={{ duration: 0.5 }}
                                            className="text-xl sm:text-2xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent"
                                        >
                                            ₹{cart.totalPrice.toLocaleString()}
                                        </motion.div>
                                        <div className="text-xs sm:text-sm text-gray-600">Grand Total</div>
                                    </div>
                                    <div className="col-span-2 sm:col-span-2 flex justify-center">
                                        <motion.div
                                            animate={{ 
                                                scale: [1, 1.05, 1],
                                                rotate: [0, 5, -5, 0]
                                            }}
                                            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                                            className="bg-green-100 text-green-700 px-2 sm:px-3 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-bold flex items-center gap-1 sm:gap-2"
                                        >
                                            <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-current" />
                                            Premium
                                        </motion.div>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 sm:p-16 text-center border border-white/60"
                    >
                        <motion.div
                            animate={{ 
                                y: [-5, 5, -5],
                                rotate: [-2, 2, -2]
                            }}
                            transition={{ duration: 4, repeat: Infinity }}
                        >
                            <div className="w-20 h-20 sm:w-28 sm:h-28 mx-auto mb-6 sm:mb-8 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full flex items-center justify-center shadow-2xl">
                                <ShoppingBag className="w-10 h-10 sm:w-14 sm:h-14 text-white" />
                            </div>
                        </motion.div>
                        
                        <h2 className="text-2xl sm:text-4xl font-black text-gray-900 mb-4">Your Collection Awaits</h2>
                        <p className="text-gray-600 mb-8 sm:mb-10 text-base sm:text-xl">
                            Ready to curate your perfect style collection?
                        </p>
                        
                        <motion.button
                            variants={buttonVariants}
                            whileHover="hover"
                            whileTap="tap"
                            onClick={() => window.location.href = '/outfit'}
                            className="w-full sm:w-auto px-6 sm:px-10 py-3 sm:py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-bold text-base sm:text-xl shadow-xl"
                        >
                            <span className="flex items-center justify-center gap-2 sm:gap-3">
                                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
                                Explore Outfits
                                <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
                            </span>
                        </motion.button>
                    </motion.div>
                )}
            </div>

            {/* Confirmation Modal */}
            <ConfirmationModal />
        </div>
    );
}
