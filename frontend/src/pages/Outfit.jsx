import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Heart, MessageCircle, ThumbsDown, Search, Filter, SortDesc, X, ChevronDown, ZoomIn } from 'lucide-react';
import ImageModal from '../components/ImageModal';

export default function Outfit() {
    const [outfits, setOutfits] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [startIndex, setStartIndex] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        category: '',
        section: '',
        type: '',
        sortBy: 'createdAt',
        sort: 'desc'
    });
    const [showFilters, setShowFilters] = useState(false);
    const [hoveredCard, setHoveredCard] = useState(null);
    const [searchFocused, setSearchFocused] = useState(false);
    const [modalImage, setModalImage] = useState({ isOpen: false, imageUrl: '', imageAlt: '' });
    const observerRef = useRef();
    
    const categories = [
        "Couple", "Wedding", "Traditional", "Party", "Trip/Travel", "Dinner", 
        "Date", "Birthday", "Formal", "Casual", "Festival", "Workout", 
        "Maternity", "Prom and Graduation", "Vacation", "Winter", 
        "Summer Beachwear", "Concert and Music Festival", "Outdoor Adventure", "Concert"
    ];
    
    const sections = ["Men", "Women", "Kids"];
    const types = ["Normal", "Sponsored", "Promoted"];
    const sortOptions = [
        { value: 'createdAt', label: 'Date Created' },
        { value: 'numberOfLikes', label: 'Most Liked' },
        { value: 'numberOfClicks', label: 'Most Viewed' },
        { value: 'totalPrice', label: 'Price' }
    ];

    // Fetch outfits function
    const fetchOutfits = useCallback(async (reset = false) => {
        if (loading) return;
        
        setLoading(true);
        try {
            const queryParams = new URLSearchParams({
                startIndex: reset ? 0 : startIndex,
                limit: 9,
                sortBy: filters.sortBy,
                sort: filters.sort,
                ...(searchTerm && { searchTerm }),
                ...(filters.category && { category: filters.category }),
                ...(filters.section && { section: filters.section }),
                ...(filters.type && { type: filters.type })
            });

            const response = await fetch(`/backend/outfit/getoutfits?${queryParams}`);
            const data = await response.json();

            if (response.ok) {
                if (reset) {
                    setOutfits(data.outfits);
                    setStartIndex(9);
                } else {
                    setOutfits(prev => [...prev, ...data.outfits]);
                    setStartIndex(prev => prev + 9);
                }
                
                setHasMore(data.outfits.length === 9);
            }
        } catch (error) {
            console.error('Error fetching outfits:', error);
        } finally {
            setLoading(false);
        }
    }, [startIndex, searchTerm, filters, loading]);

    // Initial load and filter changes
    useEffect(() => {
        setStartIndex(0);
        setOutfits([]);
        setHasMore(true);
        fetchOutfits(true);
    }, [searchTerm, filters]);

    // Intersection Observer for infinite scroll
    const lastOutfitElementRef = useCallback(node => {
        if (loading) return;
        if (observerRef.current) observerRef.current.disconnect();
        
        observerRef.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                fetchOutfits();
            }
        });
        
        if (node) observerRef.current.observe(node);
    }, [loading, hasMore, fetchOutfits]);

    // Handle search
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        // Search is handled by useEffect dependency
    };

    // Handle filter change
    const handleFilterChange = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value
        }));
    };

    // Clear all filters
    const clearFilters = () => {
        setSearchTerm('');
        setFilters({
            category: '',
            section: '',
            type: '',
            sortBy: 'createdAt',
            sort: 'desc'
        });
    };

    // Navigate to outfit details
    const handleOutfitClick = (outfitId) => {
        window.location.href = `/outfit/${outfitId}`;
    };

    // Handle image modal
    const handleImageClick = (e, outfit) => {
        e.stopPropagation(); // Prevent card click
        setModalImage({
            isOpen: true,
            imageUrl: outfit.image,
            imageAlt: `${outfit.category} - ${outfit.section} Outfit`
        });
    };

    const closeImageModal = () => {
        setModalImage({ isOpen: false, imageUrl: '', imageAlt: '' });
    };

    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-indigo-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
            </div>

            <div className="container mx-auto px-4 py-8 relative z-10">
                {/* Header with Animation */}
                <div className="text-center mb-12 animate-fade-in-up mt-20">
                    <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
                        Browse through our curated collection of stylish outfits for every occasion
                    </p>
                    
                    {/* User instruction note */}
                    <div className="mt-6 mb-4">
                        <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-2 text-sm text-blue-700">
                            <ZoomIn className="w-4 h-4" />
                            <span className="font-medium">Tip:</span>
                            <span>Click on any outfit image to view it in full size</span>
                        </div>
                    </div>
                    
                    <div className="mt-6 h-1 w-24 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full"></div>
                </div>

                {/* Enhanced Search and Filter Bar */}
                <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6 mb-8 transform transition-all duration-300 hover:shadow-2xl animate-fade-in-up delay-200">
                    {/* Search Bar */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-4">
                        <div className={`flex-1 relative transition-all duration-300 ${searchFocused ? 'scale-105' : ''}`}>
                            <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${searchFocused ? 'text-purple-500' : 'text-gray-400'}`} />
                            <input
                                type="text"
                                placeholder="Search outfits, tags, descriptions..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onFocus={() => setSearchFocused(true)}
                                onBlur={() => setSearchFocused(false)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSearchSubmit(e)}
                                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 bg-white/50 backdrop-blur-sm text-gray-800 placeholder-gray-500"
                            />
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                        <button
                            type="button"
                            onClick={() => setShowFilters(!showFilters)}
                            className={`px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-105 ${showFilters ? 'ring-4 ring-purple-500/30' : ''}`}
                        >
                            <Filter className="w-5 h-5" />
                            <span className="hidden sm:inline">Filters</span>
                            <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showFilters ? 'rotate-180' : ''}`} />
                        </button>
                    </div>

                    {/* Enhanced Filter Panel */}
                    <div className={`transition-all duration-500 ease-in-out overflow-hidden ${showFilters ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                        <div className="border-t border-gray-200 pt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                            {/* Category Filter */}
                            <div className="relative">
                                <select
                                    value={filters.category}
                                    onChange={(e) => handleFilterChange('category', e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 bg-white/50 backdrop-blur-sm appearance-none cursor-pointer"
                                >
                                    <option value="">All Categories</option>
                                    {categories.map(category => (
                                        <option key={category} value={category}>{category}</option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            </div>

                            {/* Section Filter */}
                            <div className="relative">
                                <select
                                    value={filters.section}
                                    onChange={(e) => handleFilterChange('section', e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 bg-white/50 backdrop-blur-sm appearance-none cursor-pointer"
                                >
                                    <option value="">All Sections</option>
                                    {sections.map(section => (
                                        <option key={section} value={section}>{section}</option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            </div>

                            {/* Type Filter */}
                            <div className="relative">
                                <select
                                    value={filters.type}
                                    onChange={(e) => handleFilterChange('type', e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 bg-white/50 backdrop-blur-sm appearance-none cursor-pointer"
                                >
                                    <option value="">All Types</option>
                                    {types.map(type => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            </div>

                            {/* Sort By */}
                            <div className="relative">
                                <select
                                    value={filters.sortBy}
                                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 bg-white/50 backdrop-blur-sm appearance-none cursor-pointer"
                                >
                                    {sortOptions.map(option => (
                                        <option key={option.value} value={option.value}>{option.label}</option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            </div>

                            {/* Sort Direction */}
                            <div className="sm:col-span-2 lg:col-span-1">
                                <button
                                    type="button"
                                    onClick={() => handleFilterChange('sort', filters.sort === 'asc' ? 'desc' : 'asc')}
                                    className="w-full px-4 py-3 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 transform hover:scale-105"
                                >
                                    <SortDesc className={`w-4 h-4 transition-transform duration-300 ${filters.sort === 'desc' ? 'rotate-180' : ''}`} />
                                    <span className="font-medium">{filters.sort === 'asc' ? 'Ascending' : 'Descending'}</span>
                                </button>
                            </div>

                            {/* Clear Filters */}
                            <div className="sm:col-span-2 lg:col-span-3 xl:col-span-5 flex justify-center">
                                <button
                                    type="button"
                                    onClick={clearFilters}
                                    className="px-6 py-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-xl transition-all duration-300 font-medium"
                                >
                                    Clear All Filters
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Enhanced Outfits Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {outfits.map((outfit, index) => (
                        <div
                            key={outfit._id}
                            ref={index === outfits.length - 1 ? lastOutfitElementRef : null}
                            onClick={() => handleOutfitClick(outfit._id)}
                            onMouseEnter={() => setHoveredCard(outfit._id)}
                            onMouseLeave={() => setHoveredCard(null)}
                            className={`bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 overflow-hidden cursor-pointer group transform transition-all duration-500 hover:scale-105 hover:shadow-2xl animate-fade-in-up ${hoveredCard === outfit._id ? 'ring-4 ring-purple-500/30' : ''}`}
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            {/* Outfit Image */}
                            <div className="relative h-72 overflow-hidden">
                                <img
                                    src={outfit.image}
                                    alt={`${outfit.category} outfit`}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 cursor-pointer"
                                    onClick={(e) => handleImageClick(e, outfit)}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                
                                {/* Zoom overlay */}
                                <div 
                                    className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                                    onClick={(e) => handleImageClick(e, outfit)}
                                >
                                    <div className="bg-white/90 backdrop-blur-sm rounded-full p-3 transform scale-75 group-hover:scale-100 transition-transform duration-300">
                                        <ZoomIn className="w-6 h-6 text-gray-800" />
                                    </div>
                                </div>
                                
                                {/* Click hint */}
                                <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <div className="bg-black/70 backdrop-blur-sm text-white text-xs px-3 py-2 rounded-lg text-center">
                                        Click image to view full size
                                    </div>
                                </div>
                                
                                {/* Type Badge */}
                                {outfit.type !== 'Normal' && (
                                    <div className={`absolute top-4 right-4 px-3 py-2 rounded-full text-xs font-bold backdrop-blur-sm transition-all duration-300 transform hover:scale-110 ${
                                        outfit.type === 'Sponsored' ? 'bg-yellow-400/90 text-yellow-900 shadow-lg' :
                                        outfit.type === 'Promoted' ? 'bg-blue-400/90 text-blue-900 shadow-lg' : ''
                                    }`}>
                                        {outfit.type}
                                    </div>
                                )}
                                
                                {/* Rating Badge */}
                                <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm text-white px-3 py-2 rounded-full text-sm font-bold shadow-lg">
                                    ⭐ {outfit.rateLook.toFixed(1)}
                                </div>

                                {/* Hover Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-purple-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </div>

                            {/* Outfit Details */}
                            <div className="p-6">
                                {/* Category and Section */}
                                <div className="flex justify-between items-start mb-3">
                                    <h3 className="text-xl font-bold text-gray-800 group-hover:text-purple-600 transition-colors duration-300 line-clamp-1">
                                        {outfit.category}
                                    </h3>
                                    <span className="text-sm font-bold text-white bg-gradient-to-r from-purple-500 to-pink-500 px-3 py-1 rounded-full shadow-md">
                                        {outfit.section}
                                    </span>
                                </div>

                                {/* Description */}
                                {outfit.description && (
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                                        {outfit.description}
                                    </p>
                                )}

                                {/* Price */}
                                <div className="mb-4">
                                    <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                                        ₹{outfit.totalPrice.toLocaleString()}
                                    </span>
                                    <span className="text-sm text-gray-500 ml-2 font-medium">
                                        ({outfit.numberOfItems} items)
                                    </span>
                                </div>

                                {/* Tags */}
                                {outfit.tags && outfit.tags.length > 0 && (
                                    <div className="mb-4">
                                        <div className="flex flex-wrap gap-2">
                                            {outfit.tags.slice(0, 3).map((tag, tagIndex) => (
                                                <span
                                                    key={tagIndex}
                                                    className="text-xs bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 px-3 py-1 rounded-full font-medium transition-all duration-300 hover:from-purple-100 hover:to-pink-100 hover:text-purple-700"
                                                >
                                                    #{tag}
                                                </span>
                                            ))}
                                            {outfit.tags.length > 3 && (
                                                <span className="text-xs text-purple-600 font-medium">
                                                    +{outfit.tags.length - 3} more
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Engagement Stats */}
                                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                                    <div className="flex items-center gap-4 text-sm">
                                        <div className="flex items-center gap-2 text-red-500 font-medium transition-colors duration-300 hover:text-red-600">
                                            <Heart className="w-4 h-4" />
                                            <span>{outfit.numberOfLikes}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-500 font-medium transition-colors duration-300 hover:text-gray-600">
                                            <ThumbsDown className="w-4 h-4" />
                                            <span>{outfit.numberOfDislikes}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-blue-500 font-medium transition-colors duration-300 hover:text-blue-600">
                                            <MessageCircle className="w-4 h-4" />
                                            <span>{outfit.numberOfComments}</span>
                                        </div>
                                    </div>
                                    <div className="text-xs text-gray-500 font-medium">
                                        {outfit.numberOfClicks} views
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Enhanced Loading Indicator */}
                {loading && (
                    <div className="flex justify-center items-center py-12">
                        <div className="relative">
                            <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200"></div>
                            <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-600 border-t-transparent absolute top-0 left-0"></div>
                        </div>
                    </div>
                )}

                {/* Enhanced No Results */}
                {!loading && outfits.length === 0 && (
                    <div className="text-center py-16 animate-fade-in-up">
                        <div className="text-8xl mb-6 animate-bounce">👗</div>
                        <h3 className="text-2xl font-bold text-gray-700 mb-4">No outfits found</h3>
                        <p className="text-gray-500 mb-6 text-lg">Try adjusting your search or filters</p>
                        <button
                            onClick={clearFilters}
                            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                        >
                            Clear Filters
                        </button>
                    </div>
                )}

                {/* Enhanced End of Results */}
                {!hasMore && outfits.length > 0 && (
                    <div className="text-center py-12 animate-fade-in-up">
                        <div className="inline-block p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl">
                            <p className="text-gray-600 font-medium">🎉 You've reached the end of the outfits!</p>
                        </div>
                    </div>
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

                @keyframes gradient-x {
                    0%, 100% {
                        background-size: 200% 200%;
                        background-position: left center;
                    }
                    50% {
                        background-size: 200% 200%;
                        background-position: right center;
                    }
                }

                .animate-fade-in-up {
                    animation: fade-in-up 0.6s ease-out forwards;
                }

                .animate-gradient-x {
                    background-size: 200% 200%;
                    animation: gradient-x 3s ease infinite;
                }

                .line-clamp-1 {
                    display: -webkit-box;
                    -webkit-line-clamp: 1;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }

                .line-clamp-2 {
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }

                .delay-200 { animation-delay: 200ms; }
                .delay-500 { animation-delay: 500ms; }
                .delay-1000 { animation-delay: 1000ms; }
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
