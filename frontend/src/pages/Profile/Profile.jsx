import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaBell, FaSave, FaEdit, FaMoon, FaSun } from 'react-icons/fa';
import Sidebar from './Sidebar';

const Profile = () => {
    const [user, setUser] = useState({
        username: 'demo_user',
        email: 'demo@example.com',
        newPassword: '',
        confirmPassword: '',
        notificationThreshold: '50',
        darkMode: false
    });
    
    const [editMode, setEditMode] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user')) || {
            username: 'demo_user',
            email: 'demo@example.com'
        };
        
        setUser({
            ...user,
            username: storedUser.username,
            email: storedUser.email
        });
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setUser({
            ...user,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setEditMode(false);
        setMessage('Profile updated successfully!');
        
        localStorage.setItem('user', JSON.stringify({
            username: user.username,
            email: user.email
        }));
        
        setTimeout(() => setMessage(''), 3000);
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />
            
            <div className="flex-1 ml-64 p-6">
                <div className="max-w-4xl mx-auto">
                    {/* Header Section */}
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                            <FaUser className="mr-3 text-cyan-600" />
                            User Profile
                        </h1>
                        <button 
                            onClick={() => navigate(-1)}
                            className="text-cyan-600 hover:text-cyan-800 text-sm font-medium"
                        >
                            ← Back to Dashboard
                        </button>
                    </div>

                    {/* Success Message */}
                    {message && (
                        <div className={`p-4 mb-6 rounded-lg ${message.includes('success') ? 
                            'bg-green-50 text-green-800 border border-green-200' : 
                            'bg-red-50 text-red-800 border border-red-200'}`}
                        >
                            {message}
                        </div>
                    )}

                    {/* Main Profile Card */}
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
                        <form onSubmit={handleSubmit}>
                            {/* Card Header */}
                            <div className="bg-gradient-to-r from-cyan-600 to-blue-600 p-6">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h2 className="text-xl font-bold text-white">Profile Settings</h2>
                                        <p className="text-sm text-blue-100 mt-1">
                                            {editMode ? 'Edit your personal information' : 'View and manage your profile'}
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setEditMode(!editMode)}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${editMode ? 
                                            'bg-white text-cyan-600 hover:bg-gray-50' : 
                                            'bg-white/20 text-white hover:bg-white/30'}`}
                                    >
                                        {editMode ? (
                                            <>
                                                <FaSave /> Save
                                            </>
                                        ) : (
                                            <>
                                                <FaEdit /> Edit Profile
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Profile Section */}
                            <div className="p-6 border-b border-gray-100">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Username Field */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                                            <FaUser className="mr-2 text-cyan-600" /> Username
                                        </label>
                                        {editMode ? (
                                            <input
                                                type="text"
                                                name="username"
                                                value={user.username}
                                                onChange={handleChange}
                                                className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
                                                required
                                            />
                                        ) : (
                                            <p className="mt-1 p-3 bg-gray-50 border border-gray-200 rounded-lg">{user.username}</p>
                                        )}
                                    </div>

                                    {/* Email Field */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                                            <FaEnvelope className="mr-2 text-cyan-600" /> Email
                                        </label>
                                        {editMode ? (
                                            <input
                                                type="email"
                                                name="email"
                                                value={user.email}
                                                onChange={handleChange}
                                                className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
                                                required
                                            />
                                        ) : (
                                            <p className="mt-1 p-3 bg-gray-50 border border-gray-200 rounded-lg">{user.email}</p>
                                        )}
                                    </div>

                                    {editMode && (
                                        <>
                                            {/* New Password Field */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                                                    <FaLock className="mr-2 text-cyan-600" /> New Password
                                                </label>
                                                <input
                                                    type="password"
                                                    name="newPassword"
                                                    value={user.newPassword}
                                                    onChange={handleChange}
                                                    className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
                                                    placeholder="Leave blank to keep current"
                                                />
                                            </div>

                                            {/* Confirm Password Field */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                                                    <FaLock className="mr-2 text-cyan-600" /> Confirm Password
                                                </label>
                                                <input
                                                    type="password"
                                                    name="confirmPassword"
                                                    value={user.confirmPassword}
                                                    onChange={handleChange}
                                                    className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
                                                    placeholder="Confirm new password"
                                                />
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Preferences Section */}
                            <div className="p-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                    <FaBell className="mr-3 text-cyan-600" /> Preferences
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Notification Threshold */}
                                    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                                        <h4 className="text-sm font-medium text-gray-700 mb-1">Notification Threshold</h4>
                                        <p className="text-xs text-gray-500 mb-3">Minimum severity level to notify me</p>
                                        {editMode ? (
                                            <select
                                                name="notificationThreshold"
                                                value={user.notificationThreshold}
                                                onChange={handleChange}
                                                className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                                            >
                                                <option value="30">Low (30%)</option>
                                                <option value="50">Medium (50%)</option>
                                                <option value="70">High (70%)</option>
                                            </select>
                                        ) : (
                                            <div className="px-3 py-1 bg-cyan-50 text-cyan-700 rounded-md text-sm inline-block">
                                                {user.notificationThreshold === '30' ? 'Low' :
                                                    user.notificationThreshold === '50' ? 'Medium' : 'High'}
                                            </div>
                                        )}
                                    </div>

                                    {/* Theme Preference */}
                                    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                                        <h4 className="text-sm font-medium text-gray-700 mb-1">Theme Preference</h4>
                                        <p className="text-xs text-gray-500 mb-3">Toggle between light and dark mode</p>
                                        {editMode ? (
                                            <label className="flex items-center cursor-pointer">
                                                <div className="relative">
                                                    <input
                                                        type="checkbox"
                                                        name="darkMode"
                                                        checked={user.darkMode}
                                                        onChange={handleChange}
                                                        className="sr-only peer"
                                                    />
                                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                                                </div>
                                                <span className="ml-3 text-sm text-gray-700">
                                                    {user.darkMode ? 'Dark Mode' : 'Light Mode'}
                                                </span>
                                            </label>
                                        ) : (
                                            <div className="flex items-center">
                                                {user.darkMode ? (
                                                    <FaMoon className="text-cyan-600 mr-2" />
                                                ) : (
                                                    <FaSun className="text-yellow-400 mr-2" />
                                                )}
                                                <span className="text-sm text-gray-700">
                                                    {user.darkMode ? 'Dark Mode' : 'Light Mode'}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {editMode && (
                                <div className="p-6 bg-gray-50 flex flex-col sm:flex-row justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setEditMode(false)}
                                        className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-5 py-2.5 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition flex items-center justify-center"
                                    >
                                        <FaSave className="mr-2" />
                                        Save Changes
                                    </button>
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;