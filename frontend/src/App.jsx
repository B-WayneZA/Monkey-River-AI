import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../src/pages/Auth/LoginPage';
import Dashboard from '../src/pages/Alert/Dashboard'; 
import Register from '../src/pages/Auth/RegisterPage';
import Profile from '../src/pages/Profile/Profile';
import Test from '../src/pages/Crud/DiagnosticTestList';
import HealthChecker from './pages/Dashboard/HealthChecker';

function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect root path to health-check */}
        <Route path="/" element={<Navigate to="/health-check" replace />} />

        {/* Auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* App content routes */}
        <Route path="/profile" element={<Profile />} />
        <Route path="/test" element={<Test />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/health-check" element={<HealthChecker />} />
      </Routes>
    </Router>
  );
}

export default App;