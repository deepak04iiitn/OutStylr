import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  updateStart, 
  updateSuccess, 
  updateFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signOutStart,
  signoutSuccess,
  signOutFailure
} from '../redux/user/userSlice';

export default function Profile() {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({});
  const [updateUserSuccess, setUpdateUserSuccess] = useState(false);
  const [updateUserError, setUpdateUserError] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateUserError(null);
    setUpdateUserSuccess(false);

    if (Object.keys(formData).length === 0) {
      setUpdateUserError('No changes made');
      return;
    }

    try {
      dispatch(updateStart());
      const res = await fetch(`/backend/user/update/${currentUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        dispatch(updateFailure(data.message));
        setUpdateUserError(data.message);
      } else {
        dispatch(updateSuccess(data));
        setUpdateUserSuccess(true);
        setFormData({});
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
      setUpdateUserError(error.message);
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/backend/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(deleteUserFailure(data.message));
      } else {
        dispatch(deleteUserSuccess(data));
        navigate('/sign-in');
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignout = async () => {
    try {
      dispatch(signOutStart());
      const res = await fetch('/backend/user/signout', {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(signOutFailure(data.message));
      } else {
        dispatch(signoutSuccess(data));
        navigate('/sign-in');
      }
    } catch (error) {
      dispatch(signOutFailure(error.message));
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-16 px-4 sm:px-6 lg:px-8 mt-20">
      <motion.div 
        ref={ref}
        className="max-w-4xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        {/* Header Section */}
        <motion.div 
          className="text-center mb-12"
          variants={itemVariants}
        >
          <motion.h1 
            className="text-4xl lg:text-5xl font-black text-white mb-4"
            animate={{
              textShadow: [
                "0 0 20px rgba(147, 51, 234, 0.3)",
                "0 0 40px rgba(168, 85, 247, 0.4)",
                "0 0 20px rgba(147, 51, 234, 0.3)"
              ]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            Fashion Profile
          </motion.h1>
          <motion.p 
            className="text-xl text-purple-300 max-w-2xl mx-auto"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            Customize your style identity and manage your OutStylr experience
          </motion.p>
        </motion.div>

        {/* Main Profile Card */}
        <motion.div 
          className="bg-slate-800/60 backdrop-blur-xl rounded-[2rem] border border-purple-500/30 overflow-hidden"
          variants={itemVariants}
          style={{
            boxShadow: "0 25px 50px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(147, 51, 234, 0.2)"
          }}
          whileHover={{
            boxShadow: "0 35px 70px rgba(0, 0, 0, 0.6), 0 0 0 2px rgba(147, 51, 234, 0.3)"
          }}
        >
          <div className="relative p-8 lg:p-12">
            {/* Decorative Background Elements */}
            <motion.div
              className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-purple-500/20 to-transparent rounded-full blur-2xl"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Profile Form */}
            <form onSubmit={handleSubmit} className="space-y-8">

              {/* Form Fields Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Username */}
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-semibold text-purple-200 mb-3">
                    Username
                  </label>
                  <motion.input
                    type='text'
                    id='username'
                    placeholder='Username'
                    defaultValue={currentUser.username}
                    onChange={handleChange}
                    className="w-full px-4 py-4 bg-slate-700/50 border-2 border-purple-500/30 rounded-2xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 text-white placeholder-purple-300 transition-all duration-300 outline-none"
                    whileFocus={{ 
                      scale: 1.02,
                      boxShadow: "0 0 20px rgba(147, 51, 234, 0.3)"
                    }}
                  />
                </motion.div>

                {/* Full Name */}
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-semibold text-purple-200 mb-3">
                    Full Name
                  </label>
                  <motion.input
                    type='text'
                    id='fullName'
                    placeholder='Full Name'
                    defaultValue={currentUser.fullName}
                    onChange={handleChange}
                    className="w-full px-4 py-4 bg-slate-700/50 border-2 border-purple-500/30 rounded-2xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 text-white placeholder-purple-300 transition-all duration-300 outline-none"
                    whileFocus={{ 
                      scale: 1.02,
                      boxShadow: "0 0 20px rgba(147, 51, 234, 0.3)"
                    }}
                  />
                </motion.div>

                {/* Email */}
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-semibold text-purple-200 mb-3">
                    Email Address
                  </label>
                  <motion.input
                    type='email'
                    id='email'
                    placeholder='Email'
                    defaultValue={currentUser.email}
                    onChange={handleChange}
                    className="w-full px-4 py-4 bg-slate-700/50 border-2 border-purple-500/30 rounded-2xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 text-white placeholder-purple-300 transition-all duration-300 outline-none"
                    whileFocus={{ 
                      scale: 1.02,
                      boxShadow: "0 0 20px rgba(147, 51, 234, 0.3)"
                    }}
                  />
                </motion.div>

                {/* Gender */}
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-semibold text-purple-200 mb-3">
                    Gender
                  </label>
                  <motion.select
                    id='gender'
                    defaultValue={currentUser.gender}
                    onChange={handleChange}
                    className="w-full px-4 py-4 bg-slate-700/50 border-2 border-purple-500/30 rounded-2xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 text-white transition-all duration-300 outline-none"
                    whileFocus={{ 
                      scale: 1.02,
                      boxShadow: "0 0 20px rgba(147, 51, 234, 0.3)"
                    }}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </motion.select>
                </motion.div>

                {/* Password */}
                <motion.div className="lg:col-span-2" variants={itemVariants}>
                  <label className="block text-sm font-semibold text-purple-200 mb-3">
                    New Password (Leave blank to keep current)
                  </label>
                  <motion.input
                    type='password'
                    id='password'
                    placeholder='New Password'
                    onChange={handleChange}
                    className="w-full px-4 py-4 bg-slate-700/50 border-2 border-purple-500/30 rounded-2xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 text-white placeholder-purple-300 transition-all duration-300 outline-none"
                    whileFocus={{ 
                      scale: 1.02,
                      boxShadow: "0 0 20px rgba(147, 51, 234, 0.3)"
                    }}
                  />
                </motion.div>
              </div>

              {/* Action Buttons */}
              <motion.div 
                className="flex flex-col sm:flex-row flex-wrap gap-4 pt-8"
                variants={itemVariants}
              >
                {/* Update Button */}
                <motion.button
                  type='submit'
                  disabled={loading}
                  className="cursor-pointer flex-1 relative px-8 py-4 bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 text-white rounded-2xl font-bold text-lg overflow-hidden group disabled:opacity-70"
                  whileHover={{ 
                    scale: loading ? 1 : 1.02,
                    boxShadow: "0 25px 50px -12px rgba(147, 51, 234, 0.6)"
                  }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                >
                  {/* Shimmer Effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
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
                        Updating Profile...
                      </>
                    ) : (
                      <>
                        Update Profile
                        <motion.span 
                          className="ml-2"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          🔄
                        </motion.span>
                      </>
                    )}
                  </span>
                </motion.button>

                {/* Dashboard Button (Admin Only) */}
                {currentUser.isUserAdmin && (
                  <motion.button
                    type='button'
                    onClick={() => navigate('/dashboard')}
                    className="cursor-pointer px-8 py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-2xl font-semibold hover:from-emerald-700 hover:to-emerald-800 transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Admin Dashboard
                  </motion.button>
                )}

                {/* Sign Out Button */}
                <motion.button
                  type='button'
                  onClick={handleSignout}
                  className="cursor-pointer px-8 py-4 bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-2xl font-semibold hover:from-slate-700 hover:to-slate-800 transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Sign Out
                </motion.button>

                {/* Delete Account Button */}
                <motion.button
                  type='button'
                  onClick={() => setShowDeleteModal(true)}
                  className="cursor-pointer px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-2xl font-semibold hover:from-red-700 hover:to-red-800 transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Delete Account
                </motion.button>
              </motion.div>

              {/* Success/Error Messages */}
              <AnimatePresence>
                {updateUserSuccess && (
                  <motion.div 
                    className="bg-green-900/50 border-2 border-green-500/50 text-green-300 p-4 rounded-2xl text-center"
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <motion.span
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        ✅
                      </motion.span>
                      <span>Profile updated successfully!</span>
                    </div>
                  </motion.div>
                )}

                {updateUserError && (
                  <motion.div 
                    className="bg-red-900/50 border-2 border-red-500/50 text-red-300 p-4 rounded-2xl text-center"
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <motion.span
                        animate={{ rotate: [0, 15, -15, 0] }}
                        transition={{ duration: 0.5, repeat: 2 }}
                      >
                        ⚠️
                      </motion.span>
                      <span>{updateUserError}</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </div>
        </motion.div>
      </motion.div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDeleteModal(false)}
            />
            
            {/* Modal */}
            <motion.div
              className="fixed inset-0 flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="bg-slate-800/95 backdrop-blur-xl rounded-2xl p-8 border border-red-500/30 max-w-md w-full"
                style={{
                  boxShadow: "0 25px 50px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(239, 68, 68, 0.3)"
                }}
              >
                <motion.div 
                  className="text-center"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <div className="text-6xl mb-4">⚠️</div>
                  <h3 className="text-2xl font-bold text-white mb-4">Delete Account</h3>
                  <p className="text-gray-300 mb-8">
                    Are you sure you want to delete your account? This action cannot be undone and you will lose all your data.
                  </p>
                  
                  <div className="flex space-x-4">
                    <motion.button
                      onClick={() => setShowDeleteModal(false)}
                      className="cursor-pointer flex-1 px-6 py-3 bg-slate-600 text-white rounded-xl font-semibold hover:bg-slate-700 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      onClick={handleDeleteUser}
                      className="cursor-pointer flex-1 px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Delete
                    </motion.button>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
