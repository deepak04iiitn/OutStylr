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

  // Fashion-themed floating elements
  const fashionIcons = [
    { icon: '👗', size: 'text-2xl', opacity: 0.15 },
    { icon: '👔', size: 'text-xl', opacity: 0.12 },
    { icon: '👠', size: 'text-lg', opacity: 0.18 },
    { icon: '👜', size: 'text-xl', opacity: 0.14 },
    { icon: '🧥', size: 'text-2xl', opacity: 0.16 },
    { icon: '👖', size: 'text-lg', opacity: 0.13 },
    { icon: '👡', size: 'text-lg', opacity: 0.15 },
    { icon: '🎩', size: 'text-xl', opacity: 0.12 },
    { icon: '🧢', size: 'text-lg', opacity: 0.14 },
    { icon: '👟', size: 'text-xl', opacity: 0.16 },
    { icon: '👚', size: 'text-lg', opacity: 0.13 },
    { icon: '🧣', size: 'text-xl', opacity: 0.15 },
    { icon: '🕶️', size: 'text-lg', opacity: 0.12 },
    { icon: '💍', size: 'text-sm', opacity: 0.18 },
    { icon: '⌚', size: 'text-lg', opacity: 0.14 },
  ];

  return (
    <div className="min-h-screen bg-slate-900 overflow-hidden">
      {/* WhatsApp Bot Widget */}
      <WhatsAppBot showWhatsApp={showWhatsApp} setShowWhatsApp={setShowWhatsApp} />

      {/* Fashion-themed Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Base gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/20 to-indigo-900/20" />
        
        {/* Subtle pattern overlay */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239333ea' fill-opacity='0.4'%3E%3Cpath d='M30 30c0-11.046 8.954-20 20-20s20 8.954 20 20-8.954 20-20 20-20-8.954-20-20zm0-20c0-11.046 8.954-20 20-20s20 8.954 20 20-8.954 20-20 20-20-8.954-20-20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }}
        />

        {/* Floating Fashion Items */}
        {[...Array(25)].map((_, i) => {
          const randomIcon = fashionIcons[Math.floor(Math.random() * fashionIcons.length)];
          return (
            <motion.div
              key={i}
              className={`absolute ${randomIcon.size} select-none`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                color: '#a855f7',
                opacity: randomIcon.opacity,
              }}
              animate={{
                y: [0, -30, 0],
                x: [0, Math.random() > 0.5 ? 15 : -15, 0],
                rotate: [0, Math.random() > 0.5 ? 10 : -10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 8 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 5,
                ease: "easeInOut"
              }}
            >
              {randomIcon.icon}
            </motion.div>
          );
        })}

        {/* Floating Clothing Silhouettes */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`silhouette-${i}`}
            className="absolute w-20 h-20 opacity-5"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -50, 0],
              x: [0, Math.random() > 0.5 ? 25 : -25, 0],
              rotate: [0, 15, -15, 0],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 12 + Math.random() * 6,
              repeat: Infinity,
              delay: Math.random() * 8,
              ease: "easeInOut"
            }}
          >
            <svg viewBox="0 0 100 100" className="w-full h-full text-purple-400">
              {/* T-shirt silhouette */}
              {i % 4 === 0 && (
                <path
                  d="M20,30 L20,25 Q20,20 25,20 L35,20 Q40,15 60,15 Q65,20 75,20 Q80,20 80,25 L80,30 L85,35 L85,45 L80,40 L80,85 Q80,90 75,90 L25,90 Q20,90 20,85 L20,40 L15,45 L15,35 Z"
                  fill="currentColor"
                />
              )}
              {/* Dress silhouette */}
              {i % 4 === 1 && (
                <path
                  d="M30,20 Q30,15 35,15 L65,15 Q70,15 70,20 L70,30 L75,35 Q75,40 70,45 L70,80 Q70,90 60,90 L40,90 Q30,90 30,80 L30,45 Q25,40 25,35 Z"
                  fill="currentColor"
                />
              )}
              {/* Pants silhouette */}
              {i % 4 === 2 && (
                <path
                  d="M35,20 L65,20 L65,50 L60,50 L60,85 L55,85 L55,50 L45,50 L45,85 L40,85 L40,50 L35,50 Z"
                  fill="currentColor"
                />
              )}
              {/* Jacket silhouette */}
              {i % 4 === 3 && (
                <path
                  d="M25,25 L25,20 Q25,15 30,15 L40,15 Q45,10 55,10 Q60,15 70,15 Q75,15 75,20 L75,25 L80,30 L80,40 L75,35 L75,80 Q75,85 70,85 L30,85 Q25,85 25,80 L25,35 L20,40 L20,30 Z"
                  fill="currentColor"
                />
              )}
            </svg>
          </motion.div>
        ))}

        {/* Gradient Orbs for Fashion Ambiance */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={`orb-${i}`}
            className="absolute rounded-full blur-3xl"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${100 + Math.random() * 200}px`,
              height: `${100 + Math.random() * 200}px`,
              background: `linear-gradient(45deg, ${
                ['#9333ea20', '#a855f720', '#8b5cf620', '#7c3aed20', '#6d28d920'][
                  Math.floor(Math.random() * 5)
                ]
              }, transparent)`,
            }}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.1, 0.2, 0.1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 20 + Math.random() * 10,
              repeat: Infinity,
              delay: Math.random() * 10,
              ease: "easeInOut"
            }}
          />
        ))}

        {/* Subtle Fashion Pattern Lines */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={`line-${i}`}
            className="absolute bg-gradient-to-r from-transparent via-purple-400/10 to-transparent"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${50 + Math.random() * 100}px`,
              height: '1px',
              transform: `rotate(${Math.random() * 360}deg)`,
            }}
            animate={{
              opacity: [0, 0.3, 0],
              scaleX: [0.5, 1.5, 0.5],
            }}
            transition={{
              duration: 6 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 8,
              ease: "easeInOut"
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
              className="mt-14 inline-flex items-center space-x-2 bg-gradient-to-r from-purple-900/50 to-violet-900/50 backdrop-blur-lg rounded-full px-6 py-3 mb-8 border border-purple-500/20"
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
                className="cursor-pointer group relative w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 text-white rounded-2xl text-xl font-bold overflow-hidden"
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
                className="cursor-pointer group w-full sm:w-auto px-10 py-5 border-2 border-purple-500 text-purple-300 rounded-2xl text-xl font-bold relative overflow-hidden"
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
