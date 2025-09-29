import React from 'react';
import { motion } from 'framer-motion';

const Toolbar = ({ onAction }) => {
  return (
    <motion.div
      className="bg-gray-200 p-2 flex gap-2"
      initial={{ y: -50 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <button onClick={() => onAction('undo')} className="bg-blue-500 text-white px-2 py-1 rounded">Undo</button>
      <button onClick={() => onAction('redo')} className="bg-blue-500 text-white px-2 py-1 rounded">Redo</button>
      <button onClick={() => onAction('export')} className="bg-green-500 text-white px-2 py-1 rounded">Export PNG</button>
    </motion.div>
  );
};

export default Toolbar;
