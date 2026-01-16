/**
 * Timer Web Worker
 *
 * Runs timer logic in a separate thread for accuracy.
 * Uses performance.now() for high-resolution timing that doesn't drift.
 */

interface TimerState {
  isRunning: boolean;
  startTime: number;
  durationMs: number;
  pausedTime: number;
}

let state: TimerState = {
  isRunning: false,
  startTime: 0,
  durationMs: 0,
  pausedTime: 0,
};

let intervalId: ReturnType<typeof setInterval> | null = null;

function calculateRemainingMs(): number {
  if (!state.isRunning) {
    return state.durationMs - state.pausedTime;
  }

  const elapsed = performance.now() - state.startTime;
  return Math.max(0, state.durationMs - elapsed);
}

function tick() {
  const remainingMs = calculateRemainingMs();
  const remainingSeconds = Math.ceil(remainingMs / 1000);

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

function start(durationSeconds: number) {
  state = {
    isRunning: true,
    startTime: performance.now(),
    durationMs: durationSeconds * 1000,
    pausedTime: 0,
  };

  // Immediate tick
  tick();

  // Update every 100ms for smooth display
  intervalId = setInterval(tick, 100);
}

function resume() {
  if (state.pausedTime > 0) {
    state.startTime = performance.now();
    state.durationMs = state.durationMs - state.pausedTime;
    state.isRunning = true;
    state.pausedTime = 0;

    tick();
    intervalId = setInterval(tick, 100);
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

self.onmessage = (event: MessageEvent) => {
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
    case 'GET_STATUS':
      self.postMessage({
        type: 'STATUS',
        isRunning: state.isRunning,
        remainingSeconds: Math.ceil(calculateRemainingMs() / 1000),
      });
      break;
  }
};
