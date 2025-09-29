import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Home = () => {
  return (
    <motion.div
      className="flex flex-col items-center justify-center h-screen bg-gray-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <h1 className="text-5xl font-bold mb-6">Welcome to Matty</h1>
      <p className="text-xl mb-6 text-gray-700">Create stunning graphics online, easily and fast.</p>
      <Link to="/editor" className="bg-blue-600 text-white px-6 py-3 rounded text-lg hover:bg-blue-700 transition">
        Start Designing
      </Link>
    </motion.div>
  );
};

export default Home;
