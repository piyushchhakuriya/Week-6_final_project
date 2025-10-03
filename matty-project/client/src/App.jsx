<<<<<<< HEAD
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
=======
// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Import Pages
import Home from './pages/Home';
>>>>>>> e88cc9014c75e4ee0a771c83a0ce5e1f8d49fd8a
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Editor from './pages/Editor'; 
import About from './pages/About'; 

<<<<<<< HEAD
const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Login />} />                 
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/editor" element={<Editor />} />         
      <Route path="/editor/:id" element={<Editor />} />      
      <Route path="/about" element={<About />} />
      <Route path="/about-us" element={<About />} />
    </Routes>
  </Router>
);
=======
import ProtectedRoute from './components/ProtectedRoute';
>>>>>>> e88cc9014c75e4ee0a771c83a0ce5e1f8d49fd8a

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                {<Dashboard />}
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/editor"
            element={
              <ProtectedRoute>
                <Editor />
              </ProtectedRoute>
            }
          />
          
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;