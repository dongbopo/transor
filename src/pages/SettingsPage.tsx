import React from 'react';
import { motion } from 'framer-motion';
import { Settings, Globe, Database, Keyboard, Eye, EyeOff } from 'lucide-react';
import { useSettingsContext } from '../contexts/SettingsContext';
import LanguageSelector from '../components/LanguageSelector';
import DomainSelector from '../components/DomainSelector';

const SettingsPage: React.FC = () => {
  const { state, updateSettings } = useSettingsContext();

  const handleLanguageChange = (language: string) => {
    updateSettings({ defaultTargetLanguage: language });
  };

  const handleDomainChange = (domain: any) => {
    updateSettings({ defaultDomain: domain });
  };

  const handleStorageProviderChange = (provider: any) => {
    updateSettings({ storageProvider: provider });
  };

  const handleTogglePrivacyNotice = () => {
    updateSettings({ showPrivacyNotice: !state.settings.showPrivacyNotice });
  };

  const handleToggleRTLSupport = () => {
    updateSettings({ rtlSupport: !state.settings.rtlSupport });
  };

  const handleToggleKeyboardShortcuts = () => {
    updateSettings({ keyboardShortcuts: !state.settings.keyboardShortcuts });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center space-x-3 mb-8">
          <Settings className="w-8 h-8 text-primary-600" />
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        </div>

        <div className="grid gap-8">
          {/* Default Language Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card"
          >
            <div className="flex items-center space-x-3 mb-6">
              <Globe className="w-6 h-6 text-primary-600" />
              <h2 className="text-xl font-semibold text-gray-900">Default Language</h2>
            </div>
            <LanguageSelector
              value={state.settings.defaultTargetLanguage}
              onChange={handleLanguageChange}
            />
          </motion.div>

          {/* Default Domain Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card"
          >
            <div className="flex items-center space-x-3 mb-6">
              <Settings className="w-6 h-6 text-primary-600" />
              <h2 className="text-xl font-semibold text-gray-900">Default Domain</h2>
            </div>
            <DomainSelector
              value={state.settings.defaultDomain}
              onChange={handleDomainChange}
            />
          </motion.div>

          {/* Storage Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card"
          >
            <div className="flex items-center space-x-3 mb-6">
              <Database className="w-6 h-6 text-primary-600" />
              <h2 className="text-xl font-semibold text-gray-900">Storage Provider</h2>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { value: 'local', label: 'Local Download', description: 'Download files directly to your device' },
                  { value: 'lovable', label: 'Lovable Storage', description: 'Save files to Lovable cloud storage' },
                  { value: 's3', label: 'S3 Compatible', description: 'Connect to your own S3-compatible storage' },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleStorageProviderChange(option.value)}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                      state.settings.storageProvider === option.value
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <h3 className="font-medium text-gray-900 mb-1">{option.label}</h3>
                    <p className="text-sm text-gray-500">{option.description}</p>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Accessibility Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card"
          >
            <div className="flex items-center space-x-3 mb-6">
              <Keyboard className="w-6 h-6 text-primary-600" />
              <h2 className="text-xl font-semibold text-gray-900">Accessibility & Display</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">Show Privacy Notice</h3>
                  <p className="text-sm text-gray-500">Display privacy information on the upload page</p>
                </div>
                <button
                  onClick={handleTogglePrivacyNotice}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    state.settings.showPrivacyNotice ? 'bg-primary-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      state.settings.showPrivacyNotice ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">RTL Language Support</h3>
                  <p className="text-sm text-gray-500">Enable right-to-left text direction for Arabic, Hebrew, etc.</p>
                </div>
                <button
                  onClick={handleToggleRTLSupport}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    state.settings.rtlSupport ? 'bg-primary-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      state.settings.rtlSupport ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">Keyboard Shortcuts</h3>
                  <p className="text-sm text-gray-500">Enable keyboard shortcuts for faster navigation</p>
                </div>
                <button
                  onClick={handleToggleKeyboardShortcuts}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    state.settings.keyboardShortcuts ? 'bg-primary-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      state.settings.keyboardShortcuts ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default SettingsPage;
