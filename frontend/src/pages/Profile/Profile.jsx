import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaBell, FaSave, FaEdit, FaMoon, FaSun, FaChevronLeft } from 'react-icons/fa';
import Sidebar from '../../components/Sidebar';

const Profile = () => {
    // Initialize state with complete default values
    const [user, setUser] = useState({
        name: 'Alice',
        email: 'Bobson',
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

    // Apply theme preference on component mount and when theme changes
    useEffect(() => {
        const applyTheme = () => {
            if (user.themePreference === 'dark') {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        };

        // Load user data
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

                // Apply the theme after setting user data
                applyTheme();
            } catch (error) {
                setMessage({ text: 'Failed to load profile data', type: 'error' });
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, []);

    // Apply theme whenever themePreference changes
    useEffect(() => {
        if (user.themePreference === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [user.themePreference]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setUser(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // Validation forms 
    const validateForm = () => {
        if (editMode && user.newPassword && user.newPassword !== user.confirmPassword) {
            setMessage({ text: 'Passwords do not match', type: 'error' });
            return false;
        }
        return true;
    };

    // submit handler
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
            <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900">
                <Sidebar />
                <div className="flex-1 ml-64 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary dark:border-primary-dark"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900">
            <Sidebar />

            {/* Main Content */}
            <div className="flex-1 ml-64">
                {/* Header */}
                <header className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
                    <div className="flex justify-between items-center px-8 py-5">
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-800 dark:text-white tracking-tight">
                                User Profile
                            </h1>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                {editMode ? 'Edit your profile details below' : 'View and manage your profile information'}
                            </p>
                        </div>
                    </div>
                </header>

                {/* Profile Content */}
                <div className="px-8 py-6">
                    {message.text && (
                        <div className={`mb-6 p-4 rounded-lg ${message.type === 'success'
                            ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800'
                            : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800'
                            }`}>
                            {message.text}
                        </div>
                    )}

                    {/* Div for background */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gradient-to-r from-primary to-secondary dark:from-primary-dark dark:to-secondary-dark">
                            <h2 className="text-lg font-semibold text-white">Profile Settings</h2>
                            <button
                                type="button"
                                onClick={toggleEditMode}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${editMode
                                    ? 'bg-sky-300 dark:bg-sky-700 text-white hover:bg-sky-50 dark:hover:bg-sky-600'
                                    : 'bg-sky-300 dark:bg-sky-700 text-white hover:bg-sky/30 dark:hover:bg-sky-600'
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
                                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center mb-4">
                                        <FaUser className="mr-2 text-primary dark:text-primary-dark" /> Personal Information
                                    </h3>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                                            {editMode ? (
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={user.name}
                                                    onChange={handleChange}
                                                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark focus:border-transparent bg-white dark:bg-gray-700 dark:text-white"
                                                    required
                                                />
                                            ) : (
                                                <p className="p-3 bg-gray-50 dark:bg-gray-700 dark:text-white rounded-lg">{user.name}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                                            {editMode ? (
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={user.email}
                                                    onChange={handleChange}
                                                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark focus:border-transparent bg-white dark:bg-gray-700 dark:text-white"
                                                    required
                                                />
                                            ) : (
                                                <p className="p-3 bg-gray-50 dark:bg-gray-700 dark:text-white rounded-lg">{user.email}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Security Section */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center mb-4">
                                        <FaLock className="mr-2 text-primary dark:text-primary-dark" /> Security
                                    </h3>

                                    <div className="space-y-4">
                                        {editMode ? (
                                            <>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Current Password</label>
                                                    <input
                                                        type="password"
                                                        name="currentPassword"
                                                        value={user.currentPassword}
                                                        onChange={handleChange}
                                                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark focus:border-transparent bg-white dark:bg-gray-700 dark:text-white"
                                                        placeholder="Enter current password"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Password</label>
                                                    <input
                                                        type="password"
                                                        name="newPassword"
                                                        value={user.newPassword}
                                                        onChange={handleChange}
                                                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark focus:border-transparent bg-white dark:bg-gray-700 dark:text-white"
                                                        placeholder="Enter new password"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm Password</label>
                                                    <input
                                                        type="password"
                                                        name="confirmPassword"
                                                        value={user.confirmPassword}
                                                        onChange={handleChange}
                                                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark focus:border-transparent bg-white dark:bg-gray-700 dark:text-white"
                                                        placeholder="Confirm new password"
                                                    />
                                                </div>
                                            </>
                                        ) : (
                                            <div className="p-4 bg-blue-50 dark:bg-blue-900 rounded-lg border border-blue-100 dark:border-blue-800">
                                                <p className="text-sm text-blue-800 dark:text-blue-200">
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
                            <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-700">
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center mb-6">
                                    <FaBell className="mr-2 text-primary dark:text-primary-dark" /> Preferences
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Notification Threshold Setting */}
                                    <div className="bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 p-4 shadow-sm">
                                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notification Threshold</h4>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Minimum severity level for notifications</p>
                                        {editMode ? (
                                            <select
                                                name="notificationThreshold"
                                                value={user.notificationThreshold}
                                                onChange={handleChange}
                                                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark focus:border-transparent bg-white dark:bg-gray-700 dark:text-white"
                                            >
                                                <option value="low">Low - Only critical alerts</option>
                                                <option value="medium">Medium - Important alerts</option>
                                                <option value="high">High - All notifications</option>
                                            </select>
                                        ) : (
                                            <div className="flex items-center">
                                                <div className={`px-3 py-1 rounded-md text-sm font-medium ${user.notificationThreshold === 'low'
                                                    ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                                                    : user.notificationThreshold === 'medium'
                                                        ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-500 dark:text-yellow-300'
                                                        : 'bg-lime-100 dark:bg-lime-900 text-lime-500 dark:text-lime-300'
                                                    }`}>
                                                    {user.notificationThreshold.charAt(0).toUpperCase() + user.notificationThreshold.slice(1)}
                                                </div>
                                                <p className="ml-2 text-sm text-gray-600 dark:text-gray-300">
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
                                    <div className="bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 p-4 shadow-sm">
                                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Theme Preference</h4>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Appearance mode</p>
                                        {editMode ? (
                                            <div className="flex space-x-4">
                                                <label className="flex items-center space-x-2 cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name="themePreference"
                                                        value="light"
                                                        checked={user.themePreference === 'light'}
                                                        onChange={handleChange}
                                                        className="h-4 w-4 text-primary dark:text-primary-dark focus:ring-primary dark:focus:ring-primary-dark"
                                                    />
                                                    <span className="text-gray-700 dark:text-gray-300">Light Mode</span>
                                                </label>
                                                <label className="flex items-center space-x-2 cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name="themePreference"
                                                        value="dark"
                                                        checked={user.themePreference === 'dark'}
                                                        onChange={handleChange}
                                                        className="h-4 w-4 text-primary dark:text-primary-dark focus:ring-primary dark:focus:ring-primary-dark"
                                                    />
                                                    <span className="text-gray-700 dark:text-gray-300">Dark Mode</span>
                                                </label>
                                            </div>
                                        ) : (
                                            <div className="flex items-center">
                                                {user.themePreference === 'dark' ? (
                                                    <FaMoon className="text-primary dark:text-primary-dark mr-2" />
                                                ) : (
                                                    <FaSun className="text-yellow-400 mr-2" />
                                                )}
                                                <span className="text-sm text-gray-700 dark:text-gray-300">
                                                    {user.themePreference === 'dark' ? 'Dark Mode' : 'Light Mode'}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Save buttons */}
                            <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={toggleEditMode}
                                    className="px-5 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                                    disabled={isLoading}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2.5 bg-primary dark:bg-primary-dark text-white rounded-lg hover:bg-secondary dark:hover:bg-secondary-dark transition flex items-center justify-center"
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
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;