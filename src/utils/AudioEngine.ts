import { Howl, Howler } from 'howler';

class AudioEngine {
  private isFocusModePlaying = false;
  private isInitialized = false;

  // Web Audio Context & Nodes for Procedural Sounds
  private ctx: AudioContext | null = null;
  private brownNoiseSource: AudioBufferSourceNode | null = null;
  private brownNoiseGain: GainNode | null = null;

  // Howler Assets
  private rain: Howl | null = null;
  private library: Howl | null = null;

  public init() {
    if (this.isInitialized) return;

    // We can extract the native AudioContext from Howler
    if (!Howler.ctx) {
      // Force init howler context if missing
      new Howl({ src: ['data:audio/mp3;base64,'] }); 
    }
    
    this.ctx = Howler.ctx as AudioContext;
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    // Initialize asset tracks (Default volume very low, no autoplay)
    this.rain = new Howl({
      src: ['/sounds/rain.mp3'],
      loop: true,
      volume: 0, 
      html5: true,
    });

    this.library = new Howl({
      src: ['/sounds/library.mp3'],
      loop: true,
      volume: 0,
      html5: true,
    });

    // Handle visibility changes for automatic pause/fade
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
    }

    this.isInitialized = true;
  }

  private handleVisibilityChange() {
    if (document.hidden) {
      // Fade out and pause everything when leaving tab
      if (this.isFocusModePlaying) {
        this.fadeAssets(0, 1500);
        this.fadeProcedural(0, 1.5);
      }
    } else {
      // Fade back in if returning
      if (this.isFocusModePlaying) {
        if (!this.rain?.playing()) this.rain?.play();
        if (!this.library?.playing()) this.library?.play();
        
        this.fadeAssets(0.15, 1500);
        this.fadeProcedural(0.2, 1.5);
      }
    }
  }

  private fadeAssets(targetVolume: number, durationMs: number) {
    if (this.rain?.playing()) {
      this.rain.fade(this.rain.volume(), targetVolume, durationMs);
    }
    if (this.library?.playing()) {
      this.library.fade(this.library.volume(), targetVolume * 0.8, durationMs); // Library is slightly quieter
    }
  }

  private fadeProcedural(targetVolume: number, durationSec: number) {
    if (this.ctx && this.brownNoiseGain) {
      this.brownNoiseGain.gain.cancelScheduledValues(this.ctx.currentTime);
      this.brownNoiseGain.gain.exponentialRampToValueAtTime(
        Math.max(targetVolume, 0.001), 
        this.ctx.currentTime + durationSec
      );
      if (targetVolume === 0) {
        this.brownNoiseGain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + durationSec + 0.1);
      }
    }
  }

  // Generate Procedural Brown Noise
  private createBrownNoise() {
    if (!this.ctx) return;
    const bufferSize = this.ctx.sampleRate * 2; // 2 seconds
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      // 1-pole lowpass filter to create brown noise (1/f^2)
      data[i] = (lastOut + (0.02 * white)) / 1.02;
      lastOut = data[i];
      data[i] *= 3.5; // Compensate for volume drop
    }

    this.brownNoiseSource = this.ctx.createBufferSource();
    this.brownNoiseSource.buffer = buffer;
    this.brownNoiseSource.loop = true;

    this.brownNoiseGain = this.ctx.createGain();
    this.brownNoiseGain.gain.setValueAtTime(0.001, this.ctx.currentTime);

    this.brownNoiseSource.connect(this.brownNoiseGain);
    this.brownNoiseGain.connect(this.ctx.destination);
    
    this.brownNoiseSource.start();
  }

  public startFocusMode() {
    if (this.isFocusModePlaying || !this.isInitialized) return;
    this.isFocusModePlaying = true;

    // Start Procedural
    this.createBrownNoise();
    this.fadeProcedural(0.2, 1.5); // Warm, deep rumble

    // Start Assets
    if (!this.rain?.playing()) this.rain?.play();
    if (!this.library?.playing()) this.library?.play();
    this.fadeAssets(0.15, 1500);
  }

  public stopFocusMode() {
    if (!this.isInitialized) return;
    
    this.fadeAssets(0, 1500);
    this.fadeProcedural(0, 1.5);

    setTimeout(() => {
      this.rain?.stop();
      this.library?.stop();
      if (this.brownNoiseSource) {
        this.brownNoiseSource.stop();
        this.brownNoiseSource.disconnect();
        this.brownNoiseSource = null;
      }
      this.isFocusModePlaying = false;
    }, 1600);
  }

  // Micro-interaction: Upload Success
  public playUploadSuccess() {
    if (!this.ctx || !this.isInitialized) return;

    // Warm 2-tone pulse: 440Hz -> 554Hz (A4 to C#5 - Major Third)
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sine';
    
    // Frequency slide
    osc.frequency.setValueAtTime(440, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(554, this.ctx.currentTime + 0.15);
    
    // Volume envelope
    gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.3, this.ctx.currentTime + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 1.2);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 1.5);
  }

  // Micro-interaction: Summary Finished
  public playSummaryFinished() {
    if (!this.ctx || !this.isInitialized) return;

    // Gentle muffled chime
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(880, this.ctx.currentTime); // A5

    // Muffle it with a lowpass
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1200, this.ctx.currentTime);

    // Exponential decay (400ms)
    gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.2, this.ctx.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.4);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.5);
  }
}

export const audioEngine = new AudioEngine();
