import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function WhatsAppBot({ showWhatsApp, setShowWhatsApp }) {
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
      <motion.button
        className="cursor-pointer fixed bottom-6 right-6 w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white text-2xl shadow-lg z-50"
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

      <AnimatePresence>
        {showWhatsApp && (
          <motion.div
            className="fixed bottom-24 right-6 w-96 h-[500px] bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl z-50 border border-purple-500/20 flex flex-col"
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ duration: 0.3 }}
          >
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