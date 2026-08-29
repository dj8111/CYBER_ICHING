/**
 * 賽博易斷 (CyberIChing) - 多渠道社群分享與動態 QRCode 模組
 * 包含 LINE、FB、Email、ASCII 終端剪貼簿複製與像素 QRCode 生成
 */

import { QRCode } from '../core/qrcode.js';
import { sound } from '../core/audio.js';

export class ShareManager {
  constructor() {
    this.currentReading = null;
    this.qrCanvas = null;
  }

  init() {
    this.qrCanvas = document.getElementById('qr-pixel-canvas');
    this.bindEvents();
  }

  bindEvents() {
    // 複製連結按鈕
    const copyUrlBtn = document.getElementById('btn-copy-share-url');
    if (copyUrlBtn) {
      copyUrlBtn.addEventListener('click', () => this.copyShareUrl());
    }

    // LINE 分享按鈕
    const shareLineBtn = document.getElementById('btn-share-line');
    if (shareLineBtn) {
      shareLineBtn.addEventListener('click', () => this.shareLine());
    }

    // Facebook 分享按鈕
    const shareFbBtn = document.getElementById('btn-share-fb');
    if (shareFbBtn) {
      shareFbBtn.addEventListener('click', () => this.shareFacebook());
    }

    // Email 轉發按鈕
    const shareEmailBtn = document.getElementById('btn-share-email');
    if (shareEmailBtn) {
      shareEmailBtn.addEventListener('click', () => this.shareEmail());
    }

    // 一鍵複製終端報告
    const copyReportBtn = document.getElementById('btn-copy-ascii-report');
    if (copyReportBtn) {
      copyReportBtn.addEventListener('click', () => this.copyAsciiReport());
    }

    // 下載 QRCode 圖檔
    const downloadQrBtn = document.getElementById('btn-download-qr');
    if (downloadQrBtn) {
      downloadQrBtn.addEventListener('click', () => this.downloadQrCode());
    }
  }

  /**
   * 更新分享模組狀態與 QRCode
   * @param {Object} reading 占斷結果物件
   */
  updateReading(reading) {
    this.currentReading = reading;

    const shareUrl = this.generateShareUrl(reading);
    const urlDisplay = document.getElementById('share-url-text');
    if (urlDisplay) {
      urlDisplay.textContent = shareUrl;
    }

    // 繪製像素 QRCode
    if (this.qrCanvas && window.QRCodeLib) {
      try {
        window.QRCodeLib.generatePixelQR(shareUrl, this.qrCanvas, {
          pixelSize: 4,
          margin: 2,
          bgColor: '#070b10',
          fgColor: '#00ff66'
        });
      } catch (e) {
        console.warn("QR generation error:", e);
      }
    }
  }

  generateShareUrl(reading) {
    if (!reading) return window.location.href;
    const base = window.location.origin + window.location.pathname;
    const movingStr = (reading.movingPositions || []).join(',');
    const qStr = encodeURIComponent(reading.question || '');
    const catStr = encodeURIComponent(reading.category || '');
    return `${base}?hex=${reading.primaryHex.id}&lines=${movingStr}&q=${qStr}&cat=${catStr}`;
  }

  shareLine() {
    if (!this.currentReading) return;
    sound.playClick();

    const reading = this.currentReading;
    const url = this.generateShareUrl(reading);
    const text = `【賽博易斷 CyberIChing 占斷報告】\n` +
      `問事：${reading.question}（${reading.category}）\n` +
      `卦象：本卦【${reading.primaryHex.full_name}】` +
      (reading.movingPositions.length > 0 ? ` ➔ 之卦【${reading.changedHex.full_name}】` : '') + `\n` +
      `焦點斷語：${reading.zhuXi.ruleSummary}\n` +
      `高島精要：${reading.primaryHex.takashima_summary}\n` +
      `專屬占斷連結：${url}`;

    const lineUrl = `https://line.me/R/msg/text/?${encodeURIComponent(text)}`;
    window.open(lineUrl, '_blank');
  }

  shareFacebook() {
    if (!this.currentReading) return;
    sound.playClick();

    const url = this.generateShareUrl(this.currentReading);
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(fbUrl, '_blank', 'width=600,height=500');
  }

  shareEmail() {
    if (!this.currentReading) return;
    sound.playClick();

    const reading = this.currentReading;
    const url = this.generateShareUrl(reading);
    const subject = `【賽博易斷占斷報告】${reading.question} - ${reading.primaryHex.full_name}`;
    const body = `【賽博易斷 CyberIChing 專屬占斷結果】\n\n` +
      `占問事項：${reading.question}\n` +
      `所屬領域：${reading.category}\n` +
      `本卦：${reading.primaryHex.full_name} (${reading.primaryHex.structure})\n` +
      `之卦：${reading.changedHex.full_name}\n` +
      `動爻位：${reading.movingPositions.length > 0 ? '第 ' + reading.movingPositions.join(', ') + ' 爻動' : '六爻皆靜'}\n\n` +
      `【朱熹動爻定則分析】\n${reading.zhuXi.ruleTitle} - ${reading.zhuXi.ruleSummary}\n${reading.zhuXi.focusNote}\n\n` +
      `【卦辭原文】\n${reading.primaryHex.judgment}\n` +
      `白話解讀：${reading.primaryHex.judgment_vernacular}\n\n` +
      `【高島吞象實戰斷語】\n${reading.primaryHex.takashima_summary}\n` +
      `歷史占例：${reading.primaryHex.takashima_case}\n\n` +
      `【現代行動決策指引】\n${reading.primaryHex.modern_action}\n\n` +
      `完整互動占斷報告請至：\n${url}`;

    const mailto = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
  }

  copyShareUrl() {
    if (!this.currentReading) return;
    sound.playClick();

    const url = this.generateShareUrl(this.currentReading);
    navigator.clipboard.writeText(url).then(() => {
      this.showToast("✓ 專屬占斷網址已複製至剪貼簿！");
    }).catch(() => {
      this.showToast("網址複製失敗，請手動複製。");
    });
  }

  copyAsciiReport() {
    if (!this.currentReading) return;
    sound.playClick();

    const r = this.currentReading;
    const url = this.generateShareUrl(r);

    // 生成 ASCII 卦象
    const getLineAscii = (isYang, isMoving) => {
      if (isYang) {
        return isMoving ? " [ ⚊ ⚊ ⚊ ⚊ ⚊ ⚊ ] (○ 老陽動爻)" : " [ ⚊ ⚊ ⚊ ⚊ ⚊ ⚊ ]";
      } else {
        return isMoving ? " [ ⚊ ⚊     ⚊ ⚊ ] (✗ 老陰動爻)" : " [ ⚊ ⚊     ⚊ ⚊ ]";
      }
    };

    let asciiLines = [];
    for (let i = 5; i >= 0; i--) {
      const bit = r.primaryHex.binary_code[i];
      const isMoving = r.movingPositions.includes(i + 1);
      const posName = ["初", "二", "三", "四", "五", "上"][i];
      asciiLines.push(`第${posName}爻: ${getLineAscii(bit === '1', isMoving)}`);
    }

    const report = 
`╔══════════════════════════════════════════════════════╗
║        CYBER ICHING TERMINAL REPORT v2.0             ║
╚══════════════════════════════════════════════════════╝
> 占問事項: ${r.question} [情境: ${r.category}]
> 占斷時間: ${new Date(r.timestamp).toLocaleString()}
--------------------------------------------------------
[ 卦象矩陣 ]
本卦: ${r.primaryHex.full_name} (${r.primaryHex.structure})
之卦: ${r.changedHex.full_name}
動爻: ${r.movingPositions.length > 0 ? '第 ' + r.movingPositions.join(', ') + ' 爻動' : '六爻安靜'}

${asciiLines.join('\n')}

--------------------------------------------------------
[ 朱熹動爻核心分析 ]
> 規則: ${r.zhuXi.ruleTitle}
> 焦點: ${r.zhuXi.ruleSummary}
> 指引: ${r.zhuXi.focusNote}

[ 周易原文與白話 ]
> 卦辭: ${r.primaryHex.judgment}
> 白話: ${r.primaryHex.judgment_vernacular}
> 大象: ${r.primaryHex.image_text}

[ 高島易斷實戰精解 ]
> 斷語: ${r.primaryHex.takashima_summary}
> 占例: ${r.primaryHex.takashima_case}

[ 現代行動決策 SOP ]
> 指引: ${r.primaryHex.modern_action}
--------------------------------------------------------
> 線上驗證與動態還原:
  ${url}
════════════════════════════════════════════════════════`;

    navigator.clipboard.writeText(report).then(() => {
      this.showToast("✓ ASCII 終端占斷報告已複製！");
    }).catch(() => {
      this.showToast("報告複製失敗。");
    });
  }

  downloadQrCode() {
    if (!this.qrCanvas) return;
    sound.playClick();

    const link = document.createElement('a');
    link.download = `CyberIChing_Hex_${this.currentReading ? this.currentReading.primaryHex.id : 'divination'}.png`;
    link.href = this.qrCanvas.toDataURL('image/png');
    link.click();
    this.showToast("✓ 像素 QRCode 圖片已下載！");
  }

  showToast(msg) {
    const toast = document.getElementById('cyber-toast');
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }
}

export const shareManager = new ShareManager();
