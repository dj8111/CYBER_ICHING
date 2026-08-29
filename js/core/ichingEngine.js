/**
 * 賽博易斷 (CyberIChing) - 易經起卦與解卦核心引擎
 * 支援三枚銅錢筮法、大衍筮法、朱熹動爻定則與變卦計算
 */

import { HEXAGRAMS, TRIGRAMS } from '../data/hexagrams.js';
import { getHexagramLineDetail } from '../data/lines.js';

/**
 * 投擲單爻 (三枚銅錢法)
 * 正面(字)=3 (陽), 背面(花)=2 (陰)
 * 3+3+3 = 9 (老陽，動爻，變陰)
 * 2+2+2 = 6 (老陰，動爻，變陽)
 * 3+3+2 = 8 (少陰，靜爻，不變)
 * 3+2+2 = 7 (少陽，靜爻，不變)
 */
export function castSingleLineCoins() {
  const coins = [
    Math.random() < 0.5 ? 2 : 3,
    Math.random() < 0.5 ? 2 : 3,
    Math.random() < 0.5 ? 2 : 3
  ];
  const sum = coins[0] + coins[1] + coins[2];

  let initialBit, changedBit, name, isMoving, nature;

  switch (sum) {
    case 6:
      initialBit = '0';
      changedBit = '1';
      name = '老陰 (⚋ 變 ⚊)';
      nature = '老陰';
      isMoving = true;
      break;
    case 7:
      initialBit = '1';
      changedBit = '1';
      name = '少陽 (⚊)';
      nature = '少陽';
      isMoving = false;
      break;
    case 8:
      initialBit = '0';
      changedBit = '0';
      name = '少陰 (⚋)';
      nature = '少陰';
      isMoving = false;
      break;
    case 9:
      initialBit = '1';
      changedBit = '0';
      name = '老陽 (⚊ 變 ⚋)';
      nature = '老陽';
      isMoving = true;
      break;
    default:
      initialBit = '1';
      changedBit = '1';
      name = '少陽';
      nature = '少陽';
      isMoving = false;
  }

  return {
    coins,
    sum,
    nature,
    initialBit,
    changedBit,
    isMoving,
    name
  };
}

/**
 * 大衍筮法機率演算法 (大衍五十，其用四十有九)
 * 機率分佈：
 * 老陰(6): 1/16
 * 少陽(7): 5/16
 * 少陰(8): 7/16
 * 老陽(9): 3/16
 */
export function castSingleLineDayan() {
  const rand = Math.random() * 16;
  let sum;
  if (rand < 1) sum = 6;
  else if (rand < 6) sum = 7;
  else if (rand < 13) sum = 8;
  else sum = 9;

  let initialBit, changedBit, name, isMoving, nature;
  switch (sum) {
    case 6:
      initialBit = '0';
      changedBit = '1';
      name = '老陰 (⚋ 變 ⚊)';
      nature = '老陰';
      isMoving = true;
      break;
    case 7:
      initialBit = '1';
      changedBit = '1';
      name = '少陽 (⚊)';
      nature = '少陽';
      isMoving = false;
      break;
    case 8:
      initialBit = '0';
      changedBit = '0';
      name = '少陰 (⚋)';
      nature = '少陰';
      isMoving = false;
      break;
    case 9:
      initialBit = '1';
      changedBit = '0';
      name = '老陽 (⚊ 變 ⚋)';
      nature = '老陽';
      isMoving = true;
      break;
  }

  return {
    coins: [sum === 9 ? 3 : 2, 3, sum === 6 ? 2 : 3],
    sum,
    nature,
    initialBit,
    changedBit,
    isMoving,
    name
  };
}

/**
 * 依據二進位碼搜尋對應之卦象
 * @param {string} binaryStr 6位二進位字串 (初爻在 index 0, 上爻在 index 5)
 */
export function findHexagramByBinary(binaryStr) {
  return HEXAGRAMS.find(h => h.binary_code === binaryStr) || HEXAGRAMS[0];
}

/**
 * 朱熹動爻定則解析引擎
 * 依據動爻數目（0~6）提煉解卦核心焦點與決策權重
 */
export function interpretZhuXiRules(primaryHex, changedHex, movingPositions) {
  const count = movingPositions.length;
  let ruleTitle = "";
  let ruleSummary = "";
  let keyTexts = [];
  let focusNote = "";

  switch (count) {
    case 0:
      ruleTitle = "六爻皆靜（無動爻）";
      ruleSummary = "以【本卦卦辭】為主斷，審視當前大局態勢與宏觀走向。";
      focusNote = "目前事物處於平穩發展階段，無突發劇變，遵從本卦卦辭與大象傳心法即可。";
      keyTexts.push({
        label: `本卦卦辭【${primaryHex.name}】`,
        text: primaryHex.judgment,
        vernacular: primaryHex.judgment_vernacular
      });
      break;

    case 1: {
      const pos = movingPositions[0];
      const lineDetail = getHexagramLineDetail(primaryHex.id, pos);
      ruleTitle = `一爻發動（第 ${pos} 爻動）`;
      ruleSummary = `以【本卦 ${lineDetail.name} 爻辭】為主斷，參看之卦【${changedHex.name}】作為未來趨勢。`;
      focusNote = `焦點鎖定在第 ${pos} 爻（${lineDetail.name}），此爻為事物轉變之關鍵樞紐。`;
      keyTexts.push({
        label: `本卦動爻【${lineDetail.name}】`,
        text: lineDetail.text,
        vernacular: lineDetail.takashima_explanation
      });
      break;
    }

    case 2: {
      const pos1 = movingPositions[0]; // 下爻
      const pos2 = movingPositions[1]; // 上爻
      const lineDetail1 = getHexagramLineDetail(primaryHex.id, pos1);
      const lineDetail2 = getHexagramLineDetail(primaryHex.id, pos2);
      ruleTitle = `二爻發動（第 ${pos1}、${pos2} 爻動）`;
      ruleSummary = `以本卦二動爻爻辭合參，並以【居下位之 ${lineDetail1.name}】為主，【上位之 ${lineDetail2.name}】為輔。`;
      focusNote = `下爻代表根本基底，上爻代表未來延伸。優先解決下爻指出的問題。`;
      keyTexts.push({
        label: `本卦主爻【${lineDetail1.name}】(主)`,
        text: lineDetail1.text,
        vernacular: lineDetail1.takashima_explanation
      });
      keyTexts.push({
        label: `本卦輔爻【${lineDetail2.name}】(輔)`,
        text: lineDetail2.text,
        vernacular: lineDetail2.takashima_explanation
      });
      break;
    }

    case 3:
      ruleTitle = "三爻發動（半動半靜）";
      ruleSummary = `以【本卦卦辭】為體（佔60%），以【之卦卦辭】為用（佔40%）。`;
      focusNote = "形勢正處於重大轉折交替期，前程即將迎來全新格局，本卦代表現狀，之卦代表轉化後的未來結果。";
      keyTexts.push({
        label: `本卦卦辭【${primaryHex.name}】(體·現狀)`,
        text: primaryHex.judgment,
        vernacular: primaryHex.judgment_vernacular
      });
      keyTexts.push({
        label: `之卦卦辭【${changedHex.name}】(用·趨勢)`,
        text: changedHex.judgment,
        vernacular: changedHex.judgment_vernacular
      });
      break;

    case 4: {
      // 找出之卦的兩個不變爻
      const staticPositions = [1, 2, 3, 4, 5, 6].filter(p => !movingPositions.includes(p));
      const pos1 = staticPositions[0]; // 居下者
      const pos2 = staticPositions[1];
      const lineDetail1 = getHexagramLineDetail(changedHex.id, pos1);
      const lineDetail2 = getHexagramLineDetail(changedHex.id, pos2);
      ruleTitle = `四爻發動（之卦二靜爻）`;
      ruleSummary = `形勢劇變過半，以【之卦】之二不變爻斷，並以【居下位之 ${lineDetail1.name}】為主斷。`;
      focusNote = "變局已成定局，重心已轉移至之卦，關注之卦中未變的定海神針。";
      keyTexts.push({
        label: `之卦主爻【${lineDetail1.name}】(主)`,
        text: lineDetail1.text,
        vernacular: lineDetail1.takashima_explanation
      });
      if (lineDetail2) {
        keyTexts.push({
          label: `之卦輔爻【${lineDetail2.name}】(輔)`,
          text: lineDetail2.text,
          vernacular: lineDetail2.takashima_explanation
        });
      }
      break;
    }

    case 5: {
      // 找出之卦的一個不變爻
      const staticPos = [1, 2, 3, 4, 5, 6].find(p => !movingPositions.includes(p)) || 1;
      const lineDetail = getHexagramLineDetail(changedHex.id, staticPos);
      ruleTitle = `五爻發動（之卦一靜爻）`;
      ruleSummary = `形勢幾乎全變，以【之卦 ${lineDetail.name} 不變爻】之辭為主斷。`;
      focusNote = `全局翻轉，唯有之卦第 ${staticPos} 爻是唯一的守衡之點，必須依其行事。`;
      keyTexts.push({
        label: `之卦不變爻【${lineDetail.name}】`,
        text: lineDetail.text,
        vernacular: lineDetail.takashima_explanation
      });
      break;
    }

    case 6:
      if (primaryHex.id === 1) {
        ruleTitle = "六爻全變（乾之坤）";
        ruleSummary = "乾卦六陽全動，以【用九：見群龍無首，吉】為主斷。";
        focusNote = "剛健至極轉為純柔，不爭首位、順應群體則大吉。";
        keyTexts.push({
          label: "乾卦 用九",
          text: "用九：見群龍無首，吉。",
          vernacular: "剛柔並濟，群策群力而不獨攬大權，天下大和之象。"
        });
      } else if (primaryHex.id === 2) {
        ruleTitle = "六爻全變（坤之乾）";
        ruleSummary = "坤卦六陰全動，以【用六：利永貞】為主斷。";
        focusNote = "純柔至極轉為大剛，長久持守純正堅定之志向。";
        keyTexts.push({
          label: "坤卦 用六",
          text: "用六：利永貞。",
          vernacular: "順應天命以獲善終，長久持守正道大吉。"
        });
      } else {
        ruleTitle = "六爻全變（乾坤之外）";
        ruleSummary = `六爻全動，舊局完全崩解重組，以【之卦卦辭【${changedHex.name}】】為主斷。`;
        focusNote = "徹底告別過去，進入全新卦象境界，全盤遵照之卦指引。";
        keyTexts.push({
          label: `之卦卦辭【${changedHex.name}】`,
          text: changedHex.judgment,
          vernacular: changedHex.judgment_vernacular
        });
      }
      break;
  }

  return {
    movingCount: count,
    ruleTitle,
    ruleSummary,
    focusNote,
    keyTexts
  };
}

/**
 * 完整執行起卦流程
 * @param {Array} lines 6爻陣列（可由前台逐步擲得或一次生成）
 * @param {string} question 占問事項
 * @param {string} category 占問分類
 */
export function buildDivinationReading(lines, question = "未定事項", category = "決策") {
  const primaryBinary = lines.map(l => l.initialBit).join('');
  const changedBinary = lines.map(l => l.changedBit).join('');

  const primaryHex = findHexagramByBinary(primaryBinary);
  const changedHex = findHexagramByBinary(changedBinary);

  // 取得動爻位置 (1-indexed)
  const movingPositions = [];
  lines.forEach((line, index) => {
    if (line.isMoving) {
      movingPositions.push(index + 1);
    }
  });

  const zhuXi = interpretZhuXiRules(primaryHex, changedHex, movingPositions);

  return {
    timestamp: new Date().toISOString(),
    question: question.trim() || "天下事問機緣",
    category,
    lines,
    movingPositions,
    primaryHex,
    changedHex,
    zhuXi
  };
}
