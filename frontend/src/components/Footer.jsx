import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Footer() {
  const footerLinks = {
    'Premium Collections': [
      { name: 'Trending Styles', href: '#trending' },
      { name: 'Men\'s Luxury', href: '#men' },
      { name: 'Women\'s Elite', href: '#women' },
      { name: 'Kids Designer', href: '#kids' },
    ],
    'Elite Services': [
      { name: 'Bespoke Styling', href: '#custom' },
      { name: 'Personal Stylist', href: '#stylist' },
      { name: 'VIP Concierge', href: '#whatsapp' },
      { name: 'Premium Newsletter', href: '#newsletter' },
    ],
    'Luxury Occasions': [
      { name: 'Wedding Couture', href: '#wedding' },
      { name: 'Executive Wear', href: '#office' },
      { name: 'Evening Gala', href: '#party' },
      { name: 'Resort Collections', href: '#casual' },
    ],
  };

  const socialIcons = [
    { name: 'instagram', icon: '📷', color: 'from-purple-500 to-violet-500' },
    { name: 'twitter', icon: '🐦', color: 'from-indigo-500 to-purple-500' },
    { name: 'pinterest', icon: '📌', color: 'from-violet-500 to-purple-500' },
    { name: 'youtube', icon: '📺', color: 'from-purple-600 to-indigo-600' },
    { name: 'whatsapp', icon: '💬', color: 'from-green-500 to-emerald-500' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.04, 0.62, 0.23, 0.98] }
    }
  };

  return (
    <footer className="bg-slate-900 text-white relative overflow-hidden border-t border-purple-500/20">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-10">
        {[...Array(40)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-purple-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main Footer Content */}
        <motion.div 
          className="py-16 lg:py-24"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
            {/* Luxury Brand Section */}
            <motion.div 
              className="lg:col-span-2"
              variants={itemVariants}
            >
              <Link to="/" className="flex items-center space-x-4">
                <img 
                  src='/outstylr.png'
                  alt="logo" className="w-50 h-24" 
                />
              </Link>
              
              <motion.p 
                className="text-purple-200 text-lg mb-8 max-w-md leading-relaxed"
                variants={itemVariants}
              >
                Pioneering modern fashion technology. Sophisticated aesthetics meet instant accessibility. 
                Where elegant styling becomes effortless.
              </motion.p>
              
              <div className="flex space-x-4">
                {socialIcons.map((social, index) => (
                  <motion.a
                    key={social.name}
                    href={`#${social.name}`}
                    className="relative w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden group bg-slate-800 border border-purple-500/20"
                    variants={itemVariants}
                    whileHover={{ 
                      scale: 1.1,
                      y: -5,
                      borderColor: "rgba(147, 51, 234, 0.5)"
                    }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-600/0 to-violet-600/0 group-hover:from-purple-600/20 group-hover:to-violet-600/20 transition-all duration-300" />
                    <motion.span 
                      className="relative text-xl z-10 text-purple-300 group-hover:text-white transition-colors duration-300"
                      animate={{
                        rotate: [0, 5, -5, 0]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: index * 0.2
                      }}
                    >
                      {social.icon}
                    </motion.span>
                  </motion.a>
                ))}
              </div>

              {/* WhatsApp CTA */}
              <motion.div 
                className="mt-8 p-4 bg-gradient-to-r from-green-900/20 to-emerald-900/20 rounded-2xl border border-green-500/20"
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
              >
                <h4 className="text-green-400 font-bold mb-2 flex items-center space-x-2">
                  <span>💬</span>
                  <span>Try Our WhatsApp Bot</span>
                </h4>
                <p className="text-purple-200 text-sm mb-3">
                  Get instant outfit recommendations 24/7
                </p>
                <motion.button
                  className="cursor-pointer px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-500 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Start Chat Now
                </motion.button>
              </motion.div>
            </motion.div>

            {/* Link Sections */}
            {Object.entries(footerLinks).map(([title, links], sectionIndex) => (
              <motion.div 
                key={title}
                variants={itemVariants}
              >
                <motion.h3 
                  className="text-xl font-bold mb-6 text-white relative"
                  whileHover={{ scale: 1.05, x: 5 }}
                >
                  {title}
                  <motion.div
                    className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-violet-400"
                    whileHover={{ width: "100%" }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.h3>
                <ul className="space-y-4">
                  {links.map((link, linkIndex) => (
                    <motion.li 
                      key={link.name}
                      variants={itemVariants}
                    >
                      <motion.a
                        href={link.href}
                        className="text-purple-300 hover:text-white transition-all duration-300 group flex items-center"
                        whileHover={{ x: 10, color: "#a855f7" }}
                      >
                        <motion.span
                          className="w-0 h-0.5 bg-gradient-to-r from-purple-400 to-violet-400 mr-0 group-hover:w-4 group-hover:mr-3 transition-all duration-300"
                        />
                        {link.name}
                      </motion.a>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Premium Newsletter */}
        <motion.div 
          className="border-t border-purple-500/20 py-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <motion.div
              whileHover={{ scale: 1.02 }}
            >
              <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">
                Join the Elite Circle
              </h3>
              <p className="text-purple-200 text-lg">Exclusive modern trends and premium styling access</p>
            </motion.div>
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto"
              whileHover={{ scale: 1.02 }}
            >
              <motion.input
                type="email"
                placeholder="Your exclusive email"
                className="px-6 py-4 bg-slate-800/70 backdrop-blur-sm border border-purple-500/30 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 text-white placeholder-purple-300 lg:w-80"
                whileFocus={{
                  scale: 1.02,
                  boxShadow: "0 20px 40px -15px rgba(147, 51, 234, 0.4)"
                }}
              />
              <motion.button 
                className="cursor-pointer px-8 py-4 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-xl font-bold hover:shadow-lg transition-all duration-300 relative overflow-hidden group"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 25px 50px -12px rgba(147, 51, 234, 0.5)"
                }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-violet-600 to-purple-600"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "0%" }}
                  transition={{ duration: 0.3 }}
                />
                <span className="relative z-10">Join Community</span>
              </motion.button>
            </motion.div>
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div 
          className="border-t border-purple-500/20 py-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <motion.div 
              className="text-purple-300 text-sm"
              whileHover={{ scale: 1.02 }}
            >
              © 2025 OutfitFirst. All rights reserved. 
              <span className="ml-2 bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent font-medium">
                Fashion redefined.
              </span>
            </motion.div>
            <div className="flex space-x-8 text-sm">
              {['Privacy Policy', 'Terms of Service', 'Outfit Store', 'WhatsApp Bot'].map((link, index) => (
                <motion.a 
                  key={link}
                  href="#" 
                  className="text-purple-300 hover:text-purple-100 transition-colors duration-300"
                  whileHover={{ scale: 1.05, y: -2 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {link}
                </motion.a>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
