import React from 'react';
import { motion } from 'framer-motion';
import { UserQuest, Quest } from '../../types/healthquest';
import { CheckCircle2, Circle } from 'lucide-react';

interface QuestListProps {
  quests: Array<UserQuest & { quest: Quest }>;
}

export const QuestList: React.FC<QuestListProps> = ({ quests }) => {
  const getQuestIcon = (category: string) => {
    switch (category) {
      case 'activity':
        return '🏃';
      case 'nutrition':
        return '💧';
      case 'sleep':
        return '🌙';
      default:
        return '📋';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
        Today's Quests ({quests.filter(q => q.status === 'completed').length}/{quests.length})
      </h2>
      <div className="space-y-3">
        {quests.map((userQuest, index) => {
          const { quest, status, progress } = userQuest;
          const isCompleted = status === 'completed';

          return (
            <motion.div
              key={userQuest.id}
              className={`flex items-center gap-3 p-3 rounded-lg ${
                isCompleted
                  ? 'bg-green-50 dark:bg-green-900/20'
                  : 'bg-gray-50 dark:bg-gray-700/50'
              }`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="text-2xl">{getQuestIcon(quest.category)}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  ) : (
                    <Circle className="w-5 h-5 text-gray-400" />
                  )}
                  <span
                    className={`font-medium ${
                      isCompleted
                        ? 'text-green-700 dark:text-green-400 line-through'
                        : 'text-gray-800 dark:text-white'
                    }`}
                  >
                    {quest.title}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {quest.description}
                </p>
                {!isCompleted && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                      <span>Progress</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                      <motion.div
                        className="bg-blue-500 h-1.5 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </div>
                )}
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                  +{quest.rewardPoints} pts
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

