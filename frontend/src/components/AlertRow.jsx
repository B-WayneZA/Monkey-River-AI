import React from 'react';

const AlertRow = ({ alert, isPulsing }) => {
  const getStatusBadge = () => {
    switch(alert.status) {
      case 'critical':
        return <span className="status-badge critical-badge">CRITICAL</span>;
      case 'warning':
        return <span className="status-badge warning-badge">WARNING</span>;
      case 'resolved':
        return <span className="status-badge resolved-badge">RESOLVED</span>;
      default:
        return <span className="status-badge info-badge">INFO</span>;
    }
  };

  const getAlertIcon = () => {
    switch(alert.type) {
      case 'cardiac':
        return <i className="fas fa-heartbeat text-red-500"></i>;
      case 'respiratory':
        return <i className="fas fa-lungs text-red-500"></i>;
      case 'temperature':
        return <i className="fas fa-temperature-high text-yellow-500"></i>;
      case 'medication':
        return <i className="fas fa-prescription-bottle text-green-500"></i>;
      default:
        return <i className="fas fa-sync-alt text-blue-500"></i>;
    }
  };

  const getAlertBg = () => {
    switch(alert.type) {
      case 'cardiac':
      case 'respiratory':
        return 'bg-red-100';
      case 'temperature':
        return 'bg-yellow-100';
      case 'medication':
        return 'bg-green-100';
      default:
        return 'bg-blue-100';
    }
  };

  return (
    <tr className={isPulsing ? 'pulse' : ''}>
      <td className="px-6 py-4 whitespace-nowrap">
        {getStatusBadge()}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className={`${getAlertBg()} p-2 rounded-lg mr-3`}>
            {getAlertIcon()}
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900">{alert.title}</div>
            <div className="text-sm text-gray-500">{alert.description}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <img className="h-8 w-8 rounded-full" src={alert.patient.avatar} alt={alert.patient.name} />
          <div className="ml-3">
            <div className="text-sm font-medium text-gray-900">{alert.patient.name}</div>
            <div className="text-sm text-gray-500">ID: {alert.patient.id}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{alert.relativeTime}</div>
        <div className="text-sm text-gray-500">{alert.timestamp}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        <button className="text-primary hover:text-secondary mr-3">
          <i className="fas fa-eye"></i>
        </button>
        <button className="text-green-500 hover:text-green-700 mr-3">
          <i className="fas fa-check"></i>
        </button>
        <button className="text-red-500 hover:text-red-700">
          <i className="fas fa-times"></i>
        </button>
      </td>
    </tr>
  );
};

export default AlertRow;