import { Howler } from 'howler';

class AudioEngine {
  private isFocusModePlaying = false;
  private isInitialized = false;

  // Web Audio Context
  private ctx: AudioContext | null = null;
  
  // Nodes
  private brownNoiseSource: AudioBufferSourceNode | null = null;
  private brownNoiseGain: GainNode | null = null;

  private rainSource: AudioBufferSourceNode | null = null;
  private rainGain: GainNode | null = null;

  private librarySource: AudioBufferSourceNode | null = null;
  private libraryGain: GainNode | null = null;

  public init() {
    if (this.isInitialized) return;

    // Use Howler's audio context for cross-browser compatibility
    if (!Howler.ctx) {
      Howler.mute(false);
    }
    
    this.ctx = Howler.ctx as AudioContext;
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
    }

    this.isInitialized = true;
  }

  private handleVisibilityChange() {
    if (document.hidden) {
      if (this.isFocusModePlaying) {
        this.fadeProcedural(this.brownNoiseGain, 0, 1.5);
        this.fadeProcedural(this.rainGain, 0, 1.5);
        this.fadeProcedural(this.libraryGain, 0, 1.5);
      }
    } else {
      if (this.isFocusModePlaying) {
        this.fadeProcedural(this.brownNoiseGain, 0.2, 1.5);
        this.fadeProcedural(this.rainGain, 0.05, 1.5);
        this.fadeProcedural(this.libraryGain, 0.1, 1.5);
      }
    }
  }

  private fadeProcedural(gainNode: GainNode | null, targetVolume: number, durationSec: number) {
    if (this.ctx && gainNode) {
      gainNode.gain.cancelScheduledValues(this.ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        Math.max(targetVolume, 0.001), 
        this.ctx.currentTime + durationSec
      );
      if (targetVolume === 0) {
        gainNode.gain.linearRampToValueAtTime(0, this.ctx.currentTime + durationSec + 0.1);
      }
    }
  }

  private createNoiseBuffer(type: 'white' | 'pink' | 'brown'): AudioBuffer | null {
    if (!this.ctx) return null;
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    let lastOut = 0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      
      if (type === 'white') {
        data[i] = white;
      } else if (type === 'pink') {
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        data[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        data[i] *= 0.11; // compensation
        b6 = white * 0.115926;
      } else if (type === 'brown') {
        data[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = data[i];
        data[i] *= 3.5; // compensation
      }
    }
    return buffer;
  }

  private startNoise(
    buffer: AudioBuffer, 
    filterType: BiquadFilterType, 
    freq: number, 
    volume: number
  ): { source: AudioBufferSourceNode, gain: GainNode } | null {
    if (!this.ctx) return null;

    const source = this.ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = filterType;
    filter.frequency.value = freq;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.001, this.ctx.currentTime);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    
    source.start();
    return { source, gain };
  }

  public startFocusMode() {
    if (this.isFocusModePlaying || !this.isInitialized || !this.ctx) return;
    this.isFocusModePlaying = true;

    const brownBuffer = this.createNoiseBuffer('brown');
    const pinkBuffer = this.createNoiseBuffer('pink');
    
    if (brownBuffer && pinkBuffer) {
      // 1. Airplane Cabin Rumble (Brown Noise)
      const brown = this.startNoise(brownBuffer, 'lowpass', 400, 0.2);
      if (brown) {
        this.brownNoiseSource = brown.source;
        this.brownNoiseGain = brown.gain;
        this.fadeProcedural(this.brownNoiseGain, 0.2, 1.5);
      }

      // 2. Gentle Rain (Pink Noise + Bandpass)
      const rain = this.startNoise(pinkBuffer, 'bandpass', 1200, 0.05);
      if (rain) {
        this.rainSource = rain.source;
        this.rainGain = rain.gain;
        this.fadeProcedural(this.rainGain, 0.05, 1.5);
      }

      // 3. Library Hum (Pink Noise + Heavy Lowpass)
      const library = this.startNoise(pinkBuffer, 'lowpass', 150, 0.1);
      if (library) {
        this.librarySource = library.source;
        this.libraryGain = library.gain;
        this.fadeProcedural(this.libraryGain, 0.1, 1.5);
      }
    }
  }

  public stopFocusMode() {
    if (!this.isInitialized) return;
    
    this.fadeProcedural(this.brownNoiseGain, 0, 1.5);
    this.fadeProcedural(this.rainGain, 0, 1.5);
    this.fadeProcedural(this.libraryGain, 0, 1.5);

    setTimeout(() => {
      this.brownNoiseSource?.stop();
      this.brownNoiseSource?.disconnect();
      this.brownNoiseSource = null;

      this.rainSource?.stop();
      this.rainSource?.disconnect();
      this.rainSource = null;

      this.librarySource?.stop();
      this.librarySource?.disconnect();
      this.librarySource = null;

      this.isFocusModePlaying = false;
    }, 1600);
  }

  // Micro-interaction: Upload Success
  public playUploadSuccess() {
    if (!this.ctx || !this.isInitialized) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(554, this.ctx.currentTime + 0.15);
    
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

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(880, this.ctx.currentTime); // A5

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1200, this.ctx.currentTime);

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
