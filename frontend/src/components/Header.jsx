import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  
  const headerBg = useTransform(
    scrollY,
    [0, 100],
    ["rgba(15, 23, 42, 0)", "rgba(15, 23, 42, 0.95)"]
  );
  
  const logoScale = useTransform(scrollY, [0, 100], [1, 0.9]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Collection', href: '#collection' },
    { name: 'Trending', href: '#trending' },
    { name: 'Testimonials', href: '#testimonials' },
    { name: 'FAQ', href: '#faq' },
    { name: 'Custom Request', href: '#custom' },
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.645, 0.045, 0.355, 1],
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.645, 0.045, 0.355, 1] }
    }
  };

  return (
    <motion.header
      style={{ backgroundColor: headerBg }}
      className={`fixed w-full z-50 transition-all duration-500 ${
        isScrolled ? 'backdrop-blur-xl border-b border-purple-500/20 shadow-2xl shadow-purple-900/20' : ''
      }`}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-18 lg:h-22">
          {/* Luxury Logo */}
          <motion.div 
            className="flex items-center space-x-4"
            style={{ scale: logoScale }}
          >
            <motion.div 
              className="relative w-12 h-12 rounded-2xl flex items-center justify-center overflow-hidden"
              animate={{
                boxShadow: [
                  "0 0 20px rgba(147, 51, 234, 0.4)",
                  "0 0 40px rgba(168, 85, 247, 0.6)",
                  "0 0 20px rgba(147, 51, 234, 0.4)"
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
              whileHover={{ 
                scale: 1.1, 
                rotate: 360,
                transition: { duration: 0.8, ease: "easeInOut" }
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-violet-600 to-indigo-600" />
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-violet-400 opacity-60 animate-pulse" />
              <motion.span 
                className="relative text-white font-bold text-2xl z-10"
                animate={{ 
                  textShadow: [
                    "0 0 10px rgba(255,255,255,0.8)",
                    "0 0 20px rgba(255,255,255,1)",
                    "0 0 10px rgba(255,255,255,0.8)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                O
              </motion.span>
            </motion.div>
            <motion.div className="flex flex-col">
              <motion.span 
                className="text-3xl font-black bg-gradient-to-r from-purple-400 via-violet-400 to-indigo-400 bg-clip-text text-transparent"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                OutStylr
              </motion.span>
            </motion.div>
          </motion.div>

          {/* Premium Navigation */}
          <nav className="hidden md:flex items-center space-x-10">
            {navItems.map((item, index) => (
              <motion.div
                key={item.name}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                className="relative group"
              >
                <motion.a
                  href={item.href}
                  className="relative text-purple-200 hover:text-purple-100 font-medium text-lg transition-all duration-300 group"
                  whileHover={{ y: -2 }}
                >
                  {item.name}
                  <motion.span 
                    className="absolute -bottom-2 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-violet-400 group-hover:w-full transition-all duration-500 ease-out"
                  />
                  <motion.span 
                    className="absolute -bottom-1 left-1/2 w-0 h-0.5 bg-gradient-to-r from-violet-300 to-purple-300 opacity-0 group-hover:w-1/2 group-hover:opacity-100 transform -translate-x-1/2 transition-all duration-300 delay-200"
                  />
                </motion.a>
              </motion.div>
            ))}
          </nav>

          {/* Luxury CTA Buttons */}
          <div className="hidden md:flex items-center space-x-6">
            <motion.button 
              className="relative px-6 py-3 text-purple-300 hover:text-purple-100 font-semibold text-lg group overflow-hidden"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              variants={itemVariants}
            >
              <span className="relative z-10">Newsletter</span>
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-purple-900/30 to-violet-900/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"
                initial={{ scale: 0 }}
                whileHover={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>
            
            <motion.button 
              className="relative px-8 py-3 bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 text-white rounded-full font-semibold text-lg overflow-hidden group"
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 20px 40px -15px rgba(147, 51, 234, 0.6)"
              }}
              whileTap={{ scale: 0.95 }}
              variants={itemVariants}
            >
              <motion.span 
                className="relative z-10"
                animate={{ 
                  color: ["#ffffff", "#e0e7ff", "#ffffff"]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Find My Look
              </motion.span>
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                initial={{ x: "-100%" }}
                whileHover={{ x: "0%" }}
                transition={{ duration: 0.5 }}
              />
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-3 relative group"
            whileTap={{ scale: 0.9 }}
          >
            <div className="space-y-2">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-7 h-0.5 bg-purple-300 origin-center"
                  animate={{
                    rotate: isMobileMenuOpen 
                      ? (i === 0 ? 45 : i === 2 ? -45 : 0)
                      : 0,
                    opacity: isMobileMenuOpen && i === 1 ? 0 : 1,
                    y: isMobileMenuOpen 
                      ? (i === 0 ? 6 : i === 2 ? -6 : 0) 
                      : 0
                  }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                />
              ))}
            </div>
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className="md:hidden"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
            >
              <motion.div 
                className="py-8 space-y-6 bg-slate-900/95 backdrop-blur-xl rounded-b-3xl border-b border-purple-500/20"
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                transition={{ delay: 0.1 }}
              >
                {navItems.map((item, index) => (
                  <motion.a
                    key={item.name}
                    href={item.href}
                    className="block text-purple-200 hover:text-purple-100 font-semibold text-xl py-2 px-4 rounded-xl hover:bg-purple-900/30 transition-all duration-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 + 0.2 }}
                    whileHover={{ x: 10, scale: 1.02 }}
                  >
                    {item.name}
                  </motion.a>
                ))}
                
                <motion.div 
                  className="flex flex-col space-y-4 px-4 pt-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <motion.button 
                    className="text-left text-purple-300 hover:text-purple-100 font-semibold text-lg"
                    whileHover={{ x: 10 }}
                  >
                    Newsletter
                  </motion.button>
                  <motion.button 
                    className="px-8 py-4 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-full font-semibold text-lg shadow-lg"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Find My Look
                  </motion.button>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
