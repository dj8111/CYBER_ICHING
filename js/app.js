/**
 * 賽博易斷 (CyberIChing) - 主程式入口 (app.js)
 * 整合導航切換、硬體面板控制、深層連結解析與三大模組生命週期
 */

import { sound } from './core/audio.js';
import { divinationManager } from './modules/divination.js';
import { flashcardManager } from './modules/flashcard.js';
import { codexManager } from './modules/codex.js';
import { shareManager } from './modules/share.js';

class CyberIChingApp {
  constructor() {
    this.currentTab = 'tab-divination';
  }

  init() {
    this.bindHardwareControls();
    this.bindNavigationTabs();

    // 初始化各子模組
    divinationManager.init();
    flashcardManager.init();
    codexManager.init();
    shareManager.init();

    // 解析 URL Query 參數 (Deep Link 直達占斷結果)
    this.handleUrlParams();
  }

  /**
   * 綁定 CRT 硬體控制面板 (音效開關、CRT掃描線切換)
   */
  bindHardwareControls() {
    // 音效開關
    const soundBtn = document.getElementById('btn-toggle-sound');
    const soundText = document.getElementById('sound-status-text');
    if (soundBtn) {
      soundBtn.addEventListener('click', () => {
        const isMuted = sound.toggleMute();
        soundBtn.classList.toggle('active', !isMuted);
        if (soundText) soundText.textContent = isMuted ? 'OFF' : 'ON';
        if (!isMuted) sound.playClick();
      });
    }

    // CRT 掃描線光暈開關
    const crtBtn = document.getElementById('btn-toggle-crt-scan');
    const crtScreen = document.getElementById('main-crt-screen');
    if (crtBtn && crtScreen) {
      crtBtn.addEventListener('click', () => {
        sound.playClick();
        crtScreen.classList.toggle('no-scanlines');
        const active = !crtScreen.classList.contains('no-scanlines');
        crtBtn.classList.toggle('active', active);
        crtBtn.textContent = active ? '📺 CRT: ON' : '📺 CRT: OFF';
      });
    }
  }

  /**
   * 綁定主導航 Tab 切換
   */
  bindNavigationTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetTab = btn.getAttribute('data-tab');
        if (targetTab === this.currentTab) return;

        sound.playClick();
        this.switchTab(targetTab);
      });
    });
  }

  switchTab(targetTabId) {
    this.currentTab = targetTabId;

    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabButtons.forEach(btn => {
      if (btn.getAttribute('data-tab') === targetTabId) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    tabPanes.forEach(pane => {
      if (pane.id === targetTabId) {
        pane.classList.add('active');
      } else {
        pane.classList.remove('active');
      }
    });
  }

  /**
   * 檢查並解析 URL 帶入之專屬占斷參數
   */
  handleUrlParams() {
    const params = new URLSearchParams(window.location.search);
    const hexId = params.get('hex');
    const lines = params.get('lines') || '';
    const q = params.get('q') || '';
    const cat = params.get('cat') || '';

    if (hexId) {
      this.switchTab('tab-divination');
      divinationManager.loadFromParams(hexId, lines, q, cat);
    }
  }
}

// 啟動應用程式
document.addEventListener('DOMContentLoaded', () => {
  const app = new CyberIChingApp();
  app.init();
});
