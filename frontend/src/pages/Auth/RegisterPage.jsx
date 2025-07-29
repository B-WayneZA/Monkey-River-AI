import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaGoogle, FaFacebook, FaLock, FaHeartbeat, FaPlay, FaUser, FaSignInAlt, FaEnvelope } from 'react-icons/fa';
import { motion } from 'framer-motion';
import logoImg from '../../assets/Favicon.png';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({  email: '', name: '', password: ''});
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    // handle the register of the paeg -> backend logic
    const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    try {
        const res = await fetch('http://localhost:5000/api/Users/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });

        const result = await res.json();

        if (res.ok) {
            const { token, user } = result;

            // Store in localStorage
            localStorage.setItem('user', JSON.stringify({
                id: user.id,
                username: user.userName,
                email: user.email,
                name: user.name,
                token: token
            }));

            // Redirect to dashboard
            navigate('/dashboard', { state: { userId: user.id } });
        } else {
            // Server-side validation or identity errors
            const errorMessage = result.errors?.join(', ') || result.message || 'Registration failed.';
            setError(errorMessage);
        }
    } catch (err) {
        setError('Network error: ' + err.message);
    }
};


    return (
        <section className="min-h-screen bg-gray-200 overflow-hidden relative">
            {/* Background shapes - using Tailwind's opacity utilities */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
                <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-cyan-700 opacity-30"></div>
                <div className="absolute bottom-[-30%] left-[-10%] w-[800px] h-[800px] rounded-full bg-cyan-700 opacity-30"></div>
            </div>

            <div className="container px-4 py-12 mx-auto relative z-10">
                <div className="flex flex-col lg:flex-row items-center justify-left gap-2">
                    {/* Left Column - Hero Content */}
                    <motion.div
                        className="lg:w-1/2 text-center lg:text-left"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                    >
                        <div className="space-y-8">
                            <div className="inline-block p-3 rounded-xl bg-white bg-opacity-10 backdrop-blur-sm">
                                <img src={logoImg} alt="HealthForge Logo" className="w-16 h-auto rounded-full" />
                            </div>

                            <h1 className="text-5xl font-bold leading-tight text-white">
                                Your AI Health
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500">
                                    <br />Checker
                                </span>
                            </h1>

                            <p className="text-xl text-white max-w-lg leading-relaxed">
                                Personalized health insights powered by artificial intelligence.
                                Track your wellness journey with tailored recommendations.
                            </p>
                        </div>
                    </motion.div>

                    {/* Right Column - Login Card */}
                    <motion.div
                        className="fixed lg:relative inset-0 lg:inset-auto lg:w-[40%] w-full max-w-md flex items-center justify-center lg:justify-center -translate-x-1/2 lg:translate-x-0 left-1/2"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
                    >
                        <div className="w-full max-w-md mx-4">
                            {/* Card background effects */}
                            <div className="absolute -inset-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 opacity-20 blur-lg"></div>
                            <div className="relative bg-gray-700 bg-opacity-60 backdrop-blur-xl rounded-2xl border border-gray-700 overflow-hidden shadow-2xl">
                                <div className="p-8">
                                    {/* Logo and Header */}
                                    <div className="flex flex-col items-center mb-8">
                                        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center mb-4">
                                            <img src={logoImg} alt="HealthForge Logo" className="h-12 h-12 rounded-full" />
                                        </div>
                                        <h2 className="text-2xl font-bold text-white">Welcome Back</h2>
                                        <p className="text-gray-400 mt-1">Register and embark on your health journey</p>
                                    </div>

                                    <form onSubmit={handleRegister} className="space-y-6">
                                        {/* Email Field */}
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-300">Email</label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                                                    placeholder="Enter your email"
                                                    required
                                                />
                                                <FaEnvelope className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                            </div>
                                        </div>

                                        {/* Name */}
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-300">Name</label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                                                    placeholder="Enter your name"
                                                    required
                                                />
                                                <FaUser className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                            </div>
                                        </div>

                                        {/* Password Field */}
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-300">Password</label>
                                            <div className="relative">
                                                <input
                                                    type={showPassword ? 'text' : 'password'}
                                                    name="password"
                                                    value={formData.password}
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all pr-10"
                                                    placeholder="Enter your password"
                                                    required
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                                                >
                                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                                </button>
                                            </div>
                                        </div>

                                        {/* Remember Me & Forgot Password */}
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    id="rememberMe"
                                                    className="h-4 w-4 bg-gray-700 border-gray-600 rounded focus:ring-cyan-500 text-cyan-600"
                                                />
                                                <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-300">
                                                    Remember me
                                                </label>
                                            </div>
                                            <Link
                                                to="/forgot-password"
                                                className="text-sm text-cyan-400 hover:text-cyan-300 hover:underline transition-colors"
                                            >
                                                Forgot password?
                                            </Link>
                                        </div>

                                        {/* Error Message */}
                                        {error && (
                                            <div className="p-3 bg-red-900 bg-opacity-30 border border-red-700 rounded-lg flex items-center gap-2 text-red-100">
                                                <FaLock className="flex-shrink-0" />
                                                <span>{error}</span>
                                            </div>
                                        )}

                                        {/* Login Button */}
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            type="submit"
                                            className="w-full py-3 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                                        >
                                            <FaSignInAlt />
                                            Register
                                        </motion.button>

                                        {/* Divider */}
                                        <div className="relative">
                                            <div className="absolute inset-0 flex items-center">
                                                <div className="w-full border-t border-gray-700"></div>
                                            </div>
                                            <div className="relative flex justify-center">
                                            </div>
                                        </div>

                                        {/* Sign Up Link */}
                                        <p className="text-center text-gray-400">
                                            Already have an account?{' '}
                                            <Link
                                                to="/login"
                                                className="font-medium text-cyan-400 hover:text-cyan-300 hover:underline transition-colors"
                                            >
                                                login
                                            </Link>
                                        </p>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Register;