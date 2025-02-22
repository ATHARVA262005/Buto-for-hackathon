import { motion } from 'framer-motion';
import { FaProjectDiagram, FaRobot, FaCode, FaTrophy } from 'react-icons/fa';

const steps = [
  {
    icon: <FaProjectDiagram className="text-5xl text-cyan-400" />,
    title: "Create Your Space",
    description: "Start by creating your project workspace and inviting team members to collaborate.",
    gradient: "from-cyan-500 to-blue-500"
  },
  {
    icon: <FaRobot className="text-5xl text-purple-400" />,
    title: "Chat with AI",
    description: "Interact with our AI assistant in your team chat. Share prompts and get intelligent responses.",
    gradient: "from-purple-500 to-pink-500"
  },
  {
    icon: <FaCode className="text-5xl text-blue-400" />,
    title: "Generate & Collaborate",
    description: "View AI-generated files in our three-column layout and collaborate with your team in real-time.",
    gradient: "from-blue-500 to-indigo-500"
  },
  {
    icon: <FaTrophy className="text-5xl text-amber-400" />,
    title: "Join Prompt Battles",
    description: "Participate in prompt battles, earn rankings, and mint your best prompts as NFTs.",
    gradient: "from-amber-500 to-orange-500"
  }
];

function HowItWorks() {
  return (
    <section className="py-32 px-6" id="how-it-works">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              How BUTO.ai Works
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Experience seamless AI-powered collaboration in four simple steps
          </p>
        </motion.div>

        {/* Step indicators */}
        <div className="hidden lg:flex justify-between mb-8 px-16">
          {steps.map((_, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center text-white font-bold">
                  {index + 1}
                </div>
                {index < steps.length - 1 && (
                  <div className="h-[2px] w-[calc(24rem-2.5rem)] bg-gradient-to-r from-cyan-500/50 to-blue-500/50" />
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <div className={`h-full bg-gray-800/50 rounded-2xl p-8 backdrop-blur-xl border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300`}>
                <div className={`mb-6 w-16 h-16 rounded-xl flex items-center justify-center bg-gradient-to-r ${step.gradient} bg-opacity-20`}>
                  {step.icon}
                </div>
                <h3 className="text-2xl font-semibold text-white mb-4">{step.title}</h3>
                <p className="text-gray-400">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
