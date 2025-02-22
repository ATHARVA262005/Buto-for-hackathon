import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from "../components/Navigation/Navbar";
import Footer from '../components/Navigation/Footer';
import { motion } from 'framer-motion';
import { FiCalendar, FiMapPin, FiClock, FiUsers, FiArrowLeft, FiShare2, FiBookmark, FiAward, FiThumbsUp, FiCopy, FiPlus } from 'react-icons/fi';
import { events } from '../data/event';
import { prompts, participants, userVotes } from '../data/prompts';

const PromptCard = ({ prompt, onUpvote, hasVoted }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-[#1E293B]/80 backdrop-blur-xl rounded-xl p-6 border border-gray-800/50"
  >
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <span className="text-xs text-blue-400 uppercase tracking-wider">{prompt.category}</span>
          <h3 className="text-lg font-semibold text-white">{prompt.prompt}</h3>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onUpvote(prompt.id)}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
            hasVoted 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          <FiThumbsUp size={14} />
          <span>{prompt.upvotes}</span>
        </motion.button>
      </div>
      
      <div className="bg-gray-900/50 rounded-lg p-4">
        <pre className="text-sm text-gray-300 whitespace-pre-wrap">{prompt.example}</pre>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-400">
          {new Date(prompt.timestamp).toLocaleDateString()}
        </div>
        <div className="flex gap-2">
          <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
            <FiCopy size={14} />
          </button>
          <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
            <FiShare2 size={14} />
          </button>
        </div>
      </div>
    </div>
  </motion.div>
);

const Leaderboard = ({ participants }) => (
  <div className="bg-[#1E293B]/80 backdrop-blur-xl rounded-xl p-6 border border-gray-800/50">
    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
      <FiAward className="text-yellow-500" /> Leaderboard
    </h2>
    <div className="space-y-4">
      {participants
        .sort((a, b) => b.totalUpvotes - a.totalUpvotes)
        .slice(0, 10)
        .map((participant, index) => (
          <motion.div
            key={participant.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-800/50"
          >
            <div className={`w-8 h-8 flex items-center justify-center rounded-full ${
              index === 0 ? 'bg-yellow-500' :
              index === 1 ? 'bg-gray-400' :
              index === 2 ? 'bg-orange-600' :
              'bg-gray-700'
            }`}>
              {index + 1}
            </div>
            <img src={participant.avatar} alt={participant.name} className="w-10 h-10 rounded-full" />
            <div className="flex-1">
              <h3 className="font-semibold">{participant.name}</h3>
              <p className="text-sm text-gray-400">{participant.promptsSubmitted} prompts</p>
            </div>
            <div className="flex items-center gap-1 text-blue-400">
              <FiThumbsUp size={14} />
              {participant.totalUpvotes}
            </div>
          </motion.div>
        ))}
    </div>
  </div>
);

const EventDetails = () => {
  const { title } = useParams();
  const navigate = useNavigate();
  const [userPromptVotes, setUserPromptVotes] = useState(userVotes);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const slugify = (text) => {
    return text
      ?.toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-');
  };

  useEffect(() => {
    const findEvent = () => {
      const foundEvent = events.find(event => slugify(event.title) === title);
      
      if (!foundEvent) {
        navigate('/404');
        return;
      }

      // If it's a prompt battle, redirect to the dedicated page
      if (foundEvent.customUrl) {
        navigate(foundEvent.customUrl);
        return;
      }

      setCurrentEvent(foundEvent);
      setIsLoading(false);
    };

    findEvent();
  }, [title, navigate]);

  if (isLoading || !currentEvent) {
    return null;
  }

  const handleUpvote = (promptId) => {
    const userId = 1; // In a real app, this would come from auth
    const voteKey = `${userId}_${promptId}`;
    setUserPromptVotes(prev => ({
      ...prev,
      [voteKey]: !prev[voteKey]
    }));
  };

  const renderEventContent = () => {
    if (currentEvent.eventType === 'promptBattle') {
      return (
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold">Prompt Submissions</h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl font-semibold flex items-center gap-2"
              >
                <FiPlus /> Submit Prompt
              </motion.button>
            </div>
            
            <div className="space-y-6">
              {prompts
                .sort((a, b) => b.upvotes - a.upvotes)
                .map(prompt => (
                  <PromptCard
                    key={prompt.id}
                    prompt={prompt}
                    onUpvote={handleUpvote}
                    hasVoted={userPromptVotes[`1_${prompt.id}`]}
                  />
                ))}
            </div>
          </div>
          
          <div className="space-y-8">
            <Leaderboard participants={participants} />
            <div className="bg-[#1E293B]/80 backdrop-blur-xl rounded-xl p-6 border border-gray-800/50">
              <h2 className="text-xl font-bold mb-4">Prize Pool</h2>
              <div className="space-y-4">
                {currentEvent.prizes.map((prize, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 flex items-center justify-center rounded-full ${
                        index === 0 ? 'bg-yellow-500' :
                        index === 1 ? 'bg-gray-400' :
                        'bg-orange-600'
                      }`}>
                        #{prize.position}
                      </div>
                      <span>{prize.prize}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#1E293B]/80 backdrop-blur-xl rounded-xl p-6 border border-gray-800/50">
              <h2 className="text-xl font-bold mb-4">Rules</h2>
              <ul className="space-y-3">
                {currentEvent.rules.map((rule, index) => (
                  <li key={index} className="flex items-start gap-2 text-gray-300">
                    <span className="text-blue-400">•</span>
                    {rule}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      );
    }

    // Regular event content with safety checks
    return (
      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          {/* Schedule Section */}
          {currentEvent.schedule && (
            <section className="space-y-6">
              <h2 className="text-3xl font-bold">Event Schedule</h2>
              <div className="space-y-4">
                {currentEvent.schedule.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start p-4 bg-[#1E293B] rounded-xl"
                  >
                    <div className="text-blue-400 font-semibold min-w-[100px]">{item.time}</div>
                    <div>{item.title}</div>
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {/* Speakers Section */}
          {currentEvent.speakers && (
            <section className="space-y-6">
              <h2 className="text-3xl font-bold">Speakers</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {currentEvent.speakers.map((speaker, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-6 bg-[#1E293B] rounded-xl space-y-2"
                  >
                    <h3 className="text-xl font-semibold">{speaker.name}</h3>
                    <p className="text-gray-400">{speaker.role}</p>
                    <p className="text-blue-400">{speaker.company}</p>
                  </motion.div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="sticky top-24">
            <div className="p-6 bg-[#1E293B] rounded-xl space-y-6">
              <div className="flex justify-between">
                <button className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors">
                  <FiShare2 />
                </button>
                <button className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors">
                  <FiBookmark />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3 text-gray-300">
                  <FiCalendar />
                  <span>{currentEvent.date}</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-300">
                  <FiClock />
                  <span>{currentEvent.time}</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-300">
                  <FiMapPin />
                  <span>{currentEvent.location}</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-300">
                  <FiUsers />
                  <span>{currentEvent.attendees}+ Attendees</span>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl font-semibold"
              >
                Register Now
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-[#0F172A] text-white min-h-screen">
      <Navbar />
      <main className="pt-20">
        <div className="relative h-[60vh] overflow-hidden">
          <div className="absolute inset-0">
            <img 
              src={currentEvent.image} 
              alt={currentEvent.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0F172A]/50 via-[#0F172A]/70 to-[#0F172A]"></div>
          </div>
          
          <div className="relative max-w-7xl mx-auto px-4 h-full flex items-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl space-y-6"
            >
              <button 
                onClick={() => navigate('/events')}
                className="flex items-center text-gray-400 hover:text-white transition-colors"
              >
                <FiArrowLeft className="mr-2" /> Back to Events
              </button>
              <h1 className="text-5xl font-bold">{currentEvent.title}</h1>
              <p className="text-xl text-gray-300">{currentEvent.description}</p>
            </motion.div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-16">
          {renderEventContent()}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default EventDetails;
