import React from 'react';
import Navbar from "../components/Navigation/Navbar";
import Footer from '../components/Navigation/Footer';
import { motion } from 'framer-motion';
import { FiArrowRight, FiCode, FiUsers, FiTarget, FiAward, FiCpu, FiCloud, FiDatabase, FiMonitor, FiEye, FiTerminal, FiMessageSquare, FiGitBranch } from 'react-icons/fi';

function About() {
  return (
    <div className="bg-[#0F172A] text-white">
      <Navbar />
      <main className="pt-20">
        {/* Hero Section with Glassmorphism */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-3xl"></div>
            <div className="absolute -top-1/2 -right-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-1/2 -left-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl"></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center space-y-8"
            >
              <h1 className="text-6xl md:text-8xl font-bold">
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
                  We Are ButoAI
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Crafting the future of AI-powered solutions with innovation and creativity
              </p>
            </motion.div>
          </div>
        </div>

        {/* Mission Statement */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8"
        >
          <div className="bg-gradient-to-br from-[#1E293B] to-[#0F172A] p-8 rounded-2xl border border-gray-800/50">
            <h2 className="text-3xl font-bold mb-6">Our Mission & Vision</h2>
            <div className="space-y-6 text-gray-300">
              <p className="leading-relaxed">
                At ButoAI, we're driven by a singular vision: to democratize artificial intelligence and make it accessible to businesses of all sizes. Our journey began with the belief that AI shouldn't be confined to tech giants and Fortune 500 companies.
              </p>
              <p className="leading-relaxed">
                We're committed to breaking down the barriers that traditionally separate businesses from cutting-edge AI solutions. Through our innovative platform, we're empowering organizations to harness the full potential of artificial intelligence, regardless of their technical expertise.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="py-16 bg-gradient-to-b from-[#1E293B]/50 to-transparent"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { number: '500+', label: 'Clients' },
                { number: '95%', label: 'Satisfaction' },
                { number: '24/7', label: 'Support' },
                { number: '50+', label: 'Countries' },
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="text-4xl md:text-5xl font-bold text-blue-400"
                  >
                    {stat.number}
                  </motion.div>
                  <div className="text-gray-400 mt-2">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Journey Section - New Addition */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8"
        >
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">Our Journey</h2>
              <div className="space-y-4 text-gray-300">
                <p>Founded in 2023, ButoAI emerged from a simple yet powerful idea: that artificial intelligence should be intuitive, accessible, and transformative for every business.</p>
                <p>Our team of dedicated AI specialists, engineers, and industry experts works tirelessly to develop solutions that not only meet but exceed the evolving needs of modern businesses.</p>
                <p>Today, we're proud to serve clients across multiple industries, helping them leverage AI to drive innovation, efficiency, and growth.</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { year: '2023', event: 'Company Founded' },
                { year: '2023', event: 'First AI Product Launch' },
                { year: '2024', event: 'Global Expansion' },
                { year: 'Future', event: 'Continuous Innovation' },
              ].map((milestone, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  className="p-6 bg-gradient-to-br from-blue-600/10 to-purple-600/10 rounded-xl border border-gray-800/50"
                >
                  <div className="text-xl font-bold text-blue-400">{milestone.year}</div>
                  <div className="text-gray-300">{milestone.event}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Values Section */}
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Core Values</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              These principles guide every decision we make and shape the solutions we deliver to our clients.
            </p>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {[
              { icon: <FiCode />, title: 'Innovation', description: 'Pushing boundaries with cutting-edge AI solutions' },
              { icon: <FiUsers />, title: 'Community', description: 'Building strong relationships with our users' },
              { icon: <FiTarget />, title: 'Precision', description: 'Delivering accurate and reliable results' },
              { icon: <FiAward />, title: 'Excellence', description: 'Maintaining the highest standards in AI' },
            ].map((value, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -10 }}
                className="group relative p-8 rounded-2xl bg-gradient-to-b from-[#1E293B] to-[#0F172A] border border-gray-800/50"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative space-y-4">
                  <span className="text-3xl text-blue-400">{value.icon}</span>
                  <h3 className="text-xl font-semibold">{value.title}</h3>
                  <p className="text-gray-400">{value.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Technology Stack - Creative Version */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8"
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
              Our Technology Stack
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Powering the future with cutting-edge AI technologies
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <FiCpu className="text-4xl" />,
                title: 'Machine Learning',
                description: 'Advanced algorithms that learn and adapt',
                color: 'from-blue-500 to-purple-500'
              },
              {
                icon: <FiMessageSquare className="text-4xl" />,
                title: 'Natural Language',
                description: 'Processing human language with precision',
                color: 'from-purple-500 to-pink-500'
              },
              {
                icon: <FiEye className="text-4xl" />,
                title: 'Computer Vision',
                description: 'Seeing and understanding visual data',
                color: 'from-pink-500 to-red-500'
              },
              {
                icon: <FiMonitor className="text-4xl" />,
                title: 'Deep Learning',
                description: 'Neural networks that mimic human brain',
                color: 'from-red-500 to-orange-500'
              },
              {
                icon: <FiDatabase className="text-4xl" />,
                title: 'Big Data',
                description: 'Processing massive data sets efficiently',
                color: 'from-orange-500 to-yellow-500'
              },
              {
                icon: <FiCloud className="text-4xl" />,
                title: 'Cloud Computing',
                description: 'Scalable cloud-native solutions',
                color: 'from-yellow-500 to-green-500'
              },
              {
                icon: <FiTerminal className="text-4xl" />,
                title: 'API Integration',
                description: 'Seamless system interconnectivity',
                color: 'from-green-500 to-teal-500'
              },
              {
                icon: <FiGitBranch className="text-4xl" />,
                title: 'DevOps',
                description: 'Continuous integration and deployment',
                color: 'from-teal-500 to-blue-500'
              }
            ].map((tech, index) => (
              <motion.div
                key={index}
                initial={{ y: 20 }}
                whileInView={{ y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ 
                  y: -10,
                  transition: { duration: 0.2 }
                }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl blur-xl"
                     style={{ background: `linear-gradient(to right, var(--tw-gradient-stops))` }}>
                </div>
                <div className={`relative h-full bg-gradient-to-br ${tech.color} p-[1px] rounded-2xl group-hover:p-[2px] transition-all duration-300`}>
                  <div className="h-full bg-[#0F172A] rounded-2xl p-6 backdrop-blur-xl">
                    <div className="flex flex-col items-center space-y-4">
                      <div className="text-white group-hover:scale-110 transform transition-transform duration-300">
                        {tech.icon}
                      </div>
                      <h3 className="text-xl font-semibold text-white">{tech.title}</h3>
                      <p className="text-gray-400 text-center text-sm">
                        {tech.description}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8"
        >
          <div className="relative rounded-2xl overflow-hidden">
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-xl"></div>
            </div>
            <div className="relative py-16 px-8 text-center space-y-8">
              <h2 className="text-4xl font-bold">Ready to Get Started?</h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Join us in shaping the future of AI technology
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center px-8 py-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold space-x-2 hover:from-blue-600 hover:to-purple-600 transition-all"
              >
                <span>Start Your Journey</span>
                <FiArrowRight />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}

export default About;

