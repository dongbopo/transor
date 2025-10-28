import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Loader2, Clock, Type, Star, CheckCircle2 } from 'lucide-react';
import { LLMProvider, TranslationResult, TranslationComparison } from '../types';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

interface TranslationComparisonViewProps {
  documentId: string;
  originalText: string;
  targetLanguage: string;
  onSelectModel: (model: LLMProvider) => void;
}

const providerInfo: Record<LLMProvider, { name: string; color: string; icon: string }> = {
  openai: {
    name: 'GPT-4o',
    color: 'from-emerald-500 to-teal-600',
    icon: '🔵',
  },
  gemini: {
    name: 'Gemini Pro',
    color: 'from-blue-500 to-indigo-600',
    icon: '✨',
  },
  grok: {
    name: 'Grok',
    color: 'from-purple-500 to-pink-600',
    icon: '🧠',
  },
  claude: {
    name: 'Claude 3',
    color: 'from-orange-500 to-red-600',
    icon: '⚡',
  },
};

const TranslationComparisonView: React.FC<TranslationComparisonViewProps> = ({
  documentId,
  originalText,
  targetLanguage,
  onSelectModel,
}) => {
  const { user, hasAPIKey } = useAuth();
  const [isTranslating, setIsTranslating] = useState(false);
  const [comparison, setComparison] = useState<TranslationComparison | null>(null);
  const [selectedModel, setSelectedModel] = useState<LLMProvider | null>(null);

  const availableProviders: LLMProvider[] = (['openai', 'gemini', 'grok', 'claude'] as LLMProvider[])
    .filter((provider) => hasAPIKey(provider));

  const handleTranslateAll = async () => {
    if (availableProviders.length === 0) {
      toast.error('Please add at least one API key in Settings');
      return;
    }

    setIsTranslating(true);

    // Simulate API calls to all providers
    const results: TranslationResult[] = await Promise.all(
      availableProviders.map(async (provider) => {
        // Simulate translation time
        await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 2000));

        // Mock translation (replace with actual API call)
        return {
          model: provider,
          modelVersion: providerInfo[provider].name,
          text: `[${providerInfo[provider].name} Translation]\n\n${originalText}\n\n(This is a sample translation. In production, this would be the actual AI translation.)`,
          timeTaken: Math.random() * 3 + 1,
          wordCount: originalText.split(' ').length,
        };
      })
    );

    setComparison({
      documentId,
      samplePage: 1,
      originalText,
      translations: results,
      selectedModel: selectedModel || undefined,
    });

    setIsTranslating(false);
    toast.success('Translation comparison complete!');
  };

  const handleSelectModel = (model: LLMProvider) => {
    setSelectedModel(model);
    onSelectModel(model);
    toast.success(`Selected ${providerInfo[model].name} for full document translation`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Translation Comparison</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Compare translations from different AI models
          </p>
        </div>
        <button
          onClick={handleTranslateAll}
          disabled={isTranslating || availableProviders.length === 0}
          className="btn-primary flex items-center space-x-2"
        >
          {isTranslating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Translating...</span>
            </>
          ) : (
            <>
              <Star className="w-4 h-4" />
              <span>Translate Sample</span>
            </>
          )}
        </button>
      </div>

      {/* API Keys Notice */}
      {availableProviders.length === 0 && (
        <div className="card border-l-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20">
          <p className="text-yellow-800 dark:text-yellow-200">
            ⚠️ No API keys configured. Add your API keys in Settings to use translation comparison.
          </p>
        </div>
      )}

      {/* Original Text */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Original Text</h3>
        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
          {originalText}
        </div>
        <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          {originalText.split(' ').length} words • Target: {targetLanguage}
        </div>
      </div>

      {/* Translation Results Grid */}
      {comparison && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {comparison.translations.map((result) => {
            const info = providerInfo[result.model];
            const isSelected = selectedModel === result.model;

            return (
              <motion.div
                key={result.model}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`
                  card relative overflow-hidden cursor-pointer transition-all
                  ${isSelected 
                    ? 'ring-2 ring-blue-500 dark:ring-blue-400 shadow-lg' 
                    : 'hover:shadow-md'
                  }
                `}
                onClick={() => handleSelectModel(result.model)}
              >
                {/* Model Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${info.color} flex items-center justify-center text-white text-xl`}>
                      {info.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{info.name}</h3>
                      <div className="flex items-center space-x-3 text-xs text-gray-600 dark:text-gray-400">
                        <span className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{result.timeTaken.toFixed(1)}s</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Type className="w-3 h-3" />
                          <span>{result.wordCount} words</span>
                        </span>
                      </div>
                    </div>
                  </div>
                  {isSelected && (
                    <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400">
                      <CheckCircle2 className="w-5 h-5" />
                      <span className="text-sm font-medium">Selected</span>
                    </div>
                  )}
                </div>

                {/* Translation Text */}
                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-sm text-gray-900 dark:text-gray-100 whitespace-pre-wrap max-h-64 overflow-y-auto">
                  {result.text}
                </div>

                {/* Select Button */}
                {!isSelected && (
                  <button
                    className="mt-4 w-full btn-outline text-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectModel(result.model);
                    }}
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Select This Model
                  </button>
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      {/* No Results Yet */}
      {!comparison && !isTranslating && availableProviders.length > 0 && (
        <div className="card text-center py-12">
          <Star className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Ready to Compare Translations
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Click "Translate Sample" to compare translations from {availableProviders.length} AI models
          </p>
        </div>
      )}
    </div>
  );
};

export default TranslationComparisonView;

