import React from 'react';
import DocumentLibrary from '../components/DocumentLibrary';
import { motion } from 'framer-motion';
import { Library, Upload, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LibraryPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Library className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              My Library
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Browse and manage your documents
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate('/')}
          className="btn-primary flex items-center space-x-2"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Document</span>
        </button>
      </motion.div>

      {/* Document Library */}
      <DocumentLibrary />
    </div>
  );
};

export default LibraryPage;

