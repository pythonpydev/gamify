// API Response Types

export interface ApiResponse<T = unknown> {
  data?: T;
  error?: ApiError;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: unknown;
}

// Session API Types
export interface CreateSessionRequest {
  categoryId: string;
  sessionType: 'QUICK_HAND' | 'STANDARD' | 'DEEP_STACK';
}

export interface CompleteSessionRequest {
  qualityRating: number; // 1-5
  notes?: string;
}

export interface CompleteSessionResponse {
  session: {
    id: string;
    chipsEarned: number;
    status: 'COMPLETED';
  };
  chipsEarned: number;
  totalChips: number;
  newRank: string;
}

export interface SessionListResponse {
  sessions: Array<{
    id: string;
    sessionType: string;
    startTime: string;
    endTime: string | null;
    durationMins: number;
    qualityRating: number | null;
    chipsEarned: number;
    status: string;
    category: {
      id: string;
      name: string;
      color: string;
    };
  }>;
  total: number;
  hasMore: boolean;
}

// User API Types
export interface UserStatsResponse {
  currentChips: number;
  totalChipsEarned: number;
  rank: string;
  totalSessions: number;
  completedSessions: number;
  totalStudyTime: number; // in minutes
  averageQuality: number;
}

export interface UserProfileResponse {
  id: string;
  email: string;
  displayName: string | null;
  currentChips: number;
  totalChipsEarned: number;
  rank: string;
  createdAt: string;
}

// Category API Types
export interface CreateCategoryRequest {
  name: string;
  color: string;
}

export interface UpdateCategoryRequest {
  name?: string;
  color?: string;
}

export interface CategoryResponse {
  id: string;
  name: string;
  color: string;
  isDefault: boolean;
  sessionCount?: number;
}
