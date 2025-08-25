import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

export default function LuxuryCarousel({ items, currentSlide, setCurrentSlide }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % items.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + items.length) % items.length);
  };

  return (
    <motion.section 
      ref={ref}
      className="py-20 lg:py-32 relative overflow-hidden bg-gradient-to-br from-slate-800/30 to-purple-900/10"
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
          <h2 className="text-4xl md:text-6xl font-black text-white mb-6">
            Featured{' '}
            <span className="bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">
              Collections
            </span>
          </h2>
          <p className="text-2xl text-purple-200">
            Curated luxury looks for the modern elite
          </p>
        </motion.div>

        <div className="relative">
          <div className="overflow-hidden rounded-3xl">
            <motion.div 
              className="flex transition-transform duration-500 ease-out"
              animate={{ x: `-${currentSlide * 100}%` }}
            >
              {items.map((item, index) => (
                <div key={item.id} className="w-full flex-shrink-0">
                  <motion.div 
                    className={`relative h-96 lg:h-[500px] bg-gradient-to-br ${item.gradient} rounded-3xl flex items-center justify-center text-center p-12`}
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent rounded-3xl" />
                    
                    <motion.div 
                      className="relative z-10"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ 
                        opacity: index === currentSlide ? 1 : 0.7,
                        y: index === currentSlide ? 0 : 30 
                      }}
                      transition={{ duration: 0.5 }}
                    >
                      <motion.div 
                        className="text-6xl mb-6"
                        animate={{
                          rotate: [0, 5, -5, 0],
                          scale: [1, 1.1, 1]
                        }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          delay: index * 0.5
                        }}
                      >
                        👑
                      </motion.div>
                      
                      <h3 className="text-4xl md:text-5xl font-black text-white mb-4">
                        {item.title}
                      </h3>
                      
                      <div className="inline-block bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 mb-6">
                        <span className="text-purple-200 font-semibold">{item.category}</span>
                      </div>
                      
                      <p className="text-xl text-purple-100 max-w-2xl mx-auto leading-relaxed">
                        {item.description}
                      </p>
                    </motion.div>
                  </motion.div>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-purple-600/80 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-purple-500/80 transition-colors duration-300"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            ←
          </motion.button>
          
          <motion.button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-purple-600/80 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-purple-500/80 transition-colors duration-300"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            →
          </motion.button>

          <div className="flex justify-center space-x-3 mt-8">
            {items.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide 
                    ? 'bg-purple-400 w-8' 
                    : 'bg-purple-600/50 hover:bg-purple-500/70'
                }`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
}