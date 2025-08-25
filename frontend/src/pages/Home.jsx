import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import WhatsAppBot from '../components/home/WhatsAppBot.jsx';
import TrendingOutfitsSection from '../components/home/TrendingOutfitsSection.jsx';
import LuxuryFeaturesSection from '../components/home/LuxuryFeaturesSection.jsx';
import LuxuryCarousel from '../components/home/LuxuryCarousel.jsx';
import TestimonialsSection from '../components/home/TestimonialsSection.jsx';
import FAQSection from '../components/home/FAQSection.jsx';
import BespokeRequestSection from '../components/home/BespokeRequestSection.jsx';
import PremiumNewsletterSection from '../components/home/PremiumNewsletterSection.jsx';
import {
  trendingOutfits,
  carouselItems,
  testimonials,
  faqs,
  luxuryFeatures,
  containerVariants,
  itemVariants
} from '../data/mockData.js';

export default function App() {
  const [email, setEmail] = useState('');
  const [customRequest, setCustomRequest] = useState('');
  const [uploadedImage, setUploadedImage] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeAccordion, setActiveAccordion] = useState(0);
  const [hoveredOutfit, setHoveredOutfit] = useState(null);
  const [showWhatsApp, setShowWhatsApp] = useState(false);
  const fileInputRef = useRef(null);
  const { scrollYProgress } = useScroll();
  
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, -100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0.8]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setUploadedImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 overflow-hidden">
      {/* WhatsApp Bot Widget */}
      <WhatsAppBot showWhatsApp={showWhatsApp} setShowWhatsApp={setShowWhatsApp} />

      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/20 to-indigo-900/20" />
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-purple-400/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 5
            }}
          />
        ))}
      </div>

      {/* Hero Section */}
      <motion.section 
        className="relative pt-24 lg:pt-32 pb-20 lg:pb-32 min-h-screen flex items-center"
        style={{ y: heroY, opacity: heroOpacity }}
      >
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            className="text-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Premium Tagline */}
            <motion.div
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-900/50 to-violet-900/50 backdrop-blur-lg rounded-full px-6 py-3 mb-8 border border-purple-500/20"
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
            >
              <motion.span 
                className="w-2 h-2 bg-gradient-to-r from-purple-400 to-violet-400 rounded-full"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="text-purple-300 font-medium text-sm uppercase tracking-wide">
                Modern Fashion Revolution
              </span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1 
              className="text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-black text-white leading-[0.9] mb-8"
              variants={itemVariants}
            >
              End the{' '}
              <motion.span 
                className="relative inline-block"
                whileHover={{ scale: 1.05 }}
              >
                <motion.span 
                  className="bg-gradient-to-r from-purple-400 via-violet-400 to-indigo-400 bg-clip-text text-transparent"
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  style={{
                    backgroundSize: "200% 200%"
                  }}
                >
                  "Link Please?"
                </motion.span>
                <motion.div
                  className="absolute -inset-4 bg-gradient-to-r from-purple-600/20 to-violet-600/20 rounded-lg blur-lg"
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.2, 0.4, 0.2]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </motion.span>
              <br />
              Era Forever
            </motion.h1>

            {/* Premium Subtitle */}
            <motion.p 
              className="text-2xl md:text-3xl lg:text-4xl text-purple-200 max-w-5xl mx-auto leading-relaxed mb-12 font-light"
              variants={itemVariants}
            >
              <motion.span
                animate={{
                  color: ["#c4b5fd", "#a855f7", "#c4b5fd"]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                Instant access to categorised outfits.
              </motion.span>
              <br />
              Sophisticated curation. Zero waiting. Maximum elegance.
            </motion.p>

            {/* Luxury CTA Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
              variants={itemVariants}
            >
              <motion.button 
                className="group relative w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 text-white rounded-2xl text-xl font-bold overflow-hidden"
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
                <span className="relative z-10 flex items-center justify-center space-x-3">
                  <span>Explore Outfits Collection</span>
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    ✨
                  </motion.span>
                </span>
              </motion.button>
              
              <motion.button 
                className="group w-full sm:w-auto px-10 py-5 border-2 border-purple-500 text-purple-300 rounded-2xl text-xl font-bold relative overflow-hidden"
                whileHover={{ 
                  scale: 1.05,
                  borderColor: "#8b5cf6"
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowWhatsApp(true)}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-purple-900/30 to-violet-900/30"
                  initial={{ scale: 0 }}
                  whileHover={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                />
                <span className="relative z-10 flex items-center justify-center space-x-2">
                  <span>Try WhatsApp Bot</span>
                  <span>💬</span>
                </span>
              </motion.button>
            </motion.div>

            {/* Luxury Stats */}
            <motion.div 
              className="grid grid-cols-3 gap-8 max-w-2xl mx-auto"
              variants={containerVariants}
            >
              {[
                { number: "100+", label: "Curated Masterpieces", suffix: "" },
                { number: "24", label: "Hour Premium Service", suffix: "hr" },
                { number: "∞", label: "Style Possibilities", suffix: "" }
              ].map((stat, index) => (
                <motion.div 
                  key={index}
                  className="text-center group"
                  variants={itemVariants}
                  whileHover={{ scale: 1.1 }}
                >
                  <motion.div 
                    className="text-4xl md:text-5xl font-black bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent mb-2"
                    animate={{
                      scale: [1, 1.05, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: index * 0.5
                    }}
                  >
                    {stat.number}{stat.suffix}
                  </motion.div>
                  <div className="text-purple-300 font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Trending Outfits Section */}
      <TrendingOutfitsSection 
        outfits={trendingOutfits}
        hoveredOutfit={hoveredOutfit}
        setHoveredOutfit={setHoveredOutfit}
      />

      {/* Luxury Features Section */}
      <LuxuryFeaturesSection features={luxuryFeatures} />

      {/* Luxury Carousel Section */}
      <LuxuryCarousel 
        items={carouselItems} 
        currentSlide={currentSlide}
        setCurrentSlide={setCurrentSlide}
      />

      {/* Bespoke Request Section */}
      <BespokeRequestSection 
        customRequest={customRequest}
        setCustomRequest={setCustomRequest}
        uploadedImage={uploadedImage}
        handleImageUpload={handleImageUpload}
        fileInputRef={fileInputRef}
      />

      {/* Testimonials Section */}
      <TestimonialsSection testimonials={testimonials} />

      {/* FAQ Section */}
      <FAQSection 
        faqs={faqs}
        activeAccordion={activeAccordion}
        setActiveAccordion={setActiveAccordion}
      />

      {/* Premium Newsletter */}
      <PremiumNewsletterSection email={email} setEmail={setEmail} />
    </div>
  );
}