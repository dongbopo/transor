import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useDocuments } from '../contexts/DocumentContext';
import { useAuth } from '../contexts/AuthContext';
import EbookReader from '../components/EbookReader';
import TranslationComparisonView from '../components/TranslationComparisonView';
import { LLMProvider } from '../types';
import toast from 'react-hot-toast';

const ReaderPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state, translateDocument } = useDocuments();
  const { user, hasAPIKey } = useAuth();
  const { documents } = state;
  const [showComparison, setShowComparison] = useState(true);
  const [selectedModel, setSelectedModel] = useState<LLMProvider | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);

  const document = documents.find((doc) => doc.id === id);

  if (!document) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Document Not Found
        </h2>
        <button onClick={() => navigate('/library')} className="btn-primary">
          Go to Library
        </button>
      </div>
    );
  }

  // Get original text from document or use sample
  const originalText = document?.content?.text || `Introduction to Artificial Intelligence

Artificial intelligence (AI) is intelligence demonstrated by machines, as opposed to natural intelligence displayed by animals including humans. AI research has been defined as the field of study of intelligent agents, which refers to any system that perceives its environment and takes actions that maximize its chance of achieving its goals.

The term "artificial intelligence" had previously been used to describe machines that mimic and display "human" cognitive skills that are associated with the human mind, such as "learning" and "problem-solving". This definition has since been rejected by major AI researchers who now describe AI in terms of rationality and acting rationally, which does not limit how intelligence can be articulated.`;

  const handleModelSelection = async (model: LLMProvider) => {
    if (!user) {
      toast.error('Please log in to translate documents');
      return;
    }

    if (!hasAPIKey(model)) {
      toast.error(`Please add your ${model.toUpperCase()} API key in Settings`);
      navigate('/settings');
      return;
    }

    if (!document) {
      toast.error('Document not found');
      return;
    }

    const apiKey = user.apiKeys[model];
    if (!apiKey) {
      toast.error(`API key for ${model} not found`);
      return;
    }

    setSelectedModel(model);
    setIsTranslating(true);

    try {
      const targetLanguage = 'Vietnamese'; // Could come from document or settings
      await translateDocument(document.id, targetLanguage, model, apiKey);
      
      setIsTranslating(false);
      setShowComparison(false);
      toast.success(`Document translated using ${model}! Starting reader...`);
    } catch (error: any) {
      setIsTranslating(false);
      toast.error(`Translation failed: ${error.message || 'Unknown error'}`);
      console.error('Translation error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Back Button */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
        <button
          onClick={() => navigate('/library')}
          className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Library</span>
        </button>
      </div>

      {/* Translation Comparison or Reader */}
      {showComparison && !isTranslating ? (
        <div className="max-w-7xl mx-auto p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {document.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Compare translations from different AI models before reading
            </p>
          </div>

          <TranslationComparisonView
            documentId={document.id}
            originalText={originalText}
            targetLanguage={document.targetLanguage || 'Vietnamese'}
            onSelectModel={handleModelSelection}
          />

          {/* Skip Comparison Button */}
          <div className="mt-6 text-center">
            <button
              onClick={() => setShowComparison(false)}
              className="btn-outline"
            >
              Skip Comparison & Start Reading
            </button>
          </div>
        </div>
      ) : isTranslating ? (
        <div className="flex flex-col items-center justify-center h-screen">
          <Loader2 className="w-16 h-16 text-blue-600 dark:text-blue-400 animate-spin mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Translating Document...
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Using {selectedModel} to translate your document
          </p>
        </div>
      ) : (
        <EbookReader
          documentId={document.id}
          documentName={document.name}
          totalPages={50} // Mock total pages
        />
      )}
    </div>
  );
};

export default ReaderPage;

