import React from 'react';
import { useLocation } from 'react-router-dom';
import { Languages, Share2, Sparkles, Bell, MoreVertical } from 'lucide-react';

const Header: React.FC = () => {
  const location = useLocation();

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Upload Documents';
      case '/jobs':
        return 'My Translation Tasks';
      case '/settings':
        return 'Settings';
      default:
        if (location.pathname.startsWith('/reader')) {
          return 'Document Reader';
        }
        return 'Transor';
    }
  };

  const getPageStatus = () => {
    switch (location.pathname) {
      case '/':
        return 'Ready';
      case '/jobs':
        return 'Active';
      default:
        return null;
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded flex items-center justify-center">
          <Languages className="w-4 h-4 text-white" />
        </div>
        <h1 className="text-lg font-semibold text-gray-900">{getPageTitle()}</h1>
        {getPageStatus() && (
          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
            {getPageStatus()}
          </span>
        )}
      </div>

      <div className="flex items-center space-x-3">
        <button className="flex items-center space-x-2 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded">
          <Share2 className="w-4 h-4" />
          <span>Share</span>
        </button>
        <button className="flex items-center space-x-2 px-3 py-1.5 text-sm bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:opacity-90 rounded">
          <Sparkles className="w-4 h-4" />
          <span>AI Translate</span>
        </button>
        <button className="p-2 text-gray-700 hover:bg-gray-100 rounded relative">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <button className="p-2 text-gray-700 hover:bg-gray-100 rounded">
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};

export default Header;
