import React, { useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';

export default function FAQSection({ faqs, activeAccordion, setActiveAccordion }) {
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
            Everything you need to know about our fashion revolution
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
                className="cursor-pointer w-full px-8 py-6 text-left flex items-center justify-between hover:bg-purple-900/20 transition-colors duration-300"
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