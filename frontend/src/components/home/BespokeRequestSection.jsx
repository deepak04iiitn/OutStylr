import React, { useRef, memo, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';

// Memoized upload area to prevent unnecessary re-renders
const UploadArea = memo(({ uploadedImage, onImageClick, isInView }) => (
  <motion.div
    onClick={onImageClick}
    className="border-2 border-dashed border-purple-500/50 rounded-3xl p-12 text-center cursor-pointer group relative overflow-hidden bg-slate-800/30 will-change-transform"
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
        alt="Uploaded inspiration" 
        className="max-h-40 mx-auto rounded-2xl shadow-lg relative z-10 object-contain"
        initial={{ scale: 0, rotate: 180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.6, ease: "backOut" }}
        loading="lazy"
      />
    ) : (
      <motion.div className="relative z-10">
        <motion.div 
          className="text-6xl mb-6"
          animate={{
            rotateY: isInView ? [0, 180, 360] : 0,
            scale: isInView ? [1, 1.1, 1] : 1
          }}
          transition={{
            duration: 3,
            repeat: isInView ? Infinity : 0,
            ease: "easeInOut"
          }}
        >
          📸
        </motion.div>
        <p className="text-purple-200 text-lg">Click to upload your inspiration</p>
        <p className="text-purple-300/60 text-sm mt-2">JPG, PNG or WebP (Max 5MB)</p>
      </motion.div>
    )}
  </motion.div>
));

UploadArea.displayName = 'UploadArea';

// Memoized text area component
const CustomTextArea = memo(({ value, onChange, isInView }) => (
  <motion.textarea
    value={value}
    onChange={onChange}
    placeholder="E.g., 'Sophisticated evening look with modern touches' or 'Luxury streetwear with elegant elements'"
    className="w-full h-40 p-6 bg-slate-800/50 border-2 border-purple-500/30 rounded-3xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 resize-none text-lg text-white placeholder-purple-300 transition-all duration-300 will-change-transform"
    whileFocus={{ 
      scale: 1.02,
      boxShadow: "0 20px 40px -15px rgba(147, 51, 234, 0.3)"
    }}
    rows={5}
    maxLength={500}
  />
));

CustomTextArea.displayName = 'CustomTextArea';

// Memoized submit button
const SubmitButton = memo(({ isInView, hasContent }) => (
  <motion.button 
    className={`cursor-pointer px-12 py-5 rounded-2xl text-xl font-bold shadow-lg relative overflow-hidden group transition-all duration-300 ${
      hasContent 
        ? 'bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 text-white' 
        : 'bg-gray-600 text-gray-300 cursor-not-allowed'
    }`}
    whileHover={hasContent ? { 
      scale: 1.05,
      boxShadow: "0 25px 50px -12px rgba(147, 51, 234, 0.6)"
    } : {}}
    whileTap={hasContent ? { scale: 0.95 } : {}}
    disabled={!hasContent}
  >
    {hasContent && (
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600"
        initial={{ x: "-100%" }}
        whileHover={{ x: "0%" }}
        transition={{ duration: 0.3 }}
      />
    )}
    <span className="relative z-10 flex items-center space-x-3">
      <span>{hasContent ? 'Create My Bespoke Look' : 'Please describe your look'}</span>
      {hasContent && (
        <motion.span
          animate={{ rotate: isInView ? [0, 360] : 0 }}
          transition={{ 
            duration: 2, 
            repeat: isInView ? Infinity : 0, 
            ease: "linear" 
          }}
        >
          ✨
        </motion.span>
      )}
    </span>
  </motion.button>
));

SubmitButton.displayName = 'SubmitButton';

export default memo(function BespokeRequestSection({ 
  customRequest, 
  setCustomRequest, 
  uploadedImage, 
  handleImageUpload, 
  fileInputRef 
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { 
    once: true, 
    margin: "-100px",
    threshold: 0.1
  });

  // Memoized handlers to prevent unnecessary re-renders
  const handleImageClick = useCallback(() => {
    fileInputRef.current?.click();
  }, [fileInputRef]);

  const handleTextChange = useCallback((e) => {
    setCustomRequest(e.target.value);
  }, [setCustomRequest]);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (customRequest.trim()) {
      // Handle form submission
      console.log('Submitting bespoke request:', { customRequest, uploadedImage });
    }
  }, [customRequest, uploadedImage]);

  // Check if form has content
  const hasContent = customRequest.trim().length > 10;

  // Memoized animation variants to prevent object recreation
  const sectionVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const containerVariants = {
    hidden: { y: 60, opacity: 0, scale: 0.9 },
    visible: { y: 0, opacity: 1, scale: 1 }
  };

  const leftColumnVariants = {
    hidden: { x: -30, opacity: 0 },
    visible: { x: 0, opacity: 1 }
  };

  const rightColumnVariants = {
    hidden: { x: 30, opacity: 0 },
    visible: { x: 0, opacity: 1 }
  };

  const bottomSectionVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <motion.section 
      ref={ref}
      className="py-20 lg:py-32 bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 relative overflow-hidden"
      variants={sectionVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      {/* Background decoration - reduced complexity */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          className="absolute top-1/4 right-1/4 w-64 h-64 bg-purple-600/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-violet-600/5 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ y: 30, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : { y: 30, opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <h2 className="text-4xl md:text-6xl font-black text-white mb-6">
            Can't Find Your{' '}
            <span className="bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">
              Perfect Look?
            </span>
          </h2>
          <p className="text-2xl text-purple-200 max-w-3xl mx-auto">
            Our premium stylists will craft it exclusively for you
          </p>
        </motion.div>

        <motion.form 
          onSubmit={handleSubmit}
          className="bg-gradient-to-br from-slate-800/50 to-purple-900/20 backdrop-blur-lg rounded-3xl p-8 lg:p-16 shadow-2xl border border-purple-500/20"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="grid md:grid-cols-2 gap-12">
            {/* Upload Section */}
            <motion.div
              variants={leftColumnVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                <span className="mr-3">📸</span>
                Upload Inspiration
              </h3>
              <UploadArea 
                uploadedImage={uploadedImage}
                onImageClick={handleImageClick}
                isInView={isInView}
              />
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageUpload}
                className="hidden"
                aria-label="Upload inspiration image"
              />
            </motion.div>

            {/* Text Input Section */}
            <motion.div
              variants={rightColumnVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                <span className="mr-3">✍️</span>
                Describe Your Look
              </h3>
              <CustomTextArea 
                value={customRequest}
                onChange={handleTextChange}
                isInView={isInView}
              />
              <div className="mt-3 flex justify-between items-center text-sm">
                <span className="text-purple-300">
                  {customRequest.length}/500 characters
                </span>
                <span className={`${
                  hasContent ? 'text-green-400' : 'text-purple-400'
                }`}>
                  {hasContent ? '✓ Ready to submit' : 'Minimum 10 characters needed'}
                </span>
              </div>
            </motion.div>
          </div>

          {/* Submit Section */}
          <motion.div 
            className="mt-12 text-center"
            variants={bottomSectionVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <SubmitButton isInView={isInView} hasContent={hasContent} />
            
            <motion.p 
              className="mt-6 text-purple-200 text-lg"
              animate={isInView ? {
                color: ["#c4b5fd", "#a855f7", "#c4b5fd"]
              } : {}}
              transition={{
                duration: 3,
                repeat: isInView ? Infinity : 0,
                ease: "easeInOut"
              }}
            >
              Modern styling delivered to inbox within 24 hours
            </motion.p>

            {/* Additional info */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              {[
                { icon: '⚡', text: '24h Delivery' },
                { icon: '👥', text: 'Expert Stylists' },
                { icon: '✨', text: 'Unique Designs' }
              ].map((item, index) => (
                <motion.div
                  key={item.text}
                  className="flex items-center justify-center space-x-2 text-purple-200"
                  initial={{ opacity: 0, y: 10 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                  transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                >
                  <span className="text-2xl">{item.icon}</span>
                  <span className="font-medium">{item.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.form>
      </div>
    </motion.section>
  );
});
