import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../assets/Logo.png';

const Sidebar = () => {
  return (
    <div className="w-64 bg-white shadow-lg fixed h-full flex flex-col">
      {/* Logo at the very top with tight spacing */}
      <div className="pt-2 pb-1 flex justify-center"> {/* Minimal padding */}
        <img 
          src={Logo}
          alt="HealthAI Logo"
          className="w-60 h-60 object-contain" 
        />
      </div>


      {/* Navigation links - tighter spacing */}
      <nav className="px-2 space-y-1"> 
        <Link 
          to="/dashboard" 
          className="flex items-center px-4 py-3 text-primary bg-blue-50 border-l-4 border-primary"
        >
          <i className="fas fa-bell w-5 mr-3 text-center"></i>
          <span>Alerts Dashboard</span>
        </Link>
        
        <Link 
          to="/patients" 
          className="flex items-center px-4 py-3 text-gray-600 hover:bg-blue-50"
        >
          <i className="fas fa-user-injured w-5 mr-3 text-center"></i>
          <span>Patient Overview</span>
        </Link>
        
        <Link 
          to="/analytics" 
          className="flex items-center px-4 py-3 text-gray-600 hover:bg-blue-50"
        >
          <i className="fas fa-chart-line w-5 mr-3 text-center"></i>
          <span>Analytics</span>
        </Link>
        
        <Link 
          to="/settings" 
          className="flex items-center px-4 py-3 text-gray-600 hover:bg-blue-50"
        >
          <i className="fas fa-cog w-5 mr-3 text-center"></i>
          <span>Settings</span>
        </Link>
      </nav>

      {/* Admin profile at bottom */}
      <div className="mt-auto p-4">
        <div className="bg-blue-50 rounded-lg p-4 flex items-center">
          <img 
            src="https://randomuser.me/api/portraits/women/68.jpg" 
            className="w-10 h-10 rounded-full" 
            alt="Admin" 
          />
          <div className="ml-3">
            <p className="font-medium text-gray-900">Dr. Sarah Johnson</p>
            <p className="text-xs text-gray-600">Administrator</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;