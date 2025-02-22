import { motion } from 'framer-motion';

function CTA() {
  return (
    <section className="py-32 px-6">
      <motion.div 
        className="max-w-7xl mx-auto text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-12 rounded-3xl border border-gray-700/50 backdrop-blur-xl">
          <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            Ready to Transform Your Development Workflow?
          </h2>
          
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
            Join thousands of developers who are already using ButoAI to streamline their development process.
          </p>

          <div className="flex flex-col md:flex-row gap-6 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl text-white font-semibold text-lg"
              onClick={() => window.open('http://localhost:5173', '_blank')}
            >
              Get Started Free
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gray-800 rounded-xl text-white font-semibold text-lg hover:bg-gray-700 transition-colors"
            >
              Schedule Demo
            </motion.button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

export default CTA;
