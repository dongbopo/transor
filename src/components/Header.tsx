import React from 'react';
import { useLocation } from 'react-router-dom';
import { Languages, Menu, Moon, Sun } from 'lucide-react';
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
        return 'Transer';
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
    <header className="bg-white dark:bg-[#111113] border-b border-gray-200 dark:border-[#27272a] px-4 md:px-6 py-3 flex items-center justify-between transition-colors duration-300 shadow-sm dark:shadow-none">
      <div className="flex items-center space-x-3">
        {/* Mobile Menu Button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 text-gray-700 dark:text-[#fafafa] hover:bg-gray-100 dark:hover:bg-[#1a1a1d] rounded transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        
        <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded flex items-center justify-center">
          <Languages className="w-4 h-4 text-white" />
        </div>
        <h1 className="text-base md:text-lg font-semibold text-gray-900 dark:text-[#fafafa] truncate">{getPageTitle()}</h1>
        {getPageStatus() && (
          <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium rounded">
            {getPageStatus()}
          </span>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <button 
          onClick={toggleTheme}
          className="p-2 text-gray-700 dark:text-[#fafafa] hover:bg-gray-100 dark:hover:bg-[#1a1a1d] rounded transition-colors"
          title="Toggle theme"
        >
          {actualTheme === 'dark' ? (
            <Sun className="w-4 h-4" />
          ) : (
            <Moon className="w-4 h-4" />
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;
