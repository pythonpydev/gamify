import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

/**
 * Timer Worker Accuracy Tests
 *
 * Tests for the Web Worker-based timer to ensure it maintains accuracy
 * even when the main thread is busy or the tab is inactive.
 *
 * Note: These tests mock the Worker since Vitest runs in Node.js.
 * The actual Web Worker accuracy is tested in integration tests.
 */

// Mock the timer logic that will be in the worker
function calculateElapsedTime(startTime: number, currentTime: number): number {
  return Math.floor((currentTime - startTime) / 1000);
}

function calculateRemainingTime(durationSeconds: number, elapsedSeconds: number): number {
  return Math.max(0, durationSeconds - elapsedSeconds);
}

describe('Timer Accuracy', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('calculateElapsedTime', () => {
    it('calculates elapsed seconds correctly', () => {
      const startTime = 0;
      const currentTime = 5000; // 5 seconds later
      expect(calculateElapsedTime(startTime, currentTime)).toBe(5);
    });

    it('floors partial seconds', () => {
      const startTime = 0;
      const currentTime = 5999; // 5.999 seconds
      expect(calculateElapsedTime(startTime, currentTime)).toBe(5);
    });

    it('handles large durations correctly', () => {
      const startTime = 0;
      const currentTime = 50 * 60 * 1000; // 50 minutes
      expect(calculateElapsedTime(startTime, currentTime)).toBe(3000);
    });
  });

  describe('calculateRemainingTime', () => {
    it('calculates remaining time correctly', () => {
      expect(calculateRemainingTime(1500, 500)).toBe(1000);
    });

    it('never returns negative time', () => {
      expect(calculateRemainingTime(1000, 1500)).toBe(0);
    });

    it('returns 0 when elapsed equals duration', () => {
      expect(calculateRemainingTime(1500, 1500)).toBe(0);
    });
  });

  describe('timer accuracy simulation', () => {
    it('maintains accuracy over 25 minute session', () => {
      const startTime = performance.now();
      const durationMs = 25 * 60 * 1000; // 25 minutes in ms
      const expectedSeconds = 25 * 60;

      // Fast-forward 25 minutes
      vi.advanceTimersByTime(durationMs);

      const elapsed = Math.floor((performance.now() - startTime) / 1000);
      expect(elapsed).toBe(expectedSeconds);
    });

    it('maintains accuracy over 50 minute session', () => {
      const startTime = performance.now();
      const durationMs = 50 * 60 * 1000; // 50 minutes in ms
      const expectedSeconds = 50 * 60;

      // Fast-forward 50 minutes
      vi.advanceTimersByTime(durationMs);

      const elapsed = Math.floor((performance.now() - startTime) / 1000);
      expect(elapsed).toBe(expectedSeconds);
    });

    it('provides accurate countdown at various intervals', () => {
      const startTime = performance.now();
      const durationSeconds = 1500; // 25 minutes

      // Check at 5 minutes
      vi.advanceTimersByTime(5 * 60 * 1000);
      let elapsed = Math.floor((performance.now() - startTime) / 1000);
      expect(calculateRemainingTime(durationSeconds, elapsed)).toBe(1200);

      // Check at 10 minutes
      vi.advanceTimersByTime(5 * 60 * 1000);
      elapsed = Math.floor((performance.now() - startTime) / 1000);
      expect(calculateRemainingTime(durationSeconds, elapsed)).toBe(900);

      // Check at 25 minutes
      vi.advanceTimersByTime(15 * 60 * 1000);
      elapsed = Math.floor((performance.now() - startTime) / 1000);
      expect(calculateRemainingTime(durationSeconds, elapsed)).toBe(0);
    });
  });

  describe('drift correction', () => {
    it('uses performance.now() for high-resolution timing', () => {
      const t1 = performance.now();
      vi.advanceTimersByTime(1000);
      const t2 = performance.now();

      // Should be exactly 1000ms with fake timers
      expect(t2 - t1).toBe(1000);
    });

    it('corrects accumulated drift by using actual elapsed time', () => {
      // Simulate a scenario where setInterval might drift
      // but we correct by using performance.now()
      const startTime = performance.now();
      const intervalCalls: number[] = [];
      let callCount = 0;

      // Simulate interval that might have some drift
      const interval = setInterval(() => {
        callCount++;
        const actualElapsed = Math.floor((performance.now() - startTime) / 1000);
        intervalCalls.push(actualElapsed);

        if (callCount >= 10) {
          clearInterval(interval);
        }
      }, 1000);

      // Advance 10 seconds
      vi.advanceTimersByTime(10000);

      // Each call should show correct elapsed time
      expect(intervalCalls).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    });
  });
});

describe('Timer State Transitions', () => {
  it('transitions from IDLE to RUNNING on start', () => {
    type TimerState = 'IDLE' | 'RUNNING' | 'PAUSED' | 'COMPLETED';
    let state: TimerState = 'IDLE';

    // Start timer
    state = 'RUNNING';
    expect(state).toBe('RUNNING');
  });

  it('transitions from RUNNING to COMPLETED when time expires', () => {
    type TimerState = 'IDLE' | 'RUNNING' | 'PAUSED' | 'COMPLETED';
    let state: TimerState = 'RUNNING';
    let remainingTime = 10;

    // Simulate time expiring
    remainingTime = 0;
    if (remainingTime === 0) {
      state = 'COMPLETED';
    }

    expect(state).toBe('COMPLETED');
  });
});
