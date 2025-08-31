import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Eye, Heart, MessageCircle, Star, Zap, Crown, Trophy, Award, Target } from 'lucide-react';
import ImageModal from '../components/ImageModal';

export default function Trending() {
    const [trendingOutfits, setTrendingOutfits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalActiveOutfits: 0,
        totalClicks: 0
    });
    const [hoveredCard, setHoveredCard] = useState(null);
    const [modalImage, setModalImage] = useState({ isOpen: false, imageUrl: '', imageAlt: '' });

    useEffect(() => {
        fetchTrendingOutfits();
    }, []);

    const fetchTrendingOutfits = async () => {
        setLoading(true);
        try {
            const response = await fetch('/backend/outfit/trending?limit=10');
            const data = await response.json();
            
            if (response.ok) {
                setTrendingOutfits(data.trendingOutfits);
                setStats({
                    totalActiveOutfits: data.totalActiveOutfits,
                    totalClicks: data.totalClicks
                });
            } else {
                console.error('Error fetching trending outfits:', data.error);
            }
        } catch (error) {
            console.error('Error fetching trending outfits:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOutfitClick = (outfitId) => {
        window.location.href = `/outfit/${outfitId}`;
    };

    const handleImageClick = (e, outfit) => {
        e.stopPropagation();
        setModalImage({
            isOpen: true,
            imageUrl: outfit.image,
            imageAlt: `${outfit.category} - ${outfit.section} Outfit`
        });
    };

    const closeImageModal = () => {
        setModalImage({ isOpen: false, imageUrl: '', imageAlt: '' });
    };

    const getRankIcon = (index) => {
        switch (index) {
            case 0:
                return <Crown className="w-6 h-6 text-yellow-500" />;
            case 1:
                return <Trophy className="w-6 h-6 text-gray-400" />;
            case 2:
                return <Award className="w-6 h-6 text-amber-600" />;
            default:
                return <Target className="w-5 h-5 text-gray-500" />;
        }
    };

    const getRankColor = (index) => {
        switch (index) {
            case 0:
                return 'from-yellow-400 to-orange-500';
            case 1:
                return 'from-gray-300 to-gray-500';
            case 2:
                return 'from-amber-400 to-amber-600';
            default:
                return 'from-purple-400 to-pink-500';
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
                        className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200"
                    >
                        <motion.div 
                            className="animate-spin rounded-full h-16 w-16 border-4 border-purple-600 border-t-transparent"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                    </motion.div>
                    <motion.p 
                        className="text-gray-600 font-medium text-lg"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                    >
                        Loading trending outfits...
                    </motion.p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-yellow-400/20 to-orange-400/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-indigo-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
            </div>

            <div className="container mx-auto px-4 py-8 relative z-10">
                {/* Header Section */}
                <motion.div 
                    className="text-center mb-12 mt-20"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="flex items-center justify-center gap-3 mb-6">
                        <motion.div
                            animate={{ 
                                rotate: [0, 10, -10, 0],
                                scale: [1, 1.1, 1]
                            }}
                            transition={{ 
                                duration: 2,
                                repeat: Infinity,
                                repeatDelay: 3
                            }}
                        >
                            <TrendingUp className="w-12 h-12 text-yellow-500" />
                        </motion.div>
                        <h1 className="text-5xl font-bold bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 bg-clip-text text-transparent">
                            Trending Outfits
                        </h1>
                        <motion.div
                            animate={{ 
                                rotate: [0, -10, 10, 0],
                                scale: [1, 1.1, 1]
                            }}
                            transition={{ 
                                duration: 2,
                                repeat: Infinity,
                                repeatDelay: 3
                            }}
                        >
                            <Zap className="w-12 h-12 text-orange-500" />
                        </motion.div>
                    </div>
                    
                    <p className="text-gray-600 max-w-3xl mx-auto text-lg leading-relaxed mb-8">
                        Discover the most popular and highly viewed outfits in our community. 
                        These are the top 10 outfits that have captured the most attention!
                    </p>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-8">
                        <motion.div 
                            className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6"
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl">
                                    <Eye className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-800">{stats.totalClicks.toLocaleString()}</p>
                                    <p className="text-sm text-gray-600">Total Views</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div 
                            className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6"
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl">
                                    <TrendingUp className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-800">{stats.totalActiveOutfits}</p>
                                    <p className="text-sm text-gray-600">Active Outfits</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    <div className="h-1 w-24 bg-gradient-to-r from-yellow-500 to-orange-500 mx-auto rounded-full"></div>
                </motion.div>

                {/* Trending Outfits Grid */}
                {trendingOutfits.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {trendingOutfits.map((outfit, index) => (
                            <motion.div
                                key={outfit._id}
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                onClick={() => handleOutfitClick(outfit._id)}
                                onMouseEnter={() => setHoveredCard(outfit._id)}
                                onMouseLeave={() => setHoveredCard(null)}
                                className={`bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 overflow-hidden cursor-pointer group transform transition-all duration-500 hover:scale-105 hover:shadow-2xl relative ${
                                    hoveredCard === outfit._id ? 'ring-4 ring-yellow-500/30' : ''
                                }`}
                            >
                                {/* Rank Badge */}
                                <div className={`absolute top-4 left-4 z-10 bg-gradient-to-r ${getRankColor(index)} text-white px-3 py-2 rounded-full shadow-lg flex items-center gap-2 font-bold text-sm`}>
                                    {getRankIcon(index)}
                                    #{index + 1}
                                </div>

                                {/* Trending Badge */}
                                <div className="absolute top-4 right-4 z-10 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full shadow-lg flex items-center gap-1 font-bold text-xs">
                                    <TrendingUp className="w-3 h-3" />
                                    TRENDING
                                </div>

                                {/* Outfit Image */}
                                <div className="relative h-72 overflow-hidden bg-gray-50 flex items-center justify-center">
                                    <img
                                        src={outfit.image}
                                        alt={`${outfit.category} outfit`}
                                        className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-700 cursor-pointer"
                                        onClick={(e) => handleImageClick(e, outfit)}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    
                                    {/* Zoom overlay */}
                                    <div 
                                        className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                                        onClick={(e) => handleImageClick(e, outfit)}
                                    >
                                        <div className="bg-white/90 backdrop-blur-sm rounded-full p-3 transform scale-75 group-hover:scale-100 transition-transform duration-300">
                                            <Eye className="w-6 h-6 text-gray-800" />
                                        </div>
                                    </div>

                                    {/* Click hint */}
                                    <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <div className="bg-black/70 backdrop-blur-sm text-white text-xs px-3 py-2 rounded-lg text-center">
                                            Click image to view full size
                                        </div>
                                    </div>
                                </div>

                                {/* Outfit Details */}
                                <div className="p-6">
                                    {/* Category and Section */}
                                    <div className="flex justify-between items-start mb-3">
                                        <h3 className="text-xl font-bold text-gray-800 group-hover:text-yellow-600 transition-colors duration-300 line-clamp-1">
                                            {outfit.category}
                                        </h3>
                                        <span className="text-sm font-bold text-white bg-gradient-to-r from-purple-500 to-pink-500 px-3 py-1 rounded-full shadow-md">
                                            {outfit.section}
                                        </span>
                                    </div>

                                    {/* Rating */}
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="flex items-center gap-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star 
                                                    key={i} 
                                                    className={`w-4 h-4 ${
                                                        i < Math.floor(outfit.rateLook) 
                                                            ? 'text-yellow-400 fill-current' 
                                                            : 'text-gray-300'
                                                    }`} 
                                                />
                                            ))}
                                        </div>
                                        <span className="text-sm font-bold text-gray-600">
                                            {outfit.rateLook.toFixed(1)}
                                        </span>
                                    </div>

                                    {/* Price */}
                                    <div className="mb-4">
                                        <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                                            ₹{outfit.totalPrice.toLocaleString()}
                                        </span>
                                    </div>

                                    {/* Engagement Stats */}
                                    <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                                        <div className="flex items-center gap-4 text-sm">
                                            <div className="flex items-center gap-2 text-red-500 font-medium">
                                                <Heart className="w-4 h-4" />
                                                <span>{outfit.numberOfLikes}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-blue-500 font-medium">
                                                <MessageCircle className="w-4 h-4" />
                                                <span>{outfit.numberOfComments}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 text-yellow-600 font-bold">
                                            <Eye className="w-4 h-4" />
                                            <span>{outfit.numberOfClicks}</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <motion.div 
                        className="text-center py-16"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="text-8xl mb-6 animate-bounce">📈</div>
                        <h3 className="text-2xl font-bold text-gray-700 mb-4">No trending outfits yet</h3>
                        <p className="text-gray-500 mb-6 text-lg">Check back later for the most popular outfits!</p>
                        <motion.button
                            onClick={() => window.location.href = '/outfit'}
                            className="cursor-pointer px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Browse All Outfits
                        </motion.button>
                    </motion.div>
                )}

                {/* Call to Action */}
                {trendingOutfits.length > 0 && (
                    <motion.div 
                        className="text-center mt-16"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                    >
                        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-8 border border-yellow-200">
                            <h3 className="text-2xl font-bold text-gray-800 mb-4">
                                Want to see your outfit here?
                            </h3>
                            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                                Create amazing outfits and get them trending! The more views your outfit gets, 
                                the higher it climbs in our trending list.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <motion.button
                                    onClick={() => window.location.href = '/outfit'}
                                    className="cursor-pointer px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Browse All Outfits
                                </motion.button>
                                <motion.button
                                    onClick={() => window.location.href = '/dashboard'}
                                    className="disabled cursor-pointer px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 font-medium shadow-lg hover:shadow-xl"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Create Outfit
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Custom CSS for animations */}
            <style jsx>{`
                @keyframes fade-in-up {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .animate-fade-in-up {
                    animation: fade-in-up 0.6s ease-out forwards;
                }

                .line-clamp-1 {
                    display: -webkit-box;
                    -webkit-line-clamp: 1;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
            `}</style>
            
            {/* Image Modal */}
            <ImageModal
                isOpen={modalImage.isOpen}
                onClose={closeImageModal}
                imageUrl={modalImage.imageUrl}
                imageAlt={modalImage.imageAlt}
            />
        </div>
    );
}
