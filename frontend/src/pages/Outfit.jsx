import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Heart, MessageCircle, ThumbsDown, Search, Filter, SortDesc } from 'lucide-react';

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

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
                        Discover Amazing Outfits
                    </h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Browse through our curated collection of stylish outfits for every occasion
                    </p>
                </div>

                {/* Search and Filter Bar */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                    {/* Search Bar */}
                    <div className="flex gap-4 mb-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search outfits, tags, descriptions..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSearchSubmit(e)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={() => setShowFilters(!showFilters)}
                            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
                        >
                            <Filter className="w-5 h-5" />
                            Filters
                        </button>
                    </div>

                    {/* Filter Panel */}
                    {showFilters && (
                        <div className="border-t pt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                            {/* Category Filter */}
                            <select
                                value={filters.category}
                                onChange={(e) => handleFilterChange('category', e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                            >
                                <option value="">All Categories</option>
                                {categories.map(category => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>

                            {/* Section Filter */}
                            <select
                                value={filters.section}
                                onChange={(e) => handleFilterChange('section', e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                            >
                                <option value="">All Sections</option>
                                {sections.map(section => (
                                    <option key={section} value={section}>{section}</option>
                                ))}
                            </select>

                            {/* Type Filter */}
                            <select
                                value={filters.type}
                                onChange={(e) => handleFilterChange('type', e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                            >
                                <option value="">All Types</option>
                                {types.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>

                            {/* Sort By */}
                            <select
                                value={filters.sortBy}
                                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                            >
                                {sortOptions.map(option => (
                                    <option key={option.value} value={option.value}>{option.label}</option>
                                ))}
                            </select>

                            {/* Sort Direction */}
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => handleFilterChange('sort', filters.sort === 'asc' ? 'desc' : 'asc')}
                                    className="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center justify-center gap-2"
                                >
                                    <SortDesc className={`w-4 h-4 ${filters.sort === 'desc' ? 'rotate-180' : ''} transition-transform`} />
                                    {filters.sort === 'asc' ? 'Ascending' : 'Descending'}
                                </button>
                            </div>

                            {/* Clear Filters */}
                            <div className="lg:col-span-5">
                                <button
                                    type="button"
                                    onClick={clearFilters}
                                    className="px-4 py-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                                >
                                    Clear All Filters
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Outfits Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {outfits.map((outfit, index) => (
                        <div
                            key={outfit._id}
                            ref={index === outfits.length - 1 ? lastOutfitElementRef : null}
                            onClick={() => handleOutfitClick(outfit._id)}
                            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
                        >
                            {/* Outfit Image */}
                            <div className="relative h-64 overflow-hidden">
                                <img
                                    src={outfit.image}
                                    alt={`${outfit.category} outfit`}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                {/* Type Badge */}
                                {outfit.type !== 'Normal' && (
                                    <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-semibold ${
                                        outfit.type === 'Sponsored' ? 'bg-yellow-100 text-yellow-800' :
                                        outfit.type === 'Promoted' ? 'bg-blue-100 text-blue-800' : ''
                                    }`}>
                                        {outfit.type}
                                    </div>
                                )}
                                {/* Rating Badge */}
                                <div className="absolute top-3 left-3 bg-black bg-opacity-70 text-white px-2 py-1 rounded-full text-xs font-semibold">
                                    ⭐ {outfit.rateLook.toFixed(1)}
                                </div>
                            </div>

                            {/* Outfit Details */}
                            <div className="p-4">
                                {/* Category and Section */}
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-lg font-semibold text-gray-800 group-hover:text-purple-600 transition-colors">
                                        {outfit.category}
                                    </h3>
                                    <span className="text-sm font-medium text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                                        {outfit.section}
                                    </span>
                                </div>

                                {/* Description */}
                                {outfit.description && (
                                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                        {outfit.description}
                                    </p>
                                )}

                                {/* Price */}
                                <div className="mb-3">
                                    <span className="text-2xl font-bold text-green-600">
                                        ₹{outfit.totalPrice.toLocaleString()}
                                    </span>
                                    <span className="text-sm text-gray-500 ml-2">
                                        ({outfit.numberOfItems} items)
                                    </span>
                                </div>

                                {/* Tags */}
                                {outfit.tags && outfit.tags.length > 0 && (
                                    <div className="mb-3">
                                        <div className="flex flex-wrap gap-1">
                                            {outfit.tags.slice(0, 3).map((tag, index) => (
                                                <span
                                                    key={index}
                                                    className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
                                                >
                                                    #{tag}
                                                </span>
                                            ))}
                                            {outfit.tags.length > 3 && (
                                                <span className="text-xs text-gray-500">
                                                    +{outfit.tags.length - 3} more
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Engagement Stats */}
                                <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                                    <div className="flex items-center gap-4 text-sm text-gray-600">
                                        <div className="flex items-center gap-1">
                                            <Heart className="w-4 h-4 text-red-500" />
                                            <span>{outfit.numberOfLikes}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <ThumbsDown className="w-4 h-4 text-gray-400" />
                                            <span>{outfit.numberOfDislikes}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <MessageCircle className="w-4 h-4 text-blue-500" />
                                            <span>{outfit.numberOfComments}</span>
                                        </div>
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {outfit.numberOfClicks} views
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Loading Indicator */}
                {loading && (
                    <div className="flex justify-center items-center py-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                    </div>
                )}

                {/* No Results */}
                {!loading && outfits.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-gray-400 text-6xl mb-4">👗</div>
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">No outfits found</h3>
                        <p className="text-gray-500">Try adjusting your search or filters</p>
                        <button
                            onClick={clearFilters}
                            className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                        >
                            Clear Filters
                        </button>
                    </div>
                )}

                {/* End of Results */}
                {!hasMore && outfits.length > 0 && (
                    <div className="text-center py-8">
                        <p className="text-gray-500">You've reached the end of the outfits!</p>
                    </div>
                )}
            </div>
        </div>
    );
}