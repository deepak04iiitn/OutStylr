import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import OutfitImage from '../components/outfitdetails/OutfitImage';
import OutfitStats from '../components/outfitdetails/OutfitStats';
import OutfitInfo from '../components/outfitdetails/OutfitInfo';
import OutfitItems from '../components/outfitdetails/OutfitItems';
import CommentsSection from '../components/outfitdetails/CommentsSection';

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

function OutfitDetails() {
    const [outfit, setOutfit] = useState(null);
    const [loading, setLoading] = useState(true);
    const [commentText, setCommentText] = useState('');
    const [replyTexts, setReplyTexts] = useState({});
    const [showReplyForm, setShowReplyForm] = useState(null);
    const [addingToCart, setAddingToCart] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [notes, setNotes] = useState('');
    const [showCartOptions, setShowCartOptions] = useState(false);
    const outfitId = window.location.pathname.split('/').pop();
    const { currentUser } = useSelector((state) => state.user);

    useEffect(() => {
        fetchOutfit();
    }, [outfitId]);

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

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <motion.div 
                    className="flex flex-col items-center gap-4"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <motion.div 
                        className="animate-spin rounded-full h-12 w-12 border-2 border-neutral-300 border-t-indigo-600"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    <motion.p 
                        className="text-neutral-600 font-medium"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                    >
                        Loading outfit details...
                    </motion.p>
                </motion.div>
            </div>
        );
    }

    if (!outfit) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <motion.div 
                    className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-8 text-center max-w-md w-full"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <motion.div 
                        className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6"
                        whileHover={{ scale: 1.05 }}
                    >
                        <MessageCircle className="w-8 h-8 text-neutral-400" />
                    </motion.div>
                    <h2 className="text-2xl font-bold text-neutral-800 mb-3">Outfit not found</h2>
                    <p className="text-neutral-600 mb-6">The outfit you're looking for doesn't exist or has been removed.</p>
                    <motion.button
                        onClick={() => window.location.href = '/outfit'}
                        className="w-full px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors duration-200"
                        whileHover={{ scale: 1.02, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
                        whileTap={{ scale: 0.98 }}
                    >
                        Back to Outfits
                    </motion.button>
                </motion.div>
            </div>
        );
    }

    return (
        <motion.div 
            className="min-h-screen mt-26"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 lg:gap-8">
                    <div className="xl:col-span-5 space-y-6">
                        <OutfitImage outfit={outfit} />
                        <OutfitStats outfit={outfit} />
                    </div>
                    <div className="xl:col-span-7 space-y-6">
                        <OutfitInfo 
                            outfit={outfit} 
                            currentUser={currentUser}
                            addingToCart={addingToCart}
                            setAddingToCart={setAddingToCart}
                            quantity={quantity}
                            setQuantity={setQuantity}
                            notes={notes}
                            setNotes={setNotes}
                            showCartOptions={showCartOptions}
                            setShowCartOptions={setShowCartOptions}
                        />
                        <OutfitItems outfit={outfit} currentUser={currentUser} />
                    </div>
                </div>
                <CommentsSection 
                    outfit={outfit} 
                    currentUser={currentUser}
                    commentText={commentText}
                    setCommentText={setCommentText}
                    replyTexts={replyTexts}
                    setReplyTexts={setReplyTexts}
                    showReplyForm={showReplyForm}
                    setShowReplyForm={setShowReplyForm}
                    setOutfit={setOutfit}
                    outfitId={outfitId}
                />
            </div>
            <Toaster />
        </motion.div>
    );
}

export default OutfitDetails;