import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { signOutStart, signoutSuccess, signOutFailure } from '../redux/user/userSlice';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(3);
  
  const { scrollY } = useScroll();
  const dispatch = useDispatch();
  
  // Get current user from Redux store
  const { currentUser } = useSelector((state) => state.user);
  
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

  const handleSignOut = async () => {
    try {
      dispatch(signOutStart());
      const res = await fetch('/backend/auth/signout', {
        method: 'POST',
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutFailure(data.message));
        return;
      }
      dispatch(signoutSuccess());
      setIsMobileMenuOpen(false);
    } catch (error) {
      dispatch(signOutFailure(error.message));
    }
  };

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'About Us', href: '/about-us' },
    { name: 'Outfits', href: '/outfit' },
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

  const dropdownVariants = {
    hidden: {
      opacity: 0,
      scale: 0.95,
      y: -10,
      transition: {
        duration: 0.2
      }
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: [0.04, 0.62, 0.23, 0.98]
      }
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
              <Link to="/" className="flex items-center space-x-4">
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
              </Link>
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
              <Link to={'/cart'}>
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
              </Link>

              {/* Conditional Rendering: Sign In Button OR Profile Dropdown (Desktop Only) */}
              {currentUser ? (
                // Simple Profile Button for Desktop
                <Link to="/profile">
                  <motion.button
                    className="cursor-pointer hidden lg:flex items-center space-x-3 p-2 rounded-full hover:bg-purple-900/20 transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    variants={itemVariants}
                  >
                    {/* Profile Avatar */}
                    <motion.div 
                      className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-purple-400"
                      animate={{
                        borderColor: [
                          "rgba(147, 51, 234, 0.6)",
                          "rgba(168, 85, 247, 0.8)",
                          "rgba(147, 51, 234, 0.6)"
                        ]
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      {currentUser.avatar ? (
                        <img 
                          src={currentUser.avatar} 
                          alt={currentUser.username}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-purple-600 to-violet-600 flex items-center justify-center">
                          <span className="text-white font-bold text-sm">
                            {currentUser.username?.charAt(0).toUpperCase() || currentUser.email?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </motion.div>
                    
                    {/* Username */}
                    <span className="text-purple-200 font-medium">
                      {currentUser.username || currentUser.email?.split('@')[0]}
                    </span>
                  </motion.button>
                </Link>
              ) : (
                // Sign In Button for Non-Authenticated Users (Desktop Only)
                <Link to={'/sign-in'}>
                  <motion.button 
                    className="cursor-pointer hidden lg:flex relative px-6 py-2.5 bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 text-white rounded-full font-semibold overflow-hidden group"
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
                </Link>
              )}

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
                  {/* Navigation Items */}
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
                    {/* Cart Button for Mobile */}
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

                    {/* Conditional Mobile Auth Section */}
                    {currentUser ? (
                      <>
                        {/* Profile Info Section for Mobile */}
                        <motion.div
                          className="flex items-center space-x-3 p-4 bg-purple-900/20 rounded-xl border border-purple-500/20"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-purple-400/50">
                            {currentUser.avatar ? (
                              <img 
                                src={currentUser.avatar} 
                                alt={currentUser.username}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-purple-600 to-violet-600 flex items-center justify-center">
                                <span className="text-white font-bold text-lg">
                                  {currentUser.username?.charAt(0).toUpperCase() || currentUser.email?.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="text-white font-semibold">
                              {currentUser.username || 'Fashion Enthusiast'}
                            </p>
                            <p className="text-purple-300 text-sm truncate">
                              {currentUser.email}
                            </p>
                          </div>
                        </motion.div>

                        {/* Profile Actions for Mobile */}
                        <Link to="/profile">
                          <motion.button 
                            className="w-full flex items-center justify-center space-x-3 text-purple-300 hover:text-white font-semibold py-3 px-4 rounded-xl hover:bg-purple-900/30 transition-all duration-300"
                            whileHover={{ scale: 1.02 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <span>My Profile</span>
                          </motion.button>
                        </Link>

                        {/* Settings Button for Mobile */}
                        <motion.button 
                          className="w-full flex items-center justify-center space-x-3 text-purple-300 hover:text-white font-semibold py-3 px-4 rounded-xl hover:bg-purple-900/30 transition-all duration-300"
                          whileHover={{ scale: 1.02 }}
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                            <path d="M19.4 15C19.2669 15.3016 19.2272 15.6362 19.286 15.9606C19.3448 16.285 19.4995 16.5843 19.73 16.82L19.79 16.88C19.976 17.0657 20.1235 17.2863 20.2241 17.5291C20.3248 17.7719 20.3766 18.0322 20.3766 18.295C20.3766 18.5578 20.3248 18.8181 20.2241 19.0609C20.1235 19.3037 19.976 19.5243 19.79 19.71C19.6043 19.896 19.3837 20.0435 19.1409 20.1441C18.8981 20.2448 18.6378 20.2966 18.375 20.2966C18.1122 20.2966 17.8519 20.2448 17.6091 20.1441C17.3663 20.0435 17.1457 19.896 16.96 19.71L16.9 19.65C16.6643 19.4195 16.365 19.2648 16.0406 19.206C15.7162 19.1472 15.3816 19.1869 15.08 19.32C14.7842 19.4468 14.532 19.6572 14.3543 19.9255C14.1766 20.1938 14.0813 20.5082 14.08 20.83V21C14.08 21.5304 13.8693 22.0391 13.4942 22.4142C13.1191 22.7893 12.6104 23 12.08 23C11.5496 23 11.0409 22.7893 10.6658 22.4142C10.2907 22.0391 10.08 21.5304 10.08 21V20.91C10.0723 20.579 9.96512 20.2573 9.77251 19.9887C9.5799 19.7201 9.31074 19.5176 9 19.41C8.69838 19.2769 8.36381 19.2372 8.03941 19.296C7.71502 19.3548 7.41568 19.5095 7.18 19.74L7.12 19.8C6.93425 19.986 6.71368 20.1335 6.47088 20.2341C6.22808 20.3348 5.96783 20.3866 5.705 20.3866C5.44217 20.3866 5.18192 20.3348 4.93912 20.2341C4.69632 20.1335 4.47575 19.986 4.29 19.8C4.10405 19.6143 3.95653 19.3937 3.85588 19.1509C3.75523 18.9081 3.70343 18.6478 3.70343 18.385C3.70343 18.1222 3.75523 17.8619 3.85588 17.6191C3.95653 17.3763 4.10405 17.1557 4.29 16.97L4.35 16.91C4.58054 16.6743 4.73519 16.375 4.794 16.0506C4.85282 15.7262 4.81312 15.3916 4.68 15.09C4.55324 14.7942 4.34276 14.542 4.07447 14.3643C3.80618 14.1866 3.49179 14.0913 3.17 14.09H3C2.46957 14.09 1.96086 13.8793 1.58579 13.5042C1.21071 13.1291 1 12.6204 1 12.09C1 11.5596 1.21071 11.0509 1.58579 10.6758C1.96086 10.3007 2.46957 10.09 3 10.09H3.09C3.42099 10.0823 3.74269 9.97512 4.01133 9.78251C4.27998 9.5899 4.48244 9.32074 4.59 9.01C4.72312 8.70838 4.76282 8.37381 4.704 8.04941C4.64519 7.72502 4.49054 7.42568 4.26 7.19L4.2 7.13C4.01405 6.94425 3.86653 6.72368 3.76588 6.48088C3.66523 6.23808 3.61343 5.97783 3.61343 5.715C3.61343 5.45217 3.66523 5.19192 3.76588 4.94912C3.86653 4.70632 4.01405 4.48575 4.2 4.3C4.38575 4.11405 4.60632 3.96653 4.84912 3.86588C5.09192 3.76523 5.35217 3.71343 5.615 3.71343C5.87783 3.71343 6.13808 3.76523 6.38088 3.86588C6.62368 3.96653 6.84425 4.11405 7.03 4.3L7.09 4.36C7.32568 4.59054 7.62502 4.74519 7.94941 4.804C8.27381 4.86282 8.60838 4.82312 8.91 4.69H9C9.29577 4.56324 9.54802 4.35276 9.72569 4.08447C9.90337 3.81618 9.99872 3.50179 10 3.18V3C10 2.46957 10.2107 1.96086 10.5858 1.58579C10.9609 1.21071 11.4696 1 12 1C12.5304 1 13.0391 1.21071 13.4142 1.58579C13.7893 1.96086 14 2.46957 14 3V3.09C14.0013 3.41179 14.0966 3.72618 14.2743 3.99447C14.452 4.26276 14.7042 4.47324 15 4.6C15.3016 4.73312 15.6362 4.77282 15.9606 4.714C16.285 4.65519 16.5843 4.50054 16.82 4.27L16.88 4.21C17.0657 4.02405 17.2863 3.87653 17.5291 3.77588C17.7719 3.67523 18.0322 3.62343 18.295 3.62343C18.5578 3.62343 18.8181 3.67523 19.0609 3.77588C19.3037 3.87653 19.5243 4.02405 19.71 4.21C19.896 4.39575 20.0435 4.61632 20.1441 4.85912C20.2448 5.10192 20.2966 5.36217 20.2966 5.625C20.2966 5.88783 20.2448 6.14808 20.1441 6.39088C20.0435 6.63368 19.896 6.85425 19.71 7.04L19.65 7.1C19.4195 7.33568 19.2648 7.63502 19.206 7.95941C19.1472 8.28381 19.1869 8.61838 19.32 8.92V9C19.4468 9.29577 19.6572 9.54802 19.9255 9.72569C20.1938 9.90337 20.5082 9.99872 20.83 10H21C21.5304 10 22.0391 10.2107 22.4142 10.5858C22.7893 10.9609 23 11.4696 23 12C23 12.5304 22.7893 13.0391 22.4142 13.4142C22.0391 13.7893 21.5304 14 21 14H20.91C20.5882 14.0013 20.2738 14.0966 20.0055 14.2743C19.7372 14.452 19.5268 14.7042 19.4 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          <span>Settings</span>
                        </motion.button>

                        {/* Logout Button for Mobile */}
                        <motion.button 
                          onClick={handleSignOut}
                          className="w-full px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-semibold shadow-lg flex items-center justify-center space-x-2"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <polyline points="16,17 21,12 16,7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          <span>Log Out</span>
                        </motion.button>
                      </>
                    ) : (
                      // Sign In Button for Mobile (Non-Authenticated Users)
                      <Link to="/sign-in">
                        <motion.button 
                          className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-xl font-semibold shadow-lg"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Sign In
                        </motion.button>
                      </Link>
                    )}
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
