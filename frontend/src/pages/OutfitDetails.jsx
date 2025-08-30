import React, { useState, useEffect } from 'react';
import { Heart, ThumbsDown, MessageCircle, ShoppingCart, ExternalLink, Star, Calendar, Eye, Reply, Trash2, Send, Plus, Minus } from 'lucide-react';
import { useSelector } from 'react-redux';

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
          // Redirect to login or show login modal
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
                    'Authorization': `Bearer ${localStorage.getItem('token')}` // Assuming token storage
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
            <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    if (!outfit) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-600 mb-4">Outfit not found</h2>
                    <button
                        onClick={() => window.location.href = '/outfit'}
                        className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                        Back to Outfits
                    </button>
                </div>
            </div>
        );
    }

    const isLiked = currentUser && outfit.likes.includes(currentUser.id);
    const isDisliked = currentUser && outfit.dislikes.includes(currentUser.id);

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
            <div className="container mx-auto px-4 py-8">
                {/* Back Button */}
                <button
                    onClick={() => window.location.href = '/outfit'}
                    className="mb-6 px-4 py-2 text-purple-600 hover:bg-purple-100 rounded-lg transition-colors"
                >
                    ← Back to Outfits
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column - Image and Basic Info */}
                    <div className="space-y-6">
                        {/* Main Image */}
                        <div className="relative">
                            <img
                                src={outfit.image}
                                alt={`${outfit.category} outfit`}
                                className="w-full h-96 object-cover rounded-xl shadow-lg"
                            />
                            {outfit.type !== 'Normal' && (
                                <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-semibold ${
                                    outfit.type === 'Sponsored' ? 'bg-yellow-100 text-yellow-800' :
                                    outfit.type === 'Promoted' ? 'bg-blue-100 text-blue-800' : ''
                                }`}>
                                    {outfit.type}
                                </div>
                            )}
                        </div>

                        {/* Outfit Stats Card */}
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <h2 className="text-xl font-bold mb-4">Outfit Statistics</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="text-center p-3 bg-red-50 rounded-lg">
                                    <Heart className="w-6 h-6 text-red-500 mx-auto mb-1" />
                                    <div className="font-bold text-lg">{outfit.numberOfLikes}</div>
                                    <div className="text-sm text-gray-600">Likes</div>
                                </div>
                                <div className="text-center p-3 bg-gray-50 rounded-lg">
                                    <ThumbsDown className="w-6 h-6 text-gray-500 mx-auto mb-1" />
                                    <div className="font-bold text-lg">{outfit.numberOfDislikes}</div>
                                    <div className="text-sm text-gray-600">Dislikes</div>
                                </div>
                                <div className="text-center p-3 bg-blue-50 rounded-lg">
                                    <MessageCircle className="w-6 h-6 text-blue-500 mx-auto mb-1" />
                                    <div className="font-bold text-lg">{outfit.numberOfComments}</div>
                                    <div className="text-sm text-gray-600">Comments</div>
                                </div>
                                <div className="text-center p-3 bg-green-50 rounded-lg">
                                    <Eye className="w-6 h-6 text-green-500 mx-auto mb-1" />
                                    <div className="font-bold text-lg">{outfit.numberOfClicks}</div>
                                    <div className="text-sm text-gray-600">Views</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Details and Actions */}
                    <div className="space-y-6">
                        {/* Outfit Info Card */}
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-800 mb-2">{outfit.category} Outfit</h1>
                                    <div className="flex items-center gap-3">
                                        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                                            {outfit.section}
                                        </span>
                                        <div className="flex items-center gap-1">
                                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                            <span className="font-medium">{outfit.rateLook.toFixed(1)}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-3xl font-bold text-green-600">₹{outfit.totalPrice.toLocaleString()}</div>
                                    <div className="text-sm text-gray-500">{outfit.numberOfItems} items</div>
                                </div>
                            </div>

                            {/* Description */}
                            {outfit.description && (
                                <div className="mb-4">
                                    <h3 className="font-semibold text-gray-800 mb-2">Description</h3>
                                    <p className="text-gray-600">{outfit.description}</p>
                                </div>
                            )}

                            {/* Tags */}
                            {outfit.tags && outfit.tags.length > 0 && (
                                <div className="mb-4">
                                    <h3 className="font-semibold text-gray-800 mb-2">Tags</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {outfit.tags.map((tag, index) => (
                                            <span
                                                key={index}
                                                className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full"
                                            >
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex gap-3 mb-4">
                                <button
                                    onClick={handleLike}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                                        isLiked 
                                            ? 'bg-red-100 text-red-700 border border-red-200' 
                                            : 'bg-gray-100 hover:bg-red-50 text-gray-700'
                                    }`}
                                >
                                    <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                                    {isLiked ? 'Liked' : 'Like'}
                                </button>
                                <button
                                    onClick={handleDislike}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                                        isDisliked 
                                            ? 'bg-gray-200 text-gray-800 border border-gray-300' 
                                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                    }`}
                                >
                                    <ThumbsDown className={`w-5 h-5 ${isDisliked ? 'fill-current' : ''}`} />
                                    {isDisliked ? 'Disliked' : 'Dislike'}
                                </button>
                                {/* Add to Cart Section */}
                              <div className="space-y-3">
                                  {!showCartOptions ? (
                                      <button 
                                          onClick={() => setShowCartOptions(true)}
                                          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold"
                                      >
                                          <ShoppingCart className="w-5 h-5" />
                                          Add Complete Outfit to Cart
                                      </button>
                                  ) : (
                                      <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                                          {/* Quantity Selector */}
                                          <div>
                                              <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                                              <div className="flex items-center gap-3">
                                                  <button
                                                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                      className="w-8 h-8 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded-full"
                                                  >
                                                      <Minus className="w-4 h-4" />
                                                  </button>
                                                  <span className="w-12 text-center font-semibold">{quantity}</span>
                                                  <button
                                                      onClick={() => setQuantity(Math.min(10, quantity + 1))}
                                                      className="w-8 h-8 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded-full"
                                                  >
                                                      <Plus className="w-4 h-4" />
                                                  </button>
                                              </div>
                                          </div>

                                          {/* Notes */}
                                          <div>
                                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                                  Notes (Optional)
                                              </label>
                                              <textarea
                                                  value={notes}
                                                  onChange={(e) => setNotes(e.target.value)}
                                                  placeholder="Any special instructions or preferences..."
                                                  className="w-full p-3 border border-gray-300 rounded-lg resize-none text-sm"
                                                  rows="2"
                                                  maxLength="200"
                                              />
                                              <div className="text-xs text-gray-500 mt-1">{notes.length}/200</div>
                                          </div>

                                          {/* Action Buttons */}
                                          <div className="flex gap-3">
                                              <button
                                                  onClick={() => {
                                                      setShowCartOptions(false);
                                                      setQuantity(1);
                                                      setNotes('');
                                                  }}
                                                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                              >
                                                  Cancel
                                              </button>
                                              <button
                                                  onClick={handleAddToCart}
                                                  disabled={addingToCart}
                                                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-purple-400 transition-colors"
                                              >
                                                  {addingToCart ? (
                                                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                  ) : (
                                                      <ShoppingCart className="w-4 h-4" />
                                                  )}
                                                  {addingToCart ? 'Adding...' : 'Add to Cart'}
                                              </button>
                                          </div>
                                      </div>
                                  )}
                              </div>
                            </div>

                            {/* Creation Date */}
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Calendar className="w-4 h-4" />
                                Created {formatDate(outfit.createdAt)}
                            </div>
                        </div>

                        {/* Items List */}
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <h2 className="text-xl font-bold mb-4">Outfit Items</h2>
                            <div className="space-y-4">
                                {outfit.items.map((item, index) => (
                                    <div key={item.itemId} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                        <div className="flex-shrink-0 w-8 h-8 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center font-semibold">
                                            {index + 1}
                                        </div>
                                        <div className="flex-grow">
                                            <h4 className="font-semibold text-gray-800">{item.itemName}</h4>
                                            <p className="text-sm text-gray-600">{item.sourceName}</p>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-green-600">₹{item.itemPrice.toLocaleString()}</div>
                                            <a
                                                href={item.itemLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-purple-600 hover:text-purple-800 text-sm flex items-center gap-1"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                View Item <ExternalLink className="w-3 h-3" />
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Comments Section */}
                <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
                    <h2 className="text-2xl font-bold mb-6">Comments ({outfit.numberOfComments})</h2>

                    {/* Add Comment Form */}
                    {currentUser && (
                        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                            <div className="flex gap-4">
                                <div className="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center font-semibold">
                                    {currentUser.fullName?.charAt(0) || 'U'}
                                </div>
                                <div className="flex-grow">
                                    <textarea
                                        value={commentText}
                                        onChange={(e) => setCommentText(e.target.value)}
                                        placeholder="Share your thoughts about this outfit..."
                                        className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        rows="3"
                                    />
                                    <div className="flex justify-end mt-2">
                                        <button
                                            onClick={handleAddComment}
                                            disabled={!commentText.trim()}
                                            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                                        >
                                            <Send className="w-4 h-4" />
                                            Post Comment
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Comments List */}
                    <div className="space-y-6">
                        {outfit.comments.map((comment) => (
                            <div key={comment.commentId} className="border border-gray-200 rounded-lg p-4">
                                {/* Comment Header */}
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                                            {comment.username?.charAt(0) || comment.userFullName?.charAt(0) || 'U'}
                                        </div>
                                        <div>
                                            <div className="font-semibold text-gray-800">
                                                {comment.username || comment.userFullName || 'Anonymous'}
                                            </div>
                                            <div className="text-sm text-gray-500">{formatDate(comment.createdAt)}</div>
                                        </div>
                                    </div>
                                    {currentUser && (currentUser.isUserAdmin || comment.userId === currentUser.id) && (
                                        <button
                                            onClick={() => handleDeleteComment(comment.commentId)}
                                            className="text-red-500 hover:text-red-700 p-1"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>

                                {/* Comment Text */}
                                <p className="text-gray-700 mb-3">{comment.text}</p>

                                {/* Comment Actions */}
                                <div className="flex items-center gap-4 mb-4">
                                    <button
                                        onClick={() => handleCommentLike(comment.commentId)}
                                        className={`flex items-center gap-1 text-sm ${
                                            currentUser && comment.likes.includes(currentUser.id)
                                                ? 'text-red-600' : 'text-gray-600 hover:text-red-600'
                                        }`}
                                    >
                                        <Heart className={`w-4 h-4 ${currentUser && comment.likes.includes(currentUser.id) ? 'fill-current' : ''}`} />
                                        {comment.likes.length}
                                    </button>
                                    <button
                                        onClick={() => handleCommentDislike(comment.commentId)}
                                        className={`flex items-center gap-1 text-sm ${
                                            currentUser && comment.dislikes.includes(currentUser.id)
                                                ? 'text-gray-800' : 'text-gray-600 hover:text-gray-800'
                                        }`}
                                    >
                                        <ThumbsDown className={`w-4 h-4 ${currentUser && comment.dislikes.includes(currentUser.id) ? 'fill-current' : ''}`} />
                                        {comment.dislikes.length}
                                    </button>
                                    {currentUser && (
                                        <button
                                            onClick={() => setShowReplyForm(showReplyForm === comment.commentId ? null : comment.commentId)}
                                            className="flex items-center gap-1 text-sm text-purple-600 hover:text-purple-800"
                                        >
                                            <Reply className="w-4 h-4" />
                                            Reply
                                        </button>
                                    )}
                                    <span className="text-sm text-gray-500">{comment.replies.length} replies</span>
                                </div>

                                {/* Reply Form */}
                                {currentUser && showReplyForm === comment.commentId && (
                                    <div className="ml-8 mb-4 p-3 bg-gray-50 rounded-lg">
                                        <div className="flex gap-3">
                                            <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                                                {currentUser.fullName?.charAt(0) || 'U'}
                                            </div>
                                            <div className="flex-grow">
                                                <textarea
                                                    value={replyTexts[comment.commentId] || ''}
                                                    onChange={(e) => setReplyTexts(prev => ({ ...prev, [comment.commentId]: e.target.value }))}
                                                    placeholder="Write a reply..."
                                                    className="w-full p-2 border border-gray-300 rounded-lg resize-none text-sm"
                                                    rows="2"
                                                />
                                                <div className="flex justify-end gap-2 mt-2">
                                                    <button
                                                        onClick={() => setShowReplyForm(null)}
                                                        className="px-3 py-1 text-gray-600 hover:bg-gray-200 rounded text-sm"
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        onClick={() => handleAddReply(comment.commentId)}
                                                        disabled={!replyTexts[comment.commentId]?.trim()}
                                                        className="px-3 py-1 bg-purple-600 text-white rounded disabled:bg-gray-300 text-sm"
                                                    >
                                                        Reply
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Replies */}
                                {comment.replies && comment.replies.length > 0 && (
                                    <div className="ml-8 space-y-3">
                                        {comment.replies.map((reply) => (
                                            <div key={reply.replyId} className="bg-gray-50 rounded-lg p-3">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center font-semibold text-xs">
                                                            {reply.username?.charAt(0) || reply.userFullName?.charAt(0) || 'U'}
                                                        </div>
                                                        <div>
                                                            <div className="font-medium text-gray-800 text-sm">
                                                                {reply.username || reply.userFullName || 'Anonymous'}
                                                            </div>
                                                            <div className="text-xs text-gray-500">{formatDate(reply.createdAt)}</div>
                                                        </div>
                                                    </div>
                                                    {currentUser && (currentUser.isUserAdmin || reply.userId === currentUser.id) && (
                                                        <button
                                                            onClick={() => handleDeleteReply(comment.commentId, reply.replyId)}
                                                            className="text-red-500 hover:text-red-700 p-1"
                                                        >
                                                            <Trash2 className="w-3 h-3" />
                                                        </button>
                                                    )}
                                                </div>
                                                <p className="text-gray-700 text-sm mb-2">{reply.text}</p>
                                                <div className="flex items-center gap-3">
                                                    <button
                                                        onClick={() => handleReplyLike(comment.commentId, reply.replyId)}
                                                        className={`flex items-center gap-1 text-xs ${
                                                            currentUser && reply.likes.includes(currentUser.id)
                                                                ? 'text-red-600' : 'text-gray-600 hover:text-red-600'
                                                        }`}
                                                    >
                                                        <Heart className={`w-3 h-3 ${currentUser && reply.likes.includes(currentUser.id) ? 'fill-current' : ''}`} />
                                                        {reply.likes.length}
                                                    </button>
                                                    <button
                                                        onClick={() => handleReplyDislike(comment.commentId, reply.replyId)}
                                                        className={`flex items-center gap-1 text-xs ${
                                                            currentUser && reply.dislikes.includes(currentUser.id)
                                                                ? 'text-gray-800' : 'text-gray-600 hover:text-gray-800'
                                                        }`}
                                                    >
                                                        <ThumbsDown className={`w-3 h-3 ${currentUser && reply.dislikes.includes(currentUser.id) ? 'fill-current' : ''}`} />
                                                        {reply.dislikes.length}
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* No Comments */}
                        {outfit.comments.length === 0 && (
                            <div className="text-center py-8">
                                <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                <h3 className="text-lg font-semibold text-gray-600 mb-2">No comments yet</h3>
                                <p className="text-gray-500">Be the first to share your thoughts about this outfit!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}