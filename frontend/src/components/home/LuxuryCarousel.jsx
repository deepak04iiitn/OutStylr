import React, { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';

export default function LuxuryCarousel({ items, currentSlide, setCurrentSlide }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef(null);

  // 2 seconds interval for auto-navigation
  const AUTO_ADVANCE_INTERVAL = 2000;

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
  };

  // Auto-navigation effect with 2-second interval
  useEffect(() => {
    if (isAutoPlaying && !isPaused && isInView) {
      intervalRef.current = setInterval(() => {
        nextSlide();
      }, AUTO_ADVANCE_INTERVAL); // 2 seconds

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
  }, [isAutoPlaying, isPaused, isInView, currentSlide]);

  // Keyboard navigation (kept for accessibility)
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'ArrowRight') {
        nextSlide();
        // Pause auto-play temporarily when user manually navigates
        setIsPaused(true);
        setTimeout(() => setIsPaused(false), 8000);
      } else if (event.key === 'ArrowLeft') {
        prevSlide();
        // Pause auto-play temporarily when user manually navigates
        setIsPaused(true);
        setTimeout(() => setIsPaused(false), 8000);
      } else if (event.key === ' ') { // Spacebar to toggle auto-play
        event.preventDefault();
        setIsAutoPlaying(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  // Mouse enter/leave handlers for pause on hover
  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  // Images from public folder
  const carouselImages = [
    {
      id: 1,
      src: "/OSB-1.png",
      alt: "Outfit-First Shopping - Your Style, Simplified"
    },
    {
      id: 2,
      src: "/OSB-2.png",
      alt: "No More Link Please - Unlock Instant Outfits"
    },
    {
      id: 3,
      src: "/OSB-3.png",
      alt: "Upload the Outfit - Get Personalized Styling"
    },
    {
      id: 4,
      src: "/OSB-4.png",
      alt: "Get Trending Outfits - Curated for Occasions"
    }
  ];

  return (
    <motion.section 
      ref={ref}
      className="py-12 sm:py-16 lg:py-32 relative overflow-hidden bg-gradient-to-br from-slate-800/30 to-purple-900/10"
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-8 sm:mb-12 lg:mb-16"
          initial={{ y: 50, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 sm:mb-6">
            Your Style{' '}
            <span className="bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">
              Simplified
            </span>
          </h2>
          <p className="text-lg sm:text-xl lg:text-2xl text-purple-200">
            Outfit-first shopping experience with instant styling solutions
          </p>
        </motion.div>

        <div className="relative" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          <div className="overflow-hidden rounded-2xl sm:rounded-3xl shadow-2xl">
            <motion.div 
              className="flex transition-transform duration-500 ease-out"
              animate={{ x: `-${currentSlide * 100}%` }}
            >
              {carouselImages.map((image, index) => (
                <div key={image.id} className="w-full flex-shrink-0">
                  <motion.div 
                    className="relative w-full h-64 sm:h-80 lg:h-96 xl:h-[500px] overflow-hidden rounded-2xl sm:rounded-3xl"
                    style={{
                      background: `
                        radial-gradient(circle at 20% 80%, rgba(147, 51, 234, 0.4) 0%, transparent 50%),
                        radial-gradient(circle at 80% 20%, rgba(168, 85, 247, 0.3) 0%, transparent 50%),
                        radial-gradient(circle at 40% 40%, rgba(124, 58, 237, 0.2) 0%, transparent 50%),
                        linear-gradient(135deg, #1e293b 0%, #334155 50%, #475569 100%)
                      `,
                      boxShadow: `
                        inset 0 1px 0 rgba(255, 255, 255, 0.1),
                        inset 0 -1px 0 rgba(0, 0, 0, 0.2),
                        0 10px 25px rgba(0, 0, 0, 0.3),
                        0 20px 40px rgba(147, 51, 234, 0.2)
                      `
                    }}
                    whileHover={{ 
                      scale: 1.02,
                      boxShadow: `
                        inset 0 1px 0 rgba(255, 255, 255, 0.15),
                        inset 0 -1px 0 rgba(0, 0, 0, 0.25),
                        0 15px 35px rgba(0, 0, 0, 0.4),
                        0 25px 50px rgba(147, 51, 234, 0.3)
                      `
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* 3D Background with Geometric Elements */}
                    <div className="absolute inset-0 overflow-hidden">
                      {/* Floating geometric shapes - reduced for mobile performance */}
                      <motion.div
                        className="absolute top-4 sm:top-10 left-4 sm:left-10 w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-purple-400/30 to-purple-600/20 rounded-xl sm:rounded-2xl"
                        style={{
                          transform: 'perspective(1000px) rotateX(45deg) rotateY(45deg)',
                          boxShadow: '0 5px 15px rgba(147, 51, 234, 0.3)'
                        }}
                        animate={{
                          rotateY: [45, 90, 45],
                          rotateX: [45, 60, 45]
                        }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                      />
                      
                      <motion.div
                        className="absolute bottom-4 sm:bottom-12 right-4 sm:right-12 w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-gradient-to-tl from-violet-400/25 to-purple-500/15 rounded-lg sm:rounded-xl"
                        style={{
                          transform: 'perspective(800px) rotateX(-30deg) rotateY(-30deg)',
                          boxShadow: '0 4px 12px rgba(168, 85, 247, 0.25)'
                        }}
                        animate={{
                          rotateY: [-30, -60, -30],
                          rotateX: [-30, -45, -30]
                        }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                      />
                      
                      {/* Ambient light effects */}
                      <motion.div
                        className="absolute top-0 left-0 w-16 h-16 sm:w-24 sm:h-24 lg:w-32 lg:h-32 bg-purple-400/20 rounded-full blur-xl"
                        animate={{
                          scale: [1, 1.5, 1],
                          opacity: [0.2, 0.4, 0.2]
                        }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      />
                      
                      <motion.div
                        className="absolute bottom-0 right-0 w-20 h-20 sm:w-28 sm:h-28 lg:w-40 lg:h-40 bg-violet-500/15 rounded-full blur-2xl"
                        animate={{
                          scale: [1, 1.3, 1],
                          opacity: [0.15, 0.3, 0.15]
                        }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                      />
                    </div>

                    {/* Image with proper fit - COMPLETE IMAGE VISIBLE */}
                    <div className="absolute inset-0 flex items-center justify-center z-10 p-4 sm:p-6">
                      <motion.img
                        src={image.src}
                        alt={image.alt}
                        className="max-w-full max-h-full object-contain drop-shadow-2xl"
                        style={{
                          filter: 'drop-shadow(0 10px 20px rgba(0, 0, 0, 0.3))'
                        }}
                        initial={{ scale: 1.05 }}
                        animate={{ 
                          scale: index === currentSlide ? 1 : 1.02,
                          filter: index === currentSlide 
                            ? "brightness(1) drop-shadow(0 15px 25px rgba(0, 0, 0, 0.4))" 
                            : "brightness(0.8) drop-shadow(0 10px 20px rgba(0, 0, 0, 0.3))"
                        }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                    
                    {/* Subtle Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-black/5 pointer-events-none z-20" />
                    
                    {/* Premium glass effect border */}
                    <div 
                      className="absolute inset-0 rounded-2xl sm:rounded-3xl pointer-events-none z-30"
                      style={{
                        background: 'linear-gradient(145deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.02) 100%)',
                        border: '1px solid rgba(255,255,255,0.1)'
                      }}
                    />
                    
                    {/* Animated Border Effect */}
                    <motion.div
                      className="absolute inset-0 border-2 border-transparent rounded-2xl sm:rounded-3xl z-40"
                      animate={{
                        borderColor: index === currentSlide 
                          ? ["rgba(147, 51, 234, 0.6)", "rgba(168, 85, 247, 0.9)", "rgba(147, 51, 234, 0.6)"]
                          : "rgba(147, 51, 234, 0.2)"
                      }}
                      transition={{ 
                        duration: 2, 
                        repeat: index === currentSlide ? Infinity : 0 
                      }}
                      style={{
                        boxShadow: index === currentSlide 
                          ? '0 0 20px rgba(147, 51, 234, 0.4), inset 0 0 20px rgba(168, 85, 247, 0.1)'
                          : '0 0 10px rgba(147, 51, 234, 0.2)'
                      }}
                    />

                    {/* Fashion Icon Overlay */}
                    <motion.div 
                      className="absolute top-3 right-3 sm:top-6 sm:right-6 w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-white/15 backdrop-blur-md rounded-full flex items-center justify-center z-50"
                      style={{
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                      }}
                      animate={{
                        scale: index === currentSlide ? [1, 1.2, 1] : 1,
                        opacity: index === currentSlide ? 1 : 0.7,
                        rotateY: index === currentSlide ? [0, 180, 360] : 0
                      }}
                      transition={{
                        scale: { duration: 2, repeat: Infinity },
                        opacity: { duration: 0.5 },
                        rotateY: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                      }}
                    >
                      <span className="text-white text-sm sm:text-lg lg:text-xl">✨</span>
                    </motion.div>
                  </motion.div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Navigation Buttons - HIDDEN ON MOBILE/TABLET, VISIBLE ON LARGE SCREENS */}
          <motion.button
            onClick={() => {
              prevSlide();
              setIsPaused(true);
              setTimeout(() => setIsPaused(false), 8000);
            }}
            className="hidden lg:flex cursor-pointer absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 lg:w-14 lg:h-14 bg-purple-600/90 backdrop-blur-sm rounded-full items-center justify-center text-white hover:bg-purple-500/90 transition-all duration-300 shadow-lg z-10"
            whileHover={{ scale: 1.1, x: -2 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Previous slide"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.button>
          
          <motion.button
            onClick={() => {
              nextSlide();
              setIsPaused(true);
              setTimeout(() => setIsPaused(false), 8000);
            }}
            className="hidden lg:flex cursor-pointer absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 lg:w-14 lg:h-14 bg-purple-600/90 backdrop-blur-sm rounded-full items-center justify-center text-white hover:bg-purple-500/90 transition-all duration-300 shadow-lg z-10"
            whileHover={{ scale: 1.1, x: 2 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Next slide"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.button>

          {/* Enhanced Indicators with Auto-play Progress */}
          <div className="flex justify-center space-x-2 sm:space-x-4 mt-6 sm:mt-8">
            {carouselImages.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => {
                  setCurrentSlide(index);
                  setIsPaused(true);
                  setTimeout(() => setIsPaused(false), 8000);
                }}
                className={`relative overflow-hidden rounded-full transition-all duration-300 ${
                  index === currentSlide 
                    ? 'w-8 sm:w-10 lg:w-12 h-3 sm:h-4 bg-purple-400' 
                    : 'w-3 sm:w-4 h-3 sm:h-4 bg-purple-600/50 hover:bg-purple-500/70'
                }`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                {index === currentSlide && (
                  <>
                    {/* Background gradient */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-purple-300 to-violet-300"
                      animate={{
                        x: ["-100%", "100%"]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    />
                    {/* Auto-play progress bar */}
                    {isAutoPlaying && !isPaused && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-orange-400"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{
                          duration: AUTO_ADVANCE_INTERVAL / 1000, // Convert to seconds
                          ease: "linear",
                          repeat: Infinity
                        }}
                        style={{ transformOrigin: "left" }}
                      />
                    )}
                  </>
                )}
              </motion.button>
            ))}
          </div>

          {/* Auto-play Control Button */}
          <motion.button
            onClick={() => setIsAutoPlaying(prev => !prev)}
            className="absolute top-3 left-3 sm:top-6 sm:left-6 w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-all duration-300 shadow-lg z-50"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title={isAutoPlaying ? 'Pause auto-play' : 'Resume auto-play'}
          >
            {isAutoPlaying ? (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="6" y="4" width="4" height="16" fill="currentColor"/>
                <rect x="14" y="4" width="4" height="16" fill="currentColor"/>
              </svg>
            ) : (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <polygon points="5,3 19,12 5,21" fill="currentColor"/>
              </svg>
            )}
          </motion.button>

          {/* Image Counter */}
          <motion.div 
            className="absolute bottom-3 left-3 sm:bottom-6 sm:left-6 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1 sm:px-4 sm:py-2"
            animate={{
              scale: [1, 1.05, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <span className="text-white font-medium text-xs sm:text-sm">
              {currentSlide + 1} / {carouselImages.length}
            </span>
          </motion.div>
        </div>

      </div>
    </motion.section>
  );
}
