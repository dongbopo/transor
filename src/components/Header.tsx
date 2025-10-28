import React from 'react';
import { useLocation } from 'react-router-dom';
import { Languages, Share2, Sparkles, Bell, MoreVertical, Menu, Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface HeaderProps {
  onMenuClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const location = useLocation();
  const { toggleTheme, actualTheme } = useTheme();

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
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 md:px-6 py-3 flex items-center justify-between transition-colors">
      <div className="flex items-center space-x-3">
        {/* Mobile Menu Button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        
        <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded flex items-center justify-center">
          <Languages className="w-4 h-4 text-white" />
        </div>
        <h1 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white truncate">{getPageTitle()}</h1>
        {getPageStatus() && (
          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
            {getPageStatus()}
          </span>
        )}
      </div>

      <div className="flex items-center space-x-1 md:space-x-2">
        <button className="hidden md:flex items-center space-x-2 px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors">
          <Share2 className="w-4 h-4" />
          <span>Share</span>
        </button>
        <button className="flex items-center space-x-2 px-2 md:px-3 py-1.5 text-xs md:text-sm bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:opacity-90 rounded transition-opacity">
          <Sparkles className="w-4 h-4" />
          <span className="hidden sm:inline">AI Translate</span>
        </button>
        <button 
          onClick={toggleTheme}
          className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
          title="Toggle theme"
        >
          {actualTheme === 'dark' ? (
            <Sun className="w-4 h-4" />
          ) : (
            <Moon className="w-4 h-4" />
          )}
        </button>
        <button className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded relative transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <button className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors">
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};

export default Header;
