import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Navbar = () => {
  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="w-full z-50 fixed top-0 left-0 backdrop-blur-lg bg-gray-900/50 border-b border-gray-800/50"
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            ButoAI
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/about">About</NavLink>
            <NavLink to="http://localhost:5174" >
              <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                Prompt Battle
              </span>
            </NavLink>
            <NavLink to="/contact">Contact</NavLink>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="http://localhost:5173"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg"
              >
                Get Started
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

const NavLink = ({ to, children }) => {
  const isExternal = /^(http|https):\/\//.test(to);
  if (isExternal) {
    return (
      <a 
        href={to} 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-gray-300 hover:text-white transition-colors relative group"
      >
        {children}
        <motion.span 
          className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-400 group-hover:w-full transition-all duration-300"
        />
      </a>
    );
  }
  return (
    <Link 
      to={to} 
      className="text-gray-300 hover:text-white transition-colors relative group"
    >
      {children}
      <motion.span 
        className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-400 group-hover:w-full transition-all duration-300"
      />
    </Link>
  );
};

export default Navbar;
