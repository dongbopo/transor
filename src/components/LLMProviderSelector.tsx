import React, { useState } from 'react';
import { LLMProvider } from '../types';
import { Sparkles } from 'lucide-react';

interface LLMProviderSelectorProps {
  value: LLMProvider;
  onChange: (provider: LLMProvider) => void;
  disabled?: boolean;
}

const LLMProviderSelector: React.FC<LLMProviderSelectorProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  const providers = [
    {
      id: 'openai' as LLMProvider,
      name: 'OpenAI',
      model: 'GPT-4',
      description: 'Best for general-purpose translation',
      logo: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
          <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z"/>
        </svg>
      ),
      color: 'from-emerald-400 to-cyan-500',
    },
    {
      id: 'gemini' as LLMProvider,
      name: 'Google Gemini',
      model: 'Gemini Pro',
      description: 'Excellent for multilingual content',
      logo: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
          <path d="M11.04 19.32l-5.6-9.7c-.5-.9-.5-2 0-2.8l5.6-9.7c.5-.9 1.4-1.4 2.4-1.4s1.9.5 2.4 1.4l5.6 9.7c.5.9.5 2 0 2.8l-5.6 9.7c-.5.9-1.4 1.4-2.4 1.4s-1.9-.5-2.4-1.4zm2-15.8c-.3 0-.5.2-.6.4l-5.6 9.7c-.1.2-.1.5 0 .7l5.6 9.7c.1.2.3.4.6.4s.5-.2.6-.4l5.6-9.7c.1-.2.1-.5 0-.7l-5.6-9.7c-.1-.2-.3-.4-.6-.4z"/>
        </svg>
      ),
      color: 'from-blue-500 to-purple-600',
    },
    {
      id: 'grok' as LLMProvider,
      name: 'Grok',
      model: 'Grok-1',
      description: 'Great for creative translations',
      logo: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ),
      color: 'from-gray-800 to-gray-600',
    },
    {
      id: 'claude' as LLMProvider,
      name: 'Anthropic Claude',
      model: 'Claude 3',
      description: 'Best for nuanced, context-aware translation',
      logo: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
          <rect x="2" y="2" width="20" height="20" rx="5" fill="#D97757"/>
          <path d="M8 16l2-5 2 5m-3.5-1.5h3m4.5 0c0 1.1-.9 2-2 2s-2-.9-2-2c0-1.1.9-2 2-2s2 .9 2 2z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        </svg>
      ),
      color: 'from-amber-500 to-orange-600',
    },
  ];

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        Select AI Model
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {providers.map((provider) => (
          <button
            key={provider.id}
            type="button"
            onClick={() => onChange(provider.id)}
            disabled={disabled}
            className={`relative p-4 rounded-lg border-2 transition-all text-left ${
              value === provider.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300 bg-white'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            {/* Selected Indicator */}
            {value === provider.id && (
              <div className="absolute top-2 right-2">
                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            )}

            {/* Provider Info */}
            <div className="flex items-start space-x-3">
              <div className={`w-10 h-10 bg-gradient-to-br ${provider.color} rounded-lg flex items-center justify-center p-2 flex-shrink-0 text-white`}>
                {provider.logo}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-900 mb-0.5">
                  {provider.name}
                </div>
                <div className="text-xs text-gray-500 mb-1">{provider.model}</div>
                <div className="text-xs text-gray-600">{provider.description}</div>
              </div>
            </div>

            {/* Token Cost Indicator */}
            <div className="mt-3 flex items-center justify-between text-xs">
              <span className="text-gray-500">Cost per 1K tokens:</span>
              <span className="font-medium text-gray-900">~1 Transor token</span>
            </div>
          </button>
        ))}
      </div>

      {disabled && (
        <div className="flex items-center space-x-2 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
          <Sparkles className="w-4 h-4" />
          <span>Upgrade to a paid plan to access AI models</span>
        </div>
      )}
    </div>
  );
};

export default LLMProviderSelector;

