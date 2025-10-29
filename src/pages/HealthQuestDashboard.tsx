import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useHealthQuest } from '../contexts/HealthQuestContext';
import { HealthScoreCard } from '../components/healthquest/HealthScoreCard';
import { CompanionDisplay } from '../components/healthquest/CompanionDisplay';
import { QuestList } from '../components/healthquest/QuestList';
import { ProgressCards } from '../components/healthquest/ProgressCards';
import { QuickLogModal } from '../components/healthquest/QuickLogModal';
import { Plus, Trophy, Flame, BarChart3 } from 'lucide-react';
import { HealthQuestService } from '../services/HealthQuestService';
import toast from 'react-hot-toast';

export const HealthQuestDashboard: React.FC = () => {
  const { dashboardData, loading, refreshDashboard, logHealthData } = useHealthQuest();
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);

  const handleLog = (dataType: any, value: number, notes?: string) => {
    logHealthData({
      category:
        dataType === 'steps' || dataType === 'weight'
          ? 'activity'
          : dataType === 'water' || dataType === 'meal'
          ? 'nutrition'
          : dataType === 'sleep_duration'
          ? 'sleep'
          : dataType === 'mood'
          ? 'mental'
          : 'vitals',
      dataType,
      value,
      unit:
        dataType === 'steps'
          ? 'steps'
          : dataType === 'water'
          ? 'ml'
          : dataType === 'weight'
          ? 'kg'
          : dataType === 'sleep_duration'
          ? 'hours'
          : '',
      recordedAt: new Date(),
      source: 'manual',
      notes,
    });

    toast.success('Data logged successfully! +10 points');
  };

  const handleInteractWithCompanion = () => {
    toast.success('Your companion is happy! 🌱');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🌱</div>
          <p className="text-gray-600 dark:text-gray-400">Loading your health journey...</p>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">No data available</p>
        </div>
      </div>
    );
  }

  const { healthScore, companion, dailyQuests, streaks, pointsBalance, todayProgress } =
    dashboardData;

  const loginStreak = streaks.find(s => s.streakType === 'daily_login') || streaks[0];
  const streakDays = loginStreak?.currentStreak || 0;

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            HealthQuest
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Welcome back! Let's keep your health journey going.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Link
            to="/healthquest/stats"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <BarChart3 className="w-5 h-5" />
            <span>Stats</span>
          </Link>
          <div className="text-right">
            <div className="flex items-center gap-2 mb-1">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <span className="text-xl font-bold text-gray-800 dark:text-white">
                {pointsBalance.toLocaleString()}
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Points</p>
          </div>
        </div>
      </div>

      {/* Streak Banner */}
      {streakDays > 0 && (
        <motion.div
          className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl shadow-lg p-4 mb-6 text-white"
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
        >
          <div className="flex items-center gap-3">
            <Flame className="w-8 h-8 animate-pulse" />
            <div>
              <div className="font-bold text-lg">{streakDays} Day Streak!</div>
              <div className="text-sm opacity-90">Keep it up! 🔥</div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Health Score */}
      <HealthScoreCard healthScore={healthScore} />

      {/* Companion */}
      {companion && (
        <CompanionDisplay
          companion={companion}
          healthScore={healthScore.overall}
          onInteract={handleInteractWithCompanion}
        />
      )}

      {/* Today's Progress */}
      <ProgressCards
        steps={todayProgress.steps}
        water={todayProgress.water}
        sleep={todayProgress.sleep}
      />

      {/* Quests */}
      {dailyQuests.length > 0 && <QuestList quests={dailyQuests} />}

      {/* Quick Log Button */}
      <motion.button
        onClick={() => setIsLogModalOpen(true)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 flex items-center justify-center z-40"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Plus className="w-8 h-8" />
      </motion.button>

      {/* Quick Log Modal */}
      <QuickLogModal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        onLog={handleLog}
      />
    </div>
  );
};

