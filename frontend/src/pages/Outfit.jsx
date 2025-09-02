import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Heart, MessageCircle, ThumbsDown, Search, Filter, SortDesc, X, ChevronDown, ZoomIn, Grid, List, Settings2, Sparkles, TrendingUp } from 'lucide-react';
import ImageModal from '../components/ImageModal';

export default function Outfit() {
    const [outfits, setOutfits] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [startIndex, setStartIndex] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [isScrolled, setIsScrolled] = useState(false);
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
    const [viewMode, setViewMode] = useState('grid');
    const [activeFilter, setActiveFilter] = useState(null);
    
    // Refs for stability
    const observerRef = useRef();
    const loadingRef = useRef(false);
    const currentRequestRef = useRef(null);
    
    // Scroll detection for navbar
    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            setIsScrolled(scrollTop > 150);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    
    // Memoized constants
    const categories = useMemo(() => [
        "Couple", "Wedding", "Traditional", "Party", "Trip/Travel", "Dinner", 
        "Date", "Birthday", "Formal", "Casual", "Festival", "Workout", 
        "Maternity", "Prom and Graduation", "Vacation", "Winter", 
        "Summer Beachwear", "Concert and Music Festival", "Outdoor Adventure", "Job Interview"
    ], []);
    
    const sections = useMemo(() => ["Men", "Women", "Kids"], []);
    const types = useMemo(() => ["Normal", "Sponsored", "Promoted"], []);
    const sortOptions = useMemo(() => [
        { value: 'createdAt', label: 'Date Created' },
        { value: 'numberOfLikes', label: 'Most Liked' },
        { value: 'numberOfClicks', label: 'Most Viewed' },
        { value: 'totalPrice', label: 'Price' }
    ], []);

    // Stable fetch function
    const fetchOutfits = useCallback(async (reset = false) => {
        if (loadingRef.current) return;
        
        loadingRef.current = true;
        setLoading(true);

        if (currentRequestRef.current) {
            currentRequestRef.current.abort();
        }

        const controller = new AbortController();
        currentRequestRef.current = controller;

        try {
            const currentStartIndex = reset ? 0 : startIndex;
            
            const queryParams = new URLSearchParams({
                startIndex: currentStartIndex,
                limit: 9,
                sortBy: filters.sortBy,
                sort: filters.sort,
                ...(searchTerm && { searchTerm }),
                ...(filters.category && { category: filters.category }),
                ...(filters.section && { section: filters.section }),
                ...(filters.type && { type: filters.type })
            });

            const response = await fetch(`/backend/outfit/getoutfits?${queryParams}`, {
                signal: controller.signal
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();

            if (!controller.signal.aborted) {
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
            if (error.name !== 'AbortError') {
                console.error('Error fetching outfits:', error);
            }
        } finally {
            loadingRef.current = false;
            setLoading(false);
            currentRequestRef.current = null;
        }
    }, [searchTerm, filters, startIndex]);

    // Debounced search effect
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setStartIndex(0);
            setOutfits([]);
            setHasMore(true);
            fetchOutfits(true);
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [searchTerm, filters.category, filters.section, filters.type, filters.sortBy, filters.sort]);

    // Intersection observer
    const handleIntersection = useCallback((entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingRef.current) {
            fetchOutfits(false);
        }
    }, [hasMore, fetchOutfits]);

    const lastOutfitElementRef = useCallback(node => {
        if (observerRef.current) {
            observerRef.current.disconnect();
        }
        
        if (node) {
            observerRef.current = new IntersectionObserver(handleIntersection, {
                rootMargin: '100px',
                threshold: 0.1
            });
            observerRef.current.observe(node);
        }
    }, [handleIntersection]);

    // Cleanup observer
    useEffect(() => {
        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
            if (currentRequestRef.current) {
                currentRequestRef.current.abort();
            }
        };
    }, []);

    // Event handlers
    const handleSearchSubmit = useCallback((e) => {
        e.preventDefault();
    }, []);

    const handleFilterChange = useCallback((key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value
        }));
    }, []);

    const clearFilters = useCallback(() => {
        setSearchTerm('');
        setFilters({
            category: '',
            section: '',
            type: '',
            sortBy: 'createdAt',
            sort: 'desc'
        });
    }, []);

    const handleOutfitClick = useCallback((outfitId) => {
        window.open(`/outfit/${outfitId}`, '_blank');
    }, []);      

    const handleImageClick = useCallback((e, outfit) => {
        e.stopPropagation();
        setModalImage({
            isOpen: true,
            imageUrl: outfit.image,
            imageAlt: `${outfit.category} - ${outfit.section} Outfit`
        });
    }, []);

    const closeImageModal = useCallback(() => {
        setModalImage({ isOpen: false, imageUrl: '', imageAlt: '' });
    }, []);

    const handleMouseEnter = useCallback((outfitId) => {
        setHoveredCard(outfitId);
    }, []);

    const handleMouseLeave = useCallback(() => {
        setHoveredCard(null);
    }, []);

    const getActiveFilterCount = () => {
        return Object.values(filters).filter(value => 
            value && value !== 'createdAt' && value !== 'desc'
        ).length + (searchTerm ? 1 : 0);
    };

    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Beautiful Purple Background */}
            <div className="fixed inset-0 bg-purple-50">
                {/* Purple Gradient Layers */}
                <div className="absolute inset-0 bg-purple-100/50"></div>
                <div className="absolute inset-0 bg-purple-200/30"></div>
                
                {/* Geometric Pattern Background */}
                <div className="absolute inset-0 opacity-20">
                    <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <pattern id="purple-pattern" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
                                <circle cx="40" cy="40" r="2" fill="#a855f7" className="animate-pulse-slow"/>
                                <circle cx="0" cy="0" r="1.5" fill="#c084fc" className="animate-pulse-medium"/>
                                <circle cx="80" cy="0" r="1.5" fill="#c084fc" className="animate-pulse-medium"/>
                                <circle cx="0" cy="80" r="1.5" fill="#c084fc" className="animate-pulse-medium"/>
                                <circle cx="80" cy="80" r="1.5" fill="#c084fc" className="animate-pulse-medium"/>
                                <circle cx="20" cy="20" r="1" fill="#ddd6fe" className="animate-pulse-slow"/>
                                <circle cx="60" cy="20" r="1" fill="#ddd6fe" className="animate-pulse-slow"/>
                                <circle cx="20" cy="60" r="1" fill="#ddd6fe" className="animate-pulse-slow"/>
                                <circle cx="60" cy="60" r="1" fill="#ddd6fe" className="animate-pulse-slow"/>
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#purple-pattern)" />
                    </svg>
                </div>

                {/* Floating Purple Elements */}
                <div className="absolute inset-0 overflow-hidden">
                    {/* Fashion Icons with Purple Theme */}
                    <div className="absolute top-20 left-20 text-6xl text-purple-300 animate-float-slow opacity-30">👗</div>
                    <div className="absolute top-40 right-32 text-4xl text-purple-300 animate-float-medium opacity-25">👠</div>
                    <div className="absolute bottom-40 left-40 text-5xl text-purple-300 animate-float-fast opacity-35">👔</div>
                    <div className="absolute bottom-60 right-20 text-3xl text-purple-300 animate-float-slow opacity-20">👜</div>
                    <div className="absolute top-60 left-1/2 text-4xl text-purple-300 animate-float-medium opacity-25">👒</div>
                    <div className="absolute top-1/3 right-1/4 text-3xl text-purple-300 animate-float-fast opacity-30">💄</div>

                    {/* Purple Geometric Shapes */}
                    <div className="absolute top-32 right-1/3 w-24 h-24 border-2 border-purple-300 rounded-full animate-spin-slow opacity-15"></div>
                    <div className="absolute bottom-32 left-1/3 w-20 h-20 border-2 border-purple-400 rotate-45 animate-pulse opacity-10"></div>
                    <div className="absolute top-1/2 right-16 w-16 h-16 bg-purple-300 rounded-full animate-bounce-slow opacity-20"></div>
                    <div className="absolute top-1/4 left-1/4 w-14 h-14 bg-purple-200 rotate-45 animate-spin-slow opacity-25"></div>
                    
                    {/* Moving Purple Lines */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-purple-300 animate-slide-right opacity-15"></div>
                    <div className="absolute top-1/3 left-0 w-full h-1 bg-purple-400 animate-slide-left opacity-10"></div>
                    <div className="absolute bottom-1/3 left-0 w-full h-1 bg-purple-200 animate-slide-right opacity-20"></div>
                </div>

                {/* Purple Particle System */}
                <div className="absolute inset-0 overflow-hidden">
                    {Array.from({ length: 20 }, (_, i) => (
                        <div
                            key={i}
                            className={`absolute w-2 h-2 bg-purple-400 rounded-full animate-float-particle opacity-15`}
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 5}s`,
                                animationDuration: `${5 + Math.random() * 10}s`
                            }}
                        />
                    ))}
                </div>

                {/* Purple Overlay for Better Contrast */}
                <div className="absolute inset-0 bg-purple-50/60"></div>
            </div>

            

            {/* Main Content */}
            <div className="relative z-10">
                {/* Enhanced Header Section */}
                <div className="bg-white/90 backdrop-blur-lg border-b border-purple-200 shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="py-12">
                            <div className="text-center mt-20">
                                <p className="mt-6 text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                                    Discover handpicked outfits curated for every occasion, season, and style preference. Find your perfect look from our exclusive collection.
                                </p>
                                
                                {/* Stats Banner */}
                                <div className="mt-10 flex justify-center">
                                    <div className="bg-white/95 backdrop-blur-sm border border-purple-200 rounded-2xl px-10 py-5 shadow-lg">
                                        <div className="flex items-center gap-10 text-sm">
                                            <div className="flex items-center gap-2">
                                                <TrendingUp className="w-5 h-5 text-green-600" />
                                                <span className="text-gray-600 font-medium">Trending Styles</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Heart className="w-5 h-5 text-red-500" />
                                                <span className="text-gray-600 font-medium">Loved by Thousands</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <ZoomIn className="w-5 h-5 text-purple-600" />
                                                <span className="text-gray-600 font-medium">Click to Zoom</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    {/* Enhanced Search & Filter Bar */}
                    <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-xl border border-purple-200 mb-10 overflow-hidden transform hover:shadow-2xl transition-all duration-300">
                        {/* Search Section */}
                        <div className="p-8 border-b border-purple-100">
                            <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
                                <div className="flex-1 relative group">
                                    <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-all duration-300 ${searchFocused ? 'scale-110' : ''}`}>
                                        <Search className={`h-6 w-6 transition-colors duration-300 ${searchFocused ? 'text-purple-600' : 'text-gray-400'}`} />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Search by category, style, tags, or description..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        onFocus={() => setSearchFocused(true)}
                                        onBlur={() => setSearchFocused(false)}
                                        className={`block w-full pl-12 pr-12 py-4 text-lg border-2 rounded-xl bg-purple-50/50 text-gray-900 placeholder-gray-500 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 focus:bg-white ${searchFocused ? 'transform scale-[1.01] shadow-lg' : ''}`}
                                    />
                                    {searchTerm && (
                                        <button
                                            onClick={() => setSearchTerm('')}
                                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                                        >
                                            <X className="h-6 w-6" />
                                        </button>
                                    )}
                                </div>
                                
                                {/* Enhanced Filter Controls */}
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => setShowFilters(!showFilters)}
                                        className={`cursor-pointer inline-flex items-center gap-3 px-6 py-4 border-2 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 ${
                                            showFilters 
                                                ? 'border-purple-500 text-purple-700 bg-purple-50 shadow-lg' 
                                                : 'border-purple-300 text-gray-700 bg-white hover:bg-purple-50/50 hover:border-purple-400 shadow-md hover:shadow-lg'
                                        }`}
                                    >
                                        <Settings2 className="h-5 w-5" />
                                        <span>Filters</span>
                                        {getActiveFilterCount() > 0 && (
                                            <span className="bg-purple-600 text-white text-sm rounded-full h-6 w-6 flex items-center justify-center font-bold animate-pulse">
                                                {getActiveFilterCount()}
                                            </span>
                                        )}
                                        <ChevronDown className={`h-5 w-5 transition-transform duration-300 ${showFilters ? 'rotate-180' : ''}`} />
                                    </button>
                                    
                                    {/* Enhanced View Toggle */}
                                    <div className="border-2 border-purple-300 rounded-xl p-2 bg-white shadow-md">
                                        <button
                                            onClick={() => setViewMode('grid')}
                                            className={`cursor-pointer p-3 rounded-lg transition-all duration-300 ${
                                                viewMode === 'grid' 
                                                    ? 'bg-purple-100 text-purple-700 shadow-md transform scale-105' 
                                                    : 'text-gray-500 hover:text-purple-600 hover:bg-purple-50'
                                            }`}
                                        >
                                            <Grid className="h-5 w-5" />
                                        </button>
                                        <button
                                            onClick={() => setViewMode('list')}
                                            className={`cursor-pointer p-3 rounded-lg transition-all duration-300 ${
                                                viewMode === 'list' 
                                                    ? 'bg-purple-100 text-purple-700 shadow-md transform scale-105' 
                                                    : 'text-gray-500 hover:text-purple-600 hover:bg-purple-50'
                                            }`}
                                        >
                                            <List className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Enhanced Filter Panel */}
                        <div className={`transition-all duration-500 ease-in-out overflow-hidden ${
                            showFilters ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
                        }`}>
                            <div className="p-8 bg-purple-50/30">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 lg:gap-6 mb-6">
                                    {/* Enhanced Filter Inputs */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-800 uppercase tracking-wide">Category</label>
                                        <select
                                            value={filters.category}
                                            onChange={(e) => handleFilterChange('category', e.target.value)}
                                            className="w-full px-4 py-3 border-2 border-purple-300 rounded-xl bg-white text-gray-900 focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 hover:border-purple-400 cursor-pointer"
                                        >
                                            <option value="">All Categories</option>
                                            {categories.map(category => (
                                                <option key={category} value={category}>{category}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-800 uppercase tracking-wide">Section</label>
                                        <select
                                            value={filters.section}
                                            onChange={(e) => handleFilterChange('section', e.target.value)}
                                            className="w-full px-4 py-3 border-2 border-purple-300 rounded-xl bg-white text-gray-900 focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 hover:border-purple-400 cursor-pointer"
                                        >
                                            <option value="">All Sections</option>
                                            {sections.map(section => (
                                                <option key={section} value={section}>{section}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-800 uppercase tracking-wide">Type</label>
                                        <select
                                            value={filters.type}
                                            onChange={(e) => handleFilterChange('type', e.target.value)}
                                            className="w-full px-4 py-3 border-2 border-purple-300 rounded-xl bg-white text-gray-900 focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 hover:border-purple-400 cursor-pointer"
                                        >
                                            <option value="">All Types</option>
                                            {types.map(type => (
                                                <option key={type} value={type}>{type}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-800 uppercase tracking-wide">Sort By</label>
                                        <select
                                            value={filters.sortBy}
                                            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                                            className="w-full px-4 py-3 border-2 border-purple-300 rounded-xl bg-white text-gray-900 focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 hover:border-purple-400 cursor-pointer"
                                        >
                                            {sortOptions.map(option => (
                                                <option key={option.value} value={option.value}>{option.label}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-800 uppercase tracking-wide">Order</label>
                                        <button
                                            onClick={() => handleFilterChange('sort', filters.sort === 'asc' ? 'desc' : 'asc')}
                                            className="cursor-pointer w-full px-4 py-3 border-2 border-purple-300 rounded-xl bg-white hover:bg-purple-50 text-gray-900 transition-all duration-300 flex items-center justify-center gap-3 hover:border-purple-400 font-semibold"
                                        >
                                            <SortDesc className={`h-5 w-5 transition-transform duration-300 ${filters.sort === 'asc' ? 'rotate-180' : ''}`} />
                                            <span>{filters.sort === 'asc' ? 'Ascending' : 'Descending'}</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Filter Summary */}
                                <div className="flex justify-between items-center pt-6 border-t-2 border-purple-200">
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg font-bold text-gray-900">
                                            {outfits.length} outfit{outfits.length !== 1 ? 's' : ''} found
                                        </span>
                                        {getActiveFilterCount() > 0 && (
                                            <span className="bg-purple-100 text-purple-800 text-sm px-3 py-1 rounded-full font-semibold">
                                                {getActiveFilterCount()} filter{getActiveFilterCount() > 1 ? 's' : ''} active
                                            </span>
                                        )}
                                    </div>
                                    {getActiveFilterCount() > 0 && (
                                        <button
                                            onClick={clearFilters}
                                            className="text-purple-600 hover:text-purple-700 font-bold transition-colors duration-200 hover:underline"
                                        >
                                            Clear all filters
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Enhanced Outfits Display with Wider Cards */}
                    <div className={`${viewMode === 'grid' 
                        ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-10' 
                        : 'space-y-6 lg:space-y-10'
                    }`}>
                        {outfits.map((outfit, index) => (
                            <div
                                key={outfit._id}
                                ref={index === outfits.length - 1 ? lastOutfitElementRef : null}
                                onClick={() => handleOutfitClick(outfit._id)}
                                onMouseEnter={() => handleMouseEnter(outfit._id)}
                                onMouseLeave={handleMouseLeave}
                                className={`bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-purple-200 overflow-hidden cursor-pointer group transition-all duration-500 hover:shadow-2xl hover:border-purple-300 hover:bg-white ${
                                    hoveredCard === outfit._id ? 'ring-4 ring-purple-500/30 transform scale-[1.02]' : 'hover:transform hover:scale-[1.01]'
                                } ${
                                    viewMode === 'list' ? 'flex flex-col sm:flex-row' : ''
                                } animate-fade-in-up`}
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                {/* Enhanced Image Container */}
                                <div className={`relative overflow-hidden bg-purple-50/50 flex items-center justify-center ${
                                    viewMode === 'list' ? 'w-full sm:w-48 md:w-56 lg:w-64 h-48 sm:h-56 md:h-64 flex-shrink-0' : 'h-80'
                                }`}>
                                    <img
                                        src={outfit.image}
                                        alt={`${outfit.category} outfit`}
                                        className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-500"
                                        onClick={(e) => handleImageClick(e, outfit)}
                                    />
                                    
                                    {/* Enhanced Hover Overlay */}
                                    <div 
                                        className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
                                        onClick={(e) => handleImageClick(e, outfit)}
                                    >
                                        <div className="bg-white/95 backdrop-blur-sm rounded-full p-4 shadow-2xl transform scale-75 group-hover:scale-100 transition-all duration-300">
                                            <ZoomIn className="w-6 h-6 text-gray-700" />
                                        </div>
                                        <div className="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur-sm text-white text-sm px-4 py-2 rounded-lg text-center font-semibold">
                                            Click to view full size
                                        </div>
                                    </div>

                                    {/* Enhanced Badges */}
                                    <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                                        <div className="bg-black/80 backdrop-blur-sm text-white px-3 py-2 rounded-xl text-sm font-bold shadow-lg border border-white/20">
                                            ⭐ {outfit.rateLook.toFixed(1)}
                                        </div>
                                        {outfit.type !== 'Normal' && (
                                            <div className={`px-3 py-2 rounded-xl text-xs font-bold text-white shadow-lg backdrop-blur-sm border border-white/20 ${
                                                outfit.type === 'Sponsored' ? 'bg-orange-500/90' :
                                                outfit.type === 'Promoted' ? 'bg-purple-500/90' : ''
                                            }`}>
                                                {outfit.type}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Enhanced Content */}
                                <div className={`p-4 sm:p-6 lg:p-8 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex-1">
                                            <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors duration-300">
                                                {outfit.category}
                                            </h3>
                                            <span className="inline-block bg-purple-100 text-purple-800 text-sm px-4 py-2 rounded-full font-bold">
                                                {outfit.section}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    {outfit.description && (
                                        <p className="text-gray-600 text-sm mb-6 line-clamp-2 leading-relaxed">
                                            {outfit.description}
                                        </p>
                                    )}

                                    {/* Enhanced Price */}
                                    <div className="mb-6 p-4 bg-green-50 rounded-xl border border-green-200">
                                        <span className="text-3xl font-black text-green-700">
                                            ₹{outfit.totalPrice.toLocaleString()}
                                        </span>
                                        <span className="text-sm text-green-600 ml-2 font-semibold">
                                            ({outfit.numberOfItems} items)
                                        </span>
                                    </div>

                                    {/* Enhanced Tags */}
                                    {outfit.tags && outfit.tags.length > 0 && (
                                        <div className="mb-6">
                                            <div className="flex flex-wrap gap-2">
                                                {outfit.tags.slice(0, 3).map((tag, tagIndex) => (
                                                    <span
                                                        key={tagIndex}
                                                        className="text-xs bg-purple-100 text-purple-700 px-3 py-2 rounded-full font-bold border border-purple-200 hover:bg-purple-200 transition-colors duration-200"
                                                    >
                                                        #{tag}
                                                    </span>
                                                ))}
                                                {outfit.tags.length > 3 && (
                                                    <span className="text-xs text-purple-500 font-bold">
                                                        +{outfit.tags.length - 3} more
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Enhanced Stats */}
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 pt-4 border-t-2 border-purple-100">
                                        <div className="flex items-center gap-4 sm:gap-6 text-sm">
                                            <div className="flex items-center gap-2 text-red-500 font-bold">
                                                <Heart className="w-4 h-4" />
                                                <span>{outfit.numberOfLikes}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-500 font-bold">
                                                <ThumbsDown className="w-4 h-4" />
                                                <span>{outfit.numberOfDislikes}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-purple-500 font-bold">
                                                <MessageCircle className="w-4 h-4" />
                                                <span>{outfit.numberOfComments}</span>
                                            </div>
                                        </div>
                                        <div className="text-xs text-gray-500 font-bold bg-purple-100 px-3 py-1 rounded-full">
                                            {outfit.numberOfClicks} views
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Enhanced Loading Indicator */}
                    {loading && (
                        <div className="flex justify-center items-center py-16">
                            <div className="flex items-center gap-4 bg-white/90 backdrop-blur-sm px-8 py-6 rounded-2xl shadow-xl">
                                <div className="relative">
                                    <div className="animate-spin rounded-full h-10 w-10 border-4 border-purple-200"></div>
                                    <div className="animate-spin rounded-full h-10 w-10 border-4 border-purple-600 border-t-transparent absolute top-0 left-0"></div>
                                </div>
                                <span className="text-gray-700 font-semibold text-lg">Loading more outfits...</span>
                            </div>
                        </div>
                    )}

                    {/* Enhanced Empty State */}
                    {!loading && outfits.length === 0 && (
                        <div className="text-center py-20">
                            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-12 max-w-lg mx-auto shadow-xl">
                                <div className="text-8xl mb-6 animate-bounce">👗</div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">No outfits found</h3>
                                <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                                    We couldn't find any outfits matching your criteria. Try adjusting your search or filters.
                                </p>
                                <button
                                    onClick={clearFilters}
                                    className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-bold rounded-xl text-white bg-purple-600 hover:bg-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                                >
                                    Clear all filters
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Enhanced End State */}
                    {!hasMore && outfits.length > 0 && (
                        <div className="text-center py-16">
                            <div className="inline-flex items-center gap-3 bg-white/90 backdrop-blur-sm text-gray-700 px-8 py-4 rounded-2xl shadow-lg">
                                <span className="text-2xl">🎉</span>
                                <span className="font-semibold text-lg">You've seen all available outfits!</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Image Modal */}
            <ImageModal
                isOpen={modalImage.isOpen}
                onClose={closeImageModal}
                imageUrl={modalImage.imageUrl}
                imageAlt={modalImage.imageAlt}
            />

            {/* Enhanced Custom Styles */}
            <style jsx>{`
                .line-clamp-2 {
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }

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

                @keyframes float-slow {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    25% { transform: translateY(-25px) rotate(3deg); }
                    50% { transform: translateY(-15px) rotate(-2deg); }
                    75% { transform: translateY(-35px) rotate(2deg); }
                }

                @keyframes float-medium {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    33% { transform: translateY(-30px) rotate(-3deg); }
                    66% { transform: translateY(-20px) rotate(2deg); }
                }

                @keyframes float-fast {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-25px) rotate(-4deg); }
                }

                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }

                @keyframes bounce-slow {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-25px); }
                }

                @keyframes slide-right {
                    0% { transform: translateX(-100vw); }
                    100% { transform: translateX(100vw); }
                }

                @keyframes slide-left {
                    0% { transform: translateX(100vw); }
                    100% { transform: translateX(-100vw); }
                }

                @keyframes float-particle {
                    0%, 100% {
                        transform: translateY(0px) translateX(0px) rotate(0deg);
                        opacity: 0.15;
                    }
                    25% {
                        transform: translateY(-120px) translateX(60px) rotate(90deg);
                        opacity: 0.6;
                    }
                    50% {
                        transform: translateY(-240px) translateX(-40px) rotate(180deg);
                        opacity: 0.9;
                    }
                    75% {
                        transform: translateY(-180px) translateX(-100px) rotate(270deg);
                        opacity: 0.6;
                    }
                }

                @keyframes pulse-slow {
                    0%, 100% { opacity: 0.2; }
                    50% { opacity: 0.7; }
                }

                @keyframes pulse-medium {
                    0%, 100% { opacity: 0.15; }
                    50% { opacity: 0.5; }
                }

                .animate-fade-in-up {
                    animation: fade-in-up 0.6s ease-out forwards;
                }

                .animate-float-slow {
                    animation: float-slow 18s ease-in-out infinite;
                }

                .animate-float-medium {
                    animation: float-medium 14s ease-in-out infinite;
                }

                .animate-float-fast {
                    animation: float-fast 10s ease-in-out infinite;
                }

                .animate-spin-slow {
                    animation: spin-slow 25s linear infinite;
                }

                .animate-bounce-slow {
                    animation: bounce-slow 4s ease-in-out infinite;
                }

                .animate-slide-right {
                    animation: slide-right 18s linear infinite;
                }

                .animate-slide-left {
                    animation: slide-left 22s linear infinite;
                }

                .animate-float-particle {
                    animation: float-particle var(--duration, 12s) ease-in-out infinite;
                }

                .animate-pulse-slow {
                    animation: pulse-slow 5s ease-in-out infinite;
                }

                .animate-pulse-medium {
                    animation: pulse-medium 4s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
}
