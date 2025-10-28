import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { ProcessingStatus } from '../types';

interface ProgressIndicatorProps {
  stage: ProcessingStatus['stage'];
  progress: number;
  message: string;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ stage, progress, message }) => {
  const getStageIcon = () => {
    switch (stage) {
      case 'completed':
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      case 'error':
        return <AlertCircle className="w-6 h-6 text-red-600" />;
      default:
        return <Loader2 className="w-6 h-6 text-primary-600 animate-spin" />;
    }
  };

  const getStageColor = () => {
    switch (stage) {
      case 'completed':
        return 'bg-green-600';
      case 'error':
        return 'bg-red-600';
      default:
        return 'bg-primary-600';
    }
  };

  const getStageMessages = () => {
    switch (stage) {
      case 'uploading':
        return 'Uploading document...';
      case 'parsing':
        return 'Parsing document structure...';
      case 'analyzing':
        return 'Analyzing content and detecting domain...';
      case 'cleaning':
        return 'Applying source corrections...';
      case 'translating':
        return 'Translating content...';
      case 'completed':
        return 'Document processed successfully!';
      case 'error':
        return 'Processing failed. Please try again.';
      default:
        return message;
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center space-x-4 mb-4">
        {getStageIcon()}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">
            {getStageMessages()}
          </h3>
          {stage !== 'completed' && stage !== 'error' && (
            <p className="text-sm text-gray-600 mt-1">{message}</p>
          )}
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold text-gray-900">
            {Math.round(progress)}%
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <motion.div
          className={`h-full ${getStageColor()} transition-colors duration-300`}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>

      {/* Stage Steps */}
      {stage !== 'error' && (
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-gray-500">
            {[
              { key: 'uploading', label: 'Upload' },
              { key: 'parsing', label: 'Parse' },
              { key: 'analyzing', label: 'Analyze' },
              { key: 'cleaning', label: 'Clean' },
              { key: 'translating', label: 'Translate' },
              { key: 'completed', label: 'Complete' },
            ].map((step, index) => {
              const isActive = stage === step.key;
              const isCompleted = ['uploading', 'parsing', 'analyzing', 'cleaning', 'translating', 'completed']
                .indexOf(stage) > ['uploading', 'parsing', 'analyzing', 'cleaning', 'translating', 'completed']
                .indexOf(step.key);
              
              return (
                <div key={step.key} className="flex items-center">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      isActive || isCompleted
                        ? 'bg-primary-600'
                        : 'bg-gray-300'
                    }`}
                  />
                  {index < 5 && (
                    <div
                      className={`w-8 h-px ml-2 ${
                        isCompleted ? 'bg-primary-600' : 'bg-gray-300'
                      }`}
                    />
                  )}
                  <span className={`ml-2 ${isActive ? 'text-primary-600 font-medium' : ''}`}>
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressIndicator;
