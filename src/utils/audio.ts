/**
 * Web Audio API procedural sound synthesizer.
 * Guarantees crisp, lag-free sound effects without external audio asset downloads.
 */

class SoundManager {
  private ctx: AudioContext | null = null;
  private isSoundEnabled = true;
  private isMusicEnabled = false;
  private isTemporarilyMuted = false;
  private masterGain: GainNode | null = null;
  private masterVolume = 0.6; // 60% default medium volume level
  private musicOscillators: OscillatorNode[] = [];
  private musicGain: GainNode | null = null;
  private isMusicPlaying = false;
  private musicInterval: any = null;

  public muteForAd() {
    this.isTemporarilyMuted = true;
    if (this.ctx && this.ctx.state === 'running') {
      this.ctx.suspend().catch(() => {});
    }
  }

  public unmuteAfterAd() {
    this.isTemporarilyMuted = false;
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    if (this.ctx && !this.masterGain) {
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.masterVolume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
  }

  private getMasterGain(): GainNode | null {
    this.initContext();
    return this.masterGain;
  }

  public setVolume(volume0to100: number) {
    this.masterVolume = Math.max(0, Math.min(100, volume0to100)) / 100;
    if (this.ctx && this.masterGain) {
      this.masterGain.gain.setValueAtTime(this.masterVolume, this.ctx.currentTime);
    }
  }

  public getVolume(): number {
    return Math.round(this.masterVolume * 100);
  }

  public setSoundEnabled(enabled: boolean) {
    this.isSoundEnabled = enabled;
  }

  public setMusicEnabled(enabled: boolean) {
    this.isMusicEnabled = enabled;
    if (enabled) {
      this.startMusic();
    } else {
      this.stopMusic();
    }
  }

  public playClick() {
    if (!this.isSoundEnabled || this.isTemporarilyMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.06);

    gain.gain.setValueAtTime(0.16, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.06);

    osc.connect(gain);
    const dest = this.getMasterGain() || this.ctx.destination;
    gain.connect(dest);

    osc.start(now);
    osc.stop(now + 0.06);
  }

  public playPop() {
    if (!this.isSoundEnabled || this.isTemporarilyMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(350, now);
    osc.frequency.exponentialRampToValueAtTime(950, now + 0.1);

    gain.gain.setValueAtTime(0.16, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

    osc.connect(gain);
    const dest = this.getMasterGain() || this.ctx.destination;
    gain.connect(dest);

    osc.start(now);
    osc.stop(now + 0.1);
  }

  public playCoin() {
    if (!this.isSoundEnabled || this.isTemporarilyMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const dest = this.getMasterGain() || this.ctx.destination;

    // Two-tone bell chime
    [987.77, 1318.51].forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const delay = idx * 0.07;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + delay);

      gain.gain.setValueAtTime(0.18, now + delay);
      gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.28);

      osc.connect(gain);
      gain.connect(dest);

      osc.start(now + delay);
      osc.stop(now + delay + 0.3);
    });
  }

  public playUpgrade() {
    if (!this.isSoundEnabled || this.isTemporarilyMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    const now = this.ctx.currentTime;
    const dest = this.getMasterGain() || this.ctx.destination;

    notes.forEach((freq, i) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const startTime = now + i * 0.08;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.18, startTime);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.25);

      osc.connect(gain);
      gain.connect(dest);

      osc.start(startTime);
      osc.stop(startTime + 0.26);
    });
  }

  /**
   * Pleasant magical swirling sound when fusion/mixing begins.
   */
  public playMixEngine() {
    if (!this.isSoundEnabled || this.isTemporarilyMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const dest = this.getMasterGain() || this.ctx.destination;

    // 1. Warm ascending harmony pad (sine waves blending smoothly)
    const baseFreqs = [261.63, 329.63, 392.0]; // C4, E4, G4 major triad
    baseFreqs.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.8, now + 1.15);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.07 / (idx + 1), now + 0.6);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

      osc.connect(gain);
      gain.connect(dest);

      osc.start(now);
      osc.stop(now + 1.25);
    });

    // 2. Sparkling stardust chime sequence swirling upwards
    const chimeNotes = [523.25, 659.25, 783.99, 1046.5, 1174.66, 1318.51, 1567.98];
    chimeNotes.forEach((freq, idx) => {
      if (!this.ctx) return;
      const startTime = now + idx * 0.15;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.08, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.22);

      osc.connect(gain);
      gain.connect(dest);

      osc.start(startTime);
      osc.stop(startTime + 0.25);
    });
  }

  /**
   * Pleasant magical pop/bloom when fusion bursts open.
   * Normalized to medium level (no harsh static explosion).
   */
  public playExplosion() {
    if (!this.isSoundEnabled || this.isTemporarilyMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const dest = this.getMasterGain() || this.ctx.destination;

    // 1. Juicy rounded bubble pop (pleasant low-mid punch, normalized)
    const popOsc = this.ctx.createOscillator();
    const popGain = this.ctx.createGain();

    popOsc.type = 'sine';
    popOsc.frequency.setValueAtTime(580, now);
    popOsc.frequency.exponentialRampToValueAtTime(140, now + 0.14);

    popGain.gain.setValueAtTime(0.18, now);
    popGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    popOsc.connect(popGain);
    popGain.connect(dest);

    popOsc.start(now);
    popOsc.stop(now + 0.2);

    // 2. Crystal bell sparkle ring (celestial magic dust)
    const sparkleFreqs = [1046.5, 1318.51, 1567.98, 2093.0]; // C6, E6, G6, C7
    sparkleFreqs.forEach((freq, i) => {
      if (!this.ctx) return;
      const delay = i * 0.035;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + delay);

      gain.gain.setValueAtTime(0.10, now + delay);
      gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.35);

      osc.connect(gain);
      gain.connect(dest);

      osc.start(now + delay);
      osc.stop(now + delay + 0.38);
    });
  }

  /**
   * Joyful, warm reveal fanfare (melodic marimba/celesta celebration).
   */
  public playNewMemeFanfare(isEpicOrAbove = false) {
    if (!this.isSoundEnabled || this.isTemporarilyMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const dest = this.getMasterGain() || this.ctx.destination;
    const notes = isEpicOrAbove
      ? [523.25, 659.25, 783.99, 987.77, 1046.5, 1318.51, 1567.98] // C5, E5, G5, B5, C6, E6, G6
      : [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6

    notes.forEach((freq, i) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const harmonic = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const startTime = now + i * 0.09;
      const noteDuration = i === notes.length - 1 ? 0.85 : 0.45;

      // Primary warm tone
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);

      // Soft sparkling overtone (octave higher, gentle)
      harmonic.type = 'sine';
      harmonic.frequency.setValueAtTime(freq * 2, startTime);

      const noteVolume = i === notes.length - 1 ? 0.18 : 0.14;
      gain.gain.setValueAtTime(noteVolume, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + noteDuration);

      osc.connect(gain);
      harmonic.connect(gain);
      gain.connect(dest);

      osc.start(startTime);
      harmonic.start(startTime);
      osc.stop(startTime + noteDuration + 0.05);
      harmonic.stop(startTime + noteDuration + 0.05);
    });
  }

  public playPositiveEvent() {
    this.playNewMemeFanfare(true);
  }

  public playNegativeEvent() {
    if (!this.isSoundEnabled || this.isTemporarilyMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const dest = this.getMasterGain() || this.ctx.destination;
    const tones = [370, 349, 330, 290];

    tones.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const startTime = now + idx * 0.16;

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, startTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.92, startTime + 0.22);

      gain.gain.setValueAtTime(0.14, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.24);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(650, startTime);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(dest);

      osc.start(startTime);
      osc.stop(startTime + 0.26);
    });
  }

  public startMusic() {
    if (this.isMusicPlaying) return;
    this.initContext();
    if (!this.ctx) return;

    this.isMusicPlaying = true;
    const melody = [261.63, 329.63, 392.0, 440.0, 392.0, 329.63, 293.66, 329.63];
    let noteIdx = 0;
    const dest = this.getMasterGain() || this.ctx.destination;

    this.musicInterval = setInterval(() => {
      if (!this.isMusicEnabled || this.isTemporarilyMuted || !this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(melody[noteIdx], now);
        noteIdx = (noteIdx + 1) % melody.length;

        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

        osc.connect(gain);
        gain.connect(dest);

        osc.start(now);
        osc.stop(now + 0.38);
      } catch (e) {
        // Safe catch on background transitions
      }
    }, 450);
  }

  public stopMusic() {
    this.isMusicPlaying = false;
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
  }
}

export const soundManager = new SoundManager();
