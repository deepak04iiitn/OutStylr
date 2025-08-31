import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send } from 'lucide-react';
import Comment from './Comment';

function CommentsSection({ 
    outfit, 
    currentUser, 
    commentText, 
    setCommentText, 
    replyTexts, 
    setReplyTexts, 
    showReplyForm, 
    setShowReplyForm, 
    setOutfit, 
    outfitId 
}) {
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

    return (
        <motion.div 
            className="mt-4 sm:mt-6 lg:mt-8 bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-slate-200 overflow-hidden"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
        >
            <div className="p-4 sm:p-6 lg:p-8 xl:p-10 border-b border-slate-200 bg-slate-50/30">
                <div className="flex items-center justify-between flex-wrap gap-4 sm:gap-0">
                    <motion.h2 
                        className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight"
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                    >
                        Comments
                    </motion.h2>
                    <motion.div 
                        className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-indigo-100 text-indigo-800 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm border-2 border-indigo-200"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                        whileHover={{ scale: 1.05 }}
                    >
                        <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="hidden xs:inline">
                            {outfit.numberOfComments} {outfit.numberOfComments === 1 ? 'Comment' : 'Comments'}
                        </span>
                        <span className="xs:hidden">{outfit.numberOfComments}</span>
                    </motion.div>
                </div>
            </div>

            <div className="p-4 sm:p-6 lg:p-8 xl:p-10">
                {currentUser && (
                    <motion.div 
                        className="mb-6 sm:mb-8 lg:mb-10 bg-slate-50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border-2 border-slate-200 shadow-sm"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        whileHover={{ shadow: "0 10px 40px rgba(0,0,0,0.1)" }}
                    >
                        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                            <motion.div 
                                className="flex-shrink-0 self-start sm:self-auto"
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-indigo-600 text-white rounded-xl sm:rounded-2xl flex items-center justify-center font-black text-sm sm:text-base lg:text-lg shadow-lg">
                                    {currentUser.username?.charAt(0) || 'U'}
                                </div>
                            </motion.div>
                            <div className="flex-grow min-w-0">
                                <motion.textarea
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                    placeholder="Share your thoughts about this outfit..."
                                    className="w-full p-4 sm:p-5 lg:p-6 border-2 border-slate-300 rounded-xl sm:rounded-2xl resize-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-700 font-medium placeholder-slate-400 shadow-sm text-sm sm:text-base"
                                    rows="3"
                                    maxLength="500"
                                    whileFocus={{ scale: 1.02 }}
                                />
                                <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center mt-3 sm:mt-4 gap-3 xs:gap-0">
                                    <div className="text-xs sm:text-sm text-slate-500 font-medium">
                                        {commentText.length}/500 characters
                                    </div>
                                    <motion.button
                                        onClick={handleAddComment}
                                        disabled={!commentText.trim()}
                                        className="w-full xs:w-auto cursor-pointer px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 bg-indigo-600 text-white rounded-xl sm:rounded-2xl hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 sm:gap-3 font-bold text-sm sm:text-base shadow-lg hover:shadow-xl"
                                        whileHover={!commentText.trim() ? {} : { scale: 1.05, y: -2 }}
                                        whileTap={!commentText.trim() ? {} : { scale: 0.95 }}
                                    >
                                        <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                                        <span className="hidden xs:inline">Post Comment</span>
                                        <span className="xs:hidden">Post</span>
                                    </motion.button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                <div className="space-y-4 sm:space-y-6 lg:space-y-8">
                    <AnimatePresence>
                        {outfit.comments.map((comment, commentIndex) => (
                            <Comment
                                key={comment.commentId}
                                comment={comment}
                                commentIndex={commentIndex}
                                currentUser={currentUser}
                                outfitId={outfitId}
                                setOutfit={setOutfit}
                                replyTexts={replyTexts}
                                setReplyTexts={setReplyTexts}
                                showReplyForm={showReplyForm}
                                setShowReplyForm={setShowReplyForm}
                            />
                        ))}
                    </AnimatePresence>
                    {outfit.comments.length === 0 && (
                        <motion.div 
                            className="text-center py-12 sm:py-16 lg:py-20 bg-slate-50 rounded-2xl sm:rounded-3xl border-2 border-dashed border-slate-300"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5, duration: 0.5 }}
                        >
                            <motion.div 
                                className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-200 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg"
                                whileHover={{ rotate: 10, scale: 1.1 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <MessageCircle className="w-8 h-8 sm:w-10 sm:h-10 text-slate-400" />
                            </motion.div>
                            <h3 className="text-lg sm:text-xl lg:text-2xl font-black text-slate-600 mb-2 sm:mb-3 tracking-tight">No comments yet</h3>
                            <p className="text-slate-500 font-medium text-sm sm:text-base lg:text-lg px-4">Be the first to share your thoughts about this outfit!</p>
                        </motion.div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}

export default CommentsSection;