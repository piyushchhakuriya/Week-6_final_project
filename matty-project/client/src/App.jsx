import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage'; // <-- NEW homepage component
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Editor from './pages/Editor'; // your CanvasEditor wrapped component
import About from './pages/About';   // your About component

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<HomePage />} />                 {/* Homepage at root */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/editor" element={<Editor />} />             {/* New design */}
      <Route path="/editor/:id" element={<Editor />} />         {/* Edit existing design */}
      <Route path="/about" element={<About />} />
      
      
    </Routes>
  </Router>
);

export default App;
