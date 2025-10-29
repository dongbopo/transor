// HealthQuest Types

export type HealthCategory = 'activity' | 'nutrition' | 'sleep' | 'vitals' | 'mental' | 'medication';

export type HealthDataType = 
  | 'steps' 
  | 'water' 
  | 'weight' 
  | 'blood_pressure' 
  | 'heart_rate' 
  | 'blood_glucose'
  | 'sleep_duration'
  | 'mood'
  | 'meal';

export interface HealthDataEntry {
  id: string;
  userId: string;
  category: HealthCategory;
  dataType: HealthDataType;
  value: number;
  unit?: string;
  valueJson?: Record<string, any>; // For complex data like blood pressure
  recordedAt: Date;
  source: 'manual' | 'apple_health' | 'google_fit';
  notes?: string;
}

export interface UserProfile {
  userId: string;
  email: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: Date;
  gender?: string;
  heightCm?: number;
  weightKg?: number;
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  primaryGoal: 'weight_loss' | 'fitness' | 'maintenance' | 'health_monitoring';
  dailyStepGoal: number;
  dailyWaterGoalMl: number;
  dailySleepGoalHours: number;
  timezone: string;
  preferredLanguage: string;
  unitsSystem: 'metric' | 'imperial';
}

export type CompanionType = 'plant' | 'animal';
export type CompanionSubtype = 'tree' | 'flower' | 'succulent' | 'cat' | 'dog' | 'bird' | 'bunny';
export type HealthState = 'thriving' | 'healthy' | 'okay' | 'struggling' | 'unwell';
export type CompanionStage = 1 | 2 | 3 | 4 | 5;

export interface Companion {
  id: string;
  type: CompanionType;
  subtype: CompanionSubtype;
  name: string;
  description: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockPoints: number;
}

export interface UserCompanion {
  id: string;
  userId: string;
  companionId: string;
  customName: string;
  isActive: boolean;
  currentStage: CompanionStage;
  healthState: HealthState;
  totalDaysActive: number;
  unlockedAt: Date;
  lastInteractionAt?: Date;
}

export interface Quest {
  id: string;
  type: 'daily' | 'weekly' | 'special';
  title: string;
  description: string;
  category: HealthCategory;
  criteria: {
    dataType?: HealthDataType;
    target?: number;
    [key: string]: any;
  };
  rewardPoints: number;
  difficulty: 'easy' | 'medium' | 'hard';
  startDate: Date;
  endDate: Date;
  isActive: boolean;
}

export interface UserQuest {
  id: string;
  userId: string;
  questId: string;
  status: 'active' | 'completed' | 'failed' | 'skipped';
  progress: number; // 0-100
  assignedAt: Date;
  completedAt?: Date;
}

export interface Achievement {
  id: string;
  code: string;
  name: string;
  description: string;
  category: 'consistency' | 'activity' | 'health' | 'social' | 'collection';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  rewardPoints: number;
  isHidden: boolean;
  criteria: Record<string, any>;
}

export interface UserAchievement {
  id: string;
  userId: string;
  achievementId: string;
  progress: number; // 0-100
  isUnlocked: boolean;
  unlockedAt?: Date;
}

export interface Streak {
  id: string;
  userId: string;
  streakType: 'daily_login' | 'activity' | 'logging';
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: Date;
  streakStartDate: Date;
  freezeCountUsed: number;
  freezeCountAvailable: number;
}

export interface PointsTransaction {
  id: string;
  userId: string;
  transactionType: 'earned' | 'spent' | 'adjusted';
  pointsChange: number;
  source: string;
  referenceId?: string;
  description?: string;
  balanceAfter: number;
  createdAt: Date;
}

export interface HealthScore {
  overall: number; // 0-100
  activity: number;
  nutrition: number;
  sleep: number;
  vitals: number;
  consistency: number;
  breakdown: {
    activityWeight: number;
    nutritionWeight: number;
    sleepWeight: number;
    vitalsWeight: number;
    consistencyWeight: number;
  };
}

export interface DashboardData {
  healthScore: HealthScore;
  companion: UserCompanion & { companion: Companion };
  dailyQuests: Array<UserQuest & { quest: Quest }>;
  streaks: Streak[];
  pointsBalance: number;
  todayProgress: {
    steps: { current: number; goal: number; percentage: number };
    water: { current: number; goal: number; percentage: number };
    sleep: { current: number; goal: number; percentage: number };
  };
  recentActivities: HealthDataEntry[];
}

