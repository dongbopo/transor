import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { HardDrive, AlertTriangle, CheckCircle, TrendingUp, Plus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

interface StoragePurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPurchase: (amountGB: number) => Promise<void>;
}

const StoragePurchaseModal: React.FC<StoragePurchaseModalProps> = ({ isOpen, onClose, onPurchase }) => {
  const [selectedAmount, setSelectedAmount] = useState(5);
  const [isPurchasing, setIsPurchasing] = useState(false);

  const storageOptions = [
    { gb: 1, popular: false },
    { gb: 5, popular: true },
    { gb: 10, popular: false },
    { gb: 20, popular: false },
  ];

  const handlePurchase = async () => {
    setIsPurchasing(true);
    try {
      await onPurchase(selectedAmount);
      toast.success(`Successfully added ${selectedAmount} GB storage!`);
      onClose();
    } catch (error) {
      toast.error('Purchase failed. Please try again.');
    } finally {
      setIsPurchasing(false);
    }
  };

  if (!isOpen) return null;

  const price = selectedAmount * 5;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-gray-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl"
      >
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Upgrade Storage
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          One-time payment for lifetime storage
        </p>

        <div className="grid grid-cols-2 gap-3 mb-6">
          {storageOptions.map((option) => (
            <button
              key={option.gb}
              onClick={() => setSelectedAmount(option.gb)}
              className={`
                relative p-4 rounded-lg border-2 transition-all
                ${selectedAmount === option.gb
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }
              `}
            >
              {option.popular && (
                <span className="absolute -top-2 right-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs px-2 py-0.5 rounded-full">
                  Popular
                </span>
              )}
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {option.gb} GB
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                ${option.gb * 5} lifetime
              </div>
            </button>
          ))}
        </div>

        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Additional Storage</span>
            <span className="font-semibold text-gray-900 dark:text-white">{selectedAmount} GB</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Price per GB</span>
            <span className="font-semibold text-gray-900 dark:text-white">$5</span>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-600 my-2"></div>
          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-900 dark:text-white">Total</span>
            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">${price}</span>
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 btn-outline"
            disabled={isPurchasing}
          >
            Cancel
          </button>
          <button
            onClick={handlePurchase}
            className="flex-1 btn-primary"
            disabled={isPurchasing}
          >
            {isPurchasing ? 'Processing...' : `Purchase $${price}`}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const StorageDashboard: React.FC = () => {
  const { user, purchaseStorage } = useAuth();
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);

  if (!user) return null;

  const { storage } = user;
  const alertLevel = storage.usagePercentage >= 95 ? 'critical' : storage.usagePercentage >= 80 ? 'warning' : 'normal';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Storage Management</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your document storage and purchases
          </p>
        </div>
        <button
          onClick={() => setShowPurchaseModal(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Upgrade Storage</span>
        </button>
      </div>

      {/* Alert */}
      {alertLevel !== 'normal' && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`
            p-4 rounded-lg border-l-4 flex items-start space-x-3
            ${alertLevel === 'critical'
              ? 'bg-red-50 dark:bg-red-900/20 border-red-500'
              : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500'
            }
          `}
        >
          <AlertTriangle className={`
            w-5 h-5 flex-shrink-0
            ${alertLevel === 'critical' ? 'text-red-600 dark:text-red-400' : 'text-yellow-600 dark:text-yellow-400'}
          `} />
          <div>
            <h3 className={`
              font-semibold mb-1
              ${alertLevel === 'critical' ? 'text-red-900 dark:text-red-100' : 'text-yellow-900 dark:text-yellow-100'}
            `}>
              {alertLevel === 'critical' ? 'Storage Almost Full!' : 'Storage Warning'}
            </h3>
            <p className={`
              text-sm
              ${alertLevel === 'critical' ? 'text-red-700 dark:text-red-200' : 'text-yellow-700 dark:text-yellow-200'}
            `}>
              You're using {storage.usagePercentage.toFixed(0)}% of your storage.
              {alertLevel === 'critical' 
                ? ' Please upgrade or delete documents to continue.'
                : ' Consider upgrading your storage soon.'
              }
            </p>
          </div>
        </motion.div>
      )}

      {/* Storage Overview */}
      <div className="card">
        <div className="flex items-center space-x-3 mb-6">
          <HardDrive className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Storage Usage</h3>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {storage.usedGB.toFixed(2)} GB used of {storage.totalGB} GB
            </span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {storage.usagePercentage.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div
              className={`
                h-3 rounded-full transition-all duration-300
                ${alertLevel === 'critical'
                  ? 'bg-gradient-to-r from-red-500 to-red-600'
                  : alertLevel === 'warning'
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                  : 'bg-gradient-to-r from-blue-500 to-purple-600'
                }
              `}
              style={{ width: `${Math.min(storage.usagePercentage, 100)}%` }}
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {storage.usedGB.toFixed(2)} GB
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Used</div>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {storage.availableGB.toFixed(2)} GB
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Available</div>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {storage.totalGB} GB
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Total</div>
          </div>
        </div>
      </div>

      {/* Purchase History */}
      {user.storagePurchases.length > 0 && (
        <div className="card">
          <div className="flex items-center space-x-3 mb-4">
            <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Purchase History</h3>
          </div>
          <div className="space-y-3">
            {user.storagePurchases.map((purchase) => (
              <div
                key={purchase.id}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      +{purchase.amountGB} GB Storage
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      {new Date(purchase.purchasedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="text-lg font-bold text-gray-900 dark:text-white">
                  ${purchase.pricePaid}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Purchase Modal */}
      <StoragePurchaseModal
        isOpen={showPurchaseModal}
        onClose={() => setShowPurchaseModal(false)}
        onPurchase={purchaseStorage}
      />
    </div>
  );
};

export default StorageDashboard;

