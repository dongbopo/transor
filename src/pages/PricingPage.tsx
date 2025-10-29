import React from 'react';
import { motion } from 'framer-motion';
import { Key, Zap, Shield, DollarSign, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PricingPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: Key,
      title: 'Your API Keys, Your Control',
      description: 'Use your own API keys from OpenAI, Gemini, Grok, or Claude. No subscription fees, no middleman.',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: DollarSign,
      title: 'Pay Only What You Use',
      description: 'Pay directly to AI providers based on actual token usage. Transparent pricing, no markup.',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: Shield,
      title: 'Privacy First',
      description: 'Your API keys are encrypted and stored locally. We never see or store your keys on our servers.',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: Zap,
      title: 'Unlimited Usage',
      description: 'No token limits, no monthly caps. Translate as much as you want with your own API keys.',
      color: 'from-orange-500 to-red-500',
    },
  ];

  const providers = [
    {
      name: 'OpenAI',
      models: 'GPT-4, GPT-3.5 Turbo',
      pricing: '~$0.03/1K tokens',
      color: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
    },
    {
      name: 'Google Gemini',
      models: 'Gemini Pro',
      pricing: '~$0.00125/1K tokens',
      color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    },
    {
      name: 'xAI Grok',
      models: 'Grok-1',
      pricing: 'Coming soon',
      color: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400',
    },
    {
      name: 'Anthropic Claude',
      models: 'Claude 3 Opus, Sonnet',
      pricing: '~$0.015/1K tokens',
      color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          Free to Use. Forever.
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-2">
          Transer is 100% free. You only pay for the AI tokens you use.
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-500">
          No subscriptions, no hidden fees, no markup.
        </p>
      </motion.div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 gap-6 mb-12">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card group hover:shadow-lg transition-shadow"
            >
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {feature.description}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Pricing Comparison */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card mb-12"
      >
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
          Transparent AI Provider Pricing
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {providers.map((provider, index) => (
            <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium mb-3 ${provider.color}`}>
                {provider.name}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {provider.models}
              </p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                {provider.pricing}
              </p>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-500 text-center mt-4">
          * Pricing is approximate and set by each AI provider. Check their official sites for exact rates.
        </p>
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="text-center"
      >
        <button
          onClick={() => navigate(isAuthenticated ? '/settings' : '/signup')}
          className="btn-primary inline-flex items-center space-x-2 px-8 py-3 text-lg"
        >
          <span>{isAuthenticated ? 'Add Your API Keys' : 'Get Started Free'}</span>
          <ArrowRight className="w-5 h-5" />
        </button>
        <p className="text-sm text-gray-500 dark:text-gray-500 mt-4">
          No credit card required. Start translating in minutes.
        </p>
      </motion.div>
    </div>
  );
};

export default PricingPage;
