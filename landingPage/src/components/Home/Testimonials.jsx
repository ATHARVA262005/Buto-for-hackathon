import { motion } from 'framer-motion';

const testimonials = [
  {
    name: "Alex Thompson",
    role: "Tech Lead",
    company: "CodeStack Solutions",
    image: "https://randomuser.me/api/portraits/men/42.jpg",
    text: "BUTO.ai's three-column layout and AI assistant have transformed our team's workflow. The ability to instantly generate and organize code while maintaining team chat is incredible.",
    gradient: "from-cyan-500 to-blue-500"
  },
  {
    name: "Sophia Patel",
    role: "Prompt Engineer",
    company: "AI Innovations",
    image: "https://randomuser.me/api/portraits/women/36.jpg",
    text: "The Prompt Battle feature is revolutionary! I've not only improved my prompting skills but also earned NFTs for my top-ranked prompts. The community engagement is amazing.",
    gradient: "from-purple-500 to-pink-500"
  },
  {
    name: "David Kim",
    role: "Project Manager",
    company: "DevSync",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    text: "Managing multiple projects has never been easier. The voice search and history tracking features save us hours, and the AI assistant understands our project context perfectly.",
    gradient: "from-blue-500 to-indigo-500"
  }
];

function Testimonials() {
  return (
    <section className="py-32 px-6 bg-gradient-to-b from-gray-900/50 to-transparent">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Trusted by Developers
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Join thousands of developers building better projects with BUTO.ai
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="relative bg-gray-800/30 p-8 rounded-2xl backdrop-blur-xl border border-gray-700/50"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${testimonial.gradient} opacity-5 rounded-2xl`} />
              <div className="flex items-center mb-6">
                <div className={`w-12 h-12 rounded-full p-0.5 bg-gradient-to-r ${testimonial.gradient}`}>
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-full h-full rounded-full border-2 border-gray-900"
                  />
                </div>
                <div className="ml-4">
                  <h4 className="text-xl font-semibold text-white">{testimonial.name}</h4>
                  <p className="text-gray-400">
                    {testimonial.role} · {testimonial.company}
                  </p>
                </div>
              </div>
              <p className="text-gray-300 leading-relaxed relative z-10">
                "{testimonial.text}"
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
