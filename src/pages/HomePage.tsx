import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { Upload, FileText, Globe, Shield, Zap } from 'lucide-react';
import toast from 'react-hot-toast';
import { useDocumentContext } from '../contexts/DocumentContext';
import { useSettingsContext } from '../contexts/SettingsContext';
import { useAuth } from '../contexts/AuthContext';
import LanguageSelector from '../components/LanguageSelector';
import DomainSelector from '../components/DomainSelector';
import LLMProviderSelector from '../components/LLMProviderSelector';
import TokenUsageDisplay from '../components/TokenUsageDisplay';
import { LLMProvider } from '../types';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { uploadDocument, state } = useDocumentContext();
  const { state: settingsState } = useSettingsContext();
  const { user, isAuthenticated } = useAuth();
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

    if (user?.subscriptionPlan === 'free') {
      toast.error('Please upgrade to a paid plan to use translation features');
      navigate('/pricing');
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
      
      // Navigate to the first uploaded document
      toast.success('Files uploaded successfully!');
      // The DocumentContext will handle navigation to the reader page
    } catch (error) {
      toast.error('Upload failed. Please try again.');
      console.error('Upload error:', error);
    }
  };

  const supportedFormats = [
    { type: 'DOCX', description: 'Microsoft Word documents' },
    { type: 'PDF', description: 'Portable Document Format' },
    { type: 'DOC', description: 'Legacy Word documents' },
    { type: 'RTF', description: 'Rich Text Format' },
    { type: 'ODT', description: 'OpenDocument Text' },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="grid grid-cols-4 gap-4 mb-8"
      >
        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-500">Total Documents</span>
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-4 h-4 text-blue-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {state.documents.length}
          </div>
          <div className="text-xs text-gray-500 mt-1">Ready to translate</div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-500">Languages</span>
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <Globe className="w-4 h-4 text-purple-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">15+</div>
          <div className="text-xs text-gray-500 mt-1">Supported locales</div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-500">AI-Powered</span>
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-green-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">Fast</div>
          <div className="text-xs text-green-600 mt-1">↑ High quality</div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-500">Privacy</span>
            <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Shield className="w-4 h-4 text-yellow-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">100%</div>
          <div className="text-xs text-gray-500 mt-1">Secure & private</div>
        </div>
      </motion.div>

      {/* Main Upload Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="card mb-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Upload Documents</h2>
          <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-medium rounded hover:opacity-90">
            + New Document
          </button>
        </div>
        
        {/* Dropzone */}
        <div
          {...getRootProps()}
          className={`dropzone ${isDragActive ? 'dropzone-active' : ''}`}
        >
          <input {...getInputProps()} />
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          {isDragActive ? (
            <p className="text-lg text-primary-600 font-medium">
              Drop your files here...
            </p>
          ) : (
            <div>
              <p className="text-lg text-gray-600 font-medium mb-2">
                Drag & drop files here, or click to select
              </p>
              <p className="text-sm text-gray-500">
                Supports DOCX, PDF, DOC, RTF, and ODT files
              </p>
            </div>
          )}
        </div>

        {/* Selected Files */}
        {selectedFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-6"
          >
            <h3 className="text-lg font-medium text-gray-900 mb-3">Selected Files</h3>
            <div className="space-y-2">
              {selectedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="font-medium text-gray-900">{file.name}</p>
                      <p className="text-sm text-gray-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedFiles(prev => prev.filter((_, i) => i !== index))}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Upload Button */}
        {selectedFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 flex justify-between items-center"
          >
            <div className="text-sm text-gray-600">
              {selectedFiles.length} file(s) selected
            </div>
            <button
              onClick={handleUpload}
              className="btn-primary px-6 py-2"
            >
              Upload & Process Documents
            </button>
          </motion.div>
        )}
      </motion.div>

      {/* Configuration Section */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="md:col-span-2 space-y-4"
        >
          {/* LLM Provider Selector */}
          <div className="card">
            <LLMProviderSelector
              value={llmProvider}
              onChange={setLlmProvider}
              disabled={!isAuthenticated || user?.subscriptionPlan === 'free'}
            />
          </div>

          {/* Language & Domain */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="card">
              <div className="flex items-center space-x-2 mb-3">
                <Globe className="w-5 h-5 text-blue-600" />
                <h3 className="text-sm font-semibold text-gray-900">Target Language</h3>
              </div>
              <LanguageSelector
                value={targetLanguage}
                onChange={setTargetLanguage}
              />
            </div>

            <div className="card">
              <div className="flex items-center space-x-2 mb-3">
                <Zap className="w-5 h-5 text-purple-600" />
                <h3 className="text-sm font-semibold text-gray-900">Document Domain</h3>
              </div>
              <DomainSelector
                value={domain}
                onChange={setDomain}
              />
            </div>
          </div>
        </motion.div>

        {/* Token Usage Display */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.35 }}
        >
          {isAuthenticated && <TokenUsageDisplay />}
        </motion.div>
      </div>

      {/* Supported Formats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="card"
      >
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Supported File Formats</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          {supportedFormats.map((format) => (
            <div key={format.type} className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
              <FileText className="w-4 h-4 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">{format.type}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default HomePage;
