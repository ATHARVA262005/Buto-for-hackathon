import { motion } from 'framer-motion';

const Features = () => {
  const features = [
    {
      title: "AI-Powered Project Management",
      description: "Create and manage unlimited projects with an intuitive interface. Add collaborators, set permissions, and organize your workspace efficiently.",
      icon: "🚀",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      title: "Team Chat & AI Assistant",
      description: "Collaborate in real-time with team chat and get intelligent responses from our AI assistant. Share context and maintain project-specific conversations.",
      icon: "💬",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      title: "Smart File Generation",
      description: "View AI-generated files in our three-column layout. Generated code and content is automatically organized and easily accessible.",
      icon: "📂",
      gradient: "from-green-500 to-teal-500"
    },
    {
      title: "Prompt Bookmarking",
      description: "Learn from the community by accessing curated prompts. Save and organize effective prompts for future use.",
      icon: "🔖",
      gradient: "from-orange-500 to-yellow-500"
    },
    {
      title: "Voice Search Integration",
      description: "Search through your projects and prompts using voice commands for a hands-free experience.",
      icon: "🎤",
      gradient: "from-red-500 to-pink-500"
    },
    {
      title: "History Management",
      description: "Access project-wise and session-wise history. Track changes and maintain context across your development process.",
      icon: "📅",
      gradient: "from-indigo-500 to-purple-500"
    }
  ];

  return (
    <section className="py-20 px-6" id="features">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-16 space-y-4"
        >
          <h2 className="text-4xl font-bold">
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Powerful Features
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Everything you need to build and collaborate with your team using AI assistance
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -5 }}
              transition={{ delay: index * 0.1 }}
              className="p-6 rounded-xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 hover:border-gray-600/50 transition-all"
            >
              <div className={`text-4xl mb-4 w-12 h-12 rounded-lg flex items-center justify-center bg-gradient-to-r ${feature.gradient} bg-opacity-20`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                {feature.title}
              </h3>
              <p className="text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
