import React from 'react';
import { motion } from 'framer-motion';
import { HealthScore } from '../../types/healthquest';

interface HealthScoreCardProps {
  healthScore: HealthScore;
}

export const HealthScoreCard: React.FC<HealthScoreCardProps> = ({ healthScore }) => {
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-500';
    if (score >= 70) return 'text-green-400';
    if (score >= 50) return 'text-yellow-500';
    if (score >= 30) return 'text-orange-500';
    return 'text-red-500';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 90) return 'bg-green-500';
    if (score >= 70) return 'bg-green-400';
    if (score >= 50) return 'bg-yellow-500';
    if (score >= 30) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Health Score</h2>
        <div className={`text-4xl font-bold ${getScoreColor(healthScore.overall)}`}>
          {healthScore.overall}
        </div>
      </div>

      {/* Circular Progress */}
      <div className="flex justify-center mb-6">
        <div className="relative w-32 h-32">
          <svg className="transform -rotate-90 w-32 h-32">
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-gray-200 dark:text-gray-700"
            />
            <motion.circle
              cx="64"
              cy="64"
              r="56"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              className={getScoreColor(healthScore.overall)}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: healthScore.overall / 100 }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-2xl font-bold ${getScoreColor(healthScore.overall)}`}>
              {healthScore.overall}
            </span>
          </div>
        </div>
      </div>

      {/* Breakdown */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">Activity</span>
          <div className="flex items-center gap-2">
            <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <motion.div
                className={`h-2 rounded-full ${getScoreBgColor(healthScore.activity)}`}
                initial={{ width: 0 }}
                animate={{ width: `${healthScore.activity}%` }}
                transition={{ duration: 1, delay: 0.7 }}
              />
            </div>
            <span className="text-sm font-semibold w-8 text-right">
              {healthScore.activity}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">Nutrition</span>
          <div className="flex items-center gap-2">
            <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <motion.div
                className={`h-2 rounded-full ${getScoreBgColor(healthScore.nutrition)}`}
                initial={{ width: 0 }}
                animate={{ width: `${healthScore.nutrition}%` }}
                transition={{ duration: 1, delay: 0.8 }}
              />
            </div>
            <span className="text-sm font-semibold w-8 text-right">
              {healthScore.nutrition}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">Sleep</span>
          <div className="flex items-center gap-2">
            <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <motion.div
                className={`h-2 rounded-full ${getScoreBgColor(healthScore.sleep)}`}
                initial={{ width: 0 }}
                animate={{ width: `${healthScore.sleep}%` }}
                transition={{ duration: 1, delay: 0.9 }}
              />
            </div>
            <span className="text-sm font-semibold w-8 text-right">
              {healthScore.sleep}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">Vitals</span>
          <div className="flex items-center gap-2">
            <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <motion.div
                className={`h-2 rounded-full ${getScoreBgColor(healthScore.vitals)}`}
                initial={{ width: 0 }}
                animate={{ width: `${healthScore.vitals}%` }}
                transition={{ duration: 1, delay: 1.0 }}
              />
            </div>
            <span className="text-sm font-semibold w-8 text-right">
              {healthScore.vitals}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">Consistency</span>
          <div className="flex items-center gap-2">
            <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <motion.div
                className={`h-2 rounded-full ${getScoreBgColor(healthScore.consistency)}`}
                initial={{ width: 0 }}
                animate={{ width: `${healthScore.consistency}%` }}
                transition={{ duration: 1, delay: 1.1 }}
              />
            </div>
            <span className="text-sm font-semibold w-8 text-right">
              {healthScore.consistency}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

