import React from 'react';
import { motion } from 'framer-motion';

function OutfitImage({ outfit }) {
    const scaleHover = { scale: 1.05, transition: { type: "spring", stiffness: 300, damping: 20 } };

    return (
        <motion.div 
            className="relative group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
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
    );
}

export default OutfitImage;