import React from 'react';
import { motion } from 'framer-motion';
import { Heart, ThumbsDown, Trash2 } from 'lucide-react';

function Reply({ reply, replyIndex, commentId, outfitId, currentUser, setOutfit }) {
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

    return (
        <motion.div 
            className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border-2 border-slate-200 shadow-sm hover:shadow-md transition-all relative"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ delay: replyIndex * 0.1, duration: 0.3 }}
            layout
            whileHover={{ x: 4 }}
        >
            <div className="absolute top-0 left-0 w-1 h-full bg-indigo-400 rounded-r" />
            <div className="flex justify-between items-start mb-3 sm:mb-4">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                    <motion.div 
                        className="w-8 h-8 sm:w-10 sm:h-10 bg-indigo-600 text-white rounded-lg sm:rounded-xl flex items-center justify-center font-black text-xs sm:text-sm shadow-md flex-shrink-0"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                        {reply.username?.charAt(0) || reply.userFullName?.charAt(0) || 'U'}
                    </motion.div>
                    <div className="min-w-0 flex-1">
                        <div className="font-black text-slate-900 text-sm sm:text-base truncate">
                            {reply.username || reply.userFullName || 'Anonymous'}
                        </div>
                        <div className="text-xs text-slate-500 font-semibold">{formatDate(reply.createdAt)}</div>
                    </div>
                </div>
                {currentUser && (currentUser.isUserAdmin || reply.userId === currentUser.id) && (
                    <motion.button
                        onClick={() => handleDeleteReply(commentId, reply.replyId)}
                        className="cursor-pointer text-red-500 hover:text-red-700 p-1.5 sm:p-2 hover:bg-red-50 rounded-lg sm:rounded-xl transition-all shadow-sm hover:shadow-md flex-shrink-0 ml-2"
                        whileHover={{ scale: 1.1, rotate: 10 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                    </motion.button>
                )}
            </div>
            <p className="text-slate-700 font-medium leading-relaxed mb-3 sm:mb-4 pl-0 sm:pl-13 text-sm sm:text-base break-words">{reply.text}</p>
            <div className="flex items-center gap-2 sm:gap-3 pl-0 sm:pl-13 flex-wrap">
                <motion.button
                    onClick={() => handleReplyLike(commentId, reply.replyId)}
                    className={`cursor-pointer flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl font-bold text-xs transition-all shadow-sm hover:shadow-md ${
                        currentUser && reply.likes.includes(currentUser.id)
                            ? 'text-red-700 bg-red-50 border border-red-200' 
                            : 'text-slate-600 hover:text-red-600 hover:bg-red-50 border border-slate-200 bg-white'
                    }`}
                    whileHover={{ scale: 1.05, y: -1 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Heart className={`w-3 h-3 ${currentUser && reply.likes.includes(currentUser.id) ? 'fill-current' : ''}`} />
                    <span>{reply.likes.length}</span>
                </motion.button>
                <motion.button
                    onClick={() => handleReplyDislike(commentId, reply.replyId)}
                    className={`cursor-pointer flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl font-bold text-xs transition-all shadow-sm hover:shadow-md ${
                        currentUser && reply.dislikes.includes(currentUser.id)
                            ? 'text-slate-800 bg-slate-200 border border-slate-300' 
                            : 'text-slate-600 hover:text-slate-800 hover:bg-slate-200 border border-slate-200 bg-white'
                    }`}
                    whileHover={{ scale: 1.05, y: -1 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <ThumbsDown className={`w-3 h-3 ${currentUser && reply.dislikes.includes(currentUser.id) ? 'fill-current' : ''}`} />
                    <span>{reply.dislikes.length}</span>
                </motion.button>
            </div>
        </motion.div>
    );
}

export default Reply;