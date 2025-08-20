import { useCallback, useRef } from 'react';

// Simple sound utility hook using Web Audio API
export function useSound() {
  const audioContext = useRef<AudioContext | null>(null);

  const initAudioContext = useCallback(() => {
    if (!audioContext.current) {
      audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContext.current;
  }, []);

  const playTone = useCallback((frequency: number, duration: number, volume = 0.1) => {
    try {
      const ctx = initAudioContext();
      
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + duration);
    } catch (error) {
      console.log('Audio not available:', error);
    }
  }, [initAudioContext]);

  const playMoveSound = useCallback(() => {
    playTone(800, 0.1, 0.05);
  }, [playTone]);

  const playWinSound = useCallback(() => {
    // Play a celebratory sequence
    playTone(523, 0.2, 0.08); // C
    setTimeout(() => playTone(659, 0.2, 0.08), 150); // E
    setTimeout(() => playTone(784, 0.2, 0.08), 300); // G
    setTimeout(() => playTone(1047, 0.4, 0.1), 450); // C (octave)
  }, [playTone]);

  const playShuffleSound = useCallback(() => {
    // Quick sequence of random tones
    for (let i = 0; i < 8; i++) {
      const frequency = 200 + Math.random() * 600;
      setTimeout(() => playTone(frequency, 0.05, 0.03), i * 50);
    }
  }, [playTone]);

  return {
    playMoveSound,
    playWinSound,
    playShuffleSound,
  };
}