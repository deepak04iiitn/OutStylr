import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn, Download, Share2 } from 'lucide-react';

const ImageModal = ({ isOpen, onClose, imageUrl, imageAlt = "Image" }) => {
    if (!isOpen) return null;

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = imageAlt || 'image';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: imageAlt,
                    url: window.location.href,
                });
            } catch (error) {
                console.log('Error sharing:', error);
            }
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(window.location.href);
            // You could add a toast notification here
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
                    onClick={onClose}
                >
                    {/* Backdrop */}
                    <div className="absolute inset-0" onClick={onClose} />
                    
                    {/* Modal Content */}
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="relative max-w-7xl max-h-[90vh] w-full mx-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header with controls */}
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <ZoomIn className="w-5 h-5 text-white" />
                                <span className="text-white font-medium text-lg">
                                    {imageAlt}
                                </span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                                {/* Download Button */}
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={handleDownload}
                                    className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                                    title="Download image"
                                >
                                    <Download className="w-5 h-5 text-white" />
                                </motion.button>
                                
                                {/* Share Button */}
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={handleShare}
                                    className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                                    title="Share image"
                                >
                                    <Share2 className="w-5 h-5 text-white" />
                                </motion.button>
                                
                                {/* Close Button */}
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={onClose}
                                    className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                                    title="Close modal"
                                >
                                    <X className="w-5 h-5 text-white" />
                                </motion.button>
                            </div>
                        </div>
                        
                        {/* Image Container */}
                        <div className="relative bg-white rounded-2xl overflow-hidden shadow-2xl">
                            <motion.img
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.1 }}
                                src={imageUrl}
                                alt={imageAlt}
                                className="w-full h-auto max-h-[70vh] object-contain"
                                onError={(e) => {
                                    e.target.src = '/placeholder-image.png'; // Fallback image
                                }}
                            />
                            
                            {/* Loading overlay */}
                            <motion.div
                                initial={{ opacity: 1 }}
                                animate={{ opacity: 0 }}
                                transition={{ delay: 0.5 }}
                                className="absolute inset-0 bg-gray-100 flex items-center justify-center"
                            >
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full"
                                />
                            </motion.div>
                        </div>
                        
                        {/* Instructions */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="mt-4 text-center"
                        >
                            <p className="text-white/70 text-sm">
                                Click outside the image or press <kbd className="px-2 py-1 bg-white/20 rounded text-xs">ESC</kbd> to close
                            </p>
                        </motion.div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ImageModal;
