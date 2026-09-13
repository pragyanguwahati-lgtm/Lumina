class AudioEngine {
  private ctx: AudioContext | null = null;
  private ambientGain: GainNode | null = null;
  private isAmbientPlaying = false;

  public init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public playAmbientFocus() {
    if (!this.ctx || this.isAmbientPlaying) return;
    this.isAmbientPlaying = true;

    // Create a very deep, soothing ambient drone
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    const masterGain = this.ctx.createGain();

    osc1.type = 'sine';
    osc2.type = 'triangle';
    
    // Very low frequencies for a 'room tone' feel
    osc1.frequency.value = 55; // A1
    osc2.frequency.value = 55.5; // Slight detune for phasing

    filter.type = 'lowpass';
    filter.frequency.value = 150; // Very muffled
    filter.Q.value = 1;

    // LFO to slowly modulate the filter to make it "breathe"
    lfo.type = 'sine';
    lfo.frequency.value = 0.1; // Very slow (10s cycle)
    lfoGain.gain.value = 50;

    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    masterGain.gain.value = 0; // Start silent, fade in
    masterGain.gain.linearRampToValueAtTime(0.15, this.ctx.currentTime + 5); // 5s fade in

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(masterGain);
    masterGain.connect(this.ctx.destination);

    osc1.start();
    osc2.start();
    lfo.start();

    this.ambientGain = masterGain;
  }

  public stopAmbientFocus() {
    if (!this.ctx || !this.ambientGain) return;
    
    // Fade out over 3 seconds
    this.ambientGain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 3);
    setTimeout(() => {
      this.ambientGain?.disconnect();
      this.ambientGain = null;
      this.isAmbientPlaying = false;
    }, 3000);
  }

  public playPageTurn() {
    if (!this.ctx) return;

    // A synthetic paper rustle using filtered noise
    const bufferSize = this.ctx.sampleRate * 0.5; // 0.5 seconds
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1200;
    filter.Q.value = 0.5;

    const env = this.ctx.createGain();
    env.gain.setValueAtTime(0, this.ctx.currentTime);
    env.gain.linearRampToValueAtTime(0.3, this.ctx.currentTime + 0.05); // quick attack
    env.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.3); // papery decay

    noiseSource.connect(filter);
    filter.connect(env);
    env.connect(this.ctx.destination);

    noiseSource.start();
  }

  public playMagicChime() {
    if (!this.ctx) return;

    // A subtle, ethereal chime for when the AI finishes
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, this.ctx.currentTime); // A5
    osc.frequency.exponentialRampToValueAtTime(440, this.ctx.currentTime + 2); // Drop pitch slightly

    filter.type = 'lowpass';
    filter.frequency.value = 2000;

    gain.gain.setValueAtTime(0, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.2, this.ctx.currentTime + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 3);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 3);
  }
}

// Export a singleton instance
export const audioEngine = new AudioEngine();
