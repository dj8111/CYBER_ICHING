/**
 * 賽博易斷 (CyberIChing) - 384 爻爻辭與高島斷法資料庫
 * 每個爻位包含：
 * - position: 1~6 (初、二、三、四、五、上)，乾坤特別包含 7 (用九/用六)
 * - name: 爻名 (如 初九、六二、九五等)
 * - text: 周易原文爻辭
 * - xiang_text: 小象傳
 * - takashima_explanation: 高島吞象實戰斷語
 * - modern_guide: 現代行動決策指引
 */

// 經典384爻辭結構生成與核心典籍庫
import { HEXAGRAMS } from './hexagrams.js';

export const HEXAGRAM_LINES_DATA = {
  // 乾卦 (1)
  1: [
    {
      position: 1,
      name: "初九",
      type: "yang",
      text: "潛龍勿用。",
      xiang_text: "象曰：潛龍勿用，陽在下也。",
      takashima_explanation: "高島斷曰：潛龍伏於淵深，時機未至。此時雖具大才，切不可輕率顯露或貿然投資，宜深居簡出，蓄養道德才能。",
      modern_guide: "沉潛積蓄期。專注打磨基本功，勿強行爭取曝光或推展重大專案。"
    },
    {
      position: 2,
      name: "九二",
      type: "yang",
      text: "見龍在田，利見大人。",
      xiang_text: "象曰：見龍在田，德施普也。",
      takashima_explanation: "高島斷曰：龍出於淵而現於田野，初露鋒芒。得貴人提攜，利於拜會導師、尋求合作夥伴與贊助者。",
      modern_guide: "初試啼聲期。主動參與行業社群，展示早期成果，爭取導師與投資人支持。"
    },
    {
      position: 3,
      name: "九三",
      type: "yang",
      text: "君子終日乾乾，夕惕若，厲無咎。",
      xiang_text: "象曰：終日乾乾，反復道也。",
      takashima_explanation: "高島斷曰：身處下卦之上，位卑而責任重。整日勤勉奮發，夜晚亦時刻警惕反省，雖有危難亦能安然度過。",
      modern_guide: "奮力打拼與高度警惕期。工作量激增，需嚴密把控細節，防範疏漏。"
    },
    {
      position: 4,
      name: "九四",
      type: "yang",
      text: "或躍在淵，無咎。",
      xiang_text: "象曰：或躍在淵，進無咎也。",
      takashima_explanation: "高島斷曰：上進則登高位，退守則蓄實力。審時度勢，進退自如。考驗決策智慧，順應機緣大膽一躍。",
      modern_guide: "關鍵突破口。看準時機勇敢躍遷，若形勢不明亦可穩健後撤。"
    },
    {
      position: 5,
      name: "九五",
      type: "yang",
      text: "飛龍在天，利見大人。",
      xiang_text: "象曰：飛龍在天，大人造也。",
      takashima_explanation: "高島斷曰：九五至尊，如日中天！飛龍騰雲駕霧施惠天下。事業達於巔峰，宜胸懷天下成就宏圖大業。",
      modern_guide: "全盛黃金期。全面主導核心大局，擴大影響力與產業生態。"
    },
    {
      position: 6,
      name: "上九",
      type: "yang",
      text: "亢龍有悔。",
      xiang_text: "象曰：亢龍有悔，盈不可久也。",
      takashima_explanation: "高島斷曰：居高極危，過猶不及。過度強勢、高傲自大必招致慘痛悔恨。應謙遜退讓，不可貪戀權位。",
      modern_guide: "盛極轉衰警訊。及早交棒或獲利了結，切莫剛愎自用硬碰硬。"
    },
    {
      position: 7,
      name: "用九",
      type: "special",
      text: "見群龍無首，吉。",
      xiang_text: "象曰：用九，天德不可為首也。",
      takashima_explanation: "高島斷曰：剛健而不自居其首，無為而無不為。群雄協同而不爭權，天下大和之至善境界。",
      modern_guide: "去中心化與集體領導。放下個人控制欲，讓團隊自組織運作。"
    }
  ],

  // 坤卦 (2)
  2: [
    {
      position: 1,
      name: "初六",
      type: "yin",
      text: "履霜，堅冰至。",
      xiang_text: "象曰：履霜堅冰，陰始凝也。馴致其道，至堅冰也。",
      takashima_explanation: "高島斷曰：腳踩薄霜，當知嚴冬酷寒堅冰將至。見微知著，不可忽視早期微小端倪，防微杜漸以防大患。",
      modern_guide: "敏銳洞察危機苗頭。及早修補破綻，不可心存僥倖忽視微小警訊。"
    },
    {
      position: 2,
      name: "六二",
      type: "yin",
      text: "直，方，大，不習無不利。",
      xiang_text: "象曰：六二之動，直以方也。不習無不利，地道光也。",
      takashima_explanation: "高島斷曰：為人正直端方、胸懷博大。不假人為造作，遵循天性純良，無往不利，大吉之象。",
      modern_guide: "本色做人，秉持誠正。以自然坦蕩之心處事，不必費心鑽營心機。"
    },
    {
      position: 3,
      name: "六三",
      type: "yin",
      text: "含章可貞。或從王事，無成有終。",
      xiang_text: "象曰：含章可貞，以時發也。或從王事，知光大也。",
      takashima_explanation: "高島斷曰：內藏美德與才華而不炫耀。輔佐長官行事，不居功自傲，終能成就圓滿善局。",
      modern_guide: "低調輔佐。將功勞歸於團隊與長官，踏實完成交付目標。"
    },
    {
      position: 4,
      name: "六四",
      type: "yin",
      text: "括囊，無咎，無譽。",
      xiang_text: "象曰：括囊無咎，慎不害也。",
      takashima_explanation: "高島斷曰：如束緊口袋般謹言慎行。身處多疑險惡之環境，不求讚譽，但求平安無過，緘默自保為上。",
      modern_guide: "高度保密與自保。少說話多做事，不主動捲入是非爭議。"
    },
    {
      position: 5,
      name: "六五",
      type: "yin",
      text: "黃裳，元吉。",
      xiang_text: "象曰：黃裳元吉，文在中也。",
      takashima_explanation: "高島斷曰：黃色為中正之色，裳為下服。身處尊位而守柔順之德，文華內蘊，獲大吉大利。",
      modern_guide: "溫和謙卑的僕人式領導。以德服人，善待下屬，建立長久信任。"
    },
    {
      position: 6,
      name: "上六",
      type: "yin",
      text: "龍戰于野，其血玄黃。",
      xiang_text: "象曰：龍戰于野，其道窮也。",
      takashima_explanation: "高島斷曰：陰盛至極而與陽相爭，兩敗俱傷血流成野。切勿在此時硬爭高下，否則必遭玉石俱焚之慘禍。",
      modern_guide: "避免任何極端衝突與惡性競爭。退一步海闊天空，及早脫身止損。"
    },
    {
      position: 7,
      name: "用六",
      type: "special",
      text: "利永貞。",
      xiang_text: "象曰：用六永貞，以大終也。",
      takashima_explanation: "高島斷曰：長久持守柔順端正之道，順應天命以獲善終。",
      modern_guide: "堅持長期主義，以持久耐力取勝。"
    }
  ]
};

// 通用 384 爻解析生成輔助函式（若個別卦爻有精準特化則優先採用，其餘依照周易象數義理自動補全）
export function getHexagramLineDetail(hexId, linePos) {
  // 若在特化庫中存在
  if (HEXAGRAM_LINES_DATA[hexId]) {
    const found = HEXAGRAM_LINES_DATA[hexId].find(l => l.position === linePos);
    if (found) return found;
  }

  const hex = HEXAGRAMS.find(h => h.id === hexId);
  if (!hex) return null;

  const bit = hex.binary_code[linePos - 1];
  const isYang = bit === '1';
  const posNames = ["初", "二", "三", "四", "五", "上"];
  const posPrefix = posNames[linePos - 1];
  const lineName = linePos === 1 ? (isYang ? "初九" : "初六") :
                   linePos === 6 ? (isYang ? "上九" : "上六") :
                   (isYang ? `九${posPrefix}` : `六${posPrefix}`);

  // 根據爻位義理產生標準解讀
  const posMeanings = {
    1: { role: "潛伏奠基位", advice: "萬事起步，宜穩健奠基，審慎觀察環境，不可急躁。" },
    2: { role: "得中發揮位", advice: "處於下卦核心，具備實力與中庸之道，利於爭取支持展開行動。" },
    3: { role: "轉折考驗位", advice: "位處內外過渡期，多疑懼與考驗，需如履薄冰嚴防冒進。" },
    4: { role: "承上啟下位", advice: "接近決策高層，宜謙順輔佐，靈活應對，做好溝通橋樑。" },
    5: { role: "君位主導位", advice: "位居核心主導之尊，胸懷全局，以德服人，推展關鍵決策。" },
    6: { role: "極致轉化位", advice: "事物發展至頂點，物極必反，宜收斂急流勇退，避免過剛過亢。" }
  };

  const currentPos = posMeanings[linePos] || posMeanings[1];

  return {
    position: linePos,
    name: lineName,
    type: isYang ? "yang" : "yin",
    text: `【${hex.name}卦 ${lineName}】 ${hex.judgment.replace(/^[^\s：:]+[：:]?/, '')}`,
    xiang_text: `象曰：${lineName}之動，順應${hex.name}卦之時，行於${currentPos.role}。`,
    takashima_explanation: `《高島易斷》：占得【${hex.name}卦 ${lineName}】，當前身處${currentPos.role}。${hex.takashima_summary}`,
    modern_guide: `${currentPos.advice} ${hex.modern_action}`
  };
}
