import { Howl, Howler } from 'howler';

class AudioEngine {
  private isAmbientPlaying = false;
  
  // Ambient Tracks (Loops)
  private rain: Howl | null = null;
  private fireplace: Howl | null = null;
  private library: Howl | null = null;

  // SFX
  private pageTurn: Howl | null = null;
  private chime: Howl | null = null;

  private isInitialized = false;

  public init() {
    if (this.isInitialized) return;
    
    // Enable audio context if it was suspended
    if (Howler.ctx && Howler.ctx.state === 'suspended') {
      Howler.ctx.resume();
    }

    // Initialize multi-track ambient loops
    this.rain = new Howl({
      src: ['/sounds/rain.mp3'],
      loop: true,
      volume: 0,
      html5: true, // Stream large audio files
    });

    this.fireplace = new Howl({
      src: ['/sounds/fireplace.mp3'],
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

    // Initialize UI SFX
    this.pageTurn = new Howl({
      src: ['/sounds/page-turn.mp3'],
      volume: 0.6,
    });

    this.chime = new Howl({
      src: ['/sounds/chime.mp3'],
      volume: 0.4,
    });

    this.isInitialized = true;
  }

  public playAmbientFocus() {
    if (this.isAmbientPlaying || !this.isInitialized) return;
    this.isAmbientPlaying = true;

    // Start playback (if not already playing)
    if (!this.rain?.playing()) this.rain?.play();
    if (!this.fireplace?.playing()) this.fireplace?.play();
    if (!this.library?.playing()) this.library?.play();

    // Fade in the ambient mix for a deep focus atmosphere
    this.rain?.fade(0, 0.4, 4000);
    this.fireplace?.fade(0, 0.5, 4000);
    this.library?.fade(0, 0.2, 4000);
  }

  public stopAmbientFocus() {
    if (!this.isInitialized) return;
    
    // Smoothly fade out all ambient tracks over 3 seconds
    this.rain?.fade(this.rain.volume(), 0, 3000);
    this.fireplace?.fade(this.fireplace.volume(), 0, 3000);
    this.library?.fade(this.library.volume(), 0, 3000);

    setTimeout(() => {
      this.rain?.stop();
      this.fireplace?.stop();
      this.library?.stop();
      this.isAmbientPlaying = false;
    }, 3000);
  }

  public playPageTurn() {
    if (!this.isInitialized) return;
    // Play with slight random pitch variation for realism
    const rate = 0.9 + Math.random() * 0.2;
    this.pageTurn?.rate(rate);
    this.pageTurn?.play();
  }

  public playMagicChime() {
    if (!this.isInitialized) return;
    this.chime?.play();
  }
}

export const audioEngine = new AudioEngine();
