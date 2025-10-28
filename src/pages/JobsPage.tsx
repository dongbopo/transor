import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Cloud, Trash2, Eye, ChevronRight, Globe, Clock } from 'lucide-react';
import { useDocumentContext } from '../contexts/DocumentContext';
import { formatDistanceToNow } from 'date-fns';

const JobsPage: React.FC = () => {
  const { state } = useDocumentContext();

  const handleOpenDocument = (documentId: string) => {
    // Navigate to reader page
    window.location.href = `/reader/${documentId}`;
  };

  const handleDownload = (documentId: string) => {
    // Implement download functionality
    console.log('Download document:', documentId);
  };

  const handleSaveToCloud = (documentId: string) => {
    // Implement cloud save functionality
    console.log('Save to cloud:', documentId);
  };

  const handleDelete = (documentId: string) => {
    // Implement delete functionality
    console.log('Delete document:', documentId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getProgressColor = (value: number) => {
    if (value === 100) return 'bg-green-500';
    if (value >= 50) return 'bg-blue-500';
    if (value > 0) return 'bg-blue-500';
    return 'bg-gray-300';
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8"
      >
        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Total Tasks</span>
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{state.documents.length}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">All documents</div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Completed</span>
            <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <Globe className="w-4 h-4 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {state.documents.filter(d => d.status.stage === 'completed').length}
          </div>
          <div className="text-xs text-green-600 dark:text-green-400 mt-1">Ready to view</div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">In Progress</span>
            <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
              <Clock className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {state.documents.filter(d => d.status.stage !== 'completed' && d.status.stage !== 'error').length}
          </div>
          <div className="text-xs text-yellow-600 mt-1">Processing</div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-500">Total Words</span>
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <FileText className="w-4 h-4 text-purple-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {state.documents.reduce((sum, doc) => sum + (doc.content.metadata.wordCount || 0), 0).toLocaleString()}
          </div>
          <div className="text-xs text-gray-500 mt-1">Across all docs</div>
        </div>
      </motion.div>

      {/* Translation Tasks Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <h2 className="text-lg font-semibold text-gray-900">Translation Tasks</h2>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">All Documents</span>
          </div>
          <button
            onClick={() => window.location.href = '/'}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-medium rounded hover:opacity-90"
          >
            + New Task
          </button>
        </div>

        {state.documents.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No documents yet</h3>
            <p className="text-gray-600 mb-6">
              Upload your first document to get started with translation and polishing.
            </p>
            <button
              onClick={() => window.location.href = '/'}
              className="btn-primary"
            >
              Upload Document
            </button>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            {/* Table Header - Desktop Only */}
            <div className="hidden md:block bg-gray-50 border-b border-gray-200 px-4 py-3">
              <div className="grid grid-cols-12 gap-4 text-xs font-medium text-gray-600">
                <div className="col-span-4">Document Name</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-2">Size / Words</div>
                <div className="col-span-2">Created</div>
                <div className="col-span-2">Actions</div>
              </div>
            </div>

            {/* Table Body / Cards */}
            <div className="divide-y divide-gray-200">
              {state.documents.map((document, index) => (
                <motion.div
                  key={document.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleOpenDocument(document.id)}
                >
                  {/* Desktop View */}
                  <div className="hidden md:grid grid-cols-12 gap-4 items-center">
                    {/* Document Name */}
                    <div className="col-span-4">
                      <div className="flex items-start space-x-2">
                        <span className="text-lg">📄</span>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm text-gray-900 truncate">
                            {document.originalFile.name}
                          </div>
                          {document.summary && (
                            <div className="text-xs text-gray-500 truncate">
                              {document.summary.abstract}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="col-span-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getStatusColor(document.status.stage)}`}>
                        {document.status.stage}
                      </span>
                    </div>

                    {/* Size / Words */}
                    <div className="col-span-2">
                      <div className="text-sm text-gray-700">
                        {(document.originalFile.size / 1024 / 1024).toFixed(2)} MB
                      </div>
                      <div className="text-xs text-gray-500">
                        {document.content.metadata.wordCount?.toLocaleString()} words
                      </div>
                    </div>

                    {/* Created */}
                    <div className="col-span-2">
                      <span className="text-sm text-gray-700">
                        {formatDistanceToNow(document.createdAt, { addSuffix: true })}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="col-span-2">
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenDocument(document.id);
                          }}
                          className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
                          title="Open"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownload(document.id);
                          }}
                          className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
                          title="Download"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSaveToCloud(document.id);
                          }}
                          className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
                          title="Cloud"
                        >
                          <Cloud className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(document.id);
                          }}
                          className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Mobile View */}
                  <div className="md:hidden space-y-3">
                    <div className="flex items-start space-x-3">
                      <span className="text-2xl">📄</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm text-gray-900 mb-1">
                          {document.originalFile.name}
                        </div>
                        <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                          <span>{(document.originalFile.size / 1024 / 1024).toFixed(2)} MB</span>
                          <span>•</span>
                          <span>{document.content.metadata.wordCount?.toLocaleString()} words</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getStatusColor(document.status.stage)}`}>
                        {document.status.stage}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatDistanceToNow(document.createdAt, { addSuffix: true })}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-end space-x-2 pt-2 border-t border-gray-100">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenDocument(document.id);
                        }}
                        className="p-2 text-gray-400 hover:text-gray-600"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownload(document.id);
                        }}
                        className="p-2 text-gray-400 hover:text-gray-600"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSaveToCloud(document.id);
                        }}
                        className="p-2 text-gray-400 hover:text-gray-600"
                      >
                        <Cloud className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(document.id);
                        }}
                        className="p-2 text-gray-400 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobsPage;
