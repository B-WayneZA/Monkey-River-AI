// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from '../src/pages/Auth/LoginPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        {/* Add other routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;