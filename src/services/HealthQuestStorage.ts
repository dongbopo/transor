// LocalStorage service for HealthQuest data persistence

import {
  UserProfile,
  HealthDataEntry,
  UserCompanion,
  Companion,
  Quest,
  UserQuest,
  Achievement,
  UserAchievement,
  Streak,
  PointsTransaction,
  HealthScore,
} from '../types/healthquest';

const STORAGE_KEYS = {
  USER_PROFILE: 'hq_user_profile',
  HEALTH_DATA: 'hq_health_data',
  COMPANIONS: 'hq_companions',
  USER_COMPANIONS: 'hq_user_companions',
  QUESTS: 'hq_quests',
  USER_QUESTS: 'hq_user_quests',
  ACHIEVEMENTS: 'hq_achievements',
  USER_ACHIEVEMENTS: 'hq_user_achievements',
  STREAKS: 'hq_streaks',
  POINTS_TRANSACTIONS: 'hq_points_transactions',
  POINTS_BALANCE: 'hq_points_balance',
} as const;

export class HealthQuestStorage {
  // User Profile
  static getProfile(): UserProfile | null {
    const data = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    return data ? JSON.parse(data) : null;
  }

  static saveProfile(profile: UserProfile): void {
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
  }

  // Health Data
  static getHealthData(): HealthDataEntry[] {
    const data = localStorage.getItem(STORAGE_KEYS.HEALTH_DATA);
    if (!data) return [];
    const entries = JSON.parse(data);
    return entries.map((e: any) => ({
      ...e,
      recordedAt: new Date(e.recordedAt),
    }));
  }

  static saveHealthData(entry: HealthDataEntry): void {
    const entries = this.getHealthData();
    const existingIndex = entries.findIndex(e => e.id === entry.id);
    if (existingIndex >= 0) {
      entries[existingIndex] = entry;
    } else {
      entries.push(entry);
    }
    localStorage.setItem(STORAGE_KEYS.HEALTH_DATA, JSON.stringify(entries));
  }

  static deleteHealthData(entryId: string): void {
    const entries = this.getHealthData().filter(e => e.id !== entryId);
    localStorage.setItem(STORAGE_KEYS.HEALTH_DATA, JSON.stringify(entries));
  }

  // Companions
  static getCompanions(): Companion[] {
    const data = localStorage.getItem(STORAGE_KEYS.COMPANIONS);
    if (!data) return [];
    return JSON.parse(data);
  }

  static saveCompanions(companions: Companion[]): void {
    localStorage.setItem(STORAGE_KEYS.COMPANIONS, JSON.stringify(companions));
  }

  static getUserCompanions(): UserCompanion[] {
    const data = localStorage.getItem(STORAGE_KEYS.USER_COMPANIONS);
    if (!data) return [];
    const companions = JSON.parse(data);
    return companions.map((c: any) => ({
      ...c,
      unlockedAt: new Date(c.unlockedAt),
      lastInteractionAt: c.lastInteractionAt ? new Date(c.lastInteractionAt) : undefined,
    }));
  }

  static saveUserCompanion(companion: UserCompanion): void {
    const companions = this.getUserCompanions();
    const existingIndex = companions.findIndex(c => c.id === companion.id);
    if (existingIndex >= 0) {
      companions[existingIndex] = companion;
    } else {
      companions.push(companion);
    }
    localStorage.setItem(STORAGE_KEYS.USER_COMPANIONS, JSON.stringify(companions));
  }

  // Quests
  static getQuests(): Quest[] {
    const data = localStorage.getItem(STORAGE_KEYS.QUESTS);
    if (!data) return [];
    const quests = JSON.parse(data);
    return quests.map((q: any) => ({
      ...q,
      startDate: new Date(q.startDate),
      endDate: new Date(q.endDate),
    }));
  }

  static saveQuests(quests: Quest[]): void {
    localStorage.setItem(STORAGE_KEYS.QUESTS, JSON.stringify(quests));
  }

  static getUserQuests(): UserQuest[] {
    const data = localStorage.getItem(STORAGE_KEYS.USER_QUESTS);
    if (!data) return [];
    const quests = JSON.parse(data);
    return quests.map((q: any) => ({
      ...q,
      assignedAt: new Date(q.assignedAt),
      completedAt: q.completedAt ? new Date(q.completedAt) : undefined,
    }));
  }

  static saveUserQuest(quest: UserQuest): void {
    const quests = this.getUserQuests();
    const existingIndex = quests.findIndex(q => q.id === quest.id);
    if (existingIndex >= 0) {
      quests[existingIndex] = quest;
    } else {
      quests.push(quest);
    }
    localStorage.setItem(STORAGE_KEYS.USER_QUESTS, JSON.stringify(quests));
  }

  // Achievements
  static getAchievements(): Achievement[] {
    const data = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
    if (!data) return [];
    return JSON.parse(data);
  }

  static saveAchievements(achievements: Achievement[]): void {
    localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
  }

  static getUserAchievements(): UserAchievement[] {
    const data = localStorage.getItem(STORAGE_KEYS.USER_ACHIEVEMENTS);
    if (!data) return [];
    const achievements = JSON.parse(data);
    return achievements.map((a: any) => ({
      ...a,
      unlockedAt: a.unlockedAt ? new Date(a.unlockedAt) : undefined,
    }));
  }

  static saveUserAchievement(achievement: UserAchievement): void {
    const achievements = this.getUserAchievements();
    const existingIndex = achievements.findIndex(a => a.id === achievement.id);
    if (existingIndex >= 0) {
      achievements[existingIndex] = achievement;
    } else {
      achievements.push(achievement);
    }
    localStorage.setItem(STORAGE_KEYS.USER_ACHIEVEMENTS, JSON.stringify(achievements));
  }

  // Streaks
  static getStreaks(): Streak[] {
    const data = localStorage.getItem(STORAGE_KEYS.STREAKS);
    if (!data) return [];
    const streaks = JSON.parse(data);
    return streaks.map((s: any) => ({
      ...s,
      lastActivityDate: new Date(s.lastActivityDate),
      streakStartDate: new Date(s.streakStartDate),
    }));
  }

  static saveStreak(streak: Streak): void {
    const streaks = this.getStreaks();
    const existingIndex = streaks.findIndex(s => s.id === streak.id && s.streakType === streak.streakType);
    if (existingIndex >= 0) {
      streaks[existingIndex] = streak;
    } else {
      streaks.push(streak);
    }
    localStorage.setItem(STORAGE_KEYS.STREAKS, JSON.stringify(streaks));
  }

  // Points
  static getPointsTransactions(): PointsTransaction[] {
    const data = localStorage.getItem(STORAGE_KEYS.POINTS_TRANSACTIONS);
    if (!data) return [];
    const transactions = JSON.parse(data);
    return transactions.map((t: any) => ({
      ...t,
      createdAt: new Date(t.createdAt),
    }));
  }

  static addPointsTransaction(transaction: PointsTransaction): void {
    const transactions = this.getPointsTransactions();
    transactions.push(transaction);
    localStorage.setItem(STORAGE_KEYS.POINTS_TRANSACTIONS, JSON.stringify(transactions));
    this.setPointsBalance(transaction.balanceAfter);
  }

  static getPointsBalance(): number {
    const data = localStorage.getItem(STORAGE_KEYS.POINTS_BALANCE);
    return data ? parseInt(data, 10) : 0;
  }

  static setPointsBalance(balance: number): void {
    localStorage.setItem(STORAGE_KEYS.POINTS_BALANCE, balance.toString());
  }

  // Initialize default data
  static initializeDefaultData(): void {
    const profile = this.getProfile();
    if (profile) return; // Already initialized

    // Create default profile
    const defaultProfile: UserProfile = {
      userId: 'user-1',
      email: 'user@example.com',
      username: 'User',
      activityLevel: 'moderate',
      primaryGoal: 'fitness',
      dailyStepGoal: 10000,
      dailyWaterGoalMl: 2000,
      dailySleepGoalHours: 8,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      preferredLanguage: 'en',
      unitsSystem: 'metric',
    };
    this.saveProfile(defaultProfile);

    // Initialize default companion (plant)
    const defaultCompanion: Companion = {
      id: 'companion-1',
      type: 'plant',
      subtype: 'tree',
      name: 'Tree Companion',
      description: 'A friendly tree that grows with your health',
      rarity: 'common',
      unlockPoints: 0,
    };

    const existingCompanions = this.getCompanions();
    if (!existingCompanions.find(c => c.id === defaultCompanion.id)) {
      this.saveCompanions([...existingCompanions, defaultCompanion]);
    }

    const userCompanion: UserCompanion = {
      id: 'user-companion-1',
      userId: defaultProfile.userId,
      companionId: defaultCompanion.id,
      customName: 'Greenery',
      isActive: true,
      currentStage: 1,
      healthState: 'healthy',
      totalDaysActive: 0,
      unlockedAt: new Date(),
    };
    this.saveUserCompanion(userCompanion);

    // Initialize default achievements
    const defaultAchievements: Achievement[] = [
      {
        id: 'ach-1',
        code: 'first_steps',
        name: 'First Steps',
        description: 'Log data for 1 day',
        category: 'consistency',
        rarity: 'common',
        rewardPoints: 10,
        isHidden: false,
        criteria: { daysLogged: 1 },
      },
      {
        id: 'ach-2',
        code: 'week_warrior',
        name: 'Week Warrior',
        description: 'Maintain a 7-day streak',
        category: 'consistency',
        rarity: 'rare',
        rewardPoints: 100,
        isHidden: false,
        criteria: { streakDays: 7 },
      },
      {
        id: 'ach-3',
        code: 'walker',
        name: 'Walker',
        description: 'Walk 10,000 steps in a day',
        category: 'activity',
        rarity: 'common',
        rewardPoints: 50,
        isHidden: false,
        criteria: { stepsInDay: 10000 },
      },
    ];
    this.saveAchievements(defaultAchievements);

    // Initialize points balance
    this.setPointsBalance(0);
  }

  // Clear all data (for testing/reset)
  static clearAll(): void {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }
}

