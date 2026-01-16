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
  sessionType: 'QUICK_HAND' | 'STANDARD' | 'DEEP_STACK' | 'TEST_HAND';
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
// Note: TEST_HAND uses durationSeconds for 10-second timer
export const SESSION_TYPES = {
  QUICK_HAND: { duration: 15, label: 'Quick Hand' },
  STANDARD: { duration: 25, label: 'Standard Hand' },
  DEEP_STACK: { duration: 50, label: 'Deep Stack' },
  TEST_HAND: { duration: 0, durationSeconds: 10, label: 'Test Hand' },
} as const;

export type SessionTypeName = keyof typeof SESSION_TYPES;
