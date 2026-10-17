// Web Audio API Sound Effects Synthesizer for Ben 10 Omnitrix Experience

class OmnitrixAudioEngine {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.ambientGain = null;
    this.ambientOsc = null;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggle() {
    this.enabled = !this.enabled;
    if (this.ambientGain) {
      this.ambientGain.gain.setValueAtTime(this.enabled ? 0.05 : 0, this.ctx ? this.ctx.currentTime : 0);
    }
    return this.enabled;
  }

  // Dial rotate click
  playDialClick() {
    if (!this.enabled) return;
    this.init();
    const t = this.ctx.currentTime;
    
    // Short mechanical click
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'square';
    osc.frequency.setValueAtTime(800, t);
    osc.frequency.exponentialRampToValueAtTime(160, t + 0.04);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1200, t);
    filter.Q.setValueAtTime(3, t);

    gain.gain.setValueAtTime(0.15, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.045);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.05);
  }

  // Omnitrix Pop-up Activation sound
  playActivate() {
    if (!this.enabled) return;
    this.init();
    const t = this.ctx.currentTime;

    // Metal unlock spring
    const clickOsc = this.ctx.createOscillator();
    const clickGain = this.ctx.createGain();
    clickOsc.type = 'triangle';
    clickOsc.frequency.setValueAtTime(350, t);
    clickOsc.frequency.exponentialRampToValueAtTime(1200, t + 0.08);
    clickGain.gain.setValueAtTime(0.2, t);
    clickGain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
    clickOsc.connect(clickGain);
    clickGain.connect(this.ctx.destination);
    clickOsc.start(t);
    clickOsc.stop(t + 0.1);

    // Rising energy charge
    const chargeOsc = this.ctx.createOscillator();
    const chargeGain = this.ctx.createGain();
    chargeOsc.type = 'sawtooth';
    chargeOsc.frequency.setValueAtTime(150, t + 0.05);
    chargeOsc.frequency.exponentialRampToValueAtTime(680, t + 0.4);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(400, t + 0.05);
    filter.frequency.exponentialRampToValueAtTime(2400, t + 0.4);

    chargeGain.gain.setValueAtTime(0.001, t + 0.05);
    chargeGain.gain.linearRampToValueAtTime(0.25, t + 0.25);
    chargeGain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);

    chargeOsc.connect(filter);
    filter.connect(chargeGain);
    chargeGain.connect(this.ctx.destination);

    chargeOsc.start(t + 0.05);
    chargeOsc.stop(t + 0.5);
  }

  // Alien DNA Transformation shockwave
  playTransform() {
    if (!this.enabled) return;
    this.init();
    const t = this.ctx.currentTime;

    // Sub bass drop
    const sub = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    sub.type = 'sine';
    sub.frequency.setValueAtTime(140, t);
    sub.frequency.exponentialRampToValueAtTime(35, t + 0.6);
    subGain.gain.setValueAtTime(0.4, t);
    subGain.gain.exponentialRampToValueAtTime(0.001, t + 0.7);
    sub.connect(subGain);
    subGain.connect(this.ctx.destination);
    sub.start(t);
    sub.stop(t + 0.7);

    // Plasma burst noise
    const bufferSize = this.ctx.sampleRate * 0.4;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.1));
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(1800, t);
    noiseFilter.frequency.exponentialRampToValueAtTime(400, t + 0.4);
    noiseFilter.Q.setValueAtTime(2, t);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.35, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);
    noise.start(t);

    // Sci-fi high ring
    const ring = this.ctx.createOscillator();
    const ringGain = this.ctx.createGain();
    ring.type = 'sine';
    ring.frequency.setValueAtTime(1200, t);
    ring.frequency.setValueAtTime(1800, t + 0.1);
    ringGain.gain.setValueAtTime(0.12, t);
    ringGain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
    ring.connect(ringGain);
    ringGain.connect(this.ctx.destination);
    ring.start(t);
    ring.stop(t + 0.5);
  }

  // Futuristic Hologram UI blip
  playHolo() {
    if (!this.enabled) return;
    this.init();
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(920, t);
    osc.frequency.setValueAtTime(1380, t + 0.05);
    gain.gain.setValueAtTime(0.08, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.1);
  }
}

export const audioEngine = new OmnitrixAudioEngine();
