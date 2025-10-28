import React, { useState } from 'react';
import { Shield, X, CheckCircle } from 'lucide-react';
import { useSettingsContext } from '../contexts/SettingsContext';

const PrivacyNotice: React.FC = () => {
  const { updateSettings } = useSettingsContext();
  const [isVisible, setIsVisible] = useState(true);

  const handleDismiss = () => {
    setIsVisible(false);
    updateSettings({ showPrivacyNotice: false });
  };

  if (!isVisible) return null;

  return (
    <div className="card bg-blue-50 border-blue-200">
      <div className="flex items-start space-x-3">
        <Shield className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            Your Privacy Matters
          </h3>
          <div className="space-y-2 text-blue-800">
            <div className="flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
              <p className="text-sm">
                <strong>Local Processing:</strong> Your documents are processed locally in your browser when possible.
              </p>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
              <p className="text-sm">
                <strong>No Retention:</strong> Content is not stored on our servers unless you explicitly choose cloud storage.
              </p>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
              <p className="text-sm">
                <strong>Secure Processing:</strong> When cloud processing is needed, data is encrypted in transit and deleted after processing.
              </p>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
              <p className="text-sm">
                <strong>Your Control:</strong> You can choose to save files locally or opt-in to cloud storage for convenience.
              </p>
            </div>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="text-blue-400 hover:text-blue-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default PrivacyNotice;
