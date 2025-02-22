import { motion } from 'framer-motion';
import { FaProjectDiagram, FaUsers, FaRobot } from 'react-icons/fa';

const steps = [
  {
    icon: <FaProjectDiagram className="text-5xl text-cyan-400" />,
    title: "Create Project Space",
    description: "Set up a dedicated workspace for your team and projects in seconds.",
  },
  {
    icon: <FaUsers className="text-5xl text-purple-400" />,
    title: "Invite Your Team",
    description: "Add team members and assign roles with simple collaboration tools.",
  },
  {
    icon: <FaRobot className="text-5xl text-blue-400" />,
    title: "AI Integration",
    description: "Leverage AI assistance for enhanced productivity and problem-solving.",
  },
];

function HowItWorks() {
  return (
    <section className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            How It Works
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Get started with ButoAI in three simple steps
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="relative"
            >
              <div className="bg-gray-800/50 rounded-2xl p-8 backdrop-blur-xl border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300">
                <div className="mb-6">{step.icon}</div>
                <h3 className="text-2xl font-semibold text-white mb-4">{step.title}</h3>
                <p className="text-gray-400">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 text-gray-600 text-4xl">
                  →
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
