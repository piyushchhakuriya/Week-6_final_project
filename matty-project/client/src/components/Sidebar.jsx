import React from 'react';
import { motion } from 'framer-motion';

const Sidebar = ({ tools, onSelectTool }) => {
  return (
    <motion.div
      className="bg-gray-100 w-20 flex flex-col items-center py-4"
      initial={{ x: -100 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.5 }}
    >
      {tools.map((tool) => (
        <button
          key={tool}
          className="my-2 p-2 bg-blue-500 text-white rounded"
          onClick={() => onSelectTool(tool)}
        >
          {tool}
        </button>
      ))}
    </motion.div>
  );
};

export default Sidebar;
