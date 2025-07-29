import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaBell, FaSave, FaEdit, FaMoon, FaSun, FaChevronLeft } from 'react-icons/fa';
import Sidebar from '../../components/Sidebar';

const Profile = () => {
    // Initialize state with complete default values
    const [user, setUser] = useState({
        name: 'Loading...',
        email: 'Loading...',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        notificationThreshold: 'medium',
        themePreference: 'light',
        lastUpdated: ''
    });
    
    const [editMode, setEditMode] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    // Load user data
    useEffect(() => {
        const fetchUserData = async () => {
            setIsLoading(true);
            try {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 500));
                
                const storedUser = JSON.parse(localStorage.getItem('user')) || {
                    name: 'Alex Johnson',
                    email: 'alex.johnson@example.com',
                    notificationThreshold: 'medium',
                    themePreference: 'light',
                    lastUpdated: new Date().toISOString()
                };
                
                setUser({
                    ...user,
                    ...storedUser,
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                });
            } catch (error) {
                setMessage({ text: 'Failed to load profile data', type: 'error' });
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchUserData();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setUser(prev => ({ 
            ...prev, 
            [name]: type === 'checkbox' ? checked : value 
        }));
    };

    const validateForm = () => {
        if (editMode && user.newPassword && user.newPassword !== user.confirmPassword) {
            setMessage({ text: 'Passwords do not match', type: 'error' });
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;
        
        setIsLoading(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 800));
            
            const updatedUser = {
                ...user,
                lastUpdated: new Date().toISOString()
            };
            
            // Remove password fields before saving
            const { currentPassword, newPassword, confirmPassword, ...userToStore } = updatedUser;
            
            // "Persist" to database (localStorage for demo)
            localStorage.setItem('user', JSON.stringify(userToStore));
            
            setMessage({ 
                text: 'Profile updated successfully!', 
                type: 'success' 
            });
            setEditMode(false);
        } catch (error) {
            setMessage({ 
                text: 'Failed to update profile', 
                type: 'error' 
            });
        } finally {
            setIsLoading(false);
            setTimeout(() => setMessage({ text: '', type: '' }), 3000);
        }
    };

    const toggleEditMode = () => {
        setEditMode(!editMode);
        setMessage({ text: '', type: '' });
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex bg-gray-50">
                <Sidebar />
                <div className="flex-1 ml-64 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex bg-gray-50">
            <Sidebar />
            
            {/* Main Content */}
            <div className="flex-1 ml-64">
                {/* Header */}
                <header className="bg-white shadow-sm">
                    <div className="flex justify-between items-center px-8 py-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">User Profile</h1>
                            <p className="text-gray-600">
                                {editMode ? 'Edit your profile' : 'View your profile information'}
                                {user.lastUpdated && (
                                    <span className="text-xs text-gray-400 ml-2">
                                        Last updated: {new Date(user.lastUpdated).toLocaleString()}
                                    </span>
                                )}
                            </p>
                        </div>
                        
                        <div className="flex items-center space-x-6">
                            <button 
                                onClick={() => navigate(-1)}
                                className="flex items-center text-primary hover:text-secondary transition"
                            >
                                <FaChevronLeft className="mr-1" /> Back to Dashboard
                            </button>
                        </div>
                    </div>
                </header>
                
                {/* Profile Content */}
                <div className="px-8 py-6">
                    {message.text && (
                        <div className={`mb-6 p-4 rounded-lg ${
                            message.type === 'success' 
                                ? 'bg-green-100 text-green-800 border border-green-200' 
                                : 'bg-red-100 text-red-800 border border-red-200'
                        }`}>
                            {message.text}
                        </div>
                    )}
                    
                    <div className="bg-white rounded-xl shadow overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-primary to-secondary">
                            <h2 className="text-lg font-semibold text-white">Profile Settings</h2>
                            <button
                                type="button"
                                onClick={toggleEditMode}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                                    editMode 
                                        ? 'bg-white text-primary hover:bg-gray-50' 
                                        : 'bg-white/20 text-white hover:bg-white/30'
                                }`}
                                disabled={isLoading}
                            >
                                {editMode ? (
                                    <>
                                        <FaSave /> Save Changes
                                    </>
                                ) : (
                                    <>
                                        <FaEdit /> Edit Profile
                                    </>
                                )}
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Personal Information Section */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800 flex items-center mb-4">
                                        <FaUser className="mr-2 text-primary" /> Personal Information
                                    </h3>
                                    
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                            {editMode ? (
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={user.name}
                                                    onChange={handleChange}
                                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                                    required
                                                />
                                            ) : (
                                                <p className="p-3 bg-gray-50 rounded-lg">{user.name}</p>
                                            )}
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                            {editMode ? (
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={user.email}
                                                    onChange={handleChange}
                                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                                    required
                                                />
                                            ) : (
                                                <p className="p-3 bg-gray-50 rounded-lg">{user.email}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Security Section */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800 flex items-center mb-4">
                                        <FaLock className="mr-2 text-primary" /> Security
                                    </h3>
                                    
                                    <div className="space-y-4">
                                        {editMode ? (
                                            <>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                                                    <input
                                                        type="password"
                                                        name="currentPassword"
                                                        value={user.currentPassword}
                                                        onChange={handleChange}
                                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                                        placeholder="Enter current password"
                                                    />
                                                </div>
                                                
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                                                    <input
                                                        type="password"
                                                        name="newPassword"
                                                        value={user.newPassword}
                                                        onChange={handleChange}
                                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                                        placeholder="Enter new password"
                                                    />
                                                </div>
                                                
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                                                    <input
                                                        type="password"
                                                        name="confirmPassword"
                                                        value={user.confirmPassword}
                                                        onChange={handleChange}
                                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                                        placeholder="Confirm new password"
                                                    />
                                                </div>
                                            </>
                                        ) : (
                                            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                                                <p className="text-sm text-blue-800">
                                                    Password last changed: {user.lastUpdated 
                                                        ? new Date(user.lastUpdated).toLocaleDateString() 
                                                        : 'Never'}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            
                            {/* Preferences Section */}
                            <div className="mt-8 pt-8 border-t border-gray-100">
                                <h3 className="text-lg font-semibold text-gray-800 flex items-center mb-6">
                                    <FaBell className="mr-2 text-primary" /> Preferences
                                </h3>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Notification Threshold Setting */}
                                    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                                        <h4 className="text-sm font-medium text-gray-700 mb-1">Notification Threshold</h4>
                                        <p className="text-xs text-gray-500 mb-3">Minimum severity level for notifications</p>
                                        {editMode ? (
                                            <select
                                                name="notificationThreshold"
                                                value={user.notificationThreshold}
                                                onChange={handleChange}
                                                className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                                            >
                                                <option value="low">Low - Only critical alerts</option>
                                                <option value="medium">Medium - Important alerts</option>
                                                <option value="high">High - All notifications</option>
                                            </select>
                                        ) : (
                                            <div className="flex items-center">
                                                <div className={`px-3 py-1 rounded-md text-sm font-medium ${
                                                    user.notificationThreshold === 'low' 
                                                        ? 'bg-red-100 text-red-800' 
                                                        : user.notificationThreshold === 'medium' 
                                                            ? 'bg-yellow-100 text-yellow-800' 
                                                            : 'bg-green-100 text-green-800'
                                                }`}>
                                                    {user.notificationThreshold.charAt(0).toUpperCase() + user.notificationThreshold.slice(1)}
                                                </div>
                                                <p className="ml-2 text-sm text-gray-600">
                                                    {user.notificationThreshold === 'low' 
                                                        ? 'Only critical alerts' 
                                                        : user.notificationThreshold === 'medium' 
                                                            ? 'Important alerts' 
                                                            : 'All notifications'}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                    
                                    {/* Theme Preference Setting */}
                                    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                                        <h4 className="text-sm font-medium text-gray-700 mb-1">Theme Preference</h4>
                                        <p className="text-xs text-gray-500 mb-3">Appearance mode</p>
                                        {editMode ? (
                                            <div className="flex space-x-4">
                                                <label className="flex items-center space-x-2 cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name="themePreference"
                                                        value="light"
                                                        checked={user.themePreference === 'light'}
                                                        onChange={handleChange}
                                                        className="h-4 w-4 text-primary focus:ring-primary"
                                                    />
                                                    <span>Light Mode</span>
                                                </label>
                                                <label className="flex items-center space-x-2 cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name="themePreference"
                                                        value="dark"
                                                        checked={user.themePreference === 'dark'}
                                                        onChange={handleChange}
                                                        className="h-4 w-4 text-primary focus:ring-primary"
                                                    />
                                                    <span>Dark Mode</span>
                                                </label>
                                            </div>
                                        ) : (
                                            <div className="flex items-center">
                                                {user.themePreference === 'dark' ? (
                                                    <FaMoon className="text-primary mr-2" />
                                                ) : (
                                                    <FaSun className="text-yellow-400 mr-2" />
                                                )}
                                                <span className="text-sm text-gray-700">
                                                    {user.themePreference === 'dark' ? 'Dark Mode' : 'Light Mode'}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            
                            {editMode && (
                                <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={toggleEditMode}
                                        className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                                        disabled={isLoading}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-5 py-2.5 bg-primary text-white rounded-lg hover:bg-secondary transition flex items-center justify-center"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                        ) : (
                                            <FaSave className="mr-2" />
                                        )}
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