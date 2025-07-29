import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from '../../components/Sidebar';
import AlertRow from '../../components/AlertRow';

const Dashboard = () => {
  const [alerts, setAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pulsingAlerts, setPulsingAlerts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Simulate API call to fetch alerts
    const fetchAlerts = () => {
      setIsLoading(true);
      setTimeout(() => {
        const mockAlerts = [
          {
            id: 1,
            status: 'critical',
            type: 'cardiac',
            title: 'Cardiac Anomaly Detected',
            description: 'Heart rate exceeded 180 bpm',
            patient: {
              name: 'Robert Chen',
              id: 'PAT-00123',
              avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
            },
            relativeTime: 'Just now',
            timestamp: '07/29/2025 14:30:22'
          },
          {
            id: 2,
            status: 'critical',
            type: 'respiratory',
            title: 'Respiratory Distress',
            description: 'Oxygen saturation below 85%',
            patient: {
              name: 'Emily Rodriguez',
              id: 'PAT-00457',
              avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
            },
            relativeTime: '5 min ago',
            timestamp: '07/29/2025 14:25:10'
          },
          {
            id: 3,
            status: 'warning',
            type: 'temperature',
            title: 'Elevated Temperature',
            description: 'Body temp: 38.7°C (101.7°F)',
            patient: {
              name: 'James Wilson',
              id: 'PAT-00289',
              avatar: 'https://randomuser.me/api/portraits/men/67.jpg'
            },
            relativeTime: '23 min ago',
            timestamp: '07/29/2025 14:07:45'
          },
          {
            id: 4,
            status: 'resolved',
            type: 'medication',
            title: 'Medication Missed',
            description: 'Insulin dose not taken',
            patient: {
              name: 'Sarah Johnson',
              id: 'PAT-00345',
              avatar: 'https://randomuser.me/api/portraits/women/22.jpg'
            },
            relativeTime: '1 hour ago',
            timestamp: '07/29/2025 13:30:15'
          },
          {
            id: 5,
            status: 'info',
            type: 'device',
            title: 'Device Reconnected',
            description: 'Wearable device back online',
            patient: {
              name: 'Michael Thompson',
              id: 'PAT-00512',
              avatar: 'https://randomuser.me/api/portraits/men/75.jpg'
            },
            relativeTime: '2 hours ago',
            timestamp: '07/29/2025 12:45:30'
          }
        ];
        setAlerts(mockAlerts);
        setPulsingAlerts([1]); 
        setIsLoading(false);
      }, 1000);
    };

    fetchAlerts();

    // Simulate real-time updates
    const interval = setInterval(() => {
      setPulsingAlerts(prev => {
        if (prev.includes(1)) {
          return prev.filter(id => id !== 1);
        } else {
          return [...prev, 1];
        }
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Filter alerts based on search term
  const filteredAlerts = useMemo(() => {
  if (!searchTerm) return alerts;
  
  const lowerCaseSearch = searchTerm.toLowerCase();
  
  return alerts.filter(alert => {
    return (
      alert.title.toLowerCase().includes(lowerCaseSearch) ||
      alert.description.toLowerCase().includes(lowerCaseSearch) ||
      alert.patient.name.toLowerCase().includes(lowerCaseSearch) ||
      alert.type.toLowerCase().includes(lowerCaseSearch)
    );
  });
}, [alerts, searchTerm]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 ml-64">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="flex justify-between items-center px-8 py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Alerts Dashboard</h1>
              <p className="text-gray-600">Monitor patient health alerts in real-time</p>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="relative">
                <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
                <input 
                  type="text" 
                  placeholder="Search alerts..." 
                  className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>
              
              <div className="relative">
                <i className="fas fa-bell text-gray-600 text-xl"></i>
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">3</span>
              </div>
            </div>
          </div>
        </header>
        
        {/* Stats Overview */}
        <div className="px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex justify-between">
                <div>
                  <p className="text-gray-500">Total Alerts</p>
                  <p className="text-3xl font-bold mt-2">{filteredAlerts.length}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-lg">
                  <i className="fas fa-bell text-primary text-xl"></i>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex justify-between">
                <div>
                  <p className="text-gray-500">Critical</p>
                  <p className="text-3xl font-bold mt-2 text-red-500">
                    {filteredAlerts.filter(a => a.status === 'critical').length}
                  </p>
                </div>
                <div className="bg-red-100 p-3 rounded-lg">
                  <i className="fas fa-exclamation-triangle text-red-500 text-xl"></i>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex justify-between">
                <div>
                  <p className="text-gray-500">Unresolved</p>
                  <p className="text-3xl font-bold mt-2 text-yellow-500">
                    {filteredAlerts.filter(a => a.status !== 'resolved').length}
                  </p>
                </div>
                <div className="bg-yellow-100 p-3 rounded-lg">
                  <i className="fas fa-clock text-yellow-500 text-xl"></i>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex justify-between">
                <div>
                  <p className="text-gray-500">Resolved</p>
                  <p className="text-3xl font-bold mt-2 text-green-500">
                    {filteredAlerts.filter(a => a.status === 'resolved').length}
                  </p>
                </div>
                <div className="bg-green-100 p-3 rounded-lg">
                  <i className="fas fa-check-circle text-green-500 text-xl"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Alerts Table */}
        <div className="px-8 pb-8">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-800">Recent Alerts</h2>
                <div className="flex space-x-2">
                  <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition">
                    <i className="fas fa-plus mr-2"></i> New Alert
                  </button>
                  <div className="relative">
                    <select className="appearance-none bg-white border border-gray-300 rounded-lg py-2 px-4 pr-8 leading-tight focus:outline-none focus:border-primary">
                      <option>All Statuses</option>
                      <option>Critical</option>
                      <option>Warning</option>
                      <option>Resolved</option>
                      <option>Info</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <i className="fas fa-chevron-down"></i>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Alert</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredAlerts.map(alert => (
                      <AlertRow 
                        key={alert.id} 
                        alert={alert} 
                        isPulsing={pulsingAlerts.includes(alert.id)} 
                      />
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredAlerts.length}</span> of <span className="font-medium">{filteredAlerts.length}</span> alerts
                  </div>
                  <div className="flex space-x-2">
                    <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                      Previous
                    </button>
                    <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary">
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;