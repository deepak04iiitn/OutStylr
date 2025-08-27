import { useDispatch, useSelector } from 'react-redux';
import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';
import { signInStart, signInFailure, signInSuccess } from '../redux/user/userSlice';
import OAuth from '../components/OAuth';

export default function SignInFashionMirror() {
  const [formData, setFormData] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const { loading, error: errorMessage } = useSelector(state => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const ref = useRef(null);
  const mirrorRef = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  // 3D Mirror Effect
  const rotateX = useSpring(0, { stiffness: 300, damping: 30 });
  const rotateY = useSpring(0, { stiffness: 300, damping: 30 });

  const handleMouseMove = (event) => {
    if (!mirrorRef.current) return;
    const rect = mirrorRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const rotateXValue = (event.clientY - centerY) / 15;
    const rotateYValue = (event.clientX - centerX) / 15;
    
    rotateX.set(rotateXValue);
    rotateY.set(-rotateYValue);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    if(!formData.email || !formData.password) {
      return dispatch(signInFailure('Please fill out all the fields!'));
    }

    try {
      dispatch(signInStart());
      const res = await fetch('/backend/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if(data.success === false) {
        dispatch(signInFailure(data.message));
      }
      
      if(res.ok) {
        dispatch(signInSuccess(data));
        navigate('/');
      }
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  // Fashion elements with sophisticated styling
  const fashionElements = [
    { icon: '👗', label: 'Dresses', position: { top: '15%', left: '10%' } },
    { icon: '👔', label: 'Formal', position: { top: '25%', right: '15%' } },
    { icon: '👠', label: 'Heels', position: { bottom: '30%', left: '8%' } },
    { icon: '👜', label: 'Bags', position: { top: '45%', right: '12%' } },
    { icon: '🧥', label: 'Outerwear', position: { bottom: '20%', right: '10%' } },
    { icon: '👖', label: 'Bottoms', position: { bottom: '35%', left: '85%' } },
  ];

  return (
    <div className="min-h-screen bg-slate-900 overflow-hidden relative">
      {/* Enhanced Fashion Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/30 to-indigo-900/20" />
        
        {/* Fashion Runway Lines */}
        <motion.div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(90deg, transparent 0%, rgba(147, 51, 234, 0.1) 45%, rgba(147, 51, 234, 0.2) 50%, rgba(147, 51, 234, 0.1) 55%, transparent 100%),
              linear-gradient(0deg, transparent 0%, rgba(168, 85, 247, 0.05) 48%, rgba(168, 85, 247, 0.1) 50%, rgba(168, 85, 247, 0.05) 52%, transparent 100%)
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
        {fashionElements.map((item, i) => (
          <motion.div
            key={i}
            className="absolute text-purple-400/20 text-4xl select-none"
            style={item.position}
            animate={{
              y: [0, -15, 0],
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: i * 0.5,
              ease: "easeInOut"
            }}
          >
            {item.icon}
          </motion.div>
        ))}

        {/* Sparkle Effects */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-purple-400 rounded-full"
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
      </div>

      

      {/* Main Content - Fashion Mirror Design */}
      <div 
        className="relative z-20 min-h-screen flex items-center justify-center p-4 mt-24"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <motion.div 
          ref={ref}
          className="w-full max-w-6xl"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          {/* Fashion Mirror Container */}
          <div className="relative grid lg:grid-cols-2 gap-8 items-center perspective-1000">
            
            {/* Left Side - Style Showcase */}
            <motion.div 
              className="relative order-2 lg:order-1"
              initial={{ opacity: 0, x: -50 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {/* Fashion Mannequin Silhouette */}
              <div className="relative bg-gradient-to-br from-slate-800/60 to-purple-900/40 backdrop-blur-2xl rounded-[2rem] p-8 lg:p-12 border border-purple-500/30 overflow-hidden">
                {/* Animated Fashion Show Background */}
                <motion.div
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 10 L60 30 L80 25 L70 45 L90 50 L70 55 L80 75 L60 70 L50 90 L40 70 L20 75 L30 55 L10 50 L30 45 L20 25 L40 30 Z' fill='%23a855f7' fill-opacity='0.3'/%3E%3C/svg%3E")`,
                    backgroundSize: '50px 50px'
                  }}
                  animate={{
                    backgroundPosition: ['0px 0px', '50px 50px', '0px 0px']
                  }}
                  transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />

                <div className="relative z-10">
                  <motion.h2 
                    className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-6"
                    animate={{
                      backgroundImage: [
                        "linear-gradient(45deg, #ffffff 0%, #a855f7 50%, #ffffff 100%)",
                        "linear-gradient(45deg, #a855f7 0%, #8b5cf6 50%, #7c3aed 100%)",
                        "linear-gradient(45deg, #ffffff 0%, #a855f7 50%, #ffffff 100%)"
                      ]
                    }}
                    transition={{ duration: 4, repeat: Infinity }}
                    style={{ 
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      color: "transparent"
                    }}
                  >
                    <span className="block">Welcome Back to the Outfit World</span>
                  </motion.h2>

                  <motion.p 
                    className="text-lg sm:text-xl text-purple-100 mb-8 leading-relaxed"
                    animate={{ opacity: [0.8, 1, 0.8] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    Welcome back to your fashion universe. Sign in to access curated outfits, instant style recommendations, and your personal fashion journey.
                  </motion.p>

                  {/* Fashion Promise Points */}
                  <div className="space-y-4">
                    {[
                      { icon: '⚡', title: 'Instant Access', desc: 'No more waiting for outfit links' },
                      { icon: '🎨', title: 'Styling on Demand', desc: 'Get your look styled by our stylists' },
                      { icon: '🔗', title: 'Direct Shopping', desc: 'Shop complete looks instantly' }
                    ].map((promise, index) => (
                      <motion.div
                        key={promise.title}
                        className="flex items-center space-x-4 p-4 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + index * 0.2 }}
                        whileHover={{ 
                          scale: 1.02,
                          backgroundColor: "rgba(255, 255, 255, 0.1)",
                          borderColor: "rgba(147, 51, 234, 0.3)"
                        }}
                      >
                        <motion.div 
                          className="text-3xl"
                          animate={{
                            scale: [1, 1.2, 1],
                            rotate: [0, 10, -10, 0]
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            delay: index * 0.5
                          }}
                        >
                          {promise.icon}
                        </motion.div>
                        <div>
                          <h3 className="text-white font-semibold">{promise.title}</h3>
                          <p className="text-purple-200 text-sm">{promise.desc}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Side - Fashion Mirror Form */}
            <motion.div 
              className="relative order-1 lg:order-2"
              initial={{ opacity: 0, x: 50 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {/* Mirror Frame Effect */}
              <motion.div 
                ref={mirrorRef}
                className="relative bg-slate-800/70 backdrop-blur-3xl border border-purple-500/30 transform-gpu"
                style={{
                  rotateX: rotateX,
                  rotateY: rotateY,
                  borderRadius: '2rem 4rem 2rem 4rem',
                  background: `
                    radial-gradient(circle at 30% 20%, rgba(147, 51, 234, 0.15) 0%, transparent 50%),
                    radial-gradient(circle at 70% 80%, rgba(168, 85, 247, 0.12) 0%, transparent 50%),
                    linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.8) 100%)
                  `,
                  boxShadow: `
                    inset 0 2px 0 rgba(255, 255, 255, 0.1),
                    inset 0 -2px 0 rgba(0, 0, 0, 0.2),
                    0 25px 50px rgba(0, 0, 0, 0.5),
                    0 0 0 2px rgba(147, 51, 234, 0.2)
                  `
                }}
                whileHover={{
                  boxShadow: `
                    inset 0 2px 0 rgba(255, 255, 255, 0.15),
                    inset 0 -2px 0 rgba(0, 0, 0, 0.25),
                    0 35px 70px rgba(0, 0, 0, 0.6),
                    0 0 0 3px rgba(147, 51, 234, 0.3)
                  `
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                {/* Mirror Reflection Effects */}
                <motion.div
                  className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-purple-500/20 to-transparent rounded-full blur-2xl"
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.2, 0.4, 0.2],
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                />
                
                <motion.div
                  className="absolute bottom-4 left-4 w-16 h-16 bg-gradient-to-tl from-violet-500/20 to-transparent rounded-full blur-2xl"
                  animate={{
                    scale: [1, 1.4, 1],
                    opacity: [0.15, 0.3, 0.15],
                  }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                />

                <div className="relative z-10 p-6 sm:p-8">
                  {/* Mirror Header */}
                  <motion.div
                    className="text-center mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <motion.h3 
                      className="text-2xl sm:text-3xl font-black text-white mb-2"
                      animate={{
                        textShadow: [
                          "0 0 20px rgba(147, 51, 234, 0.3)",
                          "0 0 30px rgba(168, 85, 247, 0.5)",
                          "0 0 20px rgba(147, 51, 234, 0.3)"
                        ]
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      Style Mirror
                    </motion.h3>
                    <p className="text-purple-300">Reflect your fashion identity</p>
                  </motion.div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Luxury Input Fields */}
                    <motion.div
                      className="relative group"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                    >
                      <div className="relative overflow-hidden" style={{ borderRadius: '1rem 2rem 1rem 2rem' }}>
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-violet-600/10"
                          animate={{
                            x: ["-100%", "100%"]
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "linear"
                          }}
                        />
                        <div className="relative flex items-center">
                          <motion.div
                            className="absolute left-4 text-purple-400 text-xl"
                            animate={{
                              scale: [1, 1.1, 1],
                              rotate: [0, 5, -5, 0]
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            ✉️
                          </motion.div>
                          <motion.input
                            type="email"
                            id="email"
                            onChange={handleChange}
                            className="w-full pl-14 pr-4 py-4 bg-slate-700/50 border-2 border-purple-500/30 text-white placeholder-purple-300 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 outline-none transition-all duration-300"
                            placeholder="Your email address"
                            style={{ borderRadius: '1rem 2rem 1rem 2rem' }}
                            whileFocus={{
                              scale: 1.02,
                              boxShadow: "0 0 30px rgba(147, 51, 234, 0.3)"
                            }}
                          />
                        </div>
                      </div>
                    </motion.div>

                    <motion.div
                      className="relative group"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1 }}
                    >
                      <div className="relative overflow-hidden" style={{ borderRadius: '2rem 1rem 2rem 1rem' }}>
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-violet-600/10 to-indigo-600/10"
                          animate={{
                            x: ["-100%", "100%"]
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "linear",
                            delay: 1
                          }}
                        />
                        <div className="relative flex items-center">
                          <motion.div
                            className="absolute left-4 text-purple-400 text-xl"
                            animate={{
                              scale: [1, 1.1, 1],
                              rotate: [0, -5, 5, 0]
                            }}
                            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                          >
                            🔑
                          </motion.div>
                          <motion.input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            onChange={handleChange}
                            className="w-full pl-14 pr-16 py-4 bg-slate-700/50 border-2 border-purple-500/30 text-white placeholder-purple-300 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 outline-none transition-all duration-300"
                            placeholder="Your password"
                            style={{ borderRadius: '2rem 1rem 2rem 1rem' }}
                            whileFocus={{
                              scale: 1.02,
                              boxShadow: "0 0 30px rgba(147, 51, 234, 0.3)"
                            }}
                          />
                          <motion.button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="cursor-pointer absolute right-4 text-purple-300 hover:text-purple-100 transition-colors text-xl"
                            whileHover={{ scale: 1.1, rotate: 15 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            {showPassword ? '🙈' : '👁️'}
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>

                    {/* Glamorous Submit Button */}
                    <motion.button
                      type="submit"
                      disabled={loading}
                      className="cursor-pointer relative w-full py-4 bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 text-white font-bold text-lg overflow-hidden group disabled:opacity-70"
                      style={{
                        borderRadius: '2rem 1rem 2rem 1rem',
                        background: `
                          linear-gradient(135deg, #7c3aed 0%, #a855f7 25%, #8b5cf6 50%, #7c3aed 75%, #a855f7 100%)
                        `,
                        backgroundSize: '400% 400%'
                      }}
                      animate={{
                        backgroundPosition: loading ? ['0% 50%'] : ['0% 50%', '100% 50%', '0% 50%']
                      }}
                      transition={{
                        duration: loading ? 0 : 8,
                        repeat: loading ? 0 : Infinity,
                        ease: "linear"
                      }}
                      whileHover={{
                        scale: loading ? 1 : 1.02,
                        borderRadius: loading ? "2rem 1rem 2rem 1rem" : "1rem 2rem 1rem 2rem",
                        boxShadow: "0 25px 50px -12px rgba(147, 51, 234, 0.6)"
                      }}
                      whileTap={{ scale: loading ? 1 : 0.98 }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.2, borderRadius: { duration: 0.3 } }}
                    >
                      {/* Diamond Sparkle Effect */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12"
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

                      <span className="relative z-10 flex items-center justify-center">
                        {loading ? (
                          <>
                            <motion.div
                              className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full mr-3"
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            />
                            Unlocking Your Style...
                          </>
                        ) : (
                          <>
                            Enter Fashion Universe
                            <motion.span 
                              className="ml-2"
                              animate={{
                                scale: [1, 1.2, 1],
                                rotate: [0, 180, 360]
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                              }}
                            >
                              ✨
                            </motion.span>
                          </>
                        )}
                      </span>
                    </motion.button>

                    {/* Stylish Divider */}
                    <motion.div 
                      className="relative my-8"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.4 }}
                    >
                      <div className="absolute inset-0 flex items-center">
                        <motion.div 
                          className="w-full h-px bg-gradient-to-r from-transparent via-purple-500/40 to-transparent"
                          animate={{
                            opacity: [0.4, 0.8, 0.4],
                            scaleX: [1, 1.02, 1]
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        />
                      </div>
                      <div className="relative flex justify-center">
                        <motion.span 
                          className="px-6 py-2 bg-slate-800/80 text-purple-300 font-medium border border-purple-500/20 backdrop-blur-sm"
                          style={{ borderRadius: '2rem 0.5rem 2rem 0.5rem' }}
                          whileHover={{ 
                            scale: 1.05, 
                            borderColor: "rgba(147, 51, 234, 0.4)",
                            backgroundColor: "rgba(15, 23, 42, 0.9)"
                          }}
                        >
                          Or continue with
                        </motion.span>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.6 }}
                    >
                      <OAuth />
                    </motion.div>
                  </form>

                  {/* Glamorous Error Display */}
                  {errorMessage && (
                    <motion.div 
                      className="mt-6 bg-red-900/40 border-2 border-red-500/40 text-red-300 p-4 text-sm backdrop-blur-sm relative overflow-hidden"
                      style={{ borderRadius: "2rem 0.5rem 2rem 0.5rem" }}
                      initial={{ opacity: 0, scale: 0.9, rotateX: -15 }}
                      animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                      transition={{ duration: 0.4, type: "spring" }}
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-transparent"
                        animate={{
                          x: ["-100%", "100%"]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "linear"
                        }}
                      />
                      <div className="flex items-center space-x-3 relative z-10">
                        <motion.span
                          animate={{
                            rotate: [0, 20, -20, 0],
                            scale: [1, 1.3, 1]
                          }}
                          transition={{ duration: 0.6, repeat: 2 }}
                        >
                          ⚠️
                        </motion.span>
                        <span>{errorMessage}</span>
                      </div>
                    </motion.div>
                  )}

                  {/* Fashion Footer */}
                  <motion.div 
                    className="mt-8 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.8 }}
                  >
                    <p className="text-sm text-purple-300">
                      New to the fashion revolution?{' '}
                      <Link 
                        to="/sign-up" 
                        className="font-semibold text-purple-400 hover:text-purple-300 transition-all duration-300 relative group"
                      >
                        <span className="relative z-10">Join OutStylr</span>
                        <motion.span
                          className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-violet-400 group-hover:w-full transition-all duration-300"
                          style={{ borderRadius: "1px" }}
                        />
                        <motion.span 
                          className="ml-2"
                          animate={{
                            x: [0, 4, 0],
                            rotate: [0, 15, -15, 0]
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          ✨
                        </motion.span>
                      </Link>
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
