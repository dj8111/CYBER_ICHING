/**
 * 賽博易斷 (CyberIChing) - 六十四卦全典矩陣與即時檢索模組
 */

import { HEXAGRAMS, TRIGRAMS } from '../data/hexagrams.js';
import { sound } from '../core/audio.js';

export class CodexManager {
  constructor() {
    this.currentFilterTrigram = 'ALL';
    this.searchKeyword = '';
  }

  init() {
    this.bindEvents();
    this.renderCodexGrid();
  }

  bindEvents() {
    // 搜尋輸入框
    const searchInput = document.getElementById('codex-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchKeyword = e.target.value.trim().toLowerCase();
        this.renderCodexGrid();
      });
    }

    // 八卦過濾標籤
    const filterBtns = document.querySelectorAll('.codex-filter-btn');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        sound.playClick();
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentFilterTrigram = btn.getAttribute('data-trigram') || 'ALL';
        this.renderCodexGrid();
      });
    });

    // 關閉 Modal
    const modalClose = document.getElementById('codex-modal-close');
    const modalOverlay = document.getElementById('codex-detail-modal');
    if (modalClose) {
      modalClose.addEventListener('click', () => {
        sound.playClick();
        if (modalOverlay) modalOverlay.style.display = 'none';
      });
    }
    if (modalOverlay) {
      modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
          modalOverlay.style.display = 'none';
        }
      });
    }
  }

  renderCodexGrid() {
    const grid = document.getElementById('codex-cards-grid');
    if (!grid) return;

    let list = HEXAGRAMS;

    // 八卦過濾 (上卦或下卦符合)
    if (this.currentFilterTrigram !== 'ALL') {
      list = list.filter(h => h.upper_trigram === this.currentFilterTrigram || h.lower_trigram === this.currentFilterTrigram);
    }

    // 關鍵字搜尋 (卦名、全名、拼音、序號、二進位或卦辭)
    if (this.searchKeyword) {
      const kw = this.searchKeyword;
      list = list.filter(h => 
        h.name.includes(kw) ||
        h.full_name.includes(kw) ||
        h.pinyin.toLowerCase().includes(kw) ||
        h.id.toString() === kw ||
        h.binary_code.includes(kw) ||
        h.core_theme.includes(kw) ||
        h.judgment.includes(kw)
      );
    }

    grid.innerHTML = '';

    if (list.length === 0) {
      grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: var(--crt-text-dim); padding: 40px;">[ 查無符合卦象矩陣資料 ]</div>`;
      return;
    }

    list.forEach(hex => {
      const item = document.createElement('div');
      item.className = 'codex-card-item';
      item.innerHTML = `
        <div class="codex-item-number">NO.${String(hex.id).padStart(2, '0')}</div>
        <div style="font-size: 24px; color: var(--crt-green); font-family: var(--font-terminal); line-height: 1;">
          ${this.getMiniHexSymbol(hex.binary_code)}
        </div>
        <div class="codex-item-name">${hex.name}</div>
        <div class="codex-item-sub">${hex.full_name}</div>
        <div style="font-size: 9px; color: #56768e; font-family: var(--font-pixel-en);">${hex.binary_code}</div>
      `;

      item.addEventListener('click', () => this.openHexDetailModal(hex));
      grid.appendChild(item);
    });
  }

  getMiniHexSymbol(binaryStr) {
    let s = '';
    for (let i = 5; i >= 0; i--) {
      s += binaryStr[i] === '1' ? '⚊' : '⚋';
    }
    return s;
  }

  openHexDetailModal(hex) {
    sound.playClick();
    const modal = document.getElementById('codex-detail-modal');
    const content = document.getElementById('codex-modal-content-body');
    if (!modal || !content) return;

    // 建立 6 爻線條
    const posNames = ["初", "二", "三", "四", "五", "上"];
    let linesHtml = '';
    for (let i = 5; i >= 0; i--) {
      const bit = hex.binary_code[i];
      const isYang = bit === '1';
      linesHtml += `
        <div class="hex-line-row">
          <span class="hex-line-pos-label">${posNames[i]}</span>
          <div class="hex-line-graphic ${isYang ? 'yang' : 'yin'}">
            <div class="line-bar"></div>
            ${!isYang ? '<div class="line-bar"></div>' : ''}
          </div>
        </div>
      `;
    }

    content.innerHTML = `
      <div style="display: flex; gap: 20px; flex-wrap: wrap; margin-bottom: 20px; align-items: center;">
        <div style="background: #090f16; border: 2px solid var(--crt-green); border-radius: 8px; padding: 14px; width: 140px;">
          <div class="hexagram-visual-container" style="margin: 0;">
            ${linesHtml}
          </div>
        </div>
        <div style="flex: 1; min-width: 220px;">
          <div style="font-family: var(--font-pixel-en); color: var(--crt-amber); font-size: 11px;">第 ${hex.id} 卦 · ${hex.pinyin} · BIN: ${hex.binary_code}</div>
          <div style="font-size: 26px; font-weight: bold; color: #fff; margin: 4px 0;">${hex.full_name} (${hex.name})</div>
          <div style="color: var(--crt-cyan); font-family: var(--font-terminal); font-size: 18px;">
            上${hex.upper_trigram}【${hex.upper_nature}】 · 下${hex.lower_trigram}【${hex.lower_nature}】 (${hex.structure})
          </div>
          <div style="color: #92b8d4; font-size: 13px; margin-top: 6px;">${hex.core_theme}</div>
        </div>
      </div>

      <div class="report-section">
        <div class="section-badge-title"><span>📜</span> [ 卦辭原文與白話解讀 ]</div>
        <div class="takashima-box">
          <div style="color: var(--crt-green); font-weight: bold; font-family: var(--font-terminal); font-size: 18px;">【卦辭】 ${hex.judgment}</div>
          <div style="color: #c8dcf0; font-size: 14px; margin-top: 6px;">${hex.judgment_vernacular}</div>
          <div style="color: var(--crt-amber); font-weight: bold; margin-top: 10px;">【大象傳】 ${hex.image_text}</div>
          <div style="color: #98b3c9; font-size: 13px;">${hex.tuan_zhuan}</div>
        </div>
      </div>

      <div class="report-section">
        <div class="section-badge-title"><span>⚔</span> [ 高島吞象實戰斷語與占例 ]</div>
        <div class="takashima-box">
          <div class="takashima-quote">${hex.takashima_summary}</div>
          <div class="takashima-case-tag">歷史實戰占例</div>
          <div style="color: #adcde8; font-size: 13px;">${hex.takashima_case}</div>
        </div>
      </div>

      <div class="report-section">
        <div class="section-badge-title"><span>🚀</span> [ 現代行動決策指引 (SOP) ]</div>
        <div class="modern-action-box">${hex.modern_action}</div>
      </div>
    `;

    modal.style.display = 'flex';
  }
}

export const codexManager = new CodexManager();
