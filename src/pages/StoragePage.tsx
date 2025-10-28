import React from 'react';
import StorageDashboard from '../components/StorageDashboard';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { HardDrive, Key, Crown, CreditCard, User, Lock } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const StoragePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (!user) return null;

  const showLicensePromo = user.licenseStatus === 'trial';

  const navItems = [
    { id: 'storage', label: 'Storage', icon: HardDrive, path: '/storage' },
    { id: 'account', label: 'Account', icon: User, path: '/settings' },
    { id: 'api-keys', label: 'API Keys', icon: Key, path: '/settings' },
    { id: 'security', label: 'Security', icon: Lock, path: '/settings' },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-start justify-start gap-6">
        {/* Settings Navigation Sidebar */}
        <nav
          className="flex-shrink-0 w-[220px] bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-2"
          aria-label="Settings navigation"
        >
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.id === 'storage';
              
              return (
                <button
                  key={item.id}
                  onClick={() => navigate(item.path)}
                  className={`
                    w-full flex items-center space-x-3 px-3 py-2.5 text-sm rounded-lg transition-colors
                    ${isActive
                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Main Content */}
        <div className="flex-1 space-y-6">
          {/* License Promotion Banner (for trial users) */}
          {showLicensePromo && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <Crown className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-1">
                      Upgrade to Lifetime License
                    </h3>
                    <p className="text-white/90 text-sm">
                      Get unlimited access + 5GB storage for a one-time payment of $49
                    </p>
                  </div>
                </div>
                <button className="btn-primary bg-white text-blue-600 hover:bg-gray-100">
                  Upgrade Now
                </button>
              </div>
            </motion.div>
          )}

          {/* License Status Card */}
          <div className="card">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`
                  w-12 h-12 rounded-xl flex items-center justify-center
                  ${user.licenseStatus === 'active'
                    ? 'bg-green-100 dark:bg-green-900/30'
                    : 'bg-yellow-100 dark:bg-yellow-900/30'
                  }
                `}>
                  <Key className={`
                    w-6 h-6
                    ${user.licenseStatus === 'active'
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-yellow-600 dark:text-yellow-400'
                    }
                  `} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    License Status
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {user.licenseStatus === 'active' ? (
                      <>
                        <span className="text-green-600 dark:text-green-400 font-medium">Active</span>
                        {user.licenseKey && <span className="ml-2 font-mono text-xs">({user.licenseKey})</span>}
                      </>
                    ) : (
                      <span className="text-yellow-600 dark:text-yellow-400 font-medium">Trial Mode</span>
                    )}
                  </p>
                </div>
              </div>
              {user.licenseStatus === 'trial' && (
                <button className="btn-outline">
                  Purchase License
                </button>
              )}
            </div>
          </div>

          {/* Storage Dashboard */}
          <StorageDashboard />
        </div>
      </div>
    </div>
  );
};

export default StoragePage;

