import React from 'react';
import { motion } from 'framer-motion';
import { Check, Zap, Crown, Star } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { SubscriptionPlan } from '../types';

const PricingPage: React.FC = () => {
  const { user, updateSubscription, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const pricingTiers = [
    {
      id: 'free' as SubscriptionPlan,
      name: 'Free',
      price: 0,
      tokens: 0,
      icon: Star,
      description: 'Perfect for trying out Transor',
      features: [
        'View demo features',
        'Explore the interface',
        'See sample translations',
        'Limited access',
        'Community support',
      ],
      limitations: [
        'No translation uploads',
        'No AI model selection',
        'No document processing',
      ],
      buttonText: 'Current Plan',
      popular: false,
    },
    {
      id: 'pro' as SubscriptionPlan,
      name: 'Pro',
      price: 15,
      tokens: 100000,
      icon: Zap,
      description: 'Great for individuals and small teams',
      features: [
        '100,000 Transor tokens/month',
        'All AI models (OpenAI, Gemini, Grok, Claude)',
        'Unlimited document uploads',
        'Bilingual view',
        'Export to DOCX/PDF',
        'Priority support',
        'Advanced formatting',
        'Glossary management',
      ],
      buttonText: 'Upgrade to Pro',
      popular: true,
    },
    {
      id: 'enterprise' as SubscriptionPlan,
      name: 'Enterprise',
      price: 45,
      tokens: 1000000,
      icon: Crown,
      description: 'For power users and teams',
      features: [
        '1,000,000 Transor tokens/month',
        'All AI models (OpenAI, Gemini, Grok, Claude)',
        'Unlimited everything',
        'Dedicated account manager',
        'Custom AI training',
        'API access',
        'Advanced analytics',
        'Team collaboration',
        'SLA guarantee',
        '24/7 premium support',
      ],
      buttonText: 'Upgrade to Enterprise',
      popular: false,
    },
  ];

  const handleSelectPlan = async (planId: SubscriptionPlan) => {
    if (!isAuthenticated) {
      toast.error('Please log in first');
      navigate('/login');
      return;
    }

    if (user?.subscriptionPlan === planId) {
      toast.info('You are already on this plan');
      return;
    }

    if (planId === 'free') {
      toast.info('You can downgrade at any time from settings');
      return;
    }

    try {
      await updateSubscription(planId);
      toast.success(`Successfully upgraded to ${planId === 'pro' ? 'Pro' : 'Enterprise'}!`);
      navigate('/');
    } catch (error) {
      toast.error('Failed to update subscription');
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Choose Your Plan
        </h1>
        <p className="text-xl text-gray-600 mb-2">
          Pay only for the tokens you use
        </p>
        <p className="text-sm text-gray-500">
          All paid plans renew monthly. Cancel anytime.
        </p>
      </motion.div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {pricingTiers.map((tier, index) => {
          const Icon = tier.icon;
          const isCurrentPlan = user?.subscriptionPlan === tier.id;
          
          return (
            <motion.div
              key={tier.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative card ${tier.popular ? 'ring-2 ring-blue-500' : ''}`}
            >
              {/* Popular Badge */}
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-medium rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              {/* Header */}
              <div className="text-center mb-6">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg mb-4 ${
                  tier.id === 'free' ? 'bg-gray-100' :
                  tier.id === 'pro' ? 'bg-blue-100' :
                  'bg-purple-100'
                }`}>
                  <Icon className={`w-6 h-6 ${
                    tier.id === 'free' ? 'text-gray-600' :
                    tier.id === 'pro' ? 'text-blue-600' :
                    'text-purple-600'
                  }`} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{tier.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{tier.description}</p>
                
                {/* Price */}
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">${tier.price}</span>
                  {tier.price > 0 && <span className="text-gray-600">/month</span>}
                </div>
                
                {/* Tokens */}
                {tier.tokens > 0 && (
                  <div className="text-sm text-gray-600">
                    {tier.tokens.toLocaleString()} tokens/month
                  </div>
                )}
              </div>

              {/* Features */}
              <div className="space-y-3 mb-6">
                {tier.features.map((feature, i) => (
                  <div key={i} className="flex items-start space-x-2">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
                {tier.limitations && tier.limitations.map((limitation, i) => (
                  <div key={i} className="flex items-start space-x-2">
                    <svg className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span className="text-sm text-gray-500">{limitation}</span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <button
                onClick={() => handleSelectPlan(tier.id)}
                disabled={isCurrentPlan}
                className={`w-full py-2 px-4 rounded font-medium transition-all ${
                  isCurrentPlan
                    ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                    : tier.popular
                    ? 'btn-primary'
                    : 'btn-outline'
                }`}
              >
                {isCurrentPlan ? 'Current Plan' : tier.buttonText}
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* FAQ Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">What is a Transor token?</h3>
            <p className="text-gray-600 text-sm">
              Transor tokens are our unified currency for all AI translation services. 
              1 Transor token ≈ 1 AI model token. The actual consumption depends on the model you choose.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Can I change my plan anytime?</h3>
            <p className="text-gray-600 text-sm">
              Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">What happens if I run out of tokens?</h3>
            <p className="text-gray-600 text-sm">
              You can upgrade your plan or purchase additional token bundles. We'll notify you when you're running low.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Which AI models are supported?</h3>
            <p className="text-gray-600 text-sm">
              All paid plans include access to OpenAI GPT-4, Google Gemini, Grok, and Anthropic Claude. You can switch between models at any time.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PricingPage;

