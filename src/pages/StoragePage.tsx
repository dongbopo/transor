import React from 'react';
import StorageDashboard from '../components/StorageDashboard';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { HardDrive, Key, Crown } from 'lucide-react';

const StoragePage: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  const showLicensePromo = user.licenseStatus === 'trial';

  return (
    <div className="space-y-6">
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
  );
};

export default StoragePage;

