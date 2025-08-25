import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

export default function PremiumNewsletterSection({ email, setEmail }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.section 
      ref={ref}
      className="py-20 lg:py-32 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
    >
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-purple-900 via-violet-900 to-indigo-900"
        animate={{
          background: [
            "linear-gradient(135deg, #581c87 0%, #7c3aed 50%, #4338ca 100%)",
            "linear-gradient(135deg, #7c3aed 0%, #4338ca 50%, #581c87 100%)",
            "linear-gradient(135deg, #4338ca 0%, #581c87 50%, #7c3aed 100%)",
            "linear-gradient(135deg, #581c87 0%, #7c3aed 50%, #4338ca 100%)"
          ]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <motion.h2 
          className="text-4xl md:text-6xl font-black text-white mb-6"
          initial={{ y: 50, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{
            textShadow: "0 4px 20px rgba(0,0,0,0.5)"
          }}
        >
          Join the Elite Circle
        </motion.h2>
        
        <motion.p 
          className="text-xl md:text-2xl text-purple-100 mb-12"
          initial={{ y: 30, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : { y: 30, opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Exclusive access to luxury trends and premium styling
        </motion.p>

        <motion.div 
          className="flex flex-col sm:flex-row gap-6 max-w-2xl mx-auto"
          initial={{ y: 30, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : { y: 30, opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <motion.input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your exclusive email address"
            className="flex-1 px-8 py-4 rounded-2xl border-0 focus:ring-2 focus:ring-white/50 text-gray-900 text-lg placeholder-gray-500 shadow-lg bg-white/95"
            whileFocus={{ 
              scale: 1.02,
              boxShadow: "0 20px 40px -15px rgba(255,255,255,0.3)"
            }}
          />
          <motion.button 
            className="px-10 py-4 bg-white text-purple-800 rounded-2xl font-bold text-lg shadow-lg relative overflow-hidden group"
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 25px 50px -12px rgba(255,255,255,0.4)"
            }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-purple-100 to-violet-100"
              initial={{ scale: 0 }}
              whileHover={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            />
            <span className="relative z-10">Join Elite</span>
          </motion.button>
        </motion.div>

        <motion.div 
          className="mt-12 flex justify-center space-x-8 text-purple-100"
          initial={{ y: 20, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          {[
            { icon: "📧", text: "Exclusive Newsletter" },
            { icon: "💬", text: "WhatsApp VIP" },
            { icon: "🎯", text: "Personalized Curation" }
          ].map((item, index) => (
            <motion.div
              key={index}
              className="flex items-center space-x-2"
              animate={{
                y: [0, -5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: index * 0.3
              }}
            >
              <span className="text-2xl">{item.icon}</span>
              <span className="font-medium">{item.text}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}