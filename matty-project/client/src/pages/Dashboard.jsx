import React, { useState, useEffect } from 'react';
import API from '../api/api';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const [designs, setDesigns] = useState([]);
  const {user , logout , isAuthenticated} = useAuth();
  const navigate = useNavigate();

  const fetchDesigns = async () => {
    try {
      const res = await API.get('/designs');
      setDesigns(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    
    if (isAuthenticated){
      fetchDesigns();
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <motion.div
      className="p-6 bg-gray-50 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <Link
              to="/logout"
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
            >
            
              Logout
            </Link>
      {/* <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Home size={24} className="text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-800">Matty Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">Welcome, {user?.username || user?.email}!</span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </nav> */}
      <h1 className="text-3xl font-bold mb-6">My Designs</h1>
      <Link
        to="/editor"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition mb-4 inline-block"
      >
        Create New Design
      </Link>
      <div className="grid grid-cols-3 gap-4 mt-4">
        {designs.map((d) => (
          <div key={d._id} className="border rounded p-2 bg-white shadow hover:shadow-lg transition">
            {d.thumbnailUrl ? (
              <img src={d.thumbnailUrl} alt={d.title} className="w-full h-40 object-cover rounded" />
            ) : (
              <div className="w-full h-40 bg-gray-200 flex items-center justify-center rounded">No Thumbnail</div>
            )}
            <h2 className="text-lg font-bold mt-2">{d.title}</h2>
            <Link to={`/editor?id=${d._id}`} className="text-blue-600 hover:underline">Edit</Link>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default Dashboard;
