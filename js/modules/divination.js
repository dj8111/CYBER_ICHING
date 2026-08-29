/**
 * 賽博易斷 (CyberIChing) - 占斷與終端機解卦模組
 * 包含互動式三枚銅錢投擲、量子快速起卦、3D 像素 steps(6) 翻轉卡與階層式報告
 */

import { castSingleLineCoins, buildDivinationReading, findHexagramByBinary, interpretZhuXiRules } from '../core/ichingEngine.js';
import { HEXAGRAMS } from '../data/hexagrams.js';
import { sound } from '../core/audio.js';
import { shareManager } from './share.js';

export class DivinationManager {
  constructor() {
    this.currentLines = [];
    this.currentCategory = '事業';
    this.isCasting = false;
    this.currentReading = null;
  }

  init() {
    this.bindEvents();
  }

  bindEvents() {
    // 1. 分類標籤切換
    const chips = document.querySelectorAll('.category-chip');
    chips.forEach(chip => {
      chip.addEventListener('click', (e) => {
        sound.playClick();
        chips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        this.currentCategory = chip.getAttribute('data-cat') || '事業';
      });
    });

    // 2. 互動單爻投擲按鈕
    const btnCastSingle = document.getElementById('btn-cast-single-line');
    if (btnCastSingle) {
      btnCastSingle.addEventListener('click', () => this.handleStepCast());
    }

    // 3. 一鍵賽博量子起卦
    const btnQuickCast = document.getElementById('btn-quick-quantum-cast');
    if (btnQuickCast) {
      btnQuickCast.addEventListener('click', () => this.handleQuickCast());
    }

    // 4. 重設占斷
    const btnReset = document.getElementById('btn-reset-divination');
    if (btnReset) {
      btnReset.addEventListener('click', () => this.resetDivination());
    }

    // 5. 3D 卡牌點擊翻轉
    const mainCard = document.getElementById('divination-pixel-card');
    if (mainCard) {
      mainCard.addEventListener('click', () => {
        sound.playCardFlip();
        mainCard.classList.toggle('flipped');
      });
    }
  }

  /**
   * 逐步投擲 6 爻
   */
  handleStepCast() {
    if (this.isCasting || this.currentLines.length >= 6) return;
    this.isCasting = true;

    sound.playCoinToss();
    this.animateCoins();

    setTimeout(() => {
      const lineResult = castSingleLineCoins();
      this.currentLines.push(lineResult);

      this.updateCoinDisplay(lineResult);
      this.updateProgressBar(this.currentLines.length);
      this.renderIntermediateLines();

      if (this.currentLines.length === 6) {
        this.completeDivination();
      }

      this.isCasting = false;
    }, 450);
  }

  /**
   * 一鍵賽博量子起卦
   */
  handleQuickCast() {
    if (this.isCasting) return;
    this.resetDivination();
    this.isCasting = true;

    sound.playCoinToss();
    this.animateCoins();

    for (let i = 0; i < 6; i++) {
      this.currentLines.push(castSingleLineCoins());
    }

    setTimeout(() => {
      this.updateProgressBar(6);
      this.completeDivination();
      this.isCasting = false;
    }, 500);
  }

  /**
   * 完成起卦並生成完整報告
   */
  completeDivination() {
    sound.playDivinationChime();

    const questionInput = document.getElementById('divination-question-input');
    const question = (questionInput ? questionInput.value : '').trim() || "天下事問機緣";

    const reading = buildDivinationReading(this.currentLines, question, this.currentCategory);
    this.currentReading = reading;

    // 渲染 3D 翻轉卡牌
    this.renderPixelCard(reading);

    // 渲染雙卦對照 (本卦 vs 之卦)
    this.renderDuoDisplay(reading);

    // 渲染階層式報告
    this.renderReport(reading);

    // 更新社群分享與 QRCode
    shareManager.updateReading(reading);

    // 顯示結果區塊
    const resultContainer = document.getElementById('divination-result-container');
    if (resultContainer) {
      resultContainer.style.display = 'block';
      resultContainer.scrollIntoView({ behavior: 'smooth' });
    }

    const castBtn = document.getElementById('btn-cast-single-line');
    if (castBtn) {
      castBtn.disabled = true;
      castBtn.textContent = '✓ 六爻已成';
    }
  }

  /**
   * 渲染 3D steps(6) 卡牌正面
   */
  renderPixelCard(reading) {
    const card = document.getElementById('divination-pixel-card');
    if (!card) return;

    // 設定正面卦象名稱與屬性
    const titleEl = card.querySelector('.card-hex-title');
    const trigramEl = card.querySelector('.card-hex-trigrams');
    const themeEl = card.querySelector('.card-hex-theme');
    const badgeEl = card.querySelector('.card-binary-badge');

    if (titleEl) titleEl.textContent = `${reading.primaryHex.id}. ${reading.primaryHex.full_name}`;
    if (trigramEl) trigramEl.textContent = `上${reading.primaryHex.upper_trigram}${reading.primaryHex.upper_nature} · 下${reading.primaryHex.lower_trigram}${reading.primaryHex.lower_nature}`;
    if (themeEl) themeEl.textContent = reading.primaryHex.core_theme;
    if (badgeEl) badgeEl.textContent = `BIN: ${reading.primaryHex.binary_code}`;

    // 繪製卡牌內部 6 爻線條
    const visualContainer = card.querySelector('.hexagram-visual-container');
    if (visualContainer) {
      visualContainer.innerHTML = this.buildHexLinesHTML(reading.primaryHex.binary_code, reading.movingPositions);
    }

    // 自動翻轉至正面展示
    setTimeout(() => {
      card.classList.add('flipped');
    }, 200);
  }

  /**
   * 生成 6 爻 HTML（由上至下顯示 上爻 index 5 到 初爻 index 0）
   */
  buildHexLinesHTML(binaryStr, movingPositions = []) {
    const posNames = ["初", "二", "三", "四", "五", "上"];
    let html = '';

    for (let i = 5; i >= 0; i--) {
      const bit = binaryStr[i];
      const isYang = bit === '1';
      const posNum = i + 1;
      const isMoving = movingPositions.includes(posNum);

      html += `
        <div class="hex-line-row ${isMoving ? 'is-moving' : ''}" title="第${posNames[i]}爻 (${isYang ? '陽爻' : '陰爻'}) ${isMoving ? '[動爻變卦]' : ''}">
          <span class="hex-line-pos-label">${posNames[i]}</span>
          <div class="hex-line-graphic ${isYang ? 'yang' : 'yin'}">
            <div class="line-bar"></div>
            ${!isYang ? '<div class="line-bar"></div>' : ''}
          </div>
          ${isMoving ? '<span class="hex-line-moving-marker">●動</span>' : ''}
        </div>
      `;
    }

    return html;
  }

  /**
   * 渲染本卦 vs 之卦對照面板
   */
  renderDuoDisplay(reading) {
    const primaryBox = document.getElementById('primary-hex-box');
    const changedBox = document.getElementById('changed-hex-box');

    if (primaryBox) {
      primaryBox.innerHTML = `
        <div class="hex-box-title">
          <span style="color: var(--crt-green);">[ 本卦 · 現況 ]</span>
          <span style="color: var(--crt-amber);">第 ${reading.primaryHex.id} 卦</span>
        </div>
        <div class="hexagram-visual-container">
          ${this.buildHexLinesHTML(reading.primaryHex.binary_code, reading.movingPositions)}
        </div>
        <div class="hex-box-name">${reading.primaryHex.full_name}</div>
        <div class="hex-box-sub">${reading.primaryHex.structure}</div>
      `;
    }

    if (changedBox) {
      changedBox.innerHTML = `
        <div class="hex-box-title">
          <span style="color: var(--crt-cyan);">[ 之卦 · 趨勢 ]</span>
          <span style="color: var(--crt-amber);">第 ${reading.changedHex.id} 卦</span>
        </div>
        <div class="hexagram-visual-container">
          ${this.buildHexLinesHTML(reading.changedHex.binary_code, [])}
        </div>
        <div class="hex-box-name">${reading.changedHex.full_name}</div>
        <div class="hex-box-sub">${reading.changedHex.structure}</div>
      `;
    }
  }

  /**
   * 渲染完整階層式解卦報告
   */
  renderReport(reading) {
    const reportEl = document.getElementById('reading-hierarchical-report');
    if (!reportEl) return;

    // 動爻焦點列表
    let keyTextsHtml = '';
    reading.zhuXi.keyTexts.forEach(kt => {
      keyTextsHtml += `
        <div class="takashima-box" style="border-left: 3px solid var(--crt-cyan);">
          <div style="font-weight: bold; color: var(--crt-cyan); margin-bottom: 4px;">${kt.label}</div>
          <div style="color: #fff; margin-bottom: 6px; font-family: var(--font-terminal); font-size: 17px;">${kt.text}</div>
          <div style="color: #9eb6cb; font-size: 13px;">${kt.vernacular}</div>
        </div>
      `;
    });

    reportEl.innerHTML = `
      <!-- 1. 朱熹動爻定則分析 -->
      <div class="report-section">
        <div class="section-badge-title">
          <span>⚙</span> [ 朱熹動爻定則核心分析 ]
        </div>
        <div class="zhuxi-focus-box">
          <div class="zhuxi-rule-tag">${reading.zhuXi.ruleTitle}</div>
          <div class="zhuxi-focus-text"><strong>斷法指引：</strong>${reading.zhuXi.ruleSummary}</div>
          <div class="zhuxi-focus-text" style="color: var(--crt-text-dim); margin-top: 4px;"><strong>心法提示：</strong>${reading.zhuXi.focusNote}</div>
        </div>
        ${keyTextsHtml}
      </div>

      <!-- 2. 周易原文與白話解讀 -->
      <div class="report-section">
        <div class="section-badge-title">
          <span>📜</span> [ 本卦周易經傳精華 ]
        </div>
        <div class="takashima-box">
          <div style="color: var(--crt-green); font-weight: bold; margin-bottom: 4px;">【卦辭】 ${reading.primaryHex.judgment}</div>
          <div style="color: #c4d7e8; font-size: 14px; margin-bottom: 10px;">${reading.primaryHex.judgment_vernacular}</div>
          
          <div style="color: var(--crt-amber); font-weight: bold; margin-bottom: 4px;">【大象傳】 ${reading.primaryHex.image_text}</div>
          <div style="color: #9eb6cb; font-size: 13px;">${reading.primaryHex.tuan_zhuan}</div>
        </div>
      </div>

      <!-- 3. 高島易斷實戰斷語與明治占例 -->
      <div class="report-section">
        <div class="section-badge-title">
          <span>⚔</span> [ 高島易斷實戰精解與歷史占例 ]
        </div>
        <div class="takashima-box">
          <div class="takashima-quote">${reading.primaryHex.takashima_summary}</div>
          <div class="takashima-case-tag">明治歷史實戰占例</div>
          <div style="color: #a3c2de; font-size: 13px; line-height: 1.5;">${reading.primaryHex.takashima_case}</div>
        </div>
      </div>

      <!-- 4. 現代行動決策指引 (SOP) -->
      <div class="report-section">
        <div class="section-badge-title">
          <span>🚀</span> [ 現代行動決策指引 (SOP) ]
        </div>
        <div class="modern-action-box">
          <strong>【針對 ${reading.category} 決策行動】：</strong>
          ${reading.primaryHex.modern_action}
        </div>
      </div>
    `;
  }

  animateCoins() {
    const coins = document.querySelectorAll('.pixel-coin');
    coins.forEach(c => {
      c.classList.add('spinning');
      setTimeout(() => c.classList.remove('spinning'), 400);
    });
  }

  updateCoinDisplay(lineResult) {
    const coins = document.querySelectorAll('.pixel-coin');
    if (coins.length >= 3 && lineResult.coins) {
      lineResult.coins.forEach((val, idx) => {
        coins[idx].textContent = val === 3 ? "字" : "花";
        coins[idx].title = val === 3 ? "正面 (3分/陽)" : "背面 (2分/陰)";
      });
    }

    const logEl = document.getElementById('coin-toss-log-text');
    if (logEl) {
      const posName = ["初", "二", "三", "四", "五", "上"][this.currentLines.length - 1];
      logEl.textContent = `> 擲得第 ${posName} 爻: [${lineResult.coins.join('+')}=${lineResult.sum}] ➔ ${lineResult.name}`;
    }
  }

  updateProgressBar(count) {
    const fill = document.getElementById('cast-progress-fill');
    const label = document.getElementById('cast-step-label');
    if (fill) fill.style.width = `${(count / 6) * 100}%`;
    if (label) label.textContent = `[ 起卦進度: ${count} / 6 爻 ]`;
  }

  renderIntermediateLines() {
    const stage = document.getElementById('intermediate-lines-visual');
    if (!stage) return;
    const binary = this.currentLines.map(l => l.initialBit).join('');
    const moving = [];
    this.currentLines.forEach((l, i) => {
      if (l.isMoving) moving.push(i + 1);
    });
    stage.innerHTML = this.buildHexLinesHTML(binary.padEnd(6, '0'), moving);
  }

  resetDivination() {
    sound.playClick();
    this.currentLines = [];
    this.currentReading = null;
    this.isCasting = false;

    this.updateProgressBar(0);
    const logEl = document.getElementById('coin-toss-log-text');
    if (logEl) logEl.textContent = `> 等待起卦... 點擊 [ 擲三枚銅錢 ] 或 [ 量子起卦 ]`;

    const stage = document.getElementById('intermediate-lines-visual');
    if (stage) stage.innerHTML = '';

    const castBtn = document.getElementById('btn-cast-single-line');
    if (castBtn) {
      castBtn.disabled = false;
      castBtn.textContent = '🎲 投擲單爻 (擲三枚銅錢)';
    }

    const card = document.getElementById('divination-pixel-card');
    if (card) card.classList.remove('flipped');

    const resultContainer = document.getElementById('divination-result-container');
    if (resultContainer) resultContainer.style.display = 'none';
  }

  /**
   * 載入 URL 指定的占斷結果 (Deep Link)
   */
  loadFromParams(hexId, movingLinesStr, question, category) {
    const hex = HEXAGRAMS.find(h => h.id === parseInt(hexId)) || HEXAGRAMS[0];
    const movingPositions = movingLinesStr ? movingLinesStr.split(',').map(n => parseInt(n)).filter(n => !isNaN(n) && n >= 1 && n <= 6) : [];

    // 重構 6 爻
    const lines = [];
    for (let i = 0; i < 6; i++) {
      const bit = hex.binary_code[i];
      const isMoving = movingPositions.includes(i + 1);
      const changedBit = isMoving ? (bit === '1' ? '0' : '1') : bit;
      lines.push({
        initialBit: bit,
        changedBit: changedBit,
        isMoving: isMoving,
        nature: isMoving ? (bit === '1' ? '老陽' : '老陰') : (bit === '1' ? '少陽' : '少陰'),
        name: isMoving ? (bit === '1' ? '老陽 (⚊ 變 ⚋)' : '老陰 (⚋ 變 ⚊)') : (bit === '1' ? '少陽 (⚊)' : '少陰 (⚋)')
      });
    }

    this.currentLines = lines;
    this.currentCategory = category || '決策';

    const qInput = document.getElementById('divination-question-input');
    if (qInput) qInput.value = question || '命理諮商';

    const chips = document.querySelectorAll('.category-chip');
    chips.forEach(c => {
      if (c.getAttribute('data-cat') === this.currentCategory) {
        c.classList.add('active');
      } else {
        c.classList.remove('active');
      }
    });

    this.updateProgressBar(6);
    this.completeDivination();
  }
}

export const divinationManager = new DivinationManager();
