import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../assets/Logo.png';

const SidebarUser = () => {
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
          to="/myDashboard" 
          className="flex items-center px-4 py-3 text-primary bg-blue-50 border-l-4 border-primary"
        >
          <i className="fas fa-bell w-5 mr-3 text-center"></i>
          <span>My Dashboard</span>
        </Link>
        
        <Link 
          to="/healthAdvisor" 
          className="flex items-center px-4 py-3 text-gray-600 hover:bg-blue-50"
        >
          <i className="fas fa-user-injured w-5 mr-3 text-center"></i>
          <span>Health Advisor</span>
        </Link>
        
        <Link 
          to="/insurance" 
          className="flex items-center px-4 py-3 text-gray-600 hover:bg-blue-50"
        >
          <i className="fas fa-chart-line w-5 mr-3 text-center"></i>
          <span>Insurance Plans</span>
        </Link>
        
        <Link 
          to="/profile" 
          className="flex items-center px-4 py-3 text-gray-600 hover:bg-blue-50"
        >
          <i className="fas fa-cog w-5 mr-3 text-center"></i>
          <span>Profile</span>
        </Link>
      </nav>

      {/* User profile at bottom */}
      <div className="mt-auto p-4">
        <div className="bg-blue-50 rounded-lg p-4 flex items-center">
          <img 
            src="https://randomuser.me/api/portraits/women/68.jpg" 
            className="w-10 h-10 rounded-full" 
            alt="Admin" 
          />
          <div className="ml-3">
            <p className="font-medium text-gray-900">Alice Bobson</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidebarUser;