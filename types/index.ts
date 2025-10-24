export type PersonalityType = 
  | 'The Explorer'
  | 'The Connector'
  | 'The Creator'
  | 'The Thinker'
  | 'The Adventurer'
  | 'The Nurturer';

export interface UserProfile {
  id: string;
  name: string;
  bio: string;
  personalityType: PersonalityType;
  hobbies: string[];
  color: string;
  trophies: Trophy[];
  onboardingCompleted: boolean;
  handshakes: number;
  grassPoints: number;
  totalNetworkingTime: number;
  networkingStats: NetworkingStats;
}

export interface NetworkingStats {
  averageFriendsPerDay: number;
  totalTimeThisWeek: number;
  totalTimeThisMonth: number;
  topLocations: LocationStat[];
  sessionsCompleted: number;
}

export interface LocationStat {
  name: string;
  visits: number;
  connectionsCount: number;
}

export type TrophyRarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface Trophy {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: TrophyRarity;
  unlockedAt?: string;
  isUnlocked: boolean;
}

export interface Friend {
  id: string;
  name: string;
  personalityType: PersonalityType;
  color: string;
  connectedAt: string;
  bio: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  time: string;
  creatorId: string;
  creatorName: string;
  attendees: string[];
  rippleLevel: number;
  expiresAt: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  category: 'social' | 'interests' | 'values' | 'lifestyle';
}
