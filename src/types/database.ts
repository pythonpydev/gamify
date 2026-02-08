// Re-export Prisma generated types
export type { User, StudySession, Category } from '@prisma/client';
export { SessionType, SessionStatus } from '@prisma/client';

// Extended types with computed fields
export interface UserWithRank {
  id: string;
  authId: string;
  email: string;
  displayName: string | null;
  currentChips: number;
  totalChipsEarned: number;
  rank: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SessionWithCategory {
  id: string;
  userId: string;
  categoryId: string;
  sessionType: 'QUICK_HAND' | 'STANDARD' | 'DEEP_STACK';
  startTime: Date;
  endTime: Date | null;
  durationMins: number;
  qualityRating: number | null;
  chipsEarned: number;
  status: 'ACTIVE' | 'COMPLETED' | 'ABANDONED';
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
  category: {
    id: string;
    name: string;
    color: string;
  };
}

// Session type configuration
export const SESSION_TYPES = {
  TEST_HAND: { duration: 1, label: 'Test Hand (1 min)', breakDuration: 1 },
  QUICK_HAND: { duration: 15, label: 'Quick Hand', breakDuration: 5 },
  STANDARD: { duration: 25, label: 'Standard Hand', breakDuration: 5 },
  DEEP_STACK: { duration: 50, label: 'Deep Stack', breakDuration: 10 },
} as const;

export type SessionTypeName = keyof typeof SESSION_TYPES;
