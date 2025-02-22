import React, { useState } from 'react';
import Navbar from "../components/Navigation/Navbar";
import Footer from '../components/Navigation/Footer';
import { motion } from 'framer-motion';
import { FiCalendar, FiMapPin, FiClock, FiTag, FiUsers, FiArrowRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { events, featuredEvent } from '../data/event';

const slugify = (text) => {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
};

const EventSection = ({ event }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="relative min-h-[60vh] flex items-center"
  >
    {/* Background with parallax effect */}
    <motion.div 
      className="absolute inset-0 overflow-hidden"
      initial={{ scale: 1.1 }}
      whileInView={{ scale: 1 }}
      transition={{ duration: 1 }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A]/95 via-[#0F172A]/80 to-transparent z-10" />
      <img
        src={event.image}
        alt={event.title}
        className="w-full h-full object-cover"
      />
    </motion.div>

    {/* Content */}
    <div className="relative z-20 max-w-7xl mx-auto px-4 w-full">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          {/* Category Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 backdrop-blur-md"
          >
            <span className="text-sm font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              {event.category}
            </span>
          </motion.div>

          {/* Title and Description */}
          <div className="space-y-4">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl font-bold"
            >
              {event.title}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-gray-300 text-lg"
            >
              {event.description}
            </motion.p>
          </div>

          {/* Event Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap gap-6"
          >
            <div className="flex items-center gap-2 text-gray-300">
              <div className="p-2 rounded-lg bg-cyan-500/10">
                <FiCalendar className="text-cyan-400" />
              </div>
              {event.date}
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <FiMapPin className="text-purple-400" />
              </div>
              {event.location}
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <FiUsers className="text-blue-400" />
              </div>
              {event.attendees}+ Attendees
            </div>
          </motion.div>

          {/* Action Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Link to={event.customUrl || `/events/${slugify(event.title)}`}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group relative px-8 py-4 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl" />
                <div className="relative flex items-center gap-2 text-white font-semibold">
                  Enter Battle
                  <FiArrowRight className="transition-transform group-hover:translate-x-1" />
                </div>
              </motion.button>
            </Link>
          </motion.div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="p-6 rounded-xl bg-gradient-to-br from-cyan-500/10 to-transparent border border-cyan-500/20 backdrop-blur-sm"
          >
            <div className="text-3xl font-bold text-cyan-400">$1,750</div>
            <div className="text-gray-400">Prize Pool</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="p-6 rounded-xl bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-500/20 backdrop-blur-sm"
          >
            <div className="text-3xl font-bold text-purple-400">25</div>
            <div className="text-gray-400">Days Left</div>
          </motion.div>
        </div>
      </div>
    </div>
  </motion.div>
);

const Events = () => {
  const [filter, setFilter] = useState('all');
  
  // Simplified filter options since we only have one event
  const filterOptions = ['all'];
  const filteredEvents = filter === 'all' ? events : events.filter(event => event.type === filter);

  const cardVariants = {
    hidden: { 
      opacity: 0,
      y: 20
    },
    visible: { 
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        duration: 0.4,
        damping: 15
      }
    }
  };

  return (
    <div className="bg-[#0F172A] text-white min-h-screen">
      <Navbar />
      <main className="pt-20">
        {/* Hero Section with Featured Event */}
        <div className="relative">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-b from-blue-600/20 via-purple-600/20 to-[#0F172A] backdrop-blur-3xl"></div>
          </div>
          <div className="relative max-w-7xl mx-auto px-4 py-24">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid lg:grid-cols-2 gap-12 items-center"
            >
              <div className="space-y-6">
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm"
                >
                  <FiCalendar className="mr-2" /> Featured Event
                </motion.div>
                <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                  {featuredEvent.title}
                </h1>
                <p className="text-xl text-gray-300">
                  {featuredEvent.description}
                </p>
                <div className="flex flex-wrap gap-6 text-gray-300">
                  <div className="flex items-center gap-2">
                    <FiCalendar /> {featuredEvent.date}
                  </div>
                  <div className="flex items-center gap-2">
                    <FiClock /> {featuredEvent.time}
                  </div>
                  <div className="flex items-center gap-2">
                    <FiUsers /> {featuredEvent.attendees}+ Attendees
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl font-semibold group"
                >
                  Register Now
                  <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </div>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="relative aspect-video"
              >
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-cyan-500/10 rounded-2xl blur-2xl"></div>
                <img 
                  src={featuredEvent.image}
                  alt={featuredEvent.title}
                  className="relative w-full h-full object-cover rounded-2xl shadow-2xl"
                />
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Event Filters */}
        <div className="sticky top-20 z-10 bg-[#0F172A]/80 backdrop-blur-xl border-y border-gray-800/50">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Live Events</h2>
              <div className="flex gap-2">
                {filterOptions.map((type) => (
                  <motion.button
                    key={type}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setFilter(type)}
                    className={`px-4 py-2 rounded-lg ${
                      filter === type 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white' 
                        : 'bg-gray-800/50 text-gray-300 hover:bg-gray-800'
                    } transition-all capitalize text-sm`}
                  >
                    {type}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Replace Events Grid with new EventSection */}
        <div className="py-16 space-y-24">
          {filteredEvents.map((event) => (
            <EventSection key={event.id} event={event} />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Events;
