import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Inbox, Settings, Upload, Plus, MoreHorizontal, LogOut, User, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  const navItems = [
    { path: '/', label: 'Upload', icon: Upload },
    { path: '/jobs', label: 'My Tasks', icon: Inbox, badge: 0 },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-60 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col h-screen
        transform transition-all duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded flex items-center justify-center text-white font-bold text-sm">
                T
              </div>
              <span className="font-semibold text-sm truncate text-gray-900 dark:text-white">Transor</span>
            </div>
            <div className="flex items-center space-x-1">
              <button className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hidden lg:block transition-colors">
                <MoreHorizontal className="w-4 h-4" />
              </button>
              <button 
                onClick={onClose}
                className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 lg:hidden p-1 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-9 pr-8 py-2 text-sm bg-gray-100 dark:bg-gray-700 dark:text-white border-0 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
            />
            <span className="absolute right-3 top-2.5 text-xs text-gray-400 dark:text-gray-500">/</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-2">
          <div className="px-2 space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => onClose()}
                  className={`
                    flex items-center space-x-3 px-3 py-2 text-sm rounded transition-colors
                    ${isActive 
                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Footer / User Info */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-4">
          {isAuthenticated && user ? (
            <div className="space-y-3">
              <div className="flex items-center space-x-2 px-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {user.name || 'User'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {user.email}
                  </p>
                </div>
              </div>
              
              {/* API Keys Status */}
              <div className="px-2 py-2 bg-gray-50 dark:bg-gray-700/50 rounded text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-gray-600 dark:text-gray-400">API Keys</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {Object.values(user.apiKeys).filter(Boolean).length}/4
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1">
                  <div
                    className="h-1 rounded-full bg-gradient-to-r from-blue-500 to-purple-600"
                    style={{ width: `${(Object.values(user.apiKeys).filter(Boolean).length / 4) * 100}%` }}
                  ></div>
                </div>
              </div>

              <button
                onClick={logout}
                className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Log out</span>
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <Link 
                to="/login" 
                className="flex items-center space-x-2 px-3 py-2 text-sm bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
              >
                <User className="w-4 h-4" />
                <span>Log in</span>
              </Link>
              <Link 
                to="/signup" 
                className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Sign up</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
