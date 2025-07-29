import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from '../src/pages/Auth/LoginPage'; 
import Dashboard from '../src/pages/Alert/Dashboard';  

function App() {
  return (
    <Router>
      <Routes>
        {/* Public route */}
        {/* <Route path="/" element={<Login />} /> */}

        {/* Protected route (add auth wrapper later if needed) */}
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
