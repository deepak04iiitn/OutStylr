import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ThumbsDown, Reply as ReplyIcon, Trash2, MessageCircle } from 'lucide-react';
import Reply from './Reply';

function Comment({ 
    comment, 
    commentIndex, 
    currentUser, 
    outfitId, 
    setOutfit, 
    replyTexts, 
    setReplyTexts, 
    showReplyForm, 
    setShowReplyForm 
}) {
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
            className="bg-white border-2 border-slate-200 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-sm hover:shadow-lg transition-all duration-300 relative overflow-hidden"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ delay: commentIndex * 0.1, duration: 0.3 }}
            layout
            whileHover={{ y: -2 }}
        >
            <div className="absolute top-0 left-0 w-1.5 sm:w-2 h-full bg-indigo-500 rounded-r-lg" />
            <div className="flex justify-between items-start mb-4 sm:mb-6">
                <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                    <motion.div 
                        className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-indigo-600 text-white rounded-xl sm:rounded-2xl flex items-center justify-center font-black text-sm sm:text-base lg:text-lg shadow-lg relative overflow-hidden flex-shrink-0"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        <div className="absolute inset-0 bg-white/20 transform -skew-y-12 translate-y-full group-hover:translate-y-0 transition-transform" />
                        {comment.username?.charAt(0) || comment.userFullName?.charAt(0) || 'U'}
                    </motion.div>
                    <div className="min-w-0 flex-1">
                        <div className="font-black text-slate-900 text-base sm:text-lg tracking-tight truncate">
                            {comment.username || comment.userFullName || 'Anonymous'}
                        </div>
                        <div className="text-xs sm:text-sm text-slate-500 font-semibold">{formatDate(comment.createdAt)}</div>
                    </div>
                </div>
                {currentUser && (currentUser.isUserAdmin || comment.userId === currentUser.id) && (
                    <motion.button
                        onClick={() => handleDeleteComment(comment.commentId)}
                        className="cursor-pointer text-red-500 hover:text-red-700 p-2 sm:p-3 hover:bg-red-50 rounded-xl sm:rounded-2xl transition-all shadow-sm hover:shadow-md flex-shrink-0 ml-2"
                        whileHover={{ scale: 1.1, rotate: 10 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    </motion.button>
                )}
            </div>
            <motion.div 
                className="mb-4 sm:mb-6 lg:mb-8 pl-0 sm:pl-16 lg:pl-18"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
            >
                <p className="text-slate-700 leading-relaxed text-sm sm:text-base lg:text-lg font-medium break-words">{comment.text}</p>
            </motion.div>
            <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-4 xs:gap-0 pl-0 sm:pl-16 lg:pl-18">
                <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 flex-wrap">
                    <motion.button
                        onClick={() => handleCommentLike(comment.commentId)}
                        className={`cursor-pointer flex items-center gap-2 sm:gap-3 px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5 lg:py-3 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm transition-all shadow-sm hover:shadow-md ${
                            currentUser && comment.likes.includes(currentUser.id)
                                ? 'text-red-700 bg-red-50 border-2 border-red-200' 
                                : 'text-slate-600 hover:text-red-600 hover:bg-red-50 border-2 border-slate-200 bg-white'
                        }`}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${currentUser && comment.likes.includes(currentUser.id) ? 'fill-current' : ''}`} />
                        <span>{comment.likes.length}</span>
                    </motion.button>
                    <motion.button
                        onClick={() => handleCommentDislike(comment.commentId)}
                        className={`cursor-pointer flex items-center gap-2 sm:gap-3 px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5 lg:py-3 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm transition-all shadow-sm hover:shadow-md ${
                            currentUser && comment.dislikes.includes(currentUser.id)
                                ? 'text-slate-800 bg-slate-200 border-2 border-slate-300' 
                                : 'text-slate-600 hover:text-slate-800 hover:bg-slate-200 border-2 border-slate-200 bg-white'
                        }`}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <ThumbsDown className={`w-4 h-4 sm:w-5 sm:h-5 ${currentUser && comment.dislikes.includes(currentUser.id) ? 'fill-current' : ''}`} />
                        <span>{comment.dislikes.length}</span>
                    </motion.button>
                    {currentUser && (
                        <motion.button
                            onClick={() => setShowReplyForm(showReplyForm === comment.commentId ? null : comment.commentId)}
                            className="cursor-pointer flex items-center gap-2 sm:gap-3 px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5 lg:py-3 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 bg-white border-2 border-indigo-200 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm transition-all shadow-sm hover:shadow-md"
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <ReplyIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                            <span className="hidden xs:inline">Reply</span>
                        </motion.button>
                    )}
                </div>
                <motion.div 
                    className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 lg:px-4 py-1.5 sm:py-2 bg-slate-100 text-slate-700 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm border border-slate-200"
                    whileHover={{ scale: 1.05 }}
                >
                    <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden xs:inline">
                        {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
                    </span>
                    <span className="xs:hidden">{comment.replies.length}</span>
                </motion.div>
            </div>
            <AnimatePresence>
                {currentUser && showReplyForm === comment.commentId && (
                    <motion.div 
                        className="mt-6 sm:mt-8 ml-0 sm:ml-16 lg:ml-18 bg-slate-50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 border-2 border-slate-200"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                            <motion.div 
                                className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-600 text-white rounded-lg sm:rounded-xl flex items-center justify-center font-black shadow-md flex-shrink-0 self-start"
                                whileHover={{ scale: 1.1, rotate: 5 }}
                            >
                                {currentUser.username?.charAt(0) || 'U'}
                            </motion.div>
                            <div className="flex-grow min-w-0">
                                <motion.textarea
                                    value={replyTexts[comment.commentId] || ''}
                                    onChange={(e) => setReplyTexts(prev => ({ ...prev, [comment.commentId]: e.target.value }))}
                                    placeholder="Write a reply..."
                                    className="w-full p-3 sm:p-4 border-2 border-slate-300 rounded-lg sm:rounded-xl resize-none font-medium focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm sm:text-base"
                                    rows="3"
                                    whileFocus={{ scale: 1.02 }}
                                />
                                <div className="flex flex-col xs:flex-row justify-end gap-2 xs:gap-3 mt-3 sm:mt-4">
                                    <motion.button
                                        onClick={() => setShowReplyForm(null)}
                                        className="w-full xs:w-auto cursor-pointer px-4 sm:px-6 py-2 sm:py-2.5 text-slate-600 hover:bg-slate-200 bg-white border-2 border-slate-200 rounded-lg sm:rounded-xl font-bold transition-all shadow-sm hover:shadow-md text-sm"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Cancel
                                    </motion.button>
                                    <motion.button
                                        onClick={() => handleAddReply(comment.commentId)}
                                        disabled={!replyTexts[comment.commentId]?.trim()}
                                        className="w-full xs:w-auto cursor-pointer px-4 sm:px-6 py-2 sm:py-2.5 bg-indigo-600 text-white rounded-lg sm:rounded-xl disabled:bg-slate-300 font-bold transition-all hover:bg-indigo-700 shadow-md hover:shadow-lg text-sm"
                                        whileHover={!replyTexts[comment.commentId]?.trim() ? {} : { scale: 1.05, y: -2 }}
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
            {comment.replies && comment.replies.length > 0 && (
                <motion.div 
                    className="mt-6 sm:mt-8 ml-0 sm:ml-16 lg:ml-18 space-y-4 sm:space-y-6 relative"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                >
                    <div className="absolute left-5 sm:left-6 w-px bg-slate-200 h-full hidden sm:block" />
                    <AnimatePresence>
                        {comment.replies.map((reply, replyIndex) => (
                            <Reply
                                key={reply.replyId}
                                reply={reply}
                                replyIndex={replyIndex}
                                commentId={comment.commentId}
                                outfitId={outfitId}
                                currentUser={currentUser}
                                setOutfit={setOutfit}
                            />
                        ))}
                    </AnimatePresence>
                </motion.div>
            )}
        </motion.div>
    );
}

export default Comment;