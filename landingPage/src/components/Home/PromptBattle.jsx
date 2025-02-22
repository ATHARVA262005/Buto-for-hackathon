import { motion } from 'framer-motion';

const PromptBattle = () => {
  return (
    <section className="py-20 px-6 bg-gradient-to-b from-transparent to-gray-900/50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-6">
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Prompt Battle
            </span>
          </h2>
          <p className="text-xl text-gray-400">Compete, Win, and Mint Your Prompts as NFTs</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="p-6 rounded-xl bg-gray-800/50 backdrop-blur-sm"
          >
            <h3 className="text-xl font-semibold mb-4">Compete</h3>
            <p className="text-gray-400">Submit your best prompts and gather upvotes from the community</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 rounded-xl bg-gray-800/50 backdrop-blur-sm"
          >
            <h3 className="text-xl font-semibold mb-4">Top 50 Ranking</h3>
            <p className="text-gray-400">Reach the leaderboard and earn the right to mint your prompts</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="p-6 rounded-xl bg-gray-800/50 backdrop-blur-sm"
          >
            <h3 className="text-xl font-semibold mb-4">NFT Marketplace</h3>
            <p className="text-gray-400">Trade your ranked prompts as unique NFTs in our marketplace</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PromptBattle;
