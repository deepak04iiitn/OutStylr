import React, { useRef, memo } from 'react';
import { motion, useInView } from 'framer-motion';

// Memoize individual outfit card to prevent unnecessary re-renders
const OutfitCard = memo(({ outfit, index, isInView, hoveredOutfit, onHoverStart, onHoverEnd, onOutfitClick }) => (
  <motion.div
    className="group relative bg-gradient-to-br from-slate-800/50 to-purple-900/20 backdrop-blur-lg rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-purple-500/20 cursor-pointer"
    initial={{ y: 60, opacity: 0, scale: 0.9 }}
    animate={isInView ? { y: 0, opacity: 1, scale: 1 } : { y: 60, opacity: 0, scale: 0.9 }}
    transition={{ duration: 0.8, delay: index * 0.1 }}
    whileHover={{ 
      y: -15,
      scale: 1.02,
      boxShadow: "0 25px 50px -12px rgba(147, 51, 234, 0.4)"
    }}
    whileTap={{ scale: 0.98 }}
    onHoverStart={() => onHoverStart(outfit.id)}
    onHoverEnd={() => onHoverEnd(null)}
    onClick={() => onOutfitClick(outfit.id)}
  >
    <div className="relative aspect-[3/4] overflow-hidden rounded-t-3xl">
      {outfit.image ? (
        <img
          src={outfit.image}
          alt={`${outfit.title} outfit`}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className={`absolute inset-0 bg-gradient-to-br ${outfit.gradient}`}>
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div 
              className="text-8xl opacity-30 will-change-transform"
              animate={{
                rotate: [0, 10, -10, 0],
                scale: hoveredOutfit === outfit.id ? 1.1 : 1
              }}
              transition={{
                rotate: { duration: 4, repeat: Infinity },
                scale: { duration: 0.3 }
              }}
            >
              👑
            </motion.div>
          </div>
        </div>
      )}
      
      <motion.div 
        className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
        animate={{ 
          opacity: hoveredOutfit === outfit.id ? 1 : 0.4 
        }}
        transition={{ duration: 0.3 }}
      />
      
      <motion.div 
        className="absolute top-4 left-4 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-full px-3 py-1 text-sm font-bold will-change-transform"
        animate={{
          y: hoveredOutfit === outfit.id ? -5 : 0,
          scale: hoveredOutfit === outfit.id ? 1.05 : 1
        }}
      >
        {outfit.trend}
      </motion.div>

      <motion.div 
        className="absolute bottom-4 left-4 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-semibold text-white"
        animate={{
          backgroundColor: hoveredOutfit === outfit.id ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.2)"
        }}
      >
        {outfit.category}
      </motion.div>
    </div>

    <motion.div 
      className="p-6"
      animate={{
        backgroundColor: hoveredOutfit === outfit.id ? "rgba(15, 23, 42, 0.8)" : "transparent"
      }}
      transition={{ duration: 0.3 }}
    >
      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-300 transition-colors duration-300">
        {outfit.title}
      </h3>
      
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <span className="text-2xl font-black text-purple-400">{outfit.price}</span>
        </div>
        <motion.span 
          className="text-purple-300 flex items-center space-x-1"
          animate={{
            scale: hoveredOutfit === outfit.id ? 1.05 : 1
          }}
        >
          <span>👍</span>
          <span className="text-sm">{outfit.likes.toLocaleString()}</span>
        </motion.span>
      </div>
      
      <motion.button 
        className="cursor-pointer w-full py-3 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 relative overflow-hidden group"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={(e) => {
          e.stopPropagation();
          onOutfitClick(outfit.id);
        }}
      >
        <motion.div
          className="cursor-pointer absolute inset-0 bg-gradient-to-r from-violet-600 to-purple-600"
          initial={{ x: "-100%" }}
          whileHover={{ x: "0%" }}
          transition={{ duration: 0.3 }}
        />
        <span className="relative z-10 flex items-center justify-center space-x-2">
          <span>Get Complete Look</span>
          <motion.span
            animate={{ x: [0, 3, 0] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            →
          </motion.span>
        </span>
      </motion.button>
    </motion.div>
  </motion.div>
));

OutfitCard.displayName = 'OutfitCard';

export default memo(function TrendingOutfitsSection({ outfits, hoveredOutfit, setHoveredOutfit, loading = false }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const handleOutfitClick = (outfitId) => {
    window.location.href = `/outfit/${outfitId}`;
  };

  return (
    <motion.section 
      ref={ref}
      className="py-20 lg:py-32 bg-gradient-to-br from-slate-900 via-purple-900/10 to-slate-900"
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ y: 50, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.h2 
            className="text-4xl md:text-6xl font-black text-white mb-6"
            animate={{
              textShadow: [
                "0 0 20px rgba(147, 51, 234, 0.3)",
                "0 0 40px rgba(168, 85, 247, 0.4)",
                "0 0 20px rgba(147, 51, 234, 0.3)"
              ]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            🔥 Trending{' '}
            <span className="bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">
              Outfits
            </span>
          </motion.h2>
          <p className="text-2xl text-purple-200 mb-8">
            Most coveted looks this season - curated by experts
          </p>
          <motion.div
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-900/50 to-violet-900/50 backdrop-blur-lg rounded-full px-4 py-2 border border-purple-500/20"
            animate={{
              scale: [1, 1.05, 1]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="text-purple-300 text-sm">✨ Updated Daily</span>
          </motion.div>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {[...Array(6)].map((_, index) => (
              <motion.div
                key={index}
                className="bg-gradient-to-br from-slate-800/50 to-purple-900/20 backdrop-blur-lg rounded-3xl shadow-xl border border-purple-500/20 overflow-hidden"
                initial={{ y: 60, opacity: 0, scale: 0.9 }}
                animate={isInView ? { y: 0, opacity: 1, scale: 1 } : { y: 60, opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                <div className="relative aspect-[3/4] overflow-hidden rounded-t-3xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-700/50 to-purple-800/30 animate-pulse"></div>
                </div>
                <div className="p-6">
                  <div className="h-6 bg-slate-700/50 rounded-lg mb-3 animate-pulse"></div>
                  <div className="h-4 bg-slate-700/30 rounded-lg mb-4 animate-pulse"></div>
                  <div className="h-8 bg-slate-700/40 rounded-lg animate-pulse"></div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : outfits.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {outfits.map((outfit, index) => (
              <OutfitCard
                key={outfit.id}
                outfit={outfit}
                index={index}
                isInView={isInView}
                hoveredOutfit={hoveredOutfit}
                onHoverStart={setHoveredOutfit}
                onHoverEnd={setHoveredOutfit}
                onOutfitClick={handleOutfitClick}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-6">👗</div>
            <h3 className="text-2xl font-bold text-white mb-4">No trending outfits yet</h3>
            <p className="text-purple-200 mb-6 text-lg">Check back later for the most popular outfits!</p>
          </div>
        )}

        <motion.div 
          className="text-center"
          initial={{ y: 30, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : { y: 30, opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <motion.button 
            className="cursor-pointer group relative px-12 py-5 bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 text-white rounded-2xl text-xl font-bold overflow-hidden"
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 25px 50px -12px rgba(147, 51, 234, 0.6)"
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.href = '/trending'}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600"
              initial={{ x: "-100%" }}
              whileHover={{ x: "0%" }}
              transition={{ duration: 0.3 }}
            />
            <span className="relative z-10 flex items-center space-x-3">
              <span>Shop More Trending Outfits</span>
              <motion.span
                animate={{ 
                  rotate: [0, 360],
                  scale: [1, 1.2, 1]
                }}
                transition={{ 
                  rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                  scale: { duration: 1.5, repeat: Infinity }
                }}
              >
                ⚡
              </motion.span>
            </span>
          </motion.button>
          
          <motion.p 
            className="mt-4 text-purple-200 text-lg"
            animate={{
              opacity: [0.7, 1, 0.7]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            Discover 100+ curated outfit collections
          </motion.p>
        </motion.div>
      </div>
    </motion.section>
  );
});
