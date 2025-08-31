import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ZoomIn } from 'lucide-react';
import ImageModal from '../ImageModal';

function OutfitImage({ outfit }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const scaleHover = { scale: 1.05, transition: { type: "spring", stiffness: 300, damping: 20 } };

    const handleImageClick = () => {
        setIsModalOpen(true);
    };

    return (
        <>
            <motion.div 
                className="relative group cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                onClick={handleImageClick}
            >
                <motion.div 
                    className="aspect-[3/4] bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden relative"
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
                    
                    {/* Zoom overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                        className="absolute inset-0 bg-black/40 flex items-center justify-center"
                    >
                        <motion.div
                            initial={{ scale: 0.8 }}
                            whileHover={{ scale: 1 }}
                            className="bg-white/90 backdrop-blur-sm rounded-full p-3"
                        >
                            <ZoomIn className="w-6 h-6 text-gray-800" />
                        </motion.div>
                    </motion.div>
                    
                    {/* Click hint */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1 }}
                        className="absolute bottom-4 left-4 right-4"
                    >
                        <div className="bg-black/70 backdrop-blur-sm text-white text-xs px-3 py-2 rounded-lg text-center">
                            Click to view full size
                        </div>
                    </motion.div>
                    
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
            
            <ImageModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                imageUrl={outfit.image}
                imageAlt={`${outfit.category} - ${outfit.section} Outfit`}
            />
        </>
    );
}

export default OutfitImage;