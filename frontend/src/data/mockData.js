export const trendingOutfits = [
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
  
  export const carouselItems = [
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
  
  export const testimonials = [
    {
      id: 1,
      name: "Arjun Malhotra",
      role: "CEO, Tech Startup",
      content: "OutStylr transformed my wardrobe completely. No more endless searching for matching pieces. Pure looks at my fingertips.",
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
      content: "Time is money, and OutStylr saves me hours. Professional curation meets instant gratification. Absolutely brilliant.",
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
  
  export const faqs = [
    {
      question: "What makes OutStylr different from other fashion platforms?",
      answer: "Unlike traditional stores that sell individual pieces, OutStylr focuses on complete, ready-to-wear outfits. We save you time and styling effort by curating modern, on-trend looks across different categories and occasions."
    },
    {
      question: "How does the instant outfit link system work?",
      answer: "Our experts curates complete looks and provides direct purchase links of all the products involved in an outfit. No more hunting across multiple sites/apps - everything you need is right here, instantly accessible."
    },
    {
      question: "What makes your styling different from others?",
      answer: "We craft modern, hype-worthy outfits inspired by today’s fashion trends. With carefully curated selections across diverse categories and style sections, we bring you elevated looks that keep your wardrobe fresh and on point."
    },
    {
      question: "How quickly can I get a custom outfit created?",
      answer: "Our premium styling team delivers bespoke looks within 24 hours. Upload your inspiration or describe your vision, and we'll create a complete outfit package with direct purchase links."
    },
    {
      question: "What types of outfits are available?",
      answer: "We offer curated collections across categories like party wear, office/formals, casual everyday outfits, wedding looks, festive wear, travel styles, date outfit, couple outfit and more."
    }
  ];
  
  export const luxuryFeatures = [
    { 
      icon: "👨‍👩‍👧‍👦", 
      title: "Fashion for All", 
      description: "Trendy outfits across men, women, and kids" 
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
      icon: "👗", 
      title: "Always in Style", 
      description: "From casual to festive, styles curated for every moment" 
    },
  ];
  
  export const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2
      }
    }
  };
  
  export const itemVariants = {
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