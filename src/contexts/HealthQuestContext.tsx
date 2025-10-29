import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { HealthQuestStorage } from '../services/HealthQuestStorage';
import { HealthQuestService } from '../services/HealthQuestService';
import {
  UserProfile,
  HealthDataEntry,
  DashboardData,
  UserCompanion,
  Companion,
  HealthScore,
  HealthDataType,
} from '../types/healthquest';
import { v4 as uuidv4 } from 'uuid';

interface HealthQuestContextType {
  profile: UserProfile | null;
  dashboardData: DashboardData | null;
  loading: boolean;
  refreshDashboard: () => void;
  logHealthData: (entry: Omit<HealthDataEntry, 'id' | 'userId'>) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
}

const HealthQuestContext = createContext<HealthQuestContextType | undefined>(undefined);

export const HealthQuestProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const loadDashboard = useCallback(() => {
    setLoading(true);
    
    // Initialize if needed
    HealthQuestStorage.initializeDefaultData();

    const currentProfile = HealthQuestStorage.getProfile();
    if (!currentProfile) {
      setLoading(false);
      return;
    }

    setProfile(currentProfile);

    // Generate daily quests if not exists
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const userQuests = HealthQuestStorage.getUserQuests();
    const todayQuests = userQuests.filter(q => {
      const assignedDate = new Date(q.assignedAt);
      assignedDate.setHours(0, 0, 0, 0);
      return assignedDate.getTime() === today.getTime() && q.userId === currentProfile.userId;
    });

    if (todayQuests.length === 0) {
      HealthQuestService.generateDailyQuests(currentProfile.userId);
    }

    // Calculate health score
    const healthScore = HealthQuestService.calculateHealthScore(currentProfile.userId);

    // Get companion
    const userCompanions = HealthQuestStorage.getUserCompanions();
    const activeCompanion = userCompanions.find(c => c.isActive);
    const companions = HealthQuestStorage.getCompanions();
    const companionData = activeCompanion 
      ? companions.find(c => c.id === activeCompanion.companionId)
      : null;

    if (activeCompanion && companionData) {
      // Update companion state based on health score
      const healthState = HealthQuestService.getHealthStateFromScore(healthScore.overall);
      activeCompanion.healthState = healthState;
      HealthQuestStorage.saveUserCompanion(activeCompanion);
    }

    // Get daily quests with quest details
    const updatedUserQuests = HealthQuestStorage.getUserQuests()
      .filter(q => q.userId === currentProfile.userId && q.status === 'active');
    const quests = HealthQuestStorage.getQuests();
    const dailyQuests = updatedUserQuests
      .map(uq => {
        const quest = quests.find(q => q.id === uq.questId);
        return quest ? { ...uq, quest } : null;
      })
      .filter((q): q is NonNullable<typeof q> => q !== null);

    // Get streaks
    const streaks = HealthQuestStorage.getStreaks()
      .filter(s => s.userId === currentProfile.userId);

    // Get points balance
    const pointsBalance = HealthQuestStorage.getPointsBalance();

    // Get today's progress
    const todayProgress = HealthQuestService.getTodayProgress(currentProfile.userId);

    // Get recent activities
    const allData = HealthQuestStorage.getHealthData();
    const recentActivities = allData
      .filter(d => d.userId === currentProfile.userId)
      .sort((a, b) => b.recordedAt.getTime() - a.recordedAt.getTime())
      .slice(0, 5);

    const dashboard: DashboardData = {
      healthScore,
      companion: activeCompanion && companionData 
        ? { ...activeCompanion, companion: companionData }
        : null as any,
      dailyQuests,
      streaks,
      pointsBalance,
      todayProgress,
      recentActivities,
    };

    setDashboardData(dashboard);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const refreshDashboard = useCallback(() => {
    loadDashboard();
  }, [loadDashboard]);

  const logHealthData = useCallback((entry: Omit<HealthDataEntry, 'id' | 'userId'>) => {
    if (!profile) return;

    const newEntry: HealthDataEntry = {
      ...entry,
      id: uuidv4(),
      userId: profile.userId,
    };

    HealthQuestService.logHealthData(newEntry);
    refreshDashboard();
  }, [profile, refreshDashboard]);

  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    if (!profile) return;

    const updated = { ...profile, ...updates };
    HealthQuestStorage.saveProfile(updated);
    setProfile(updated);
    refreshDashboard();
  }, [profile, refreshDashboard]);

  return (
    <HealthQuestContext.Provider
      value={{
        profile,
        dashboardData,
        loading,
        refreshDashboard,
        logHealthData,
        updateProfile,
      }}
    >
      {children}
    </HealthQuestContext.Provider>
  );
};

export const useHealthQuest = () => {
  const context = useContext(HealthQuestContext);
  if (context === undefined) {
    throw new Error('useHealthQuest must be used within a HealthQuestProvider');
  }
  return context;
};

