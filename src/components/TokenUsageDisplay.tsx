import React from 'react';
import { motion } from 'framer-motion';
import { Zap, TrendingUp, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

const TokenUsageDisplay: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  const usagePercentage = user.tokensTotal > 0
    ? (user.tokensRemaining / user.tokensTotal) * 100
    : 0;

  const getUsageColor = (percentage: number) => {
    if (percentage > 50) return 'bg-green-500';
    if (percentage > 20) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getUsageStatus = (percentage: number) => {
    if (percentage > 50) return { color: 'text-green-700', bg: 'bg-green-50', border: 'border-green-200' };
    if (percentage > 20) return { color: 'text-yellow-700', bg: 'bg-yellow-50', border: 'border-yellow-200' };
    return { color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200' };
  };

  const status = getUsageStatus(usagePercentage);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="card"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <h3 className="font-semibold text-gray-900">Token Usage</h3>
        </div>
        <Link
          to="/pricing"
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          Upgrade
        </Link>
      </div>

      {/* Token Stats */}
      <div className="space-y-4">
        {user.subscriptionPlan === 'free' ? (
          <div className={`p-4 ${status.bg} border ${status.border} rounded-lg`}>
            <div className="flex items-start space-x-2">
              <AlertCircle className={`w-5 h-5 ${status.color} flex-shrink-0 mt-0.5`} />
              <div>
                <p className={`text-sm font-medium ${status.color} mb-1`}>
                  Free Plan
                </p>
                <p className="text-xs text-gray-600">
                  Upgrade to access AI translation features
                </p>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Progress Bar */}
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-600">Remaining</span>
                <span className="font-semibold text-gray-900">
                  {user.tokensRemaining.toLocaleString()} / {user.tokensTotal.toLocaleString()}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${getUsageColor(usagePercentage)}`}
                  style={{ width: `${usagePercentage}%` }}
                ></div>
              </div>
            </div>

            {/* Usage Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-gray-50 rounded">
                <div className="text-xs text-gray-500 mb-1">Used</div>
                <div className="text-lg font-bold text-gray-900">
                  {(user.tokensTotal - user.tokensRemaining).toLocaleString()}
                </div>
              </div>
              <div className="p-3 bg-gray-50 rounded">
                <div className="text-xs text-gray-500 mb-1">% Remaining</div>
                <div className="text-lg font-bold text-gray-900">
                  {usagePercentage.toFixed(1)}%
                </div>
              </div>
            </div>

            {/* Low Balance Warning */}
            {usagePercentage < 20 && (
              <div className={`p-3 ${status.bg} border ${status.border} rounded`}>
                <div className="flex items-start space-x-2">
                  <AlertCircle className={`w-4 h-4 ${status.color} flex-shrink-0 mt-0.5`} />
                  <div>
                    <p className={`text-xs font-medium ${status.color} mb-1`}>
                      Low token balance
                    </p>
                    <p className="text-xs text-gray-600">
                      Consider upgrading your plan or purchasing more tokens
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Renewal Info */}
            {user.subscriptionEndDate && (
              <div className="flex items-center justify-between text-xs text-gray-600 pt-2 border-t border-gray-200">
                <span>Renews on</span>
                <span className="font-medium">
                  {new Date(user.subscriptionEndDate).toLocaleDateString()}
                </span>
              </div>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
};

export default TokenUsageDisplay;

