import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, Settings, Eye, EyeOff, Volume2, VolumeX } from 'lucide-react';
import { useDocumentContext } from '../contexts/DocumentContext';
import DocumentViewer from '../components/DocumentViewer';
import BilingualView from '../components/BilingualView';
import Toolbar from '../components/Toolbar';
import ProgressIndicator from '../components/ProgressIndicator';
import toast from 'react-hot-toast';

const ReaderPage: React.FC = () => {
  const { documentId } = useParams<{ documentId: string }>();
  const navigate = useNavigate();
  const { state, dispatch } = useDocumentContext();
  const [isProcessing, setIsProcessing] = useState(false);

  const document = state.documents.find(doc => doc.id === documentId);

  useEffect(() => {
    if (!document) {
      toast.error('Document not found');
      navigate('/');
      return;
    }

    // Auto-process document if it's still in uploading stage
    if (document.status.stage === 'uploading') {
      setIsProcessing(true);
      // Simulate document processing
      setTimeout(() => {
        dispatch({
          type: 'UPDATE_DOCUMENT_STATUS',
          payload: {
            id: document.id,
            status: {
              stage: 'completed',
              progress: 100,
              message: 'Document processed successfully',
            },
          },
        });
        setIsProcessing(false);
      }, 2000);
    }
  }, [document, navigate, dispatch]);

  if (!document) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Document Not Found</h2>
          <p className="text-gray-600 mb-4">The requested document could not be found.</p>
          <button
            onClick={() => navigate('/')}
            className="btn-primary"
          >
            Return to Upload
          </button>
        </div>
      </div>
    );
  }

  const handleBack = () => {
    navigate('/');
  };

  const handleExport = () => {
    toast.success('Export functionality will be implemented');
  };

  const handleToggleViewMode = () => {
    const newMode = state.viewMode.type === 'original' ? 'bilingual' : 'original';
    dispatch({
      type: 'SET_VIEW_MODE',
      payload: { type: newMode },
    });
  };

  const handleToggleSourceFixes = () => {
    dispatch({
      type: 'SET_VIEW_MODE',
      payload: { showSourceFixes: !state.viewMode.showSourceFixes },
    });
  };

  const handleToggleTooltips = () => {
    dispatch({
      type: 'SET_VIEW_MODE',
      payload: { showTooltips: !state.viewMode.showTooltips },
    });
  };

  const handleToggleTTS = () => {
    dispatch({
      type: 'SET_VIEW_MODE',
      payload: { showTTS: !state.viewMode.showTTS },
    });
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Upload</span>
          </button>
          <div className="h-6 w-px bg-gray-300" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{document.originalFile.name}</h1>
            <p className="text-sm text-gray-500">
              {document.content.metadata.wordCount} words • {document.content.metadata.pageCount} pages
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={handleExport}
            className="btn-outline flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          <button className="btn-outline flex items-center space-x-2">
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </button>
        </div>
      </div>

      {/* Processing Indicator */}
      {isProcessing && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <ProgressIndicator
            stage={document.status.stage}
            progress={document.status.progress}
            message={document.status.message}
          />
        </motion.div>
      )}

      {/* Toolbar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <Toolbar
          viewMode={state.viewMode}
          onToggleViewMode={handleToggleViewMode}
          onToggleSourceFixes={handleToggleSourceFixes}
          onToggleTooltips={handleToggleTooltips}
          onToggleTTS={handleToggleTTS}
        />
      </motion.div>

      {/* Document Viewer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 min-h-96"
      >
        {state.viewMode.type === 'original' ? (
          <DocumentViewer
            document={document}
            viewMode={state.viewMode}
          />
        ) : (
          <BilingualView
            document={document}
            translation={state.currentTranslation}
            viewMode={state.viewMode}
          />
        )}
      </motion.div>
    </div>
  );
};

export default ReaderPage;
