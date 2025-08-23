import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';

export default function Home() {
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

  // Sample trending outfits data
  const trendingOutfits = [
    {
      id: 1,
      title: "Midnight Elegance",
      category: "Evening Luxury",
      price: "₹12,999",
      originalPrice: "₹18,999",
      discount: "32% OFF",
      likes: 2847,
      trend: "🔥 Hot",
      gradient: "from-purple-900/80 via-violet-800/80 to-indigo-900/80"
    },
    {
      id: 2,
      title: "Executive Prestige", 
      category: "Business Elite",
      price: "₹15,499",
      originalPrice: "₹22,999",
      discount: "33% OFF",
      likes: 3654,
      trend: "⚡ New",
      gradient: "from-indigo-900/80 via-purple-800/80 to-violet-900/80"
    },
    {
      id: 3,
      title: "Urban Sophistication",
      category: "Street Luxury",
      price: "₹8,999",
      originalPrice: "₹13,999",
      discount: "36% OFF",
      likes: 4321,
      trend: "🌟 Top",
      gradient: "from-violet-900/80 via-purple-800/80 to-indigo-900/80"
    },
    {
      id: 4,
      title: "Casual Royalty",
      category: "Premium Comfort",
      price: "₹6,999",
      originalPrice: "₹10,999",
      discount: "36% OFF",
      likes: 2198,
      trend: "💎 VIP",
      gradient: "from-purple-800/80 via-indigo-800/80 to-violet-900/80"
    },
    {
      id: 5,
      title: "Weekend Majesty",
      category: "Leisure Elite",
      price: "₹9,499",
      originalPrice: "₹14,999",
      discount: "37% OFF",
      likes: 3876,
      trend: "🚀 Rising",
      gradient: "from-indigo-800/80 via-violet-800/80 to-purple-900/80"
    },
    {
      id: 6,
      title: "Evening Glamour",
      category: "Party Premium",
      price: "₹16,999",
      originalPrice: "₹24,999",
      discount: "32% OFF",
      likes: 2943,
      trend: "🔥 Hot",
      gradient: "from-purple-900/80 via-violet-900/80 to-indigo-800/80"
    }
  ];

  const carouselItems = [
    {
      id: 1,
      title: "Midnight Elegance",
      category: "Evening Luxury",
      description: "Sophisticated evening wear with contemporary touches",
      gradient: "from-purple-900 via-violet-800 to-indigo-900"
    },
    {
      id: 2,
      title: "Urban Royalty",
      category: "Street Luxury",
      description: "High-end streetwear meets royal sophistication",
      gradient: "from-indigo-900 via-purple-800 to-violet-900"
    },
    {
      id: 3,
      title: "Corporate Crown",
      category: "Executive Elite",
      description: "Power dressing redefined for modern executives",
      gradient: "from-violet-900 via-purple-800 to-indigo-900"
    },
    {
      id: 4,
      title: "Casual Majesty",
      category: "Luxury Comfort",
      description: "Premium casual wear with regal undertones",
      gradient: "from-purple-800 via-indigo-800 to-violet-900"
    }
  ];

  const testimonials = [
    {
      id: 1,
      name: "Arjun Malhotra",
      role: "CEO, Tech Startup",
      content: "OutfitFirst transformed my wardrobe completely. No more endless searching for matching pieces. Pure luxury at my fingertips.",
      avatar: "👨‍💼",
      rating: 5
    },
    {
      id: 2,
      name: "Priya Sharma",
      role: "Fashion Influencer",
      content: "The sophisticated aesthetic is everything! Finally, a platform that understands refined style. My followers are obsessed.",
      avatar: "👩‍🎨",
      rating: 5
    },
    {
      id: 3,
      name: "Rohit Gupta",
      role: "Investment Banker",
      content: "Time is money, and OutfitFirst saves me hours. Professional curation meets instant gratification. Absolutely brilliant.",
      avatar: "👨‍💻",
      rating: 5
    },
    {
      id: 4,
      name: "Ananya Patel",
      role: "Creative Director",
      content: "The custom request feature is a game-changer. They created my dream look in 24 hours. This is the future of fashion.",
      avatar: "👩‍🎨",
      rating: 5
    }
  ];

  const faqs = [
    {
      question: "How does the instant outfit link system work?",
      answer: "Our AI-powered platform curates complete looks and provides direct purchase links from premium partners. No more hunting across multiple sites - everything you need is right here, instantly accessible."
    },
    {
      question: "What makes your styling different from others?",
      answer: "We combine AI technology with expert human curation to create luxury looks tailored to your style profile. Our sophisticated aesthetic focuses on premium, refined fashion choices that elevate your wardrobe."
    },
    {
      question: "How quickly can I get a custom outfit created?",
      answer: "Our premium styling team delivers bespoke looks within 24 hours. Upload your inspiration or describe your vision, and we'll create a complete outfit package with direct purchase links."
    },
    {
      question: "Do you work with luxury brands?",
      answer: "Yes, we partner with premium and luxury brands to ensure you have access to the finest fashion pieces. Our curated selections focus on quality, style, and sophistication."
    },
    {
      question: "Is the service available internationally?",
      answer: "Currently, we serve major metropolitan areas with plans for global expansion. Our digital styling service is available worldwide, with localized shopping links for your region."
    }
  ];

  const luxuryFeatures = [
    { 
      icon: "✨", 
      title: "AI-Curated Excellence", 
      description: "Machine learning powered by fashion experts"
    },
    { 
      icon: "🎨", 
      title: "Bespoke Styling", 
      description: "Personalized looks crafted for your unique style"
    },
    { 
      icon: "⚡", 
      title: "Instant Gratification", 
      description: "Zero waiting. Immediate access to complete looks"
    },
    { 
      icon: "💎", 
      title: "Premium Partnerships", 
      description: "Exclusive access to luxury and designer brands"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 60
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.04, 0.62, 0.23, 0.98]
      }
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
                Luxury Fashion Revolution
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
                Instant access to luxury outfits.
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
                  <span>Explore Premium Collection</span>
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
                { number: "24", label: "Hour Luxury Service", suffix: "hr" },
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

      {/* Testimonials Section */}
      <TestimonialsSection testimonials={testimonials} />

      {/* FAQ Section */}
      <FAQSection 
        faqs={faqs}
        activeAccordion={activeAccordion}
        setActiveAccordion={setActiveAccordion}
      />

      {/* Bespoke Request Section */}
      <BespokeRequestSection 
        customRequest={customRequest}
        setCustomRequest={setCustomRequest}
        uploadedImage={uploadedImage}
        handleImageUpload={handleImageUpload}
        fileInputRef={fileInputRef}
      />

      {/* Premium Newsletter */}
      <PremiumNewsletterSection email={email} setEmail={setEmail} />
    </div>
  );
}

// WhatsApp Bot Component
function WhatsAppBot({ showWhatsApp, setShowWhatsApp }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      message: 'Hello! 👋 Welcome to OutfitFirst. I can help you find the perfect luxury outfits instantly!',
      timestamp: new Date().toLocaleTimeString()
    },
    {
      id: 2,
      type: 'bot',
      message: 'What type of outfit are you looking for today? 🌟',
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [newMessage, setNewMessage] = useState('');

  const quickReplies = [
    '🔥 Trending Outfits',
    '💼 Business Formal',
    '🌙 Evening Wear',
    '👑 Luxury Casual',
    '💎 Custom Request'
  ];

  const sendMessage = () => {
    if (newMessage.trim()) {
      const userMessage = {
        id: Date.now(),
        type: 'user',
        message: newMessage,
        timestamp: new Date().toLocaleTimeString()
      };
      
      setMessages(prev => [...prev, userMessage]);
      
      // Simulate bot response
      setTimeout(() => {
        const botResponse = {
          id: Date.now() + 1,
          type: 'bot',
          message: `Great choice! I'll help you find amazing ${newMessage.toLowerCase()} options. Here are some curated looks: ✨`,
          timestamp: new Date().toLocaleTimeString()
        };
        setMessages(prev => [...prev, botResponse]);
      }, 1000);
      
      setNewMessage('');
    }
  };

  const handleQuickReply = (reply) => {
    const userMessage = {
      id: Date.now(),
      type: 'user', 
      message: reply,
      timestamp: new Date().toLocaleTimeString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        type: 'bot',
        message: `Perfect! I have some amazing ${reply.toLowerCase()} collections for you. Let me show you the latest trends! 🎯`,
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  return (
    <>
      {/* WhatsApp Floating Button */}
      <motion.button
        className="fixed bottom-6 right-6 w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white text-2xl shadow-lg z-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowWhatsApp(!showWhatsApp)}
        animate={{
          boxShadow: [
            "0 4px 20px rgba(34, 197, 94, 0.4)",
            "0 8px 30px rgba(34, 197, 94, 0.6)",
            "0 4px 20px rgba(34, 197, 94, 0.4)"
          ]
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        💬
      </motion.button>

      {/* WhatsApp Bot Modal */}
      <AnimatePresence>
        {showWhatsApp && (
          <motion.div
            className="fixed bottom-24 right-6 w-96 h-[500px] bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl z-50 border border-purple-500/20 flex flex-col"
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ duration: 0.3 }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-violet-600 p-4 rounded-t-2xl flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                  <span className="text-purple-600 font-bold">O</span>
                </div>
                <div>
                  <h3 className="text-white font-bold">OutfitFirst Bot</h3>
                  <p className="text-purple-100 text-sm">Online • Luxury Stylist</p>
                </div>
              </div>
              <motion.button
                onClick={() => setShowWhatsApp(false)}
                className="text-white hover:bg-white/20 rounded-full p-1"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                ✕
              </motion.button>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className={`max-w-xs p-3 rounded-2xl ${
                    msg.type === 'user' 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-slate-800 text-purple-100 border border-purple-500/20'
                  }`}>
                    <p className="text-sm">{msg.message}</p>
                    <p className="text-xs opacity-70 mt-1">{msg.timestamp}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Quick Replies */}
            <div className="p-3 border-t border-purple-500/20">
              <div className="flex flex-wrap gap-2 mb-3">
                {quickReplies.map((reply, index) => (
                  <motion.button
                    key={index}
                    onClick={() => handleQuickReply(reply)}
                    className="px-3 py-1 bg-purple-600/20 text-purple-300 rounded-full text-xs hover:bg-purple-600/30 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {reply}
                  </motion.button>
                ))}
              </div>

              {/* Input */}
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-3 py-2 bg-slate-800 border border-purple-500/20 rounded-full text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                />
                <motion.button
                  onClick={sendMessage}
                  className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  ➤
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Trending Outfits Section
function TrendingOutfitsSection({ outfits, hoveredOutfit, setHoveredOutfit }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.section 
      ref={ref}
      className="py-20 lg:py-32 bg-gradient-to-br from-slate-900 via-purple-900/10 to-slate-900"
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
          <motion.h2 
            className="text-4xl md:text-6xl font-black text-white mb-6"
            animate={{
              textShadow: [
                "0 0 20px rgba(147, 51, 234, 0.3)",
                "0 0 40px rgba(168, 85, 247, 0.4)",
                "0 0 20px rgba(147, 51, 234, 0.3)"
              ]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            🔥 Trending{' '}
            <span className="bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">
              Outfits
            </span>
          </motion.h2>
          <p className="text-2xl text-purple-200 mb-8">
            Most coveted looks this season - curated by experts
          </p>
          <motion.div
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-900/50 to-violet-900/50 backdrop-blur-lg rounded-full px-4 py-2 border border-purple-500/20"
            animate={{
              scale: [1, 1.05, 1]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="text-purple-300 text-sm">✨ Updated Daily</span>
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {outfits.map((outfit, index) => (
            <motion.div
              key={outfit.id}
              className="group relative bg-gradient-to-br from-slate-800/50 to-purple-900/20 backdrop-blur-lg rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-purple-500/20"
              initial={{ y: 60, opacity: 0, scale: 0.9 }}
              animate={isInView ? { y: 0, opacity: 1, scale: 1 } : { y: 60, opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              whileHover={{ 
                y: -15,
                scale: 1.02,
                boxShadow: "0 25px 50px -12px rgba(147, 51, 234, 0.4)"
              }}
              onHoverStart={() => setHoveredOutfit(outfit.id)}
              onHoverEnd={() => setHoveredOutfit(null)}
            >
              {/* Outfit Image Area */}
              <div className="relative aspect-[3/4] overflow-hidden rounded-t-3xl">
                <div className={`absolute inset-0 bg-gradient-to-br ${outfit.gradient}`}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div 
                      className="text-8xl opacity-30"
                      animate={{
                        rotate: [0, 10, -10, 0],
                        scale: hoveredOutfit === outfit.id ? 1.1 : 1
                      }}
                      transition={{
                        rotate: { duration: 4, repeat: Infinity },
                        scale: { duration: 0.3 }
                      }}
                    >
                      👑
                    </motion.div>
                  </div>
                </div>
                
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
                  initial={{ opacity: 0 }}
                  animate={{ 
                    opacity: hoveredOutfit === outfit.id ? 1 : 0.4 
                  }}
                  transition={{ duration: 0.3 }}
                />
                
                <motion.div 
                  className="absolute top-4 left-4 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-full px-3 py-1 text-sm font-bold"
                  animate={{
                    y: hoveredOutfit === outfit.id ? -5 : 0,
                    scale: hoveredOutfit === outfit.id ? 1.05 : 1
                  }}
                >
                  {outfit.trend}
                </motion.div>

                <motion.div 
                  className="absolute top-4 right-4 bg-red-500 text-white rounded-full px-3 py-1 text-sm font-bold"
                  animate={{
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                >
                  {outfit.discount}
                </motion.div>

                <motion.div 
                  className="absolute bottom-4 left-4 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-semibold text-white"
                  animate={{
                    backgroundColor: hoveredOutfit === outfit.id ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.2)"
                  }}
                >
                  {outfit.category}
                </motion.div>
              </div>

              <motion.div 
                className="p-6"
                animate={{
                  backgroundColor: hoveredOutfit === outfit.id ? "rgba(15, 23, 42, 0.8)" : "transparent"
                }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-300 transition-colors duration-300">
                  {outfit.title}
                </h3>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl font-black text-purple-400">{outfit.price}</span>
                    <span className="text-lg text-gray-400 line-through">{outfit.originalPrice}</span>
                  </div>
                  <motion.span 
                    className="text-purple-300 flex items-center space-x-1"
                    animate={{
                      scale: hoveredOutfit === outfit.id ? 1.05 : 1
                    }}
                  >
                    <span>💎</span>
                    <span className="text-sm">{outfit.likes.toLocaleString()}</span>
                  </motion.span>
                </div>
                
                <motion.button 
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 relative overflow-hidden group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-violet-600 to-purple-600"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "0%" }}
                    transition={{ duration: 0.3 }}
                  />
                  <span className="relative z-10 flex items-center justify-center space-x-2">
                    <span>Get Complete Look</span>
                    <motion.span
                      animate={{ x: [0, 3, 0] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      →
                    </motion.span>
                  </span>
                </motion.button>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Shop More Button */}
        <motion.div 
          className="text-center"
          initial={{ y: 30, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : { y: 30, opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <motion.button 
            className="group relative px-12 py-5 bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 text-white rounded-2xl text-xl font-bold overflow-hidden"
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
              <span>Shop More Trending Outfits</span>
              <motion.span
                animate={{ 
                  rotate: [0, 360],
                  scale: [1, 1.2, 1]
                }}
                transition={{ 
                  rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                  scale: { duration: 1.5, repeat: Infinity }
                }}
              >
                ⚡
              </motion.span>
            </span>
          </motion.button>
          
          <motion.p 
            className="mt-4 text-purple-200 text-lg"
            animate={{
              opacity: [0.7, 1, 0.7]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            Discover 100+ curated luxury outfits
          </motion.p>
        </motion.div>
      </div>
    </motion.section>
  );
}

// Luxury Features Section
function LuxuryFeaturesSection({ features }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.section 
      ref={ref}
      className="py-20 lg:py-32 relative"
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-20"
          initial={{ y: 50, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h2 className="text-4xl md:text-6xl font-black text-white mb-6">
            Why Choose{' '}
            <span className="bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">
              Excellence
            </span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="group p-8 bg-slate-800/50 backdrop-blur-lg rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-purple-500/20"
              initial={{ y: 60, opacity: 0 }}
              animate={isInView ? { y: 0, opacity: 1 } : { y: 60, opacity: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              whileHover={{ 
                y: -10,
                scale: 1.02,
                boxShadow: "0 25px 50px -12px rgba(147, 51, 234, 0.3)"
              }}
            >
              <motion.div 
                className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300"
                animate={{
                  rotate: [0, 10, -10, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  delay: index * 0.5
                }}
              >
                {feature.icon}
              </motion.div>
              <h3 className="text-xl font-bold text-white mb-4 group-hover:text-purple-300 transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-purple-200 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

// Luxury Carousel Component
function LuxuryCarousel({ items, currentSlide, setCurrentSlide }) {
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

          {/* Navigation Buttons */}
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

          {/* Indicators */}
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

// Testimonials Section
function TestimonialsSection({ testimonials }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.section 
      ref={ref}
      className="py-20 lg:py-32 bg-gradient-to-br from-slate-900 via-purple-900/10 to-slate-900"
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
            What Our{' '}
            <span className="bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">
              Elite
            </span>{' '}
            Say
          </h2>
          <p className="text-2xl text-purple-200">
            Testimonials from fashion connoisseurs
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              className="group relative bg-gradient-to-br from-slate-800/50 to-purple-900/20 backdrop-blur-lg rounded-3xl p-8 border border-purple-500/20 hover:border-purple-400/40 transition-all duration-500"
              initial={{ y: 60, opacity: 0 }}
              animate={isInView ? { y: 0, opacity: 1 } : { y: 60, opacity: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              whileHover={{ 
                y: -10,
                boxShadow: "0 25px 50px -12px rgba(147, 51, 234, 0.3)"
              }}
            >
              <div className="flex items-start space-x-4">
                <motion.div 
                  className="text-4xl"
                  animate={{
                    rotate: [0, 10, -10, 0]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    delay: index * 0.5
                  }}
                >
                  {testimonial.avatar}
                </motion.div>
                
                <div className="flex-1">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <motion.span
                        key={i}
                        className="text-yellow-400 text-lg"
                        animate={{
                          scale: [1, 1.2, 1]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: i * 0.1
                        }}
                      >
                        ⭐
                      </motion.span>
                    ))}
                  </div>
                  
                  <p className="text-purple-100 text-lg leading-relaxed mb-6 italic">
                    "{testimonial.content}"
                  </p>
                  
                  <div>
                    <h4 className="text-white font-bold text-lg">
                      {testimonial.name}
                    </h4>
                    <p className="text-purple-300 text-sm">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </div>

              <motion.div
                className="absolute top-6 right-6 text-6xl text-purple-500/10"
                animate={{
                  rotate: [0, 360]
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                "
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

// FAQ Section
function FAQSection({ faqs, activeAccordion, setActiveAccordion }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.section 
      ref={ref}
      className="py-20 lg:py-32 bg-slate-800/30"
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ y: 50, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h2 className="text-4xl md:text-6xl font-black text-white mb-6">
            Frequently Asked{' '}
            <span className="bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">
              Questions
            </span>
          </h2>
          <p className="text-2xl text-purple-200">
            Everything you need to know about our luxury service
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              className="bg-gradient-to-br from-slate-800/50 to-purple-900/20 backdrop-blur-lg rounded-2xl border border-purple-500/20 overflow-hidden"
              initial={{ y: 30, opacity: 0 }}
              animate={isInView ? { y: 0, opacity: 1 } : { y: 30, opacity: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
            >
              <motion.button
                onClick={() => setActiveAccordion(activeAccordion === index ? -1 : index)}
                className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-purple-900/20 transition-colors duration-300"
                whileHover={{ backgroundColor: "rgba(88, 28, 135, 0.1)" }}
              >
                <h3 className="text-xl font-bold text-white pr-4">
                  {faq.question}
                </h3>
                <motion.span
                  className="text-2xl text-purple-400 flex-shrink-0"
                  animate={{ rotate: activeAccordion === index ? 45 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  +
                </motion.span>
              </motion.button>

              <AnimatePresence>
                {activeAccordion === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <motion.div 
                      className="px-8 pb-6 text-purple-200 leading-relaxed text-lg"
                      initial={{ y: -10 }}
                      animate={{ y: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                    >
                      {faq.answer}
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

// Bespoke Request Section
function BespokeRequestSection({ customRequest, setCustomRequest, uploadedImage, handleImageUpload, fileInputRef }) {
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
            Our luxury stylists will craft it exclusively for you
          </p>
        </motion.div>

        <motion.div 
          className="bg-gradient-to-br from-slate-800/50 to-purple-900/20 backdrop-blur-lg rounded-3xl p-8 lg:p-16 shadow-2xl border border-purple-500/20"
          initial={{ y: 60, opacity: 0, scale: 0.9 }}
          animate={isInView ? { y: 0, opacity: 1, scale: 1 } : { y: 60, opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="grid md:grid-cols-2 gap-12">
            {/* Image Upload */}
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

            {/* Text Description */}
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
              Luxury styling delivered within 24 hours
            </motion.p>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}

// Premium Newsletter Section
function PremiumNewsletterSection({ email, setEmail }) {
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
