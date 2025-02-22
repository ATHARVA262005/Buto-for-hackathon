import { motion } from 'framer-motion';

const heroImg = "https://i.postimg.cc/05MFvXcB/image.png";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 py-4 overflow-hidden">
      {/* Glare Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/4 w-[500px] h-[500px] bg-blue-500/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/2 -left-1/4 w-[500px] h-[500px] bg-purple-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/4 left-1/3 w-[300px] h-[300px] bg-cyan-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <h1 className="text-6xl font-bold leading-tight">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Transform Your Development
            </span>
            <br />
            <span className="text-white">With AI-Powered Collaboration</span>
          </h1>
          
          <p className="text-xl text-gray-400 leading-relaxed">
            Create, collaborate, and code together with the power of AI. 
            Streamline your development workflow and boost productivity.
          </p>

          <div className="flex gap-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl text-white font-semibold"
            >
              Get Started Free
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 border border-gray-700 hover:border-gray-600 rounded-xl text-white font-semibold"
            >
              Watch Demo
            </motion.button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          {/* Image Glare Effect */}
          <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-cyan-500/10 rounded-2xl blur-2xl"></div>
          <img 
            src={heroImg} 
            alt="AI Collaboration Platform" 
            className="relative w-full h-auto rounded-2xl shadow-2xl"
          />
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-blue-500/10 via-transparent to-purple-500/10"></div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
