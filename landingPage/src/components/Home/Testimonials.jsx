import { motion } from 'framer-motion';

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Lead Developer",
    company: "TechFlow",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    text: "ButoAI has revolutionized our development process. The AI integration is seamless and incredibly helpful.",
  },
  {
    name: "Michael Rodriguez",
    role: "Engineering Manager",
    company: "DevCorp",
    image: "https://randomuser.me/api/portraits/men/47.jpg",
    text: "The collaborative features and AI assistance have boosted our team's productivity significantly.",
  },
  {
    name: "Emily Park",
    role: "CTO",
    company: "InnovateTech",
    image: "https://randomuser.me/api/portraits/women/32.jpg",
    text: "A game-changer for our development workflow. The AI suggestions are surprisingly accurate and helpful.",
  },
];

function Testimonials() {
  return (
    <section className="py-32 px-6 bg-gray-900/50">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Loved by Developers
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            See what our users have to say about ButoAI
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="bg-gray-800/30 p-8 rounded-2xl backdrop-blur-xl border border-gray-700/50"
            >
              <div className="flex items-start mb-6">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <h4 className="text-xl font-semibold text-white">{testimonial.name}</h4>
                  <p className="text-gray-400">{testimonial.role} at {testimonial.company}</p>
                </div>
              </div>
              <p className="text-gray-300 leading-relaxed">{testimonial.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
