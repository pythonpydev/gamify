/**
 * Audio alarm utility for timer completion
 */

let audioContext: AudioContext | null = null;

/**
 * Initialize audio context (must be called from user interaction)
 */
export function initAudioContext() {
  if (typeof window === 'undefined') return;
  
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  
  // Resume context if suspended (required by some browsers)
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }
}

/**
 * Play a pleasant completion alarm sound
 * Uses Web Audio API to generate a triple-beep notification sound
 */
export function playAlarm() {
  if (typeof window === 'undefined') return;
  
  try {
    // Initialize context if needed
    if (!audioContext) {
      initAudioContext();
    }
    
    if (!audioContext) return;

    // Create a pleasant three-tone ascending chime
    const now = audioContext.currentTime;
    
    // Play three beeps with ascending frequencies
    const frequencies = [523.25, 659.25, 783.99]; // C5, E5, G5 (C major chord)
    const beepDuration = 0.15;
    const gapDuration = 0.1;
    
    frequencies.forEach((frequency, index) => {
      const oscillator = audioContext!.createOscillator();
      const gainNode = audioContext!.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext!.destination);
      
      // Use a sine wave for a pleasant tone
      oscillator.type = 'sine';
      oscillator.frequency.value = frequency;
      
      // Envelope for smooth attack and release
      const startTime = now + index * (beepDuration + gapDuration);
      const endTime = startTime + beepDuration;
      
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(0.3, startTime + 0.01); // Quick attack
      gainNode.gain.linearRampToValueAtTime(0.3, endTime - 0.05); // Sustain
      gainNode.gain.linearRampToValueAtTime(0, endTime); // Fade out
      
      oscillator.start(startTime);
      oscillator.stop(endTime);
    });
  } catch (error) {
    console.error('Failed to play alarm:', error);
  }
}

/**
 * Test the alarm sound
 */
export function testAlarm() {
  initAudioContext();
  playAlarm();
}
