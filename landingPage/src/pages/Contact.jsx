import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Navbar from '../components/Navigation/Navbar';
import Footer from '../components/Navigation/Footer';

const heroImg = "https://i.postimg.cc/05MFvXcB/image.png";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add form submission logic here
    console.log('Form submitted:', formData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        duration: 0.5
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="h-screen flex flex-col relative overflow-hidden"
      >
        {/* Simplified flares */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-purple-500/30 via-blue-500/20 to-transparent rounded-full blur-[140px] -z-10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-cyan-500/20 via-blue-500/20 to-purple-500/20 rounded-full blur-[160px] -z-10" />

        <Navbar />
        
        <main className="flex-grow bg-gray-900/30 backdrop-blur-3xl flex items-center">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          >
            <div className="grid md:grid-cols-2 gap-8 items-center">
              {/* Left side - Image with animation */}
              <motion.div
                variants={itemVariants}
                className="relative hidden md:block"
              >
                <motion.img
                  src={heroImg}
                  alt="Contact illustration"
                  className="w-full max-h-[450px] object-contain"
                  whileHover={{ scale: 1.03 }}
                  transition={{ type: "spring", stiffness: 300 }}
                />
              </motion.div>

              {/* Right side - Animated form */}
              <motion.div
                variants={itemVariants}
                className="p-6 rounded-lg backdrop-blur-sm border border-gray-700/50 relative"
                whileHover={{ boxShadow: "0 0 25px rgba(0,255,255,0.1)" }}
              >
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-cyan-500/5 to-blue-500/5 rounded-lg" />
                <motion.div 
                  className="relative"
                  variants={containerVariants}
                >
                  <motion.h1 
                    variants={itemVariants}
                    className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-3"
                  >
                    Get in Touch
                  </motion.h1>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Form fields wrapped with motion.div and variants */}
                    <motion.div variants={itemVariants} className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                          Name
                        </label>
                        <motion.input
                          whileFocus={{ scale: 1.01 }}
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full px-3 py-2 rounded-lg bg-gray-700/50 border border-gray-600 text-white focus:outline-none focus:border-cyan-500"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                          Email
                        </label>
                        <motion.input
                          whileFocus={{ scale: 1.01 }}
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-3 py-2 rounded-lg bg-gray-700/50 border border-gray-600 text-white focus:outline-none focus:border-cyan-500"
                          required
                        />
                      </div>
                    </motion.div>
                    <motion.div variants={itemVariants}>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1">
                        Phone Number
                      </label>
                      <motion.input
                        whileFocus={{ scale: 1.01 }}
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded-lg bg-gray-700/50 border border-gray-600 text-white focus:outline-none focus:border-cyan-500"
                      />
                    </motion.div>
                    <motion.div variants={itemVariants}>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">
                        Message
                      </label>
                      <motion.textarea
                        whileFocus={{ scale: 1.01 }}
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows="3"
                        className="w-full px-3 py-2 rounded-lg bg-gray-700/50 border border-gray-600 text-white focus:outline-none focus:border-cyan-500"
                        required
                      />
                    </motion.div>
                    <motion.button
                      variants={itemVariants}
                      whileHover={{ scale: 1.02, boxShadow: "0 0 15px rgba(0,255,255,0.2)" }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="w-full px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-medium"
                    >
                      Send Message
                    </motion.button>
                  </form>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </main>

        <Footer />
      </motion.div>
    </AnimatePresence>
  );
};

export default Contact;

