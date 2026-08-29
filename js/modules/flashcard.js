/**
 * 賽博易斷 (CyberIChing) - 64卦像素記憶卡學習系統 (IChing Academy)
 * 支援 Mode A (看卦象猜卦名), Mode B (看卦名憶卦象), 連勝矩陣與錯題收集本 (LocalStorage)
 */

import { HEXAGRAMS } from '../data/hexagrams.js';
import { sound } from '../core/audio.js';

export class FlashcardManager {
  constructor() {
    this.currentMode = 'A'; // 'A': 看象猜名, 'B': 看名憶象
    this.currentHex = null;
    this.isAnswered = false;
    this.stats = {
      totalAnswered: 0,
      correctCount: 0,
      currentStreak: 0,
      maxStreak: 0,
      errorHexIds: [] // 錯題本 ID 陣列
    };
    this.isErrorReviewMode = false;
  }

  init() {
    this.loadStats();
    this.bindEvents();
    this.updateStatsUI();
    this.nextQuestion();
  }

  loadStats() {
    try {
      const saved = localStorage.getItem('cyber_iching_stats_v2');
      if (saved) {
        this.stats = Object.assign(this.stats, JSON.parse(saved));
      }
    } catch (e) {}
  }

  saveStats() {
    try {
      localStorage.setItem('cyber_iching_stats_v2', JSON.stringify(this.stats));
    } catch (e) {}
  }

  bindEvents() {
    // 模式切換按鈕
    const modeABtn = document.getElementById('btn-mode-a');
    const modeBBtn = document.getElementById('btn-mode-b');
    const errorModeBtn = document.getElementById('btn-toggle-error-mode');

    if (modeABtn) {
      modeABtn.addEventListener('click', () => {
        sound.playClick();
        this.currentMode = 'A';
        modeABtn.classList.add('active');
        if (modeBBtn) modeBBtn.classList.remove('active');
        this.nextQuestion();
      });
    }

    if (modeBBtn) {
      modeBBtn.addEventListener('click', () => {
        sound.playClick();
        this.currentMode = 'B';
        modeBBtn.classList.add('active');
        if (modeABtn) modeABtn.classList.remove('active');
        this.nextQuestion();
      });
    }

    // 錯題本模式切換
    if (errorModeBtn) {
      errorModeBtn.addEventListener('click', () => {
        sound.playClick();
        this.isErrorReviewMode = !this.isErrorReviewMode;
        if (this.isErrorReviewMode) {
          if (this.stats.errorHexIds.length === 0) {
            this.showToast("目前無錯題紀錄！已為您抽考全題庫。");
            this.isErrorReviewMode = false;
            errorModeBtn.classList.remove('active');
          } else {
            errorModeBtn.classList.add('active');
            errorModeBtn.textContent = `⚡ 錯題複習中 (${this.stats.errorHexIds.length}題)`;
            this.nextQuestion();
          }
        } else {
          errorModeBtn.classList.remove('active');
          errorModeBtn.textContent = `📚 錯題本 (${this.stats.errorHexIds.length})`;
          this.nextQuestion();
        }
      });
    }

    // 下一題按鈕
    const nextBtn = document.getElementById('btn-next-flashcard');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        sound.playClick();
        this.nextQuestion();
      });
    }

    // 卡牌翻牌互動
    const card = document.getElementById('flashcard-pixel-card');
    if (card) {
      card.addEventListener('click', () => {
        sound.playCardFlip();
        card.classList.toggle('flipped');
      });
    }

    // 清除統計紀錄
    const resetStatsBtn = document.getElementById('btn-reset-academy-stats');
    if (resetStatsBtn) {
      resetStatsBtn.addEventListener('click', () => {
        if (confirm("確定要重設所有學習統計與錯題本紀錄嗎？")) {
          this.stats = {
            totalAnswered: 0,
            correctCount: 0,
            currentStreak: 0,
            maxStreak: 0,
            errorHexIds: []
          };
          this.saveStats();
          this.updateStatsUI();
          this.showToast("學習統計已重設。");
        }
      });
    }
  }

  /**
   * 隨機抽取下一題
   */
  nextQuestion() {
    this.isAnswered = false;
    const card = document.getElementById('flashcard-pixel-card');
    if (card) card.classList.remove('flipped');

    // 依據是否為錯題本模式選題
    let pool = HEXAGRAMS;
    if (this.isErrorReviewMode && this.stats.errorHexIds.length > 0) {
      pool = HEXAGRAMS.filter(h => this.stats.errorHexIds.includes(h.id));
      if (pool.length === 0) pool = HEXAGRAMS;
    }

    const randomIndex = Math.floor(Math.random() * pool.length);
    this.currentHex = pool[randomIndex];

    this.renderQuestionCard();
    this.renderQuizOptions();
  }

  /**
   * 渲染抽認卡本體
   */
  renderQuestionCard() {
    const card = document.getElementById('flashcard-pixel-card');
    if (!card || !this.currentHex) return;

    const hex = this.currentHex;

    // 正面（答案揭曉面）
    const frontTitle = card.querySelector('.card-front .card-hex-title');
    const frontTrigrams = card.querySelector('.card-front .card-hex-trigrams');
    const frontTheme = card.querySelector('.card-front .card-hex-theme');
    const frontBadge = card.querySelector('.card-front .card-binary-badge');
    const frontVisual = card.querySelector('.card-front .hexagram-visual-container');

    if (frontTitle) frontTitle.textContent = `${hex.id}. ${hex.full_name}`;
    if (frontTrigrams) frontTrigrams.textContent = `上${hex.upper_trigram}${hex.upper_nature} · 下${hex.lower_trigram}${hex.lower_nature} (${hex.structure})`;
    if (frontTheme) frontTheme.textContent = `【核心心法】${hex.core_theme}\n${hex.judgment_vernacular}`;
    if (frontBadge) frontBadge.textContent = `BIN: ${hex.binary_code}`;
    if (frontVisual) frontVisual.innerHTML = this.buildHexLinesHTML(hex.binary_code);

    // 背面（題幹面）
    const backContent = document.getElementById('flashcard-back-content');
    if (!backContent) return;

    if (this.currentMode === 'A') {
      // 模式 A：看卦象猜卦名
      backContent.innerHTML = `
        <div class="card-back-icon">🔮</div>
        <div class="card-back-title">? 這是哪一個卦象 ?</div>
        <div class="hexagram-visual-container" style="width: 100%; margin: 8px 0;">
          ${this.buildHexLinesHTML(hex.binary_code)}
        </div>
        <div class="card-back-hint">請在下方四選一選擇卦名，或點擊翻牌查看詳解</div>
      `;
    } else {
      // 模式 B：看卦名憶卦象
      backContent.innerHTML = `
        <div class="card-back-icon">📜</div>
        <div class="card-back-title" style="font-size: 16px; color: #fff;">【 ${hex.full_name} 】</div>
        <div style="color: var(--crt-amber); font-family: var(--font-pixel-en); font-size: 10px;">第 ${hex.id} 卦 · ${hex.pinyin}</div>
        <div class="card-back-hint" style="margin-top: 14px;">請在腦海中回憶其 6 爻陰陽排列與上下八卦結構</div>
        <div style="color: var(--crt-cyan); font-size: 11px; margin-top: 10px;">[ 點擊卡牌翻轉揭曉線條與心法 ]</div>
      `;
    }
  }

  /**
   * 渲染四選一按鈕
   */
  renderQuizOptions() {
    const container = document.getElementById('quiz-options-container');
    if (!container || !this.currentHex) return;

    if (this.currentMode === 'B') {
      container.style.display = 'none';
      return;
    }

    container.style.display = 'grid';
    container.innerHTML = '';

    // 生成 1 個正解 + 3 個隨機干擾項
    const distractors = [];
    const others = HEXAGRAMS.filter(h => h.id !== this.currentHex.id);

    while (distractors.length < 3) {
      const rand = others[Math.floor(Math.random() * others.length)];
      if (!distractors.some(d => d.id === rand.id)) {
        distractors.push(rand);
      }
    }

    const options = [this.currentHex, ...distractors];
    // 打亂順序 (Shuffle)
    options.sort(() => Math.random() - 0.5);

    const letters = ['A', 'B', 'C', 'D'];
    options.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.className = 'quiz-opt-btn';
      btn.innerHTML = `<span style="color: var(--crt-cyan);">${letters[idx]}.</span> ${opt.full_name}`;
      btn.setAttribute('data-id', opt.id);

      btn.addEventListener('click', () => this.handleAnswer(opt.id, btn, options));
      container.appendChild(btn);
    });
  }

  /**
   * 處理答題判定
   */
  handleAnswer(selectedId, btnElement, allOptions) {
    if (this.isAnswered) return;
    this.isAnswered = true;

    this.stats.totalAnswered++;
    const isCorrect = selectedId === this.currentHex.id;

    if (isCorrect) {
      sound.playSuccess();
      btnElement.classList.add('correct');
      this.stats.correctCount++;
      this.stats.currentStreak++;
      if (this.stats.currentStreak > this.stats.maxStreak) {
        this.stats.maxStreak = this.stats.currentStreak;
      }

      // 若在錯題本中答對，從錯題本中移除
      this.stats.errorHexIds = this.stats.errorHexIds.filter(id => id !== this.currentHex.id);
    } else {
      sound.playError();
      btnElement.classList.add('wrong');
      this.stats.currentStreak = 0;

      // 標註正確答案按鈕
      const allBtns = document.querySelectorAll('.quiz-opt-btn');
      allBtns.forEach(b => {
        if (parseInt(b.getAttribute('data-id')) === this.currentHex.id) {
          b.classList.add('correct');
        }
      });

      // 加入錯題本
      if (!this.stats.errorHexIds.includes(this.currentHex.id)) {
        this.stats.errorHexIds.push(this.currentHex.id);
      }
    }

    this.saveStats();
    this.updateStatsUI();

    // 0.4 秒後以 steps(6) 翻轉卡牌揭曉完整卦德與卦辭
    setTimeout(() => {
      const card = document.getElementById('flashcard-pixel-card');
      if (card) card.classList.add('flipped');
    }, 400);
  }

  buildHexLinesHTML(binaryStr) {
    const posNames = ["初", "二", "三", "四", "五", "上"];
    let html = '';
    for (let i = 5; i >= 0; i--) {
      const bit = binaryStr[i];
      const isYang = bit === '1';
      html += `
        <div class="hex-line-row">
          <span class="hex-line-pos-label">${posNames[i]}</span>
          <div class="hex-line-graphic ${isYang ? 'yang' : 'yin'}">
            <div class="line-bar"></div>
            ${!isYang ? '<div class="line-bar"></div>' : ''}
          </div>
        </div>
      `;
    }
    return html;
  }

  updateStatsUI() {
    const streakEl = document.getElementById('stat-current-streak');
    const accuracyEl = document.getElementById('stat-accuracy-rate');
    const totalEl = document.getElementById('stat-total-answered');
    const errorCountEl = document.getElementById('error-notebook-count');

    if (streakEl) streakEl.textContent = `🔥 連勝: ${this.stats.currentStreak} (最高: ${this.stats.maxStreak})`;
    if (totalEl) totalEl.textContent = `題數: ${this.stats.totalAnswered}`;

    const accRate = this.stats.totalAnswered > 0 
      ? Math.round((this.stats.correctCount / this.stats.totalAnswered) * 100) 
      : 100;
    if (accuracyEl) accuracyEl.textContent = `正確率: ${accRate}%`;
    if (errorCountEl) errorCountEl.textContent = this.stats.errorHexIds.length;
  }

  showToast(msg) {
    const toast = document.getElementById('cyber-toast');
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2800);
  }
}

export const flashcardManager = new FlashcardManager();
