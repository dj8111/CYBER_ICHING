/**
 * 賽博易斷 (CyberIChing) - Web Audio 8-bit 復古音效合成器
 * 免載入任何外部音訊檔案，純以 Web Audio API 即時合成
 */

class RetroAudioEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  initContext() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    return this.muted;
  }

  isMuted() {
    return this.muted;
  }

  // 1. 按鈕點擊嗶嗶聲 (Terminal Click)
  playClick() {
    if (this.muted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(880, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, this.ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch (e) {
      console.warn("Audio error:", e);
    }
  }

  // 2. 銅錢投擲金屬碰撞聲 (Coin Toss)
  playCoinToss() {
    if (this.muted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const freqs = [1200, 1600, 2400];
      freqs.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq + Math.random() * 200, this.ctx.currentTime + idx * 0.04);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.5, this.ctx.currentTime + idx * 0.04 + 0.1);

        gain.gain.setValueAtTime(0.15, this.ctx.currentTime + idx * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.04 + 0.12);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(this.ctx.currentTime + idx * 0.04);
        osc.stop(this.ctx.currentTime + idx * 0.04 + 0.12);
      });
    } catch (e) {}
  }

  // 3. steps(6) 3D 卡牌翻轉定格聲 (Card Flip Steps)
  playCardFlip() {
    if (this.muted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const steps = [220, 330, 440, 550, 660, 880];
      const stepDuration = 0.06;

      steps.forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + i * stepDuration);

        gain.gain.setValueAtTime(0.1, this.ctx.currentTime + i * stepDuration);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + (i + 1) * stepDuration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(this.ctx.currentTime + i * stepDuration);
        osc.stop(this.ctx.currentTime + (i + 1) * stepDuration);
      });
    } catch (e) {}
  }

  // 4. 起卦完成太極鳴響鐘聲 (Divination Chime)
  playDivinationChime() {
    if (this.muted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const freqs = [330, 440, 660, 880, 1320];
      freqs.forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + i * 0.08);

        gain.gain.setValueAtTime(0.15, this.ctx.currentTime + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + i * 0.08 + 1.2);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(this.ctx.currentTime + i * 0.08);
        osc.stop(this.ctx.currentTime + i * 0.08 + 1.2);
      });
    } catch (e) {}
  }

  // 5. 答對/連勝音效 (Victory Arpeggio)
  playSuccess() {
    if (this.muted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.07);

        gain.gain.setValueAtTime(0.12, this.ctx.currentTime + idx * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.07 + 0.18);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(this.ctx.currentTime + idx * 0.07);
        osc.stop(this.ctx.currentTime + idx * 0.07 + 0.18);
      });
    } catch (e) {}
  }

  // 6. 答錯/警示音效 (Error Buzz)
  playError() {
    if (this.muted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, this.ctx.currentTime);
      osc.frequency.setValueAtTime(110, this.ctx.currentTime + 0.1);

      gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.25);
    } catch (e) {}
  }
}

export const sound = new RetroAudioEngine();
