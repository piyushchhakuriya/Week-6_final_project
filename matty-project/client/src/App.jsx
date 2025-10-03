import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Editor from './pages/Editor'; // your CanvasEditor wrapped component
import About from './pages/About'; // Add your About component import

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Login />} />                 {/* Show Login on root */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/editor" element={<Editor />} />          {/* New design */}
      <Route path="/editor/:id" element={<Editor />} />      {/* Edit existing design */}
      <Route path="/about" element={<About />} />
      <Route path="/about-us" element={<About />} />
    </Routes>
  </Router>
);

export default App;
