import React from 'react';
import { motion } from 'framer-motion';

interface ProgressCardsProps {
  steps: { current: number; goal: number; percentage: number };
  water: { current: number; goal: number; percentage: number };
  sleep: { current: number; goal: number; percentage: number };
}

export const ProgressCards: React.FC<ProgressCardsProps> = ({ steps, water, sleep }) => {
  const cards = [
    {
      title: 'Steps',
      icon: '👣',
      current: steps.current,
      goal: steps.goal,
      percentage: steps.percentage,
      unit: 'steps',
      color: 'blue',
    },
    {
      title: 'Water',
      icon: '💧',
      current: water.current,
      goal: water.goal,
      percentage: water.percentage,
      unit: 'ml',
      color: 'cyan',
    },
    {
      title: 'Sleep',
      icon: '🌙',
      current: sleep.current,
      goal: sleep.goal,
      percentage: sleep.percentage,
      unit: 'hours',
      color: 'purple',
    },
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return {
          bg: 'bg-blue-500',
          text: 'text-blue-600 dark:text-blue-400',
          ring: 'ring-blue-200 dark:ring-blue-800',
        };
      case 'cyan':
        return {
          bg: 'bg-cyan-500',
          text: 'text-cyan-600 dark:text-cyan-400',
          ring: 'ring-cyan-200 dark:ring-cyan-800',
        };
      case 'purple':
        return {
          bg: 'bg-purple-500',
          text: 'text-purple-600 dark:text-purple-400',
          ring: 'ring-purple-200 dark:ring-purple-800',
        };
      default:
        return {
          bg: 'bg-gray-500',
          text: 'text-gray-600 dark:text-gray-400',
          ring: 'ring-gray-200 dark:ring-gray-800',
        };
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {cards.map((card, index) => {
        const colors = getColorClasses(card.color);

        return (
          <motion.div
            key={card.title}
            className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 ring-2 ${colors.ring}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{card.icon}</span>
                <h3 className="font-semibold text-gray-800 dark:text-white">{card.title}</h3>
              </div>
              <div className={`text-lg font-bold ${colors.text}`}>
                {Math.round(card.percentage)}%
              </div>
            </div>

            <div className="mb-2">
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                <span>
                  {card.current.toLocaleString()} {card.unit}
                </span>
                <span>
                  {card.goal.toLocaleString()} {card.unit}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <motion.div
                  className={`h-2 rounded-full ${colors.bg}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, card.percentage)}%` }}
                  transition={{ duration: 0.8, delay: index * 0.1 + 0.3 }}
                />
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

