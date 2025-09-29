
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Navbar = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem('user')));
  }, []);

  return (
    <motion.nav
      className="bg-blue-600 text-white p-4 flex justify-between items-center"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Link to="/" className="font-bold text-xl">Matty</Link>
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <span>{user.username}</span>
            <button onClick={logout} className="bg-red-500 px-3 py-1 rounded">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="bg-white text-blue-600 px-3 py-1 rounded">Login</Link>
            <Link to="/register" className="bg-white text-blue-600 px-3 py-1 rounded">Register</Link>
          </>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;
