import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useHealthQuest } from '../contexts/HealthQuestContext';
import { HealthQuestStorage } from '../services/HealthQuestStorage';
import { TrendingUp, Calendar, Award, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { HealthDataEntry, UserAchievement, Achievement } from '../types/healthquest';

export const HealthQuestStats: React.FC = () => {
  const { profile } = useHealthQuest();
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('week');

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600 dark:text-gray-400">No profile data</p>
      </div>
    );
  }

  const allData = HealthQuestStorage.getHealthData().filter(d => d.userId === profile.userId);
  const achievements = HealthQuestStorage.getAchievements();
  const userAchievements = HealthQuestStorage.getUserAchievements().filter(
    a => a.userId === profile.userId
  );

  const unlockedAchievements = userAchievements.filter(a => a.isUnlocked);
  const unlockedAchievementDetails = unlockedAchievements.map(ua => {
    const achievement = achievements.find(a => a.id === ua.achievementId);
    return achievement ? { ...ua, achievement } : null;
  }).filter((a): a is NonNullable<typeof a> => a !== null);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary':
        return 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
      case 'epic':
        return 'text-purple-500 bg-purple-50 dark:bg-purple-900/20';
      case 'rare':
        return 'text-blue-500 bg-blue-50 dark:bg-blue-900/20';
      default:
        return 'text-gray-500 bg-gray-50 dark:bg-gray-700';
    }
  };

  // Calculate stats for the selected period
  const now = new Date();
  const periodStart = new Date(now);
  switch (selectedPeriod) {
    case 'week':
      periodStart.setDate(now.getDate() - 7);
      break;
    case 'month':
      periodStart.setMonth(now.getMonth() - 1);
      break;
    case 'year':
      periodStart.setFullYear(now.getFullYear() - 1);
      break;
  }

  const periodData = allData.filter(d => d.recordedAt >= periodStart);

  const totalSteps = periodData
    .filter(d => d.dataType === 'steps')
    .reduce((sum, d) => sum + (d.value || 0), 0);

  const totalWater = periodData
    .filter(d => d.dataType === 'water')
    .reduce((sum, d) => sum + (d.value || 0), 0);

  const avgSleep = (() => {
    const sleepData = periodData.filter(d => d.dataType === 'sleep_duration');
    if (sleepData.length === 0) return 0;
    const total = sleepData.reduce((sum, d) => sum + (d.value || 0), 0);
    return total / sleepData.length;
  })();

  const totalEntries = periodData.length;
  const uniqueDays = new Set(
    periodData.map(d => {
      const date = new Date(d.recordedAt);
      date.setHours(0, 0, 0, 0);
      return date.getTime();
    })
  ).size;

  return (
    <div className="max-w-6xl mx-auto py-6 px-4">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            Stats & Insights
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track your progress and see how you're doing
          </p>
        </div>
        <Link
          to="/healthquest"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <Home className="w-5 h-5" />
          <span>Dashboard</span>
        </Link>
      </div>

      {/* Period Selector */}
      <div className="flex gap-2 mb-6">
        {(['week', 'month', 'year'] as const).map((period) => (
          <button
            key={period}
            onClick={() => setSelectedPeriod(period)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              selectedPeriod === period
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {period.charAt(0).toUpperCase() + period.slice(1)}
          </button>
        ))}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-6 h-6 text-blue-500" />
            <h3 className="font-semibold text-gray-800 dark:text-white">Total Steps</h3>
          </div>
          <p className="text-3xl font-bold text-gray-800 dark:text-white">
            {totalSteps.toLocaleString()}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Last {selectedPeriod}
          </p>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">💧</span>
            <h3 className="font-semibold text-gray-800 dark:text-white">Water Intake</h3>
          </div>
          <p className="text-3xl font-bold text-gray-800 dark:text-white">
            {Math.round(totalWater).toLocaleString()}ml
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Average: {Math.round(totalWater / uniqueDays)}ml/day
          </p>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">🌙</span>
            <h3 className="font-semibold text-gray-800 dark:text-white">Avg Sleep</h3>
          </div>
          <p className="text-3xl font-bold text-gray-800 dark:text-white">
            {avgSleep.toFixed(1)}h
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Per night
          </p>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="w-6 h-6 text-green-500" />
            <h3 className="font-semibold text-gray-800 dark:text-white">Entries</h3>
          </div>
          <p className="text-3xl font-bold text-gray-800 dark:text-white">
            {totalEntries}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Over {uniqueDays} days
          </p>
        </motion.div>
      </div>

      {/* Achievements Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Award className="w-6 h-6 text-yellow-500" />
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            Achievements ({unlockedAchievements.length}/{achievements.length})
          </h2>
        </div>

        {unlockedAchievementDetails.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400 text-center py-8">
            No achievements unlocked yet. Keep logging data to unlock your first achievement!
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {unlockedAchievementDetails.map((ua) => (
              <motion.div
                key={ua.id}
                className={`p-4 rounded-lg border-2 ${getRarityColor(ua.achievement.rarity)}`}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">🏅</span>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 dark:text-white">
                      {ua.achievement.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {ua.achievement.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className={`text-xs px-2 py-1 rounded ${getRarityColor(ua.achievement.rarity)}`}>
                    {ua.achievement.rarity.toUpperCase()}
                  </span>
                  <span className="text-sm font-semibold text-yellow-600 dark:text-yellow-400">
                    +{ua.achievement.rewardPoints} pts
                  </span>
                </div>
                {ua.unlockedAt && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Unlocked: {new Date(ua.unlockedAt).toLocaleDateString()}
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};


