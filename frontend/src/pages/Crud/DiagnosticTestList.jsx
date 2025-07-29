import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';

const DiagnosticTestList = () => {
  // Mock data
  const mockTests = [
    { id: 1, name: 'Blood Test', result: 'Normal', date: '2023-05-15T14:30:22', status: 'normal', patient: 'Robert Chen', patientId: 'PAT-00123' },
    { id: 2, name: 'X-Ray', result: 'Fracture detected', date: '2023-05-10T14:25:10', status: 'critical', patient: 'Emily Rodriguez', patientId: 'PAT-00457' },
    { id: 3, name: 'MRI Scan', result: 'No abnormalities', date: '2023-05-05T14:07:45', status: 'normal', patient: 'James Wilson', patientId: 'PAT-00289' },
    { id: 4, name: 'Glucose Test', result: 'Elevated', date: '2023-05-01T13:30:15', status: 'warning', patient: 'Sarah Johnson', patientId: 'PAT-00345' },
    { id: 5, name: 'ECG', result: 'Irregular', date: '2023-04-28T12:45:30', status: 'critical', patient: 'Michael Thompson', patientId: 'PAT-00512' },
  ];

  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTest, setCurrentTest] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    result: '',
    date: new Date().toISOString().split('T')[0],
    status: 'normal',
    patient: '',
    patientId: ''
  });

  // Load mock data
  useEffect(() => {
    const timer = setTimeout(() => {
      setTests(mockTests);
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentTest) {
      setTests(tests.map(test => 
        test.id === currentTest.id ? { ...formData, id: currentTest.id } : test
      ));
    } else {
      const newTest = {
        ...formData,
        id: Math.max(...tests.map(t => t.id), 0) + 1,
        date: `${formData.date}T${new Date().toTimeString().split(' ')[0]}`
      };
      setTests([...tests, newTest]);
    }
    setIsModalOpen(false);
    setCurrentTest(null);
    setFormData({ 
      name: '', 
      result: '', 
      date: new Date().toISOString().split('T')[0],
      status: 'normal',
      patient: '',
      patientId: ''
    });
  };

  const handleDelete = (id) => {
    setTests(tests.filter(test => test.id !== id));
  };

  const openEditModal = (test) => {
    setCurrentTest(test);
    setFormData({
      name: test.name,
      result: test.result,
      date: test.date.split('T')[0],
      status: test.status,
      patient: test.patient,
      patientId: test.patientId
    });
    setIsModalOpen(true);
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'normal': return 'bg-green-100 text-green-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'critical': return 'CRITICAL';
      case 'warning': return 'WARNING';
      case 'normal': return 'NORMAL';
      default: return 'INFO';
    }
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} min ago`;
    if (minutes < 1440) return `${Math.floor(minutes/60)} hours ago`;
    return `${Math.floor(minutes/1440)} days ago`;
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 ml-64 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Diagnostic Tests</h1>
            <p className="text-gray-600">Monitor patient test results</p>
          </div>
          <div className="relative">
            <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
            <input 
              type="text" 
              placeholder="Search tests..." 
              className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex justify-between">
              <div>
                <p className="text-gray-500">Total Tests</p>
                <p className="text-3xl font-bold mt-2">{tests.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <i className="fas fa-flask text-primary text-xl"></i>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex justify-between">
              <div>
                <p className="text-gray-500">Critical</p>
                <p className="text-3xl font-bold mt-2 text-red-500">
                  {tests.filter(t => t.status === 'critical').length}
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
                <p className="text-gray-500">Abnormal</p>
                <p className="text-3xl font-bold mt-2 text-yellow-500">
                  {tests.filter(t => t.status === 'warning').length}
                </p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <i className="fas fa-exclamation-circle text-yellow-500 text-xl"></i>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex justify-between">
              <div>
                <p className="text-gray-500">Normal</p>
                <p className="text-3xl font-bold mt-2 text-green-500">
                  {tests.filter(t => t.status === 'normal').length}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <i className="fas fa-check-circle text-green-500 text-xl"></i>
              </div>
            </div>
          </div>
        </div>

        {/* Tests Table */}
            <div className="bg-white rounded-xl shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-800">Recent Tests</h2>
                <div className="flex space-x-2">
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="px-4 py-2 bg-primary text-black rounded-lg hover:bg-secondary transition flex items-center"
                >
                    <i className="fas fa-plus mr-2"></i> New Test
                </button>
                <div className="relative">
                    <select className="appearance-none bg-white border border-gray-300 rounded-lg py-2 px-4 pr-8 leading-tight focus:outline-none focus:border-primary">
                    <option>All Statuses</option>
                    <option>Critical</option>
                    <option>Warning</option>
                    <option>Normal</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <i className="fas fa-chevron-down"></i>
                    </div>
                </div>
                </div>
            </div>
            
            {loading ? (
                <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
            ) : (
                <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead className="bg-gray-50">
                    <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Test</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {tests.map(test => (
                        <tr key={test.id}>
                        <td className="px-4 py-2 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(test.status)}`}>
                            {getStatusText(test.status)}
                            </span>
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                            <div className="font-medium text-gray-900">{test.name}</div>
                            <div className="text-gray-500">{test.result}</div>
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                            <div className="font-medium text-gray-900">{test.patient}</div>
                            <div className="text-gray-500">ID: {test.patientId}</div>
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                            <div className="text-gray-900">{getTimeAgo(test.date)}</div>
                            <div className="text-gray-500">
                            {new Date(test.date).toLocaleDateString()} {new Date(test.date).toLocaleTimeString()}
                            </div>
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                            <div className="flex space-x-2">
                            <button
                                onClick={() => openEditModal(test)}
                                className="flex items-center px-2 py-1 text-xs bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
                            >
                                <i className="fas fa-edit mr-1"></i>
                                Edit
                            </button>
                            <button
                                onClick={() => handleDelete(test.id)}
                                className="flex items-center px-2 py-1 text-xs bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors"
                            >
                                <i className="fas fa-trash mr-1"></i>
                                Delete
                            </button>
                            </div>
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                </div>
            )}
            
            {/* Pagination */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                    Showing <span className="font-medium">1</span> to <span className="font-medium">{tests.length}</span> of <span className="font-medium">{tests.length}</span> tests
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

        {/* Add/Edit Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-primary">
                  {currentTest ? 'Edit Test' : 'Add New Test'}
                </h2>
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setCurrentTest(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                    Test Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="result">
                    Result
                  </label>
                  <input
                    type="text"
                    id="result"
                    name="result"
                    value={formData.result}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="status">
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  >
                    <option value="normal">Normal</option>
                    <option value="warning">Warning</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="patient">
                    Patient Name
                  </label>
                  <input
                    type="text"
                    id="patient"
                    name="patient"
                    value={formData.patient}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="patientId">
                    Patient ID
                  </label>
                  <input
                    type="text"
                    id="patientId"
                    name="patientId"
                    value={formData.patientId}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="date">
                    Date
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setCurrentTest(null);
                    }}
                    className="mr-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                    >
                    {currentTest ? 'Update' : 'Save'}
                    </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiagnosticTestList;