import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Plus, Minus } from 'lucide-react';
import toast from 'react-hot-toast';

function AddToCart({ 
    outfit, 
    currentUser, 
    addingToCart, 
    setAddingToCart, 
    quantity, 
    setQuantity, 
 
    showCartOptions, 
    setShowCartOptions 
}) {
    const buttonHover = {
        scale: 1.02,
        boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
        transition: { duration: 0.2 }
    };
    const scaleHover = { scale: 1.05, transition: { type: "spring", stiffness: 300, damping: 20 } };

    const handleAddToCart = async () => {
        if (!currentUser) {
            toast.error('Please login to add items to cart', {
                duration: 4000,
                position: 'top-center',
                style: {
                    background: '#ef4444',
                    color: 'white',
                    fontWeight: 'bold',
                },
            });
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
                    quantity
                })
            });
    
            const data = await response.json();
    
            if (response.ok) {
                toast.success(`${data.outfitName} added to cart successfully!`, {
                    duration: 4000,
                    position: 'top-center',
                    style: {
                        background: '#10b981',
                        color: 'white',
                        fontWeight: 'bold',
                    },
                    iconTheme: {
                        primary: '#ffffff',
                        secondary: '#10b981',
                    },
                });
                setShowCartOptions(false);
                setQuantity(1);
                
                // Dispatch custom event to update cart count in header
                window.dispatchEvent(new CustomEvent('cartUpdated'));
            } else {
                toast.error(data.error || 'Failed to add outfit to cart', {
                    duration: 4000,
                    position: 'top-center',
                    style: {
                        background: '#ef4444',
                        color: 'white',
                        fontWeight: 'bold',
                    },
                });
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            toast.error('Failed to add outfit to cart', {
                duration: 4000,
                position: 'top-center',
                style: {
                    background: '#ef4444',
                    color: 'white',
                    fontWeight: 'bold',
                },
            });
        } finally {
            setAddingToCart(false);
        }
    };

    return (
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
                        className="cursor-pointer w-full flex items-center justify-center gap-3 px-6 py-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all duration-200 font-bold text-lg shadow-sm"
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
                        <div>
                            <label className="block text-sm font-semibold text-neutral-700 mb-2">
                                Quantity
                            </label>
                            <div className="flex items-center gap-3">
                                <motion.button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="cursor-pointer w-10 h-10 flex items-center justify-center bg-white hover:bg-neutral-100 border border-neutral-300 rounded-lg transition-colors"
                                    whileHover={scaleHover}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <Minus className="w-4 h-4" />
                                </motion.button>
                                <motion.span 
                                    className="cursor-pointer w-16 text-center font-bold text-lg bg-white border border-neutral-300 rounded-lg py-2"
                                    key={quantity}
                                    initial={{ scale: 1.2 }}
                                    animate={{ scale: 1 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {quantity}
                                </motion.span>
                                <motion.button
                                    onClick={() => setQuantity(Math.min(10, quantity + 1))}
                                    className="cursor-pointer w-10 h-10 flex items-center justify-center bg-white hover:bg-neutral-100 border border-neutral-300 rounded-lg transition-colors"
                                    whileHover={scaleHover}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <Plus className="w-4 h-4" />
                                </motion.button>
                            </div>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <motion.button
                                onClick={() => {
                                    setShowCartOptions(false);
                                    setQuantity(1);
                                }}
                                className="cursor-pointer flex-1 px-4 py-3 border border-neutral-300 text-neutral-700 rounded-xl hover:bg-neutral-100 transition-colors font-semibold"
                                whileHover={buttonHover}
                                whileTap={{ scale: 0.95 }}
                            >
                                Cancel
                            </motion.button>
                            <motion.button
                                onClick={handleAddToCart}
                                disabled={addingToCart}
                                className="cursor-pointer flex-2 flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:bg-indigo-400 transition-colors font-semibold"
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
    );
}

export default AddToCart;