import React from 'react';
import { motion } from 'framer-motion';
import { UserCompanion, Companion, HealthState } from '../../types/healthquest';

interface CompanionDisplayProps {
  companion: UserCompanion & { companion: Companion };
  healthScore: number;
  onInteract?: () => void;
}

const getHealthStateEmoji = (state: HealthState): string => {
  switch (state) {
    case 'thriving':
      return '🌟';
    case 'healthy':
      return '😊';
    case 'okay':
      return '🙂';
    case 'struggling':
      return '😐';
    case 'unwell':
      return '😔';
    default:
      return '😊';
  }
};

const getHealthStateColor = (state: HealthState): string => {
  switch (state) {
    case 'thriving':
      return 'text-green-500';
    case 'healthy':
      return 'text-green-400';
    case 'okay':
      return 'text-yellow-500';
    case 'struggling':
      return 'text-orange-500';
    case 'unwell':
      return 'text-red-500';
    default:
      return 'text-green-400';
  }
};

const getStageEmoji = (type: string, stage: number): string => {
  if (type === 'plant') {
    switch (stage) {
      case 1:
        return '🌱'; // Seedling
      case 2:
        return '🌿'; // Sprout
      case 3:
        return '🌳'; // Growing
      case 4:
        return '🌲'; // Mature
      case 5:
        return '🌴'; // Blooming
      default:
        return '🌱';
    }
  } else {
    switch (stage) {
      case 1:
        return '🐣'; // Baby
      case 2:
        return '🐤'; // Young
      case 3:
        return '🐥'; // Teen
      case 4:
        return '🐔'; // Adult
      case 5:
        return '🦅'; // Evolved
      default:
        return '🐣';
    }
  }
};

export const CompanionDisplay: React.FC<CompanionDisplayProps> = ({
  companion,
  healthScore,
  onInteract,
}) => {
  const { companion: companionInfo, customName, currentStage, healthState } = companion;
  const emoji = getStageEmoji(companionInfo.type, currentStage);
  const stateEmoji = getHealthStateEmoji(healthState);
  const stateColor = getHealthStateColor(healthState);

  return (
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-center">
        <motion.button
          onClick={onInteract}
          className="mb-4 focus:outline-none"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="text-8xl mb-2 animate-bounce" style={{ animationDuration: '2s' }}>
            {emoji}
          </div>
          <p className="text-xl font-semibold text-gray-800 dark:text-white">
            {customName || companionInfo.name}
          </p>
        </motion.button>

        <div className={`text-lg ${stateColor} mb-2`}>
          {stateEmoji} {healthState.charAt(0).toUpperCase() + healthState.slice(1)}
        </div>

        <div className="text-sm text-gray-600 dark:text-gray-400">
          Stage {currentStage} • Days Active: {companion.totalDaysActive}
        </div>

        <div className="mt-4 bg-gray-100 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
          <motion.div
            className={`h-full ${
              healthScore >= 90
                ? 'bg-green-500'
                : healthScore >= 70
                ? 'bg-green-400'
                : healthScore >= 50
                ? 'bg-yellow-500'
                : healthScore >= 30
                ? 'bg-orange-500'
                : 'bg-red-500'
            }`}
            initial={{ width: 0 }}
            animate={{ width: `${healthScore}%` }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
          Health Score: {healthScore}/100
        </div>
      </div>
    </motion.div>
  );
};

