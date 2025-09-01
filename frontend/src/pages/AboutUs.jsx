import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function AboutUs() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-16">
      <motion.div 
        ref={ref}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        {/* Hero Section */}
        <motion.section 
          className="text-center py-20"
          variants={itemVariants}
        >
          <motion.div
            className="relative inline-block mb-8"
            animate={{ 
              rotate: [0, 2, -2, 0],
              scale: [1, 1.02, 1]
            }}
            transition={{ 
              duration: 6, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div className="text-8xl sm:text-9xl mb-4">
              <img 
                src='/outstylr.png'
                alt="logo" className="w-90 h-34" 
              />
            </div>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-violet-500/20 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.div>

          <motion.p 
            className="text-xl sm:text-2xl text-purple-300 max-w-4xl mx-auto leading-relaxed"
            animate={{ opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            The world's first outfit-first fashion platform. We provide direct purchase links for complete looks, not just individual items, 
            eliminating decision fatigue and delivering perfectly styled outfits for every occasion.
          </motion.p>
        </motion.section>

        {/* Who We Are Section */}
        <motion.section 
          className="py-20"
          variants={fadeInUp}
        >
          <motion.div 
            className="bg-slate-800/60 backdrop-blur-xl rounded-[2rem] border border-purple-500/30 p-12 lg:p-16 relative overflow-hidden"
            style={{
              boxShadow: "0 25px 50px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(147, 51, 234, 0.2)"
            }}
            whileHover={{
              boxShadow: "0 35px 70px rgba(0, 0, 0, 0.6), 0 0 0 2px rgba(147, 51, 234, 0.3)"
            }}
          >
            <motion.div
              className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-purple-500/20 to-transparent rounded-full blur-3xl"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />

            <div className="relative z-10">
              <motion.h2 
                className="text-4xl lg:text-5xl font-black text-white mb-8 text-center"
                animate={{
                  textShadow: [
                    "0 0 20px rgba(147, 51, 234, 0.3)",
                    "0 0 30px rgba(168, 85, 247, 0.4)",
                    "0 0 20px rgba(147, 51, 234, 0.3)"
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                Who We Are
              </motion.h2>
              
              <motion.div 
                className="max-w-4xl mx-auto"
                animate={{ opacity: [0.9, 1, 0.9] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <p className="text-xl lg:text-2xl text-purple-300 leading-relaxed text-center mb-8">
                  OutStylr is revolutionizing fashion retail by offering complete, ready-to-wear outfits 
                  as the primary product. We're not just another clothing platform – we're your complete 
                  styling solution for every occasion.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                  <motion.div 
                    className="bg-slate-700/40 rounded-2xl p-8 border border-purple-500/20"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="text-4xl mb-4">🎯</div>
                    <h3 className="text-xl font-bold text-white mb-4">Our Mission</h3>
                    <p className="text-purple-300 leading-relaxed">
                      To revolutionize fashion retail by offering complete, styled outfits as the primary product, 
                      eliminating decision fatigue and making perfectly coordinated looks accessible to everyone.
                    </p>
                  </motion.div>
                  
                  <motion.div 
                    className="bg-slate-700/40 rounded-2xl p-8 border border-purple-500/20"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="text-4xl mb-4">✨</div>
                    <h3 className="text-xl font-bold text-white mb-4">Our Vision</h3>
                    <p className="text-purple-300 leading-relaxed">
                      To become the world's leading outfit-first platform, where customers can effortlessly 
                      find complete, styled looks for any occasion without the hassle of mixing and matching.
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.section>

        {/* Problem We're Solving Section */}
        <motion.section 
          className="py-20"
          variants={fadeInUp}
        >
          <motion.div 
            className="bg-slate-800/60 backdrop-blur-xl rounded-[2rem] border border-purple-500/30 p-12 lg:p-16 relative overflow-hidden"
            style={{
              boxShadow: "0 25px 50px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(147, 51, 234, 0.2)"
            }}
          >
            <motion.h2 
              className="text-4xl lg:text-5xl font-black text-white mb-12 text-center"
              animate={{
                textShadow: [
                  "0 0 20px rgba(147, 51, 234, 0.3)",
                  "0 0 30px rgba(168, 85, 247, 0.4)",
                  "0 0 20px rgba(147, 51, 234, 0.3)"
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              The Problem We're Solving
            </motion.h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div 
                className="space-y-8"
                animate={{ opacity: [0.9, 1, 0.9] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <div>
                  <div className="flex items-center mb-4">
                    <span className="text-3xl mr-4">😵‍💫</span>
                    <h3 className="text-2xl font-bold text-white">Decision Fatigue</h3>
                  </div>
                  <p className="text-purple-300 leading-relaxed">
                    The overwhelming number of choices across categories confuses customers, 
                    making shopping time-consuming and frustrating. Browsing multiple sections 
                    to create one cohesive outfit is exhausting.
                  </p>
                </div>
                
                <div>
                  <div className="flex items-center mb-4">
                    <span className="text-3xl mr-4">🎨</span>
                    <h3 className="text-2xl font-bold text-white">Poor Styling Results</h3>
                  </div>
                  <p className="text-purple-300 leading-relaxed">
                    Not everyone has fashion expertise to combine clothing items effectively. 
                    This leads to mismatched or suboptimal outfits that don't work well together.
                  </p>
                </div>
                
                <div>
                  <div className="flex items-center mb-4">
                    <span className="text-3xl mr-4">🛒</span>
                    <h3 className="text-2xl font-bold text-white">Purchase Drop-Offs</h3>
                  </div>
                  <p className="text-purple-300 leading-relaxed">
                    The hassle of finding matching pieces leads customers to abandon their carts 
                    online or leave stores empty-handed. Shopping becomes a frustrating experience.
                  </p>
                </div>
              </motion.div>
              
              <motion.div 
                className="relative"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="bg-gradient-to-br from-red-600/20 to-orange-600/20 rounded-3xl p-12 border border-red-500/30 relative overflow-hidden">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-orange-500/10"
                    animate={{
                      backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                    }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  />
                  
                  <div className="relative z-10 text-center">
                    <motion.div 
                      className="text-8xl mb-6"
                      animate={{ 
                        rotate: [0, -10, 10, 0],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      😰
                    </motion.div>
                    <h3 className="text-2xl font-bold text-white mb-4">The Reality</h3>
                    <p className="text-red-300 leading-relaxed">
                      Traditional fashion retail forces customers to piece together outfits themselves. 
                      This is especially challenging for busy professionals, parents, and individuals 
                      with limited fashion knowledge who need streamlined, reliable shopping experiences.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.section>

        {/* Our Solution Section */}
        <motion.section 
          className="py-20"
          variants={fadeInUp}
        >
          <motion.div 
            className="bg-slate-800/60 backdrop-blur-xl rounded-[2rem] border border-purple-500/30 p-12 lg:p-16 relative overflow-hidden"
            style={{
              boxShadow: "0 25px 50px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(147, 51, 234, 0.2)"
            }}
          >
            <motion.h2 
              className="text-4xl lg:text-5xl font-black text-white mb-12 text-center"
              animate={{
                textShadow: [
                  "0 0 20px rgba(147, 51, 234, 0.3)",
                  "0 0 30px rgba(168, 85, 247, 0.4)",
                  "0 0 20px rgba(147, 51, 234, 0.3)"
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              Our Solution
            </motion.h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div 
                className="relative"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 rounded-3xl p-12 border border-green-500/30 relative overflow-hidden">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10"
                    animate={{
                      backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                    }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  />
                  
                  {/* Floating outfit icons */}
                  {['👗', '👔', '👠', '👜', '🧥', '👖'].map((emoji, index) => (
                    <motion.div
                      key={emoji}
                      className="absolute text-2xl opacity-30"
                      style={{
                        left: `${15 + (index % 3) * 25}%`,
                        top: `${20 + Math.floor(index / 3) * 30}%`,
                      }}
                      animate={{
                        rotate: [0, 360],
                        scale: [1, 1.2, 1]
                      }}
                      transition={{
                        duration: 8 + (index * 0.5),
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    >
                      {emoji}
                    </motion.div>
                  ))}
                  
                  <div className="relative z-10 text-center">
                    <motion.div 
                      className="text-8xl mb-6"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      💡
                    </motion.div>
                    <h3 className="text-2xl font-bold text-white mb-4">Complete Outfits</h3>
                    <p className="text-green-300 leading-relaxed">
                      We provide purchase links for fully styled, ready-to-wear outfits as complete packages. 
                      No more guessing, no more mixing and matching – just perfect looks for every occasion.
                    </p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                className="space-y-8"
                animate={{ opacity: [0.9, 1, 0.9] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <div>
                  <div className="flex items-center mb-4">
                    <span className="text-3xl mr-4">👗</span>
                    <h3 className="text-2xl font-bold text-white">Outfits as Main Product</h3>
                  </div>
                  <p className="text-purple-300 leading-relaxed">
                    Each listing is a fully styled look like "Beach Trip Outfit" or "Formal Business Meeting Look," 
                    eliminating the need to mix and match individual pieces.
                  </p>
                </div>
                
                {/* <div>
                  <div className="flex items-center mb-4">
                    <span className="text-3xl mr-4">💰</span>
                    <h3 className="text-2xl font-bold text-white">Bundled Pricing</h3>
                  </div>
                  <p className="text-purple-300 leading-relaxed">
                    Complete outfits are offered at discounted prices compared to purchasing items individually, 
                    providing better value while encouraging complete look purchases.
                  </p>
                </div> */}
                
                <div>
                  <div className="flex items-center mb-4">
                    <span className="text-3xl mr-4">🎯</span>
                    <h3 className="text-2xl font-bold text-white">Occasion-Based Categories</h3>
                  </div>
                  <p className="text-purple-300 leading-relaxed">
                    Outfits organized by specific events and occasions – from wedding outfits and date nights 
                    to formal office wear and vacation looks. Find exactly what you need for any situation.
                  </p>
                </div>
                
                <div>
                  <div className="flex items-center mb-4">
                    <span className="text-3xl mr-4">📸</span>
                    <h3 className="text-2xl font-bold text-white">Custom Curation</h3>
                  </div>
                  <p className="text-purple-300 leading-relaxed">
                    Can't find what you're looking for? Upload an image and describe the look – 
                    our expert stylists will curate the complete outfit and deliver it to your inbox within 24 hours.
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.section>

        {/* CTA Section */}
        <motion.section 
          className="py-20 text-center"
          variants={fadeInUp}
        >
          <motion.div 
            className="bg-gradient-to-r from-purple-600/20 via-violet-600/20 to-indigo-600/20 rounded-[2rem] border border-purple-500/30 p-12 lg:p-16 relative overflow-hidden"
            style={{
              boxShadow: "0 25px 50px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(147, 51, 234, 0.2)"
            }}
            whileHover={{
              boxShadow: "0 35px 70px rgba(0, 0, 0, 0.6), 0 0 0 2px rgba(147, 51, 234, 0.3)"
            }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-violet-500/10"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "linear"
              }}
            />
            
            <div className="relative z-10">
              <motion.h2 
                className="text-4xl lg:text-5xl font-black text-white mb-8"
                animate={{
                  textShadow: [
                    "0 0 20px rgba(147, 51, 234, 0.3)",
                    "0 0 40px rgba(168, 85, 247, 0.5)",
                    "0 0 20px rgba(147, 51, 234, 0.3)"
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                Ready for Effortless Style?
              </motion.h2>
              
              <motion.p 
                className="text-xl text-purple-300 mb-12 max-w-3xl mx-auto leading-relaxed"
                animate={{ opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                Say goodbye to decision fatigue and hello to perfectly curated outfits for every occasion. 
                Your complete look is just one click away.
              </motion.p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <Link to="/outfits">
                  <motion.button
                    className="cursor-pointer px-12 py-4 bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 text-white rounded-2xl font-bold text-lg relative overflow-hidden group"
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: "0 25px 50px -12px rgba(147, 51, 234, 0.6)"
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                      animate={{
                        x: ["-200%", "200%"]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear",
                        repeatDelay: 3
                      }}
                    />
                    <span className="relative z-10">Shop Complete Outfits</span>
                  </motion.button>
                </Link>
                
                <Link to="/custom-styling">
                  <motion.button
                    className="cursor-pointer px-12 py-4 bg-slate-800/60 border-2 border-purple-500/30 text-white rounded-2xl font-semibold text-lg hover:bg-slate-700/60 transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Get Custom Styling
                  </motion.button>
                </Link>
              </div>
              
              <motion.div 
                className="mt-12 flex justify-center space-x-8"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                {['👗', '💼', '🎉', '💒', '🏖️'].map((emoji, index) => (
                  <motion.div
                    key={emoji}
                    className="text-3xl"
                    animate={{
                      rotate: [0, 360],
                      scale: [1, 1.2, 1]
                    }}
                    transition={{
                      duration: 4 + (index * 0.3),
                      repeat: Infinity,
                      delay: index * 0.2
                    }}
                  >
                    {emoji}
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </motion.section>
      </motion.div>
    </div>
  );
}