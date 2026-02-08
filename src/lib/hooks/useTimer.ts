'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

export type TimerStatus = 'IDLE' | 'RUNNING' | 'PAUSED' | 'COMPLETED' | 'BREAK_RUNNING' | 'BREAK_PAUSED' | 'BREAK_COMPLETED';
export type TimerMode = 'WORK' | 'BREAK';

export interface TimerState {
  status: TimerStatus;
  mode: TimerMode;
  remainingSeconds: number;
  totalSeconds: number;
  elapsedSeconds: number;
}

export interface UseTimerOptions {
  onComplete?: () => void;
  onBreakComplete?: () => void;
  onTick?: (remainingSeconds: number) => void;
  playAlarmOnComplete?: boolean;
}

export function useTimer(options: UseTimerOptions = {}) {
  const { onComplete, onBreakComplete, onTick, playAlarmOnComplete = false } = options;

  const [state, setState] = useState<TimerState>({
    status: 'IDLE',
    mode: 'WORK',
    remainingSeconds: 0,
    totalSeconds: 0,
    elapsedSeconds: 0,
  });

  const workerRef = useRef<Worker | null>(null);
  const totalSecondsRef = useRef<number>(0);
  const onCompleteRef = useRef(onComplete);
  const onBreakCompleteRef = useRef(onBreakComplete);
  const onTickRef = useRef(onTick);
  const playAlarmRef = useRef(playAlarmOnComplete);

  // Keep callback refs up to date
  useEffect(() => {
    onCompleteRef.current = onComplete;
    onBreakCompleteRef.current = onBreakComplete;
    onTickRef.current = onTick;
    playAlarmRef.current = playAlarmOnComplete;
  }, [onComplete, onBreakComplete, onTick, playAlarmOnComplete]);

  // Initialize worker
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Create worker from blob to avoid webpack issues
    const workerCode = `
      let state = {
        isRunning: false,
        startTime: 0,
        durationMs: 0,
        pausedTime: 0,
      };
      let intervalId = null;

      function calculateRemainingMs() {
        if (!state.isRunning) {
          return state.durationMs - state.pausedTime;
        }
        const elapsed = performance.now() - state.startTime;
        return Math.max(0, state.durationMs - elapsed);
      }

      function tick() {
        const remainingMs = calculateRemainingMs();
        const remainingSeconds = Math.max(0, Math.ceil(remainingMs / 1000));

        self.postMessage({
          type: 'TICK',
          remainingSeconds,
          remainingMs,
          isComplete: remainingMs <= 0,
        });

        if (remainingMs <= 0) {
          stop();
          self.postMessage({ type: 'COMPLETE' });
        }
      }

      function start(durationSeconds) {
        state = {
          isRunning: true,
          startTime: performance.now(),
          durationMs: durationSeconds * 1000,
          pausedTime: 0,
        };
        
        // Call tick immediately to give instant feedback
        tick();
        
        // Use 500ms interval for responsive visual updates
        intervalId = setInterval(tick, 500);
      }

      function resume() {
        if (state.pausedTime > 0) {
          state.startTime = performance.now();
          state.durationMs = state.durationMs - state.pausedTime;
          state.isRunning = true;
          state.pausedTime = 0;
          tick();
          intervalId = setInterval(tick, 500);
        }
      }

      function pause() {
        if (intervalId) {
          clearInterval(intervalId);
          intervalId = null;
        }
        const elapsed = performance.now() - state.startTime;
        state.pausedTime = elapsed;
        state.isRunning = false;
        self.postMessage({
          type: 'PAUSED',
          remainingSeconds: Math.ceil((state.durationMs - elapsed) / 1000),
        });
      }

      function stop() {
        if (intervalId) {
          clearInterval(intervalId);
          intervalId = null;
        }
        state = {
          isRunning: false,
          startTime: 0,
          durationMs: 0,
          pausedTime: 0,
        };
      }

      self.onmessage = (event) => {
        const { type, durationSeconds } = event.data;
        switch (type) {
          case 'START':
            start(durationSeconds);
            break;
          case 'PAUSE':
            pause();
            break;
          case 'RESUME':
            resume();
            break;
          case 'STOP':
            stop();
            self.postMessage({ type: 'STOPPED' });
            break;
        }
      };
    `;

    const blob = new Blob([workerCode], { type: 'application/javascript' });
    const worker = new Worker(URL.createObjectURL(blob));

    worker.onmessage = (event) => {
      const { type, remainingSeconds } = event.data;

      switch (type) {
        case 'TICK':
          setState((prev) => {
            // Only update if the values have actually changed
            if (prev.remainingSeconds !== remainingSeconds) {
              const isBreak = prev.mode === 'BREAK';
              return {
                ...prev,
                status: isBreak ? 'BREAK_RUNNING' : 'RUNNING',
                remainingSeconds,
                elapsedSeconds: totalSecondsRef.current - remainingSeconds,
              };
            }
            return prev;
          });
          onTickRef.current?.(remainingSeconds);
          break;
        case 'COMPLETE':
          setState((prev) => {
            const isBreak = prev.mode === 'BREAK';
            return {
              ...prev,
              status: isBreak ? 'BREAK_COMPLETED' : 'COMPLETED',
              remainingSeconds: 0,
              elapsedSeconds: totalSecondsRef.current,
            };
          });
          
          // Play alarm if enabled
          if (playAlarmRef.current) {
            // Dynamically import to avoid issues with SSR
            import('@/lib/utils/alarm').then(({ playAlarm }) => {
              playAlarm();
            });
          }
          
          // Call appropriate completion handler
          setState((prev) => {
            if (prev.mode === 'BREAK') {
              onBreakCompleteRef.current?.();
            } else {
              onCompleteRef.current?.();
            }
            return prev;
          });
          break;
        case 'PAUSED':
          setState((prev) => {
            const isBreak = prev.mode === 'BREAK';
            return {
              ...prev,
              status: isBreak ? 'BREAK_PAUSED' : 'PAUSED',
              remainingSeconds,
            };
          });
          break;
        case 'STOPPED':
          setState({
            status: 'IDLE',
            mode: 'WORK',
            remainingSeconds: 0,
            totalSeconds: 0,
            elapsedSeconds: 0,
          });
          break;
      }
    };

    workerRef.current = worker;

    return () => {
      worker.terminate();
    };
  }, []);

  const start = useCallback((durationSeconds: number, mode: TimerMode = 'WORK') => {
    totalSecondsRef.current = durationSeconds;
    setState({
      status: mode === 'BREAK' ? 'BREAK_RUNNING' : 'RUNNING',
      mode,
      remainingSeconds: durationSeconds,
      totalSeconds: durationSeconds,
      elapsedSeconds: 0,
    });
    
    // Send message immediately - React 18 batches state updates properly
    workerRef.current?.postMessage({ type: 'START', durationSeconds });
  }, []);

  const pause = useCallback(() => {
    workerRef.current?.postMessage({ type: 'PAUSE' });
  }, []);

  const resume = useCallback(() => {
    workerRef.current?.postMessage({ type: 'RESUME' });
  }, []);

  const stop = useCallback(() => {
    workerRef.current?.postMessage({ type: 'STOP' });
  }, []);

  const reset = useCallback(() => {
    stop();
    setState({
      status: 'IDLE',
      mode: 'WORK',
      remainingSeconds: 0,
      totalSeconds: 0,
      elapsedSeconds: 0,
    });
  }, [stop]);

  const startBreak = useCallback((durationSeconds: number) => {
    start(durationSeconds, 'BREAK');
  }, [start]);

  return {
    ...state,
    start,
    startBreak,
    pause,
    resume,
    stop,
    reset,
    isIdle: state.status === 'IDLE',
    isRunning: state.status === 'RUNNING',
    isPaused: state.status === 'PAUSED',
    isCompleted: state.status === 'COMPLETED',
    isBreakRunning: state.status === 'BREAK_RUNNING',
    isBreakPaused: state.status === 'BREAK_PAUSED',
    isBreakCompleted: state.status === 'BREAK_COMPLETED',
    isOnBreak: state.mode === 'BREAK',
    isWorkSession: state.mode === 'WORK',
  };
}
