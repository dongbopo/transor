import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { Upload, FileText, Globe, Shield, Zap, Key, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useDocumentContext } from '../contexts/DocumentContext';
import { useSettingsContext } from '../contexts/SettingsContext';
import { useAuth } from '../contexts/AuthContext';
import LanguageSelector from '../components/LanguageSelector';
import DomainSelector from '../components/DomainSelector';
import LLMProviderSelector from '../components/LLMProviderSelector';
import { LLMProvider } from '../types';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { uploadDocument, state } = useDocumentContext();
  const { state: settingsState } = useSettingsContext();
  const { user, isAuthenticated, hasAPIKey } = useAuth();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [targetLanguage, setTargetLanguage] = useState(settingsState.settings.defaultTargetLanguage);
  const [domain, setDomain] = useState(settingsState.settings.defaultDomain);
  const [llmProvider, setLlmProvider] = useState<LLMProvider>('openai');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setSelectedFiles(acceptedFiles);
    toast.success(`${acceptedFiles.length} file(s) selected`);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/rtf': ['.rtf'],
      'application/vnd.oasis.opendocument.text': ['.odt'],
    },
    multiple: true,
  });

  const handleUpload = async () => {
    if (!isAuthenticated) {
      toast.error('Please log in to upload documents');
      navigate('/login');
      return;
    }

    if (!hasAPIKey(llmProvider)) {
      toast.error(`Please add your ${llmProvider.toUpperCase()} API key in Settings first`);
      navigate('/settings');
      return;
    }

    if (selectedFiles.length === 0) {
      toast.error('Please select at least one file');
      return;
    }

    try {
      for (const file of selectedFiles) {
        await uploadDocument(file);
      }
      
      toast.success('Files uploaded successfully!');
      navigate('/jobs');
    } catch (error) {
      toast.error('Upload failed. Please try again.');
      console.error('Upload error:', error);
    }
  };

  const supportedFormats = [
    { type: 'DOCX', description: 'Microsoft Word', icon: '📄' },
    { type: 'PDF', description: 'PDF Document', icon: '📕' },
    { type: 'DOC', description: 'Word 97-2003', icon: '📝' },
    { type: 'RTF', description: 'Rich Text', icon: '📋' },
    { type: 'ODT', description: 'OpenDocument', icon: '📃' },
  ];

  const hasAnyAPIKey = user && Object.values(user.apiKeys).some(key => !!key);

  return (
    <div className="max-w-6xl mx-auto">
      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6"
      >
        <div className="stat-card transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Documents</span>
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {state.documents.length}
          </div>
        </div>

        <div className="stat-card transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">In Progress</span>
            <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {state.documents.filter(d => d.status.stage === 'translating' || d.status.stage === 'processing').length}
          </div>
        </div>

        <div className="stat-card transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Completed</span>
            <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <Shield className="w-4 h-4 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {state.documents.filter(d => d.status.stage === 'completed').length}
          </div>
        </div>

        <div className="stat-card transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">API Keys</span>
            <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
              <Key className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {user ? Object.values(user.apiKeys).filter(Boolean).length : 0}/4
          </div>
        </div>
      </motion.div>

      {/* API Key Warning */}
      {isAuthenticated && !hasAnyAPIKey && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-6"
        >
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-amber-900 dark:text-amber-100 mb-1">
                API Key Required
              </h3>
              <p className="text-sm text-amber-700 dark:text-amber-200 mb-2">
                To start translating, you need to add at least one AI provider API key.
              </p>
              <button
                onClick={() => navigate('/settings')}
                className="text-sm font-medium text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 underline"
              >
                Add API Keys in Settings →
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Main Upload Area */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card mb-6"
      >
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Upload Your Documents
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Drop your files here or click to browse
          </p>
        </div>

        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-lg p-8 md:p-12 text-center cursor-pointer transition-all
            ${isDragActive
              ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20'
              : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 bg-gray-50 dark:bg-gray-800/50'
            }
          `}
        >
          <input {...getInputProps()} />
          <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400 dark:text-gray-500" />
          {isDragActive ? (
            <p className="text-blue-600 dark:text-blue-400 font-medium">Drop files here...</p>
          ) : (
            <>
              <p className="text-gray-900 dark:text-white font-medium mb-2">
                Click to upload or drag and drop
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                DOCX, PDF, DOC, RTF, ODT (max 100MB each)
              </p>
            </>
          )}
        </div>

        {selectedFiles.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
              Selected files ({selectedFiles.length}):
            </p>
            <div className="space-y-2">
              {selectedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded"
                >
                  <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
                    {file.name}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={selectedFiles.length === 0 || !isAuthenticated}
          className="btn-primary w-full mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {!isAuthenticated ? 'Log in to Upload' : `Upload ${selectedFiles.length} file(s)`}
        </button>
      </motion.div>

      {/* Configuration Section */}
      <div className="grid lg:grid-cols-3 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 space-y-4"
        >
          {/* LLM Provider Selector */}
          <div className="card">
            <LLMProviderSelector
              value={llmProvider}
              onChange={setLlmProvider}
              disabled={!isAuthenticated}
            />
          </div>

          {/* Language & Domain */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="card">
              <div className="flex items-center space-x-2 mb-3">
                <Globe className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Target Language</h3>
              </div>
              <LanguageSelector
                value={targetLanguage}
                onChange={setTargetLanguage}
              />
            </div>

            <div className="card">
              <div className="flex items-center space-x-2 mb-3">
                <Zap className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Domain</h3>
              </div>
              <DomainSelector
                value={domain}
                onChange={setDomain}
              />
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card"
        >
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Quick Actions</h3>
          <div className="space-y-2">
            <button
              onClick={() => navigate('/jobs')}
              className="w-full btn-outline text-left"
            >
              View All Tasks
            </button>
            <button
              onClick={() => navigate('/settings')}
              className="w-full btn-outline text-left"
            >
              Manage API Keys
            </button>
            <button
              onClick={() => navigate('/pricing')}
              className="w-full btn-outline text-left"
            >
              Pricing Info
            </button>
          </div>
        </motion.div>
      </div>

      {/* Supported Formats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="card"
      >
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Supported File Formats</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {supportedFormats.map((format) => (
            <div
              key={format.type}
              className="flex items-center space-x-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <span className="text-2xl">{format.icon}</span>
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{format.type}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{format.description}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default HomePage;
