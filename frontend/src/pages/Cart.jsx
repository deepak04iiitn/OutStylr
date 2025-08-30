import React, { useState, useEffect } from 'react';
import { 
    ShoppingCart, 
    Plus, 
    Minus, 
    Trash2, 
    Heart, 
    ArrowRight, 
    Package, 
    CreditCard, 
    Bookmark, 
    RotateCcw,
    ExternalLink,
    Edit3,
    Save,
    X
} from 'lucide-react';
import { useSelector } from 'react-redux';

export default function CartPage() {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updatingItem, setUpdatingItem] = useState(null);
    const [editingNotes, setEditingNotes] = useState(null);
    const [tempNotes, setTempNotes] = useState('');
    const [activeTab, setActiveTab] = useState('cart'); // 'cart' or 'saved'

    const { currentUser } = useSelector((state) => state.user);

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
            } else {
                console.error('Error fetching cart');
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
            }
        } catch (error) {
            console.error('Error updating quantity:', error);
        } finally {
            setUpdatingItem(null);
        }
    };

    const removeOutfit = async (cartOutfitId) => {
        if (!confirm('Are you sure you want to remove this outfit from your cart?')) return;
        
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
            }
        } catch (error) {
            console.error('Error removing outfit:', error);
        }
    };

    const saveForLater = async (cartOutfitId) => {
        try {
            const response = await fetch(`/backend/cart/save-outfit/${cartOutfitId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setCart(data.cart);
            }
        } catch (error) {
            console.error('Error saving outfit for later:', error);
        }
    };

    const moveBackToCart = async (savedOutfitId) => {
        try {
            const response = await fetch(`/backend/cart/move-to-cart/${savedOutfitId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ quantity: 1, notes: '' })
            });

            if (response.ok) {
                const data = await response.json();
                setCart(data.cart);
            }
        } catch (error) {
            console.error('Error moving outfit back to cart:', error);
        }
    };

    const removeSaved = async (savedOutfitId) => {
        if (!confirm('Are you sure you want to permanently remove this saved outfit?')) return;
        
        try {
            const response = await fetch(`/backend/cart/saved/${savedOutfitId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setCart(data.cart);
            }
        } catch (error) {
            console.error('Error removing saved outfit:', error);
        }
    };

    const updateNotes = async (cartOutfitId, newNotes) => {
        try {
            const response = await fetch(`/backend/cart/outfit/${cartOutfitId}/notes`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ notes: newNotes })
            });

            if (response.ok) {
                const data = await response.json();
                setCart(data.cart);
                setEditingNotes(null);
                setTempNotes('');
            }
        } catch (error) {
            console.error('Error updating notes:', error);
        }
    };

    const clearCart = async () => {
        if (!confirm('Are you sure you want to clear your entire cart?')) return;
        
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
            }
        } catch (error) {
            console.error('Error clearing cart:', error);
        }
    };

    const startEditingNotes = (cartOutfitId, currentNotes) => {
        setEditingNotes(cartOutfitId);
        setTempNotes(currentNotes || '');
    };

    const cancelEditingNotes = () => {
        setEditingNotes(null);
        setTempNotes('');
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    if (!currentUser) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
                <div className="text-center bg-white rounded-xl shadow-lg p-8 max-w-md">
                    <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Please Login</h2>
                    <p className="text-gray-600 mb-6">You need to be logged in to view your cart</p>
                    <button
                        onClick={() => window.location.href = '/login'}
                        className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                        Login Now
                    </button>
                </div>
            </div>
        );
    }

    const hasCartItems = cart?.outfits?.length > 0;
    const hasSavedItems = cart?.savedOutfits?.length > 0;

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">Shopping Cart</h1>
                    <p className="text-gray-600">
                        {hasCartItems ? `${cart.totalOutfits} outfit${cart.totalOutfits !== 1 ? 's' : ''} in your cart` : 'Your cart is empty'}
                    </p>
                </div>

                {/* Tab Navigation */}
                <div className="flex gap-4 mb-6">
                    <button
                        onClick={() => setActiveTab('cart')}
                        className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                            activeTab === 'cart'
                                ? 'bg-purple-600 text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                        Cart ({cart?.outfits?.length || 0})
                    </button>
                    
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {activeTab === 'cart' ? (
                            // Cart Items
                            <div className="space-y-6">
                                {hasCartItems ? (
                                    <>
                                        {/* Clear Cart Button */}
                                        <div className="flex justify-end">
                                            <button
                                                onClick={clearCart}
                                                className="text-red-600 hover:text-red-800 text-sm flex items-center gap-2"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                                Clear Cart
                                            </button>
                                        </div>

                                        {cart.outfits.map((outfit) => (
                                            <div key={outfit.cartOutfitId} className="bg-white rounded-xl shadow-lg p-6">
                                                <div className="flex gap-6">
                                                    {/* Outfit Image */}
                                                    <div className="flex-shrink-0">
                                                        <img
                                                            src={outfit.outfitImage}
                                                            alt={`${outfit.outfitCategory} outfit`}
                                                            className="w-32 h-40 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                                                            onClick={() => window.location.href = `/outfit/${outfit.outfitId}`}
                                                        />
                                                    </div>

                                                    {/* Outfit Details */}
                                                    <div className="flex-grow">
                                                        <div className="flex justify-between items-start mb-3">
                                                            <div>
                                                                <h3 className="text-xl font-bold text-gray-800 mb-1">
                                                                    {outfit.outfitCategory} - {outfit.outfitSection}
                                                                </h3>
                                                                
                                                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                                                    <span className="flex items-center gap-1">
                                                                        <Package className="w-4 h-4" />
                                                                        {outfit.numberOfItems} items
                                                                    </span>
                                                                    <span>Added {formatDate(outfit.addedAt)}</span>
                                                                </div>
                                                            </div>
                                                            <div className="text-right">
                                                                <div className="text-2xl font-bold text-green-600">
                                                                    ₹{(outfit.totalOutfitPrice * outfit.quantity).toLocaleString()}
                                                                </div>
                                                                <div className="text-sm text-gray-500">
                                                                    ₹{outfit.totalOutfitPrice.toLocaleString()} each
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Notes Section */}
                                                        <div className="mb-4">
                                                            {editingNotes === outfit.cartOutfitId ? (
                                                                <div className="space-y-2">
                                                                    <textarea
                                                                        value={tempNotes}
                                                                        onChange={(e) => setTempNotes(e.target.value)}
                                                                        placeholder="Add notes for this outfit..."
                                                                        className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                                                                        rows="2"
                                                                        maxLength="200"
                                                                    />
                                                                    <div className="flex justify-between items-center">
                                                                        <span className="text-xs text-gray-500">{tempNotes.length}/200</span>
                                                                        <div className="flex gap-2">
                                                                            <button
                                                                                onClick={cancelEditingNotes}
                                                                                className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded text-sm flex items-center gap-1"
                                                                            >
                                                                                <X className="w-3 h-3" />
                                                                                Cancel
                                                                            </button>
                                                                            <button
                                                                                onClick={() => updateNotes(outfit.cartOutfitId, tempNotes)}
                                                                                className="px-3 py-1 bg-purple-600 text-white rounded text-sm flex items-center gap-1 hover:bg-purple-700"
                                                                            >
                                                                                <Save className="w-3 h-3" />
                                                                                Save
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <div 
                                                                    onClick={() => startEditingNotes(outfit.cartOutfitId, outfit.notes)}
                                                                    className="group cursor-pointer"
                                                                >
                                                                    <div className="flex items-center gap-2">
                                                                        <Edit3 className="w-4 h-4 text-gray-400 group-hover:text-purple-600" />
                                                                        <span className="text-sm text-gray-600 group-hover:text-purple-600">
                                                                            {outfit.notes || 'Add notes...'}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* Quantity and Actions */}
                                                        <div className="flex justify-between items-center">
                                                            <div className="flex items-center gap-4">
                                                                {/* Quantity Controls */}
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-sm font-medium text-gray-700">Qty:</span>
                                                                    <button
                                                                        onClick={() => updateQuantity(outfit.cartOutfitId, outfit.quantity - 1)}
                                                                        disabled={outfit.quantity <= 1 || updatingItem === outfit.cartOutfitId}
                                                                        className="w-8 h-8 flex items-center justify-center bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed rounded-full"
                                                                    >
                                                                        <Minus className="w-4 h-4" />
                                                                    </button>
                                                                    <span className="w-12 text-center font-semibold">
                                                                        {updatingItem === outfit.cartOutfitId ? (
                                                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600 mx-auto"></div>
                                                                        ) : (
                                                                            outfit.quantity
                                                                        )}
                                                                    </span>
                                                                    <button
                                                                        onClick={() => updateQuantity(outfit.cartOutfitId, outfit.quantity + 1)}
                                                                        disabled={outfit.quantity >= 10 || updatingItem === outfit.cartOutfitId}
                                                                        className="w-8 h-8 flex items-center justify-center bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed rounded-full"
                                                                    >
                                                                        <Plus className="w-4 h-4" />
                                                                    </button>
                                                                </div>
                                                            </div>

                                                            {/* Action Buttons */}
                                                            <div className="flex gap-2">
                                                                
                                                                <button
                                                                    onClick={() => removeOutfit(outfit.cartOutfitId)}
                                                                    className="flex items-center gap-1 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                    Remove
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </>
                                ) : (
                                    // Empty Cart
                                    <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                                        <ShoppingCart className="w-20 h-20 text-gray-400 mx-auto mb-6" />
                                        <h2 className="text-2xl font-bold text-gray-600 mb-4">Your cart is empty</h2>
                                        <p className="text-gray-500 mb-8">Discover amazing outfits and add them to your cart!</p>
                                        <button
                                            onClick={() => window.location.href = '/outfit'}
                                            className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold"
                                        >
                                            Browse Outfits
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            // Saved Items
                            <div className="space-y-6">
                                {hasSavedItems ? (
                                    cart.savedOutfits.map((outfit) => (
                                        <div key={outfit.cartOutfitId} className="bg-white rounded-xl shadow-lg p-6">
                                            <div className="flex gap-6">
                                                <div className="flex-shrink-0">
                                                    <img
                                                        src={outfit.outfitImage}
                                                        alt={`${outfit.outfitCategory} outfit`}
                                                        className="w-32 h-40 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                                                        onClick={() => window.location.href = `/outfit/${outfit.outfitId}`}
                                                    />
                                                </div>
                                                <div className="flex-grow">
                                                    <div className="flex justify-between items-start mb-3">
                                                        <div>
                                                            <h3 className="text-xl font-bold text-gray-800 mb-1">
                                                                {outfit.outfitCategory} - {outfit.outfitSection}
                                                            </h3>
                                                            
                                                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                                                <span className="flex items-center gap-1">
                                                                    <Package className="w-4 h-4" />
                                                                    {outfit.numberOfItems} items
                                                                </span>
                                                                <span>Saved {formatDate(outfit.savedAt)}</span>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <div className="text-2xl font-bold text-green-600">
                                                                ₹{outfit.totalOutfitPrice.toLocaleString()}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            onClick={() => moveBackToCart(outfit.cartOutfitId)}
                                                            className="flex items-center gap-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                                                        >
                                                            <RotateCcw className="w-4 h-4" />
                                                            Move to Cart
                                                        </button>
                                                        <button
                                                            onClick={() => removeSaved(outfit.cartOutfitId)}
                                                            className="flex items-center gap-1 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                            Remove
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                                        <Bookmark className="w-20 h-20 text-gray-400 mx-auto mb-6" />
                                        <h2 className="text-2xl font-bold text-gray-600 mb-4">No saved outfits</h2>
                                        <p className="text-gray-500">Items you save for later will appear here</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Sidebar - Order Summary */}
                    {activeTab === 'cart' && hasCartItems && (
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6">
                                <h2 className="text-xl font-bold mb-6">Order Summary</h2>
                                
                                {/* Summary Stats */}
                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Total Outfits:</span>
                                        <span className="font-semibold">{cart.totalOutfits}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Total Items:</span>
                                        <span className="font-semibold">{cart.totalItems}</span>
                                    </div>
                                    <div className="border-t pt-4">
                                        <div className="flex justify-between text-lg font-bold">
                                            <span>Total:</span>
                                            <span className="text-green-600">₹{cart.totalPrice.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Breakdown */}
                                <div className="mb-6">
                                    <h3 className="font-semibold mb-3">Outfit Breakdown:</h3>
                                    <div className="space-y-2 text-sm">
                                        {cart.outfits.map((outfit) => (
                                            <div key={outfit.cartOutfitId} className="flex justify-between">
                                                <span className="text-gray-600">
                                                    {outfit.outfitCategory} × {outfit.quantity}
                                                </span>
                                                <span>₹{(outfit.totalOutfitPrice * outfit.quantity).toLocaleString()}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                
                            </div>
                        </div>
                    )}
                </div>

                {/* Quick Actions Bar - Only show when cart has items */}
                {hasCartItems && activeTab === 'cart' && (
                    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 lg:hidden">
                        <div className="flex justify-between items-center">
                            <div>
                                <div className="font-bold text-lg">₹{cart.totalPrice.toLocaleString()}</div>
                                <div className="text-sm text-gray-600">{cart.totalOutfits} outfit(s)</div>
                            </div>
                            <button className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold flex items-center gap-2">
                                <CreditCard className="w-5 h-5" />
                                Checkout
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}