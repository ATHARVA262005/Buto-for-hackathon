import { motion } from 'framer-motion';
import { FaProjectDiagram, FaBrain, FaBookmark, FaHistory } from 'react-icons/fa';

const features = [
  {
    title: "Project-Based Collaboration",
    description: "Create dedicated project spaces and invite team members as collaborators.",
    icon: <FaProjectDiagram className="text-7xl text-cyan-400/80" />,
    gradient: "from-cyan-400/20 to-cyan-600/20"
  },
  {
    title: "Context-Aware AI Assistant",
    description: "Simply use @ai in your chat to get intelligent responses.",
    icon: <FaBrain className="text-7xl text-purple-400/80" />,
    gradient: "from-purple-400/20 to-purple-600/20"
  },
  {
    title: "Smart Prompt Bookmarking",
    description: "Save and share effective prompts with your team.",
    icon: <FaBookmark className="text-7xl text-blue-400/80" />,
    gradient: "from-blue-400/20 to-blue-600/20"
  },
  {
    title: "Project History",
    description: "Access your complete project history or focus on specific conversations.",
    icon: <FaHistory className="text-7xl text-green-400/80" />,
    gradient: "from-green-400/20 to-green-600/20"
  },
];

function Features() {
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (index) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: 0.1 * index,
        ease: "easeOut"
      }
    })
  };

  return (
    <section className="min-h-screen bg-gray-950 py-32">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-24"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Powerful Features
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Experience the next generation of team collaboration with our cutting-edge features
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              custom={index}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              className={`group relative overflow-hidden p-8 rounded-3xl backdrop-blur-xl 
                bg-gradient-to-br ${feature.gradient} border border-gray-800/50 
                hover:border-gray-700/50 transition-all duration-500`}
            >
              {/* Background Glow Effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} blur-3xl scale-150 opacity-20`} />
              </div>

              <div className="relative flex flex-col h-full space-y-6">
                <motion.div 
                  className="bg-gray-900/50 p-4 rounded-2xl w-fit group-hover:bg-gray-900/70 
                    transition-colors duration-300 relative overflow-hidden"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  {feature.icon}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent 
                    translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                </motion.div>
                
                <h3 className="text-2xl font-semibold text-white group-hover:text-gray-200 transition-colors">
                  {feature.title}
                </h3>
                
                <p className="text-gray-400 text-lg leading-relaxed group-hover:text-gray-300 transition-colors">
                  {feature.description}
                </p>

                <motion.div 
                  className="mt-auto flex items-center text-gray-300 group-hover:text-white cursor-pointer"
                  whileHover={{ x: 5 }}
                >
                  Learn more 
                  <svg 
                    className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;
