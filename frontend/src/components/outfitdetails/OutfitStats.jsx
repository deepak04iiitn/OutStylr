import React from 'react';
import { motion } from 'framer-motion';
import { Heart, ThumbsDown, MessageCircle, Eye } from 'lucide-react';

function OutfitStats({ outfit }) {
    const scaleHover = { scale: 1.05, transition: { type: "spring", stiffness: 300, damping: 20 } };
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
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    return (
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
    );
}

export default OutfitStats;