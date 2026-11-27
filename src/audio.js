export class SoundEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.enabled = true;
    this.streamGain = null;
    this.startedAmbient = false;
  }

  ensureContext() {
    if (!this.enabled) return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return null;
      this.ctx = new AudioCtx();
      const compressor = this.ctx.createDynamicsCompressor();
      compressor.threshold.value = -16;
      compressor.ratio.value = 6;
      const master = this.ctx.createGain();
      master.gain.value = 0.85;
      master.connect(compressor);
      compressor.connect(this.ctx.destination);
      this.masterGain = master;
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
    if (!this.startedAmbient) {
      this.startWaterAmbient();
    }
    return this.ctx;
  }

  setEnabled(flag) {
    this.enabled = Boolean(flag);
    if (!this.ctx) return;
    if (this.enabled) {
      this.ctx.resume().catch(() => {});
      if (this.streamGain) {
        this.streamGain.gain.setTargetAtTime(0.032, this.ctx.currentTime, 0.08);
      }
    } else {
      if (this.streamGain) {
        this.streamGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.04);
      }
      this.ctx.suspend().catch(() => {});
    }
  }

  startWaterAmbient() {
    if (!this.ctx || !this.masterGain || this.startedAmbient) return;
    this.startedAmbient = true;
    try {
      const bufferSize = this.ctx.sampleRate * 3;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0;
      let b1 = 0;
      let b2 = 0;
      for (let i = 0; i < bufferSize; i += 1) {
        const white = Math.random() * 2 - 1;
        b0 = 0.997 * b0 + white * 0.029;
        b1 = 0.985 * b1 + white * 0.032;
        b2 = 0.95 * b2 + white * 0.048;
        output[i] = (b0 + b1 + b2 + white * 0.05) * 0.36;
      }
      // Crossfade seam for click-free loop
      const fadeSamples = Math.floor(this.ctx.sampleRate * 0.25);
      for (let i = 0; i < fadeSamples; i += 1) {
        const w = 0.5 - 0.5 * Math.cos((Math.PI * i) / fadeSamples);
        const tailIdx = bufferSize - fadeSamples + i;
        output[i] = output[i] * w + output[tailIdx] * (1 - w);
      }

      const source = this.ctx.createBufferSource();
      source.buffer = noiseBuffer;
      source.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.value = 600;
      filter.Q.value = 0.7;

      const gain = this.ctx.createGain();
      gain.gain.value = this.enabled ? 0.032 : 0;

      source.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);
      source.start();
      this.streamGain = gain;
    } catch {
      // Audio unavailable
    }
  }

  playTap(comboLevel = 1) {
    const ctx = this.ensureContext();
    if (!ctx || !this.masterGain) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    const pitchBoost = Math.min(340, (comboLevel - 1) * 24);
    osc.frequency.setValueAtTime(340 + pitchBoost + Math.random() * 40, now);
    osc.frequency.exponentialRampToValueAtTime(660 + pitchBoost, now + 0.07);
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.08, now + 0.006);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.095);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.1);
  }

  playBuy() {
    const ctx = this.ensureContext();
    if (!ctx || !this.masterGain) return;
    const now = ctx.currentTime;
    const notes = [523.25, 659.25];
    notes.forEach((freq, idx) => {
      const t0 = now + idx * 0.055;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, t0);
      gain.gain.setValueAtTime(0.001, t0);
      gain.gain.linearRampToValueAtTime(0.085, t0 + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.001, t0 + 0.14);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(t0);
      osc.stop(t0 + 0.15);
    });
  }

  playUnlock() {
    const ctx = this.ensureContext();
    if (!ctx || !this.masterGain) return;
    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, idx) => {
      const t0 = now + idx * 0.07;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, t0);
      gain.gain.setValueAtTime(0.001, t0);
      gain.gain.linearRampToValueAtTime(0.1, t0 + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.001, t0 + 0.25);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(t0);
      osc.stop(t0 + 0.26);
    });
  }

  playBuild() {
    const ctx = this.ensureContext();
    if (!ctx || !this.masterGain) return;
    const now = ctx.currentTime;
    const thud = ctx.createOscillator();
    const tGain = ctx.createGain();
    thud.type = "triangle";
    thud.frequency.setValueAtTime(140, now);
    thud.frequency.exponentialRampToValueAtTime(52, now + 0.14);
    tGain.gain.setValueAtTime(0.001, now);
    tGain.gain.linearRampToValueAtTime(0.16, now + 0.01);
    tGain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
    thud.connect(tGain);
    tGain.connect(this.masterGain);
    thud.start(now);
    thud.stop(now + 0.17);
    this.playUnlock();
  }

  playSurgeAlert() {
    const ctx = this.ensureContext();
    if (!ctx || !this.masterGain) return;
    const now = ctx.currentTime;
    [587.33, 880, 587.33, 880].forEach((freq, idx) => {
      const t0 = now + idx * 0.09;
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, t0);
      g.gain.setValueAtTime(0.001, t0);
      g.gain.linearRampToValueAtTime(0.08, t0 + 0.01);
      g.gain.exponentialRampToValueAtTime(0.001, t0 + 0.08);
      osc.connect(g);
      g.connect(this.masterGain);
      osc.start(t0);
      osc.stop(t0 + 0.085);
    });
  }

  playFirework() {
    const ctx = this.ensureContext();
    if (!ctx || !this.masterGain) return;
    const now = ctx.currentTime;
    [659.25, 783.99, 987.77, 1318.51, 1567.98].forEach((freq, idx) => {
      const t0 = now + idx * 0.055;
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, t0);
      g.gain.setValueAtTime(0.001, t0);
      g.gain.linearRampToValueAtTime(0.09, t0 + 0.008);
      g.gain.exponentialRampToValueAtTime(0.001, t0 + 0.22);
      osc.connect(g);
      g.connect(this.masterGain);
      osc.start(t0);
      osc.stop(t0 + 0.23);
    });
  }
}
