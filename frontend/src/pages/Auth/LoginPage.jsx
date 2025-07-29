import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaGoogle, FaFacebook, FaLock } from 'react-icons/fa';
import { motion } from 'framer-motion';
import logoImg from '../../assets/Logo.png';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      if (res.ok) {
        const username = result.data.user.username;

        const idRes = await fetch(`http://localhost:5000/api/auth/user-id/${username}`);
        const idResult = await idRes.json();

        if (idRes.ok && idResult.data?.user_id) {
          const userId = idResult.data.user_id;
          const token = result.data.token;
          localStorage.setItem('user', JSON.stringify({ 
            username, 
            id: userId,
            token: token
          }));
          navigate('/dashboard', { state: { userId } });
        } else {
          setError('Could not retrieve user ID after login.');
        }
      } else {
        setError(result.message || 'Login failed');
      }
    } catch (err) {
      setError('Network error: ' + err.message);
    }
  };

  return (
    <section className="min-h-screen background-radial-gradient overflow-hidden">
      <style jsx>{`
        .background-radial-gradient {
          background-color: hsl(218, 41%, 15%);
          background-image: radial-gradient(650px circle at 0% 0%,
              hsl(218, 41%, 35%) 15%,
              hsl(218, 41%, 30%) 35%,
              hsl(218, 41%, 20%) 75%,
              hsl(218, 41%, 19%) 80%,
              transparent 100%),
            radial-gradient(1250px circle at 100% 100%,
              hsl(218, 41%, 45%) 15%,
              hsl(218, 41%, 30%) 35%,
              hsl(218, 41%, 20%) 75%,
              hsl(218, 41%, 19%) 80%,
              transparent 100%);
        }
        
        #radius-shape-1 {
          height: 220px;
          width: 220px;
          top: -60px;
          left: -130px;
          background: radial-gradient(#44006b, #ad1fff);
          overflow: hidden;
        }
        
        #radius-shape-2 {
          border-radius: 38% 62% 63% 37% / 70% 33% 67% 30%;
          bottom: -60px;
          right: -110px;
          width: 300px;
          height: 300px;
          background: radial-gradient(#44006b, #ad1fff);
          overflow: hidden;
        }
        
        .bg-glass {
          background-color: hsla(0, 0%, 100%, 0.9) !important;
          backdrop-filter: saturate(200%) blur(25px);
        }
      `}</style>

      <div className="container px-4 py-5 px-md-5 text-center text-lg-start my-5">
        <div className="row gx-lg-5 align-items-center">
          {/* Left side - Branding */}
          <div className="col-lg-6 mb-5 mb-lg-0" style={{ zIndex: 10 }}>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="my-5 display-5 fw-bold ls-tight" style={{ color: 'hsl(218, 81%, 95%)' }}>
                Your AI Health Companion <br />
                <span style={{ color: 'hsl(218, 81%, 75%)' }}>for better wellness</span>
              </h1>
              <p className="mb-4 opacity-70" style={{ color: 'hsl(218, 81%, 85%)' }}>
                Get personalized health insights powered by artificial intelligence.
                Track your wellness journey and receive tailored recommendations.
              </p>
            </motion.div>
          </div>

          {/* Right side - Login Form */}
          <div className="col-lg-6 mb-5 mb-lg-0 position-relative">
            <div id="radius-shape-1" className="position-absolute rounded-circle shadow-5-strong"></div>
            <div id="radius-shape-2" className="position-absolute shadow-5-strong"></div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="card bg-glass border-0"
            >
              <div className="card-body px-4 py-5 px-md-5">
                <div className="flex flex-col items-center mb-5">
                  <img src={logoImg} alt="HealthAI" className="w-20 mb-3" />
                  <h2 className="text-2xl font-bold text-gray-800">Welcome Back</h2>
                </div>

                <form onSubmit={handleLogin}>
                  {/* Username Input */}
                  <div className="form-outline mb-4">
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      className="form-control py-3 px-4 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                    <label className="form-label text-gray-600">Username</label>
                  </div>

                  {/* Password Input */}
                  <div className="form-outline mb-4">
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="form-control py-3 px-4 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 pr-10"
                        required
                      />
                      <label className="form-label text-gray-600">Password</label>
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600"
                      >
                        {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                      </button>
                    </div>
                  </div>

                  {/* Remember Me & Forgot Password */}
                  <div className="flex justify-between items-center mb-4">
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                        id="rememberMe"
                      />
                      <label className="form-check-label inline-block text-gray-600" htmlFor="rememberMe">
                        Remember me
                      </label>
                    </div>
                    <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">
                      Forgot password?
                    </Link>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="mb-4 p-3 text-sm text-red-700 bg-red-100 rounded-lg flex items-center">
                      <FaLock className="mr-2" /> {error}
                    </div>
                  )}

                  {/* Submit Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white py-3 rounded-lg font-medium shadow-md hover:shadow-lg transition-all mb-4"
                  >
                    Login
                  </motion.button>

                  {/* Divider */}
                  <div className="flex items-center my-6">
                    <div className="flex-1 border-t border-gray-300"></div>
                    <div className="px-4 text-gray-500">or continue with</div>
                    <div className="flex-1 border-t border-gray-300"></div>
                  </div>

                  {/* Social Login Buttons */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <button
                      type="button"
                      className="flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                    >
                      <FaGoogle className="text-blue-600" /> Google
                    </button>
                    <button
                      type="button"
                      className="flex items-center justify-center gap-2 bg-blue-800 text-white py-2.5 rounded-lg font-medium hover:bg-blue-900 transition-colors"
                    >
                      <FaFacebook /> Facebook
                    </button>
                  </div>

                  {/* Sign Up Link */}
                  <p className="text-center text-gray-600">
                    Don't have an account?{' '}
                    <Link to="/register" className="font-medium text-orange-500 hover:underline">
                      Register
                    </Link>
                  </p>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;