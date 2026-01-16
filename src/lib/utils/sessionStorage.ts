import type { ActiveSession } from '@/lib/store/sessionStore';

const SESSION_STORAGE_KEY = 'study-poker-active-session';

/**
 * Session Storage Utilities
 *
 * Provides localStorage persistence for active sessions to survive
 * page refreshes. The Zustand store uses its own persist middleware,
 * but these utilities can be used for additional session recovery logic.
 */

export function saveSession(session: ActiveSession): void {
  try {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  } catch (error) {
    console.error('Failed to save session to localStorage:', error);
  }
}

export function loadSession(): ActiveSession | null {
  try {
    const data = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!data) return null;

    const session: ActiveSession = JSON.parse(data);

    // Validate the session structure
    if (!session.id || !session.startTime || !session.sessionType) {
      clearSession();
      return null;
    }

    return session;
  } catch (error) {
    console.error('Failed to load session from localStorage:', error);
    clearSession();
    return null;
  }
}

export function clearSession(): void {
  try {
    localStorage.removeItem(SESSION_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear session from localStorage:', error);
  }
}

/**
 * Check if an active session has expired
 *
 * @param session The session to check
 * @returns true if the session timer has run out
 */
export function isSessionExpired(session: ActiveSession): boolean {
  const startTime = new Date(session.startTime).getTime();
  const durationMs = session.durationMins * 60 * 1000;
  const endTime = startTime + durationMs;

  return Date.now() >= endTime;
}

/**
 * Get remaining time for an active session
 *
 * @param session The session to check
 * @returns Remaining time in seconds, or 0 if expired
 */
export function getRemainingTime(session: ActiveSession): number {
  const startTime = new Date(session.startTime).getTime();
  const durationMs = session.durationMins * 60 * 1000;
  const endTime = startTime + durationMs;
  const remaining = Math.max(0, endTime - Date.now());

  return Math.ceil(remaining / 1000);
}
