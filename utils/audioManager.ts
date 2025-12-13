/**
 * AudioManager - Centralized audio playback with proper resource management
 *
 * Maintains a single AudioContext instance to avoid browser limits and memory leaks.
 */
class AudioManager {
  private ctx: AudioContext | null = null;
  private isEnabled: boolean = true;

  private getContext(): AudioContext | null {
    if (!this.isEnabled) return null;

    try {
      if (!this.ctx) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContextClass) {
          console.warn('AudioContext not supported in this browser');
          return null;
        }
        this.ctx = new AudioContextClass();
      }

      // Resume context if suspended (autoplay policy)
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      return this.ctx;
    } catch (error) {
      console.error('Failed to create AudioContext:', error);
      return null;
    }
  }

  /**
   * Play a success sound - pleasant chime for habit completion
   */
  playSuccess(): void {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      // Sine wave for a pleasant "ding"
      oscillator.type = 'sine';

      // Frequency sweep: Start at 500Hz, ramp to 1000Hz
      oscillator.frequency.setValueAtTime(500, ctx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(1000, ctx.currentTime + 0.1);

      // Envelope: Quick attack, gentle decay
      gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.5);

      // Clean up oscillator after it finishes
      oscillator.onended = () => {
        oscillator.disconnect();
        gainNode.disconnect();
      };
    } catch (error) {
      console.error('Failed to play success sound:', error);
    }
  }

  /**
   * Enable or disable all audio playback
   */
  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
  }

  /**
   * Clean up audio resources
   */
  cleanup(): void {
    if (this.ctx) {
      this.ctx.close();
      this.ctx = null;
    }
  }
}

// Export singleton instance
export const audioManager = new AudioManager();
