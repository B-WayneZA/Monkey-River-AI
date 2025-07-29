import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from '../src/pages/Auth/LoginPage';
import Dashboard from '../src/pages/Alert/Dashboard'; 
import Register from '../src/pages/Auth/ResgisterPage';
import Profile from '../src/pages/Profile/Profile';
import Test from '../src/pages/Crud/DiagnosticTestList';
import HealthChecker from './pages/Dashboard/HealthChecker';

function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect root to login */}
        <Route path="/login" element={<Login />} />
        
        {/* Auth routes */}
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/test" element={<Test />} />
        {/* Protected route (add auth wrapper later if needed) */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/health-check" element={<HealthChecker />} />
      </Routes>
    </Router>
  );
}


export default App;
