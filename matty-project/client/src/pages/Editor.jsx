import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Toolbar from '../components/Toolbar';
import CanvasEditor from '../components/CanvasEditor';
import API from '../api/api';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Editor = () => {
  const [design, setDesign] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const designId = queryParams.get('id');

  const fetchDesign = async () => {
    try {
      if (!designId) {
        setDesign({ title: 'New Design', jsonData: { shapes: [], text: [], images: [] }, thumbnailUrl: '' });
        return;
      }
      const res = await API.get(`/designs/${designId}`);
      setDesign(res.data);
    } catch (err) {
      console.error(err);
      navigate('/dashboard');
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) navigate('/login');
    else fetchDesign();
  }, [designId]);

  const handleAction = (action) => {
    console.log('Action:', action);
    // You can implement undo, redo, export PNG functionality here
  };

  return (
    <>
      <Navbar />
      <motion.div className="flex bg-gray-50 min-h-screen" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
        <Sidebar tools={['Rectangle', 'Text', 'Image']} onSelectTool={(tool) => console.log('Selected Tool:', tool)} />
        <div className="flex-1 p-4">
          <Toolbar onAction={handleAction} />
          {design && <CanvasEditor design={design} />}
        </div>
      </motion.div>
    </>
  );
};

export default Editor;
