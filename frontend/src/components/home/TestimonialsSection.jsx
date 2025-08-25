import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

export default function TestimonialsSection({ testimonials }) {
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