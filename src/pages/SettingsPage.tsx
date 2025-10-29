import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Key, Moon, Sun, Monitor, Eye, EyeOff, Check, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { LLMProvider } from '../types';
import toast from 'react-hot-toast';

const SettingsPage: React.FC = () => {
  const { user, updateAPIKeys, updatePreferences } = useAuth();
  const { theme, setTheme, actualTheme } = useTheme();
  
  const [apiKeys, setApiKeys] = useState({
    openai: user?.apiKeys.openai || '',
    gemini: user?.apiKeys.gemini || '',
    grok: user?.apiKeys.grok || '',
    claude: user?.apiKeys.claude || '',
  });

  const [showKeys, setShowKeys] = useState({
    openai: false,
    gemini: false,
    grok: false,
    claude: false,
  });

  const [savingKeys, setSavingKeys] = useState<LLMProvider | null>(null);

  const providers = [
    {
      id: 'openai' as LLMProvider,
      name: 'OpenAI',
      description: 'GPT-4, GPT-3.5 Turbo',
      placeholder: 'sk-...',
      helpUrl: 'https://platform.openai.com/api-keys',
      color: 'from-green-500 to-teal-500',
    },
    {
      id: 'gemini' as LLMProvider,
      name: 'Google Gemini',
      description: 'Gemini Pro, Gemini Ultra',
      placeholder: 'AIza...',
      helpUrl: 'https://makersuite.google.com/app/apikey',
      color: 'from-blue-500 to-indigo-500',
    },
    {
      id: 'grok' as LLMProvider,
      name: 'xAI Grok',
      description: 'Grok-1, Grok-2',
      placeholder: 'xai-...',
      helpUrl: 'https://x.ai/api',
      color: 'from-gray-700 to-gray-900',
    },
    {
      id: 'claude' as LLMProvider,
      name: 'Anthropic Claude',
      description: 'Claude 3 Opus, Sonnet, Haiku',
      placeholder: 'sk-ant-...',
      helpUrl: 'https://console.anthropic.com/settings/keys',
      color: 'from-purple-500 to-pink-500',
    },
  ];

  const handleSaveKey = async (provider: LLMProvider) => {
    const key = apiKeys[provider].trim();
    if (!key) {
      toast.error('Please enter an API key');
      return;
    }

    setSavingKeys(provider);
    
    // Simulate API validation
    await new Promise(resolve => setTimeout(resolve, 500));
    
    updateAPIKeys({ [provider]: key });
    toast.success(`${providers.find(p => p.id === provider)?.name} API key saved!`);
    setSavingKeys(null);
  };

  const handleRemoveKey = (provider: LLMProvider) => {
    updateAPIKeys({ [provider]: undefined });
    setApiKeys(prev => ({ ...prev, [provider]: '' }));
    toast.success(`${providers.find(p => p.id === provider)?.name} API key removed`);
  };

  const themeOptions = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your API keys and preferences
        </p>
      </motion.div>

      {/* Theme Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card"
      >
        <div className="flex items-center space-x-3 mb-4">
          {actualTheme === 'dark' ? (
            <Moon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          ) : (
            <Sun className="w-5 h-5 text-orange-600" />
          )}
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Appearance</h2>
        </div>
        
        <div className="grid grid-cols-3 gap-3">
          {themeOptions.map((option) => {
            const Icon = option.icon;
            const isSelected = theme === option.value;
            
            return (
              <button
                key={option.value}
                onClick={() => setTheme(option.value as any)}
                className={`
                  relative p-4 rounded-lg border-2 transition-all
                  ${isSelected
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }
                `}
              >
                {isSelected && (
                  <div className="absolute top-2 right-2">
                    <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  </div>
                )}
                <Icon className={`w-6 h-6 mx-auto mb-2 ${
                  isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'
                }`} />
                <p className={`text-sm font-medium ${
                  isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'
                }`}>
                  {option.label}
                </p>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* API Keys Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card"
      >
        <div className="flex items-center space-x-3 mb-4">
          <Key className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">API Keys</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Add your own API keys to use Transer. Your keys are stored locally and never sent to our servers.
            </p>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-2">
            <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-900 dark:text-blue-100">
              <p className="font-medium mb-1">Your keys, your control</p>
              <p className="text-blue-700 dark:text-blue-300">
                Transer doesn't charge for translations. You pay directly to the AI providers based on your usage. 
                API keys are encrypted and stored only on your device.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {providers.map((provider, index) => {
            const hasKey = !!user?.apiKeys[provider.id];
            const isVisible = showKeys[provider.id];
            
            return (
              <motion.div
                key={provider.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
              >
                <div className="flex items-start space-x-3 mb-3">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${provider.color} flex items-center justify-center flex-shrink-0`}>
                    <Key className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {provider.name}
                      </h3>
                      {hasKey && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                          <Check className="w-3 h-3 mr-1" />
                          Connected
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {provider.description}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex space-x-2">
                    <div className="flex-1 relative">
                      <input
                        type={isVisible ? 'text' : 'password'}
                        value={apiKeys[provider.id]}
                        onChange={(e) => setApiKeys(prev => ({
                          ...prev,
                          [provider.id]: e.target.value
                        }))}
                        placeholder={provider.placeholder}
                        className="input-field pr-10"
                      />
                      <button
                        onClick={() => setShowKeys(prev => ({
                          ...prev,
                          [provider.id]: !prev[provider.id]
                        }))}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        {isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    
                    {hasKey ? (
                      <button
                        onClick={() => handleRemoveKey(provider.id)}
                        className="btn-outline text-red-600 dark:text-red-400 border-red-300 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        Remove
                      </button>
                    ) : (
                      <button
                        onClick={() => handleSaveKey(provider.id)}
                        disabled={savingKeys === provider.id || !apiKeys[provider.id].trim()}
                        className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {savingKeys === provider.id ? 'Saving...' : 'Save'}
                      </button>
                    )}
                  </div>
                  
                  <a
                    href={provider.helpUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline inline-block"
                  >
                    Get your {provider.name} API key →
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default SettingsPage;
