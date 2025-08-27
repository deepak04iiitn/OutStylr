import React from 'react';
import { motion } from 'framer-motion';

const OutStylrBackground = ({ 
  children, 
  variant = 'default',
  intensity = 'medium',
  showFashionIcons = true,
  customGradient,
  className = ''
}) => {
  // Fashion-themed floating elements
  const fashionIcons = [
    { icon: '👗', size: 'text-2xl', opacity: 0.1 },
    { icon: '👔', size: 'text-xl', opacity: 0.08 },
    { icon: '👠', size: 'text-lg', opacity: 0.12 },
    { icon: '👜', size: 'text-xl', opacity: 0.1 },
    { icon: '🧥', size: 'text-2xl', opacity: 0.11 },
    { icon: '👖', size: 'text-lg', opacity: 0.09 },
    { icon: '👒', size: 'text-xl', opacity: 0.1 },
    { icon: '👞', size: 'text-lg', opacity: 0.09 },
    { icon: '💎', size: 'text-lg', opacity: 0.12 },
    { icon: '🦋', size: 'text-xl', opacity: 0.08 },
  ];

  // Intensity configurations
  const intensityConfig = {
    low: {
      iconCount: 8,
      orbCount: 2,
      sparkleCount: 10,
      animationDuration: { min: 12, max: 18 }
    },
    medium: {
      iconCount: 15,
      orbCount: 3,
      sparkleCount: 20,
      animationDuration: { min: 8, max: 15 }
    },
    high: {
      iconCount: 25,
      orbCount: 5,
      sparkleCount: 35,
      animationDuration: { min: 6, max: 12 }
    }
  };

  // Variant configurations
  const variantConfig = {
    default: {
      baseGradient: 'from-slate-900 via-purple-900/20 to-indigo-900/20',
      orbColors: ['#9333ea15', '#a855f715', '#8b5cf615'],
      runwayOpacity: 0.1
    },
    auth: {
      baseGradient: 'from-slate-900 via-purple-900/30 to-violet-900/25',
      orbColors: ['#9333ea20', '#a855f720', '#8b5cf620'],
      runwayOpacity: 0.15
    },
    profile: {
      baseGradient: 'from-slate-900 via-indigo-900/25 to-purple-900/20',
      orbColors: ['#6366f125', '#8b5cf620', '#7c3aed15'],
      runwayOpacity: 0.12
    },
    minimal: {
      baseGradient: 'from-slate-900 via-slate-800/50 to-slate-900',
      orbColors: ['#64748b15', '#475569a10', '#334155b15'],
      runwayOpacity: 0.05
    }
  };

  const config = intensityConfig[intensity];
  const variantStyle = variantConfig[variant];

  return (
    <div className={`min-h-screen bg-slate-900 overflow-hidden relative ${className}`}>
      {/* Base Gradient Background */}
      <div className={`fixed inset-0 pointer-events-none bg-gradient-to-br ${customGradient || variantStyle.baseGradient}`} />
      
      {/* Fashion Runway Lines */}
      <motion.div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(90deg, transparent 0%, rgba(147, 51, 234, ${variantStyle.runwayOpacity}) 45%, rgba(147, 51, 234, ${variantStyle.runwayOpacity * 2}) 50%, rgba(147, 51, 234, ${variantStyle.runwayOpacity}) 55%, transparent 100%),
            linear-gradient(0deg, transparent 0%, rgba(168, 85, 247, ${variantStyle.runwayOpacity * 0.5}) 48%, rgba(168, 85, 247, ${variantStyle.runwayOpacity}) 50%, rgba(168, 85, 247, ${variantStyle.runwayOpacity * 0.5}) 52%, transparent 100%)
          `,
          backgroundSize: '100% 4px, 4px 100%',
          backgroundPosition: '0 50%, 50% 0',
        }}
        animate={{
          backgroundPosition: ['0 50%, 50% 0', '100% 50%, 50% 100%', '0 50%, 50% 0']
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      {/* Floating Fashion Elements */}
      {showFashionIcons && [...Array(config.iconCount)].map((_, i) => {
        const randomIcon = fashionIcons[Math.floor(Math.random() * fashionIcons.length)];
        return (
          <motion.div
            key={i}
            className={`fixed ${randomIcon.size} select-none pointer-events-none`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              color: '#a855f7',
              opacity: randomIcon.opacity,
            }}
            animate={{
              y: [0, -20, 0],
              x: [0, Math.random() > 0.5 ? 10 : -10, 0],
              rotate: [0, Math.random() > 0.5 ? 5 : -5, 0],
            }}
            transition={{
              duration: config.animationDuration.min + Math.random() * (config.animationDuration.max - config.animationDuration.min),
              repeat: Infinity,
              delay: Math.random() * 8,
              ease: "easeInOut"
            }}
          >
            {randomIcon.icon}
          </motion.div>
        );
      })}

      {/* Gradient Orbs */}
      {[...Array(config.orbCount)].map((_, i) => (
        <motion.div
          key={`orb-${i}`}
          className="fixed rounded-full blur-3xl pointer-events-none"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${120 + Math.random() * 150}px`,
            height: `${120 + Math.random() * 150}px`,
            background: `linear-gradient(45deg, ${variantStyle.orbColors[i]}, transparent)`,
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.05, 0.15, 0.05],
          }}
          transition={{
            duration: 25 + Math.random() * 15,
            repeat: Infinity,
            delay: Math.random() * 15,
            ease: "easeInOut"
          }}
        />
      ))}

      {/* Sparkle Effects */}
      {[...Array(config.sparkleCount)].map((_, i) => (
        <motion.div
          key={`sparkle-${i}`}
          className="fixed w-1 h-1 bg-purple-400 rounded-full pointer-events-none"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 1, 0],
            rotate: [0, 180]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: Math.random() * 3,
            ease: "easeOut"
          }}
        />
      ))}

      {/* Gradient Mesh Overlay */}
      <motion.div
        className="fixed inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(circle at 25% 25%, rgba(147, 51, 234, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, rgba(168, 85, 247, 0.08) 0%, transparent 50%),
            radial-gradient(circle at 75% 25%, rgba(139, 92, 246, 0.06) 0%, transparent 50%),
            radial-gradient(circle at 25% 75%, rgba(124, 58, 237, 0.08) 0%, transparent 50%)
          `
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default OutStylrBackground;
