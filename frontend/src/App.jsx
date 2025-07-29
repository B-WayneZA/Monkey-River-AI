// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from '../src/pages/Auth/LoginPage';
import Dashboard from '../src/pages/Alert/Dashboard'; 
import Register from '../src/pages/Auth/ResgisterPage';
import Profile from '../src/pages/Profile/Profile';

function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect root to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        {/* Protected route (add auth wrapper later if needed) */}
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}


export default App;
