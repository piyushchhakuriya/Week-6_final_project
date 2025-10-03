import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Editor from './pages/Editor'; 
import About from './pages/About'; 

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

export default App;
