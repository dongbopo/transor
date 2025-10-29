// Service for HealthQuest business logic

import { HealthQuestStorage } from './HealthQuestStorage';
import {
  UserProfile,
  HealthDataEntry,
  HealthScore,
  HealthDataType,
  CompanionStage,
  HealthState,
  UserCompanion,
  Quest,
  UserQuest,
  Streak,
  Achievement,
  UserAchievement,
  PointsTransaction,
} from '../types/healthquest';
import { v4 as uuidv4 } from 'uuid';

export class HealthQuestService {
  // Calculate health score based on recent data
  static calculateHealthScore(userId: string, days: number = 7): HealthScore {
    const profile = HealthQuestStorage.getProfile();
    if (!profile) {
      return this.getDefaultHealthScore();
    }

    const data = HealthQuestStorage.getHealthData()
      .filter(d => d.userId === userId)
      .filter(d => {
        const daysDiff = (Date.now() - d.recordedAt.getTime()) / (1000 * 60 * 60 * 24);
        return daysDiff <= days;
      });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Activity score (30%)
    const stepsData = data.filter(d => d.dataType === 'steps');
    const totalSteps = stepsData.reduce((sum, d) => sum + (d.value || 0), 0);
    const avgSteps = stepsData.length > 0 ? totalSteps / days : 0;
    const activityScore = Math.min(100, (avgSteps / profile.dailyStepGoal) * 100);

    // Nutrition score (20%)
    const waterData = data.filter(d => d.dataType === 'water');
    const totalWater = waterData.reduce((sum, d) => sum + (d.value || 0), 0);
    const avgWater = waterData.length > 0 ? totalWater / days : 0;
    const nutritionScore = Math.min(100, (avgWater / profile.dailyWaterGoalMl) * 100);

    // Sleep score (20%)
    const sleepData = data.filter(d => d.dataType === 'sleep_duration');
    const totalSleep = sleepData.reduce((sum, d) => sum + (d.value || 0), 0);
    const avgSleep = sleepData.length > 0 ? totalSleep / days : 0;
    const sleepScore = Math.min(100, (avgSleep / profile.dailySleepGoalHours) * 100);

    // Vitals score (15%) - simplified for MVP
    const vitalsData = data.filter(d => 
      ['weight', 'blood_pressure', 'heart_rate', 'blood_glucose'].includes(d.dataType)
    );
    const vitalsScore = vitalsData.length > 0 ? 85 : 70; // Placeholder

    // Consistency score (15%)
    const uniqueDays = new Set(
      data.map(d => {
        const date = new Date(d.recordedAt);
        date.setHours(0, 0, 0, 0);
        return date.getTime();
      })
    ).size;
    const consistencyScore = Math.min(100, (uniqueDays / days) * 100);

    const weights = {
      activityWeight: 0.3,
      nutritionWeight: 0.2,
      sleepWeight: 0.2,
      vitalsWeight: 0.15,
      consistencyWeight: 0.15,
    };

    const overall = Math.round(
      activityScore * weights.activityWeight +
      nutritionScore * weights.nutritionWeight +
      sleepScore * weights.sleepWeight +
      vitalsScore * weights.vitalsWeight +
      consistencyScore * weights.consistencyWeight
    );

    return {
      overall,
      activity: Math.round(activityScore),
      nutrition: Math.round(nutritionScore),
      sleep: Math.round(sleepScore),
      vitals: Math.round(vitalsScore),
      consistency: Math.round(consistencyScore),
      breakdown: weights,
    };
  }

  static getDefaultHealthScore(): HealthScore {
    return {
      overall: 50,
      activity: 50,
      nutrition: 50,
      sleep: 50,
      vitals: 70,
      consistency: 50,
      breakdown: {
        activityWeight: 0.3,
        nutritionWeight: 0.2,
        sleepWeight: 0.2,
        vitalsWeight: 0.15,
        consistencyWeight: 0.15,
      },
    };
  }

  // Calculate companion health state from health score
  static getHealthStateFromScore(score: number): HealthState {
    if (score >= 90) return 'thriving';
    if (score >= 70) return 'healthy';
    if (score >= 50) return 'okay';
    if (score >= 30) return 'struggling';
    return 'unwell';
  }

  // Calculate companion stage from days active
  static getStageFromDays(days: number): CompanionStage {
    if (days >= 365) return 5;
    if (days >= 90) return 4;
    if (days >= 30) return 3;
    if (days >= 7) return 2;
    return 1;
  }

  // Generate daily quests
  static generateDailyQuests(userId: string): UserQuest[] {
    const profile = HealthQuestStorage.getProfile();
    if (!profile) return [];

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);

    const questTemplates: Quest[] = [
      {
        id: 'daily-steps',
        type: 'daily',
        title: 'Walk Your Steps',
        description: `Walk ${profile.dailyStepGoal.toLocaleString()} steps today`,
        category: 'activity',
        criteria: { dataType: 'steps', target: profile.dailyStepGoal },
        rewardPoints: 100,
        difficulty: 'medium',
        startDate: today,
        endDate: endOfDay,
        isActive: true,
      },
      {
        id: 'daily-water',
        type: 'daily',
        title: 'Stay Hydrated',
        description: `Drink ${profile.dailyWaterGoalMl}ml of water today`,
        category: 'nutrition',
        criteria: { dataType: 'water', target: profile.dailyWaterGoalMl },
        rewardPoints: 80,
        difficulty: 'easy',
        startDate: today,
        endDate: endOfDay,
        isActive: true,
      },
      {
        id: 'daily-sleep',
        type: 'daily',
        title: 'Rest Well',
        description: `Sleep ${profile.dailySleepGoalHours} hours tonight`,
        category: 'sleep',
        criteria: { dataType: 'sleep_duration', target: profile.dailySleepGoalHours },
        rewardPoints: 120,
        difficulty: 'medium',
        startDate: today,
        endDate: endOfDay,
        isActive: true,
      },
    ];

    // Save quests if not exists
    const existingQuests = HealthQuestStorage.getQuests();
    questTemplates.forEach(quest => {
      if (!existingQuests.find(q => q.id === quest.id)) {
        HealthQuestStorage.saveQuests([...existingQuests, quest]);
      }
    });

    // Create user quests
    const userQuests: UserQuest[] = questTemplates.map(quest => ({
      id: uuidv4(),
      userId,
      questId: quest.id,
      status: 'active',
      progress: 0,
      assignedAt: today,
    }));

    userQuests.forEach(quest => {
      HealthQuestStorage.saveUserQuest(quest);
    });

    return userQuests;
  }

  // Update quest progress
  static updateQuestProgress(userId: string, questId: string, progress: number): void {
    const userQuests = HealthQuestStorage.getUserQuests();
    const userQuest = userQuests.find(q => q.userId === userId && q.id === questId);
    if (!userQuest) return;

    const quest = HealthQuestStorage.getQuests().find(q => q.id === userQuest.questId);
    if (!quest) return;

    const newProgress = Math.min(100, Math.max(0, progress));
    userQuest.progress = newProgress;

    if (newProgress >= 100 && userQuest.status === 'active') {
      userQuest.status = 'completed';
      userQuest.completedAt = new Date();
      this.awardPoints(userId, quest.rewardPoints, `Quest completed: ${quest.title}`);
    }

    HealthQuestStorage.saveUserQuest(userQuest);
  }

  // Award points
  static awardPoints(
    userId: string,
    points: number,
    source: string,
    referenceId?: string
  ): void {
    const currentBalance = HealthQuestStorage.getPointsBalance();
    const newBalance = currentBalance + points;

    const transaction: PointsTransaction = {
      id: uuidv4(),
      userId,
      transactionType: 'earned',
      pointsChange: points,
      source,
      referenceId,
      balanceAfter: newBalance,
      createdAt: new Date(),
    };

    HealthQuestStorage.addPointsTransaction(transaction);
  }

  // Update streak
  static updateStreak(userId: string, streakType: Streak['streakType']): void {
    const streaks = HealthQuestStorage.getStreaks();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let streak = streaks.find(s => s.userId === userId && s.streakType === streakType);

    if (!streak) {
      streak = {
        id: uuidv4(),
        userId,
        streakType,
        currentStreak: 0,
        longestStreak: 0,
        lastActivityDate: today,
        streakStartDate: today,
        freezeCountUsed: 0,
        freezeCountAvailable: 2,
      };
    }

    const lastDate = new Date(streak.lastActivityDate);
    lastDate.setHours(0, 0, 0, 0);
    const daysDiff = (today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24);

    if (daysDiff === 0) {
      // Already logged today
      return;
    } else if (daysDiff === 1) {
      // Continue streak
      streak.currentStreak += 1;
      streak.lastActivityDate = today;
      if (streak.currentStreak > streak.longestStreak) {
        streak.longestStreak = streak.currentStreak;
      }

      // Check for milestone rewards
      if (streak.currentStreak === 7) {
        this.awardPoints(userId, 100, 'Streak milestone: 7 days');
        this.checkAndUnlockAchievement(userId, 'week_warrior');
      } else if (streak.currentStreak === 30) {
        this.awardPoints(userId, 500, 'Streak milestone: 30 days');
      }
    } else {
      // Streak broken
      streak.currentStreak = 1;
      streak.streakStartDate = today;
      streak.lastActivityDate = today;
    }

    HealthQuestStorage.saveStreak(streak);
  }

  // Check and unlock achievements
  static checkAndUnlockAchievement(userId: string, achievementCode: string): void {
    const achievements = HealthQuestStorage.getAchievements();
    const achievement = achievements.find(a => a.code === achievementCode);
    if (!achievement) return;

    const userAchievements = HealthQuestStorage.getUserAchievements();
    let userAchievement = userAchievements.find(
      a => a.userId === userId && a.achievementId === achievement.id
    );

    if (!userAchievement) {
      userAchievement = {
        id: uuidv4(),
        userId,
        achievementId: achievement.id,
        progress: 0,
        isUnlocked: false,
      };
    }

    if (!userAchievement.isUnlocked) {
      userAchievement.isUnlocked = true;
      userAchievement.unlockedAt = new Date();
      this.awardPoints(userId, achievement.rewardPoints, `Achievement: ${achievement.name}`);
      HealthQuestStorage.saveUserAchievement(userAchievement);
    }
  }

  // Log health data and update related systems
  static logHealthData(entry: HealthDataEntry): void {
    HealthQuestStorage.saveHealthData(entry);
    this.awardPoints(entry.userId, 10, 'Data logged', entry.id);

    // Update quest progress
    const userQuests = HealthQuestStorage.getUserQuests()
      .filter(q => q.userId === entry.userId && q.status === 'active');

    userQuests.forEach(userQuest => {
      const quest = HealthQuestStorage.getQuests().find(q => q.id === userQuest.questId);
      if (!quest) return;

      if (quest.criteria.dataType === entry.dataType) {
        const target = quest.criteria.target || 0;
        const current = entry.value || 0;
        const progress = Math.min(100, (current / target) * 100);
        this.updateQuestProgress(entry.userId, userQuest.id, progress);
      }
    });

    // Update streak
    this.updateStreak(entry.userId, 'logging');
  }

  // Get today's progress
  static getTodayProgress(userId: string): {
    steps: { current: number; goal: number; percentage: number };
    water: { current: number; goal: number; percentage: number };
    sleep: { current: number; goal: number; percentage: number };
  } {
    const profile = HealthQuestStorage.getProfile();
    if (!profile) {
      return {
        steps: { current: 0, goal: 10000, percentage: 0 },
        water: { current: 0, goal: 2000, percentage: 0 },
        sleep: { current: 0, goal: 8, percentage: 0 },
      };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayData = HealthQuestStorage.getHealthData()
      .filter(d => {
        const entryDate = new Date(d.recordedAt);
        entryDate.setHours(0, 0, 0, 0);
        return entryDate.getTime() === today.getTime() && d.userId === userId;
      });

    const steps = todayData
      .filter(d => d.dataType === 'steps')
      .reduce((sum, d) => sum + (d.value || 0), 0);

    const water = todayData
      .filter(d => d.dataType === 'water')
      .reduce((sum, d) => sum + (d.value || 0), 0);

    const sleep = todayData
      .filter(d => d.dataType === 'sleep_duration')
      .reduce((sum, d) => sum + (d.value || 0), 0);

    return {
      steps: {
        current: steps,
        goal: profile.dailyStepGoal,
        percentage: Math.min(100, (steps / profile.dailyStepGoal) * 100),
      },
      water: {
        current: water,
        goal: profile.dailyWaterGoalMl,
        percentage: Math.min(100, (water / profile.dailyWaterGoalMl) * 100),
      },
      sleep: {
        current: sleep,
        goal: profile.dailySleepGoalHours,
        percentage: sleep > 0 ? Math.min(100, (sleep / profile.dailySleepGoalHours) * 100) : 0,
      },
    };
  }
}

