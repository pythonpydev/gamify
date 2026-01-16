import { http, HttpResponse } from 'msw';

// API base URL
const baseUrl = 'http://localhost:3000/api';

// Mock user for authenticated requests
const mockUser = {
  id: 'user_123',
  email: 'test@example.com',
  displayName: 'Test User',
  currentChips: 500,
  totalChipsEarned: 500,
  rank: 'Fish',
  createdAt: new Date().toISOString(),
};

// Mock categories
const mockCategories = [
  { id: 'cat_1', name: 'PhD', color: '#4F46E5', isDefault: true },
  { id: 'cat_2', name: 'Math', color: '#059669', isDefault: true },
  { id: 'cat_3', name: 'Programming', color: '#EA580C', isDefault: true },
  { id: 'cat_4', name: 'Outschool Content', color: '#7C3AED', isDefault: true },
];

// Mock session
const mockSession = {
  id: 'session_123',
  userId: mockUser.id,
  categoryId: 'cat_1',
  sessionType: 'STANDARD',
  startTime: new Date().toISOString(),
  endTime: null,
  durationMins: 25,
  qualityRating: null,
  chipsEarned: 0,
  status: 'ACTIVE',
  notes: null,
  category: mockCategories[0],
};

export const handlers = [
  // User endpoints
  http.get(`${baseUrl}/users/me`, () => {
    return HttpResponse.json(mockUser);
  }),

  http.get(`${baseUrl}/users/me/stats`, () => {
    return HttpResponse.json({
      currentChips: mockUser.currentChips,
      totalChipsEarned: mockUser.totalChipsEarned,
      rank: mockUser.rank,
      totalSessions: 10,
      completedSessions: 8,
      totalStudyTime: 250,
      averageQuality: 4.2,
    });
  }),

  // Category endpoints
  http.get(`${baseUrl}/categories`, () => {
    return HttpResponse.json(mockCategories);
  }),

  http.post(`${baseUrl}/categories`, async ({ request }) => {
    const body = (await request.json()) as { name: string; color: string };
    return HttpResponse.json({
      id: 'cat_new',
      name: body.name,
      color: body.color,
      isDefault: false,
    }, { status: 201 });
  }),

  // Session endpoints
  http.get(`${baseUrl}/sessions`, () => {
    return HttpResponse.json({
      sessions: [mockSession],
      total: 1,
      hasMore: false,
    });
  }),

  http.get(`${baseUrl}/sessions/active`, () => {
    return HttpResponse.json(null);
  }),

  http.post(`${baseUrl}/sessions`, async ({ request }) => {
    const body = (await request.json()) as { categoryId: string; sessionType: string };
    return HttpResponse.json({
      ...mockSession,
      categoryId: body.categoryId,
      sessionType: body.sessionType,
    }, { status: 201 });
  }),

  http.post(`${baseUrl}/sessions/:sessionId/complete`, async ({ request }) => {
    const body = (await request.json()) as { qualityRating: number; notes?: string };
    return HttpResponse.json({
      session: {
        ...mockSession,
        status: 'COMPLETED',
        qualityRating: body.qualityRating,
        chipsEarned: 180,
        endTime: new Date().toISOString(),
      },
      chipsEarned: 180,
      totalChips: 680,
      newRank: 'Fish',
    });
  }),

  http.post(`${baseUrl}/sessions/:sessionId/abandon`, () => {
    return HttpResponse.json({
      ...mockSession,
      status: 'ABANDONED',
      endTime: new Date().toISOString(),
    });
  }),
];
