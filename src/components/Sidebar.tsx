import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Home, Inbox, Languages, FileText, Clock, Settings, Upload, Plus, ChevronDown, ChevronRight, MoreHorizontal, CreditCard, LogOut, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const [projectsExpanded, setProjectsExpanded] = useState(true);

  const navItems = [
    { path: '/', label: 'Upload', icon: Upload },
    { path: '/jobs', label: 'My Tasks', icon: Inbox, badge: 0 },
    { path: '/pricing', label: 'Pricing', icon: CreditCard },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="w-60 bg-white border-r border-gray-200 flex flex-col h-screen">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded flex items-center justify-center text-white font-bold text-sm">
              T
            </div>
            <span className="font-semibold text-sm truncate">Transor</span>
          </div>
          <button className="text-gray-400 hover:text-gray-600">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search documents..."
            className="w-full pl-9 pr-8 py-2 text-sm bg-gray-100 border-0 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="absolute right-3 top-2.5 text-xs text-gray-400">/</span>
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
                className={isActive ? 'nav-link-active' : 'nav-link'}
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

        {/* Recent Documents Section */}
        <div className="mt-6">
          <button
            onClick={() => setProjectsExpanded(!projectsExpanded)}
            className="w-full flex items-center justify-between px-4 py-2 text-xs font-medium text-gray-500 hover:text-gray-700"
          >
            <span>RECENT DOCUMENTS</span>
            {projectsExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
          </button>

          {projectsExpanded && (
            <div className="px-2 space-y-1 mt-2">
              <a href="#" className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="flex-1 truncate">Document 1</span>
                <span className="text-xs text-gray-400">EN→ES</span>
              </a>
              <a href="#" className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="flex-1 truncate">Document 2</span>
                <span className="text-xs text-gray-400">EN→FR</span>
              </a>
              <a href="#" className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="flex-1 truncate">Document 3</span>
                <span className="text-xs text-gray-400">EN→DE</span>
              </a>
            </div>
          )}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-2 border-t border-gray-200">
        {isAuthenticated && user ? (
          <div className="space-y-2">
            {/* User Info */}
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-white">
                    {user.email.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {user.name || user.email}
                  </div>
                  <div className="text-xs text-gray-500 capitalize">
                    {user.subscriptionPlan} Plan
                  </div>
                </div>
              </div>
              
              {/* Token Info */}
              {user.subscriptionPlan !== 'free' && (
                <div className="text-xs text-gray-600 mt-2">
                  <div className="flex justify-between mb-1">
                    <span>Tokens</span>
                    <span className="font-medium">
                      {user.tokensRemaining.toLocaleString()}/{user.tokensTotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1">
                    <div
                      className="h-1 rounded-full bg-gradient-to-r from-blue-500 to-purple-600"
                      style={{ width: `${(user.tokensRemaining / user.tokensTotal) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            {/* Logout Button */}
            <button
              onClick={logout}
              className="nav-link w-full text-red-600 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4" />
              <span>Log out</span>
            </button>
          </div>
        ) : (
          <div className="space-y-1">
            <Link to="/login" className="nav-link-active w-full">
              <User className="w-4 h-4" />
              <span>Log in</span>
            </Link>
            <Link to="/signup" className="nav-link w-full">
              <Plus className="w-4 h-4" />
              <span>Sign up</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;


