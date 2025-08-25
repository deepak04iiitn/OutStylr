import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(3);
  const { scrollY } = useScroll();
  
  const headerY = useTransform(scrollY, [0, 100], [20, 10]);
  const headerScale = useTransform(scrollY, [0, 100], [1, 0.98]);
  const headerOpacity = useTransform(scrollY, [0, 100], [0.95, 1]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', href: '#home' },
    { name: 'About Us', href: '#about' },
    { name: 'Outfits', href: '#outfits' },
    { name: 'Trending', href: '#trending' },
    { name: 'Custom Request', href: '#custom' },
    { name: 'Blogs', href: '#blogs' },
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
      className="fixed w-full z-50 px-4 sm:px-6 lg:px-8"
      style={{ y: headerY }}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Floating Header Container */}
      <motion.div
        className="relative max-w-7xl mx-auto mt-4"
        style={{ scale: headerScale }}
      >
        {/* Main Header Box with Semicircular Cutouts */}
        <motion.div
          className="relative bg-slate-900/90 backdrop-blur-xl border border-purple-500/20 shadow-2xl overflow-hidden"
          style={{ 
            opacity: headerOpacity,
            clipPath: 'polygon(5% 0%, 95% 0%, 100% 50%, 95% 100%, 5% 100%, 0% 50%)'
          }}
          animate={{
            boxShadow: [
              "0 8px 32px rgba(147, 51, 234, 0.3)",
              "0 12px 40px rgba(168, 85, 247, 0.4)",
              "0 8px 32px rgba(147, 51, 234, 0.3)"
            ]
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          {/* Gradient Border Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-violet-500/20 to-indigo-500/20 p-[1px]">
            <div className="w-full h-full bg-slate-900/95 backdrop-blur-xl" 
                 style={{ clipPath: 'polygon(5% 0%, 95% 0%, 100% 50%, 95% 100%, 5% 100%, 0% 50%)' }} />
          </div>

          {/* Header Content */}
          <div className="relative z-10 flex justify-between items-center h-16 lg:h-18 px-8 lg:px-12">
            {/* Logo */}
            <motion.div 
              className="flex items-center space-x-4"
              variants={itemVariants}
            >
              <motion.div 
                className="relative w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden"
                animate={{
                  boxShadow: [
                    "0 0 15px rgba(147, 51, 234, 0.4)",
                    "0 0 25px rgba(168, 85, 247, 0.6)",
                    "0 0 15px rgba(147, 51, 234, 0.4)"
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
                <motion.span 
                  className="relative text-white font-bold text-xl z-10"
                  animate={{ 
                    textShadow: [
                      "0 0 8px rgba(255,255,255,0.8)",
                      "0 0 16px rgba(255,255,255,1)",
                      "0 0 8px rgba(255,255,255,0.8)"
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  O
                </motion.span>
              </motion.div>
              <motion.span 
                className="text-2xl font-black bg-gradient-to-r from-purple-400 via-violet-400 to-indigo-400 bg-clip-text text-transparent"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                OutStylr
              </motion.span>
            </motion.div>

            {/* Navigation */}
            <nav className="hidden lg:flex items-center space-x-6">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.name}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                  className="relative group"
                >
                  <motion.a
                    href={item.href}
                    className="relative text-purple-200 hover:text-white font-medium transition-all duration-300 group px-3 py-2"
                    whileHover={{ y: -2 }}
                  >
                    {item.name}
                    <motion.span 
                      className="absolute -bottom-1 left-3 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-violet-400 group-hover:w-[calc(100%-24px)] transition-all duration-500 ease-out"
                    />
                  </motion.a>
                </motion.div>
              ))}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {/* Cart Icon */}
              <motion.button 
                className="cursor-pointer relative p-2 text-purple-300 hover:text-white transition-colors duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                variants={itemVariants}
              >
                <svg 
                  width="22" 
                  height="22" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6"
                >
                  <path 
                    d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.3 15.7 4.6 16.5 5.1 16.5H17M17 13V16.5M9 19.5C9.8 19.5 10.5 20.2 10.5 21S9.8 22.5 9 22.5 7.5 21.8 7.5 21 8.2 19.5 9 19.5ZM20 19.5C20.8 19.5 21.5 20.2 21.5 21S20.8 22.5 20 22.5 18.5 21.8 18.5 21 19.2 19.5 20 19.5Z" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                </svg>
                
                {cartItemCount > 0 && (
                  <motion.span
                    className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-bold rounded-full flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    whileHover={{ scale: 1.2 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  >
                    {cartItemCount > 9 ? '9+' : cartItemCount}
                  </motion.span>
                )}
              </motion.button>

              {/* Sign In Button */}
              <motion.button 
                className="cursor-pointer hidden md:flex relative px-6 py-2.5 bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 text-white rounded-full font-semibold overflow-hidden group"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 8px 25px rgba(147, 51, 234, 0.4)"
                }}
                whileTap={{ scale: 0.95 }}
                variants={itemVariants}
              >
                <motion.span 
                  className="relative z-10"
                  animate={{ 
                    color: ["#ffffff", "#e0e7ff", "#ffffff"]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  Sign In
                </motion.span>
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "0%" }}
                  transition={{ duration: 0.5 }}
                />
              </motion.button>

              {/* Mobile Menu Button */}
              <motion.button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 relative group"
                whileTap={{ scale: 0.9 }}
              >
                <div className="space-y-1.5">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-6 h-0.5 bg-purple-300 origin-center"
                      animate={{
                        rotate: isMobileMenuOpen 
                          ? (i === 0 ? 45 : i === 2 ? -45 : 0)
                          : 0,
                        opacity: isMobileMenuOpen && i === 1 ? 0 : 1,
                        y: isMobileMenuOpen 
                          ? (i === 0 ? 5 : i === 2 ? -5 : 0) 
                          : 0
                      }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    />
                  ))}
                </div>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className="lg:hidden mt-2"
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
            >
              <motion.div 
                className="bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-purple-500/20 shadow-2xl p-6"
                style={{
                  clipPath: 'polygon(3% 0%, 97% 0%, 100% 50%, 97% 100%, 3% 100%, 0% 50%)'
                }}
              >
                <div className="space-y-4">
                  {navItems.map((item, index) => (
                    <motion.a
                      key={item.name}
                      href={item.href}
                      className="block text-purple-200 hover:text-white font-semibold text-lg py-2 px-4 rounded-xl hover:bg-purple-900/30 transition-all duration-300"
                      onClick={() => setIsMobileMenuOpen(false)}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ x: 5, scale: 1.02 }}
                    >
                      {item.name}
                    </motion.a>
                  ))}
                  
                  <div className="pt-4 border-t border-purple-500/20 space-y-3">
                    <motion.button 
                      className="w-full flex items-center justify-center space-x-3 text-purple-300 hover:text-white font-semibold py-3 px-4 rounded-xl hover:bg-purple-900/30 transition-all duration-300"
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="relative">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.3 15.7 4.6 16.5 5.1 16.5H17M17 13V16.5M9 19.5C9.8 19.5 10.5 20.2 10.5 21S9.8 22.5 9 22.5 7.5 21.8 7.5 21 8.2 19.5 9 19.5ZM20 19.5C20.8 19.5 21.5 20.2 21.5 21S20.8 22.5 20 22.5 18.5 21.8 18.5 21 19.2 19.5 20 19.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        {cartItemCount > 0 && (
                          <span className="absolute -top-2 -right-2 w-4 h-4 bg-pink-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                            {cartItemCount > 9 ? '9+' : cartItemCount}
                          </span>
                        )}
                      </div>
                      <span>Cart ({cartItemCount})</span>
                    </motion.button>

                    <motion.button 
                      className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-xl font-semibold shadow-lg"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Sign In
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.header>
  );
}
