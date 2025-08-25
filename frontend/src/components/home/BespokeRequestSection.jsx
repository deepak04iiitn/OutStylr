import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

export default function BespokeRequestSection({ customRequest, setCustomRequest, uploadedImage, handleImageUpload, fileInputRef }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.section 
      ref={ref}
      className="py-20 lg:py-32 bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ y: 50, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h2 className="text-4xl md:text-6xl font-black text-white mb-6">
            Can't Find Your{' '}
            <span className="bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">
              Perfect Look?
            </span>
          </h2>
          <p className="text-2xl text-purple-200">
            Our premium stylists will craft it exclusively for you
          </p>
        </motion.div>

        <motion.div 
          className="bg-gradient-to-br from-slate-800/50 to-purple-900/20 backdrop-blur-lg rounded-3xl p-8 lg:p-16 shadow-2xl border border-purple-500/20"
          initial={{ y: 60, opacity: 0, scale: 0.9 }}
          animate={isInView ? { y: 0, opacity: 1, scale: 1 } : { y: 60, opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="grid md:grid-cols-2 gap-12">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={isInView ? { x: 0, opacity: 1 } : { x: -50, opacity: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <h3 className="text-2xl font-bold text-white mb-6">Upload Inspiration</h3>
              <motion.div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-purple-500/50 rounded-3xl p-12 text-center cursor-pointer group relative overflow-hidden bg-slate-800/30"
                whileHover={{ 
                  borderColor: "rgba(147, 51, 234, 0.8)",
                  scale: 1.02
                }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-violet-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />
                
                {uploadedImage ? (
                  <motion.img 
                    src={uploadedImage} 
                    alt="Uploaded" 
                    className="max-h-40 mx-auto rounded-2xl shadow-lg relative z-10"
                    initial={{ scale: 0, rotate: 180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ duration: 0.6, ease: "backOut" }}
                  />
                ) : (
                  <motion.div className="relative z-10">
                    <motion.div 
                      className="text-6xl mb-6"
                      animate={{
                        rotateY: [0, 180, 360],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      📸
                    </motion.div>
                    <p className="text-purple-200 text-lg">Click to upload your inspiration</p>
                  </motion.div>
                )}
              </motion.div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </motion.div>

            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={isInView ? { x: 0, opacity: 1 } : { x: 50, opacity: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <h3 className="text-2xl font-bold text-white mb-6">Describe Your Vision</h3>
              <motion.textarea
                value={customRequest}
                onChange={(e) => setCustomRequest(e.target.value)}
                placeholder="E.g., 'Sophisticated evening look with modern touches' or 'Luxury streetwear with elegant elements'"
                className="w-full h-40 p-6 bg-slate-800/50 border-2 border-purple-500/30 rounded-3xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 resize-none text-lg text-white placeholder-purple-300 transition-all duration-300"
                whileFocus={{ 
                  scale: 1.02,
                  boxShadow: "0 20px 40px -15px rgba(147, 51, 234, 0.3)"
                }}
              />
            </motion.div>
          </div>

          <motion.div 
            className="mt-12 text-center"
            initial={{ y: 30, opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : { y: 30, opacity: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
          >
            <motion.button 
              className="px-12 py-5 bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 text-white rounded-2xl text-xl font-bold shadow-lg relative overflow-hidden group"
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 25px 50px -12px rgba(147, 51, 234, 0.6)"
              }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600"
                initial={{ x: "-100%" }}
                whileHover={{ x: "0%" }}
                transition={{ duration: 0.3 }}
              />
              <span className="relative z-10 flex items-center space-x-3">
                <span>Create My Bespoke Look</span>
                <motion.span
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  ✨
                </motion.span>
              </span>
            </motion.button>
            <motion.p 
              className="mt-6 text-purple-200 text-lg"
              animate={{
                color: ["#c4b5fd", "#a855f7", "#c4b5fd"]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              Modern styling delivered within 24 hours
            </motion.p>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}