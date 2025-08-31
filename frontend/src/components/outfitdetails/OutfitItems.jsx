import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, UserCheck, ExternalLink } from 'lucide-react';

function OutfitItems({ outfit, currentUser }) {
    const scaleHover = { scale: 1.05, transition: { type: "spring", stiffness: 300, damping: 20 } };

    return (
        <motion.div 
            className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6 lg:p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <h2 className="text-2xl font-bold text-neutral-900 mb-6">Outfit Items</h2>
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
                                whileHover={{ scale: 1.02, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <UserCheck className="w-5 h-5" />
                                Sign In
                            </motion.button>
                            <motion.button
                                onClick={() => window.location.href = '/signup'}
                                className="flex items-center justify-center gap-2 px-6 py-3 border border-indigo-600 text-indigo-600 rounded-xl hover:bg-indigo-50 transition-colors font-semibold"
                                whileHover={{ scale: 1.02, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Create Account
                            </motion.button>
                        </motion.div>
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
    );
}

export default OutfitItems;