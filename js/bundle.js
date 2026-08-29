/**
 * 賽博易斷 (CyberIChing) - 完整整合執行檔 (bundle.js)
 * 相容於 file:/// 直接開啟 (免本機伺服器) 與 http:// 網頁伺服器
 */

(function () {
  'use strict';

  // =========================================================================
  // 1. 八卦與六十四卦資料庫 (TRIGRAMS & HEXAGRAMS)
  // =========================================================================
  const TRIGRAMS = {
    "111": { name: "乾", symbol: "☰", nature: "天", attribute: "健", element: "金", direction: "西北" },
    "000": { name: "坤", symbol: "☷", nature: "地", attribute: "順", element: "土", direction: "西南" },
    "100": { name: "震", symbol: "☳", nature: "雷", attribute: "動", element: "木", direction: "東" },
    "010": { name: "坎", symbol: "☵", nature: "水", attribute: "陷/險", element: "水", direction: "北" },
    "001": { name: "艮", symbol: "☶", nature: "山", attribute: "止", element: "土", direction: "東北" },
    "110": { name: "巽", symbol: "☴", nature: "風", attribute: "入", element: "木", direction: "東南" },
    "101": { name: "離", symbol: "☲", nature: "火", attribute: "麗/明", element: "火", direction: "南" },
    "011": { name: "兌", symbol: "☱", nature: "澤", attribute: "悅", element: "金", direction: "西" }
  };

  const HEXAGRAMS = [
    {
      id: 1, name: "乾", full_name: "乾為天", pinyin: "Qián", binary_code: "111111",
      upper_trigram: "乾", lower_trigram: "乾", upper_nature: "天", lower_nature: "天",
      structure: "天行健，自強不息", core_theme: "創始發端，剛健剛正，群龍之首",
      judgment: "乾：元，亨，利，貞。",
      judgment_vernacular: "乾卦象徵剛健強大。具備萬物始生之元、亨通暢達之亨、和諧適宜之利、堅守正道之貞四種至高德行。",
      image_text: "天行健，君子以自強不息。",
      tuan_zhuan: "大哉乾元，萬物資始，乃統天。雲行雨施，品物流形。",
      takashima_summary: "《高島易斷》：乾者純陽之體，健進之象。占得此卦，主運勢極盛，如日中天，宜大展鴻圖，但切戒剛愎自用與亢極之悔。",
      takashima_case: "明治九年占日本與清國外交談判：得乾卦五爻，斷曰：九五飛龍在天，兩國元首會晤必成大局，宜順勢推展立憲與商貿。",
      modern_action: "處於主導與擴張之最佳時機。制定長遠策略，維持原則與自律，積極推進新項目，切忌過度傲慢。"
    },
    {
      id: 2, name: "坤", full_name: "坤為地", pinyin: "Kūn", binary_code: "000000",
      upper_trigram: "坤", lower_trigram: "坤", upper_nature: "地", lower_nature: "地",
      structure: "地勢坤，厚德載物", core_theme: "包容承載，順應時勢，厚德載物",
      judgment: "坤：元，亨，利牝馬之貞。君子有攸往，先迷後得主，利西南得朋，東北喪朋。安貞，吉。",
      judgment_vernacular: "坤卦象徵順應承載。如同母馬般溫順堅韌。若盲目搶先將迷失，跟隨引導則能找到方向。持守柔順端正可獲大吉。",
      image_text: "地勢坤，君子以厚德載物。",
      tuan_zhuan: "至哉坤元，萬物資生，乃順承天。坤厚載物，德合無疆。",
      takashima_summary: "《高島易斷》：純陰柔順，靜守待時。不宜主動出擊，宜退居幕後配合輔佐，廣納建言以蓄積實力。",
      takashima_case: "明治年間占橫濱築港工程：得坤卦初六，履霜堅冰至。斷曰：當前地基未穩，不可急躁動工，應先紮穩基礎與防洪籌備。",
      modern_action: "採取被動防守與資源積累策略。傾聽團隊反饋，專注優化現有流程，強化後勤與信任關係。"
    },
    {
      id: 3, name: "屯", full_name: "水雷屯", pinyin: "Zhūn", binary_code: "100010",
      upper_trigram: "坎", lower_trigram: "震", upper_nature: "水", lower_nature: "雷",
      structure: "雲雷屯，創業維艱", core_theme: "初生艱難，蓄力待發，萬事起頭難",
      judgment: "屯：元，亨，利，貞，勿用，有攸往，利建侯。",
      judgment_vernacular: "屯卦象徵草木初生、破土萌芽之艱難。雖萬事起頭難，但蘊含生機。切勿冒進躁動，宜廣結善緣、確立組織架構。",
      image_text: "雲雷，屯；君子以經綸。",
      tuan_zhuan: "屯，剛柔始交而難生，動乎險中，大亨貞。雷雨之動滿盈，天造草昧，宜建侯而不寧。",
      takashima_summary: "《高島易斷》：屯者屯難也，如初生嬰兒面臨風霜。不可輕舉妄動，須延攬賢才共同開拓基業。",
      takashima_case: "占日本新興鐵道建設融資：得屯卦初九，磐桓居貞。斷曰：開局阻力重重，宜穩固根基，先尋求政府認可與結盟合作。",
      modern_action: "初創期或面臨新挑戰時，暫緩大規模擴張。先理順內部規範，招募關鍵人才，打好最底層基礎架構。"
    },
    {
      id: 4, name: "蒙", full_name: "山水蒙", pinyin: "Méng", binary_code: "010001",
      upper_trigram: "艮", lower_trigram: "坎", upper_nature: "山", lower_nature: "水",
      structure: "山下出泉，啟蒙求教", core_theme: "啟發蒙昧，求師問道，耐心學習",
      judgment: "蒙：亨。匪我求童蒙，童蒙求我。初筮告，再三瀆，瀆則不告。利貞。",
      judgment_vernacular: "蒙卦象徵啟蒙教育。求知者需懷敬畏誠心前來請益。一次詢問誠實告知，若反覆試探則是褻瀆。保持正道有利。",
      image_text: "山下出泉，蒙；君子以果行育德。",
      tuan_zhuan: "蒙，山下有險，險而止，蒙。蒙亨，以亨行時中也。",
      takashima_summary: "《高島易斷》：蒙昧未開，如山下清泉欲出而未暢。凡事不可自以為是，應尋求良師益友指點迷津。",
      takashima_case: "占明治維新之洋務學堂設置：得蒙卦九二，包蒙吉。斷曰：教育為立國之本，寬容誘導青年求知，終成國家棟樑。",
      modern_action: "承認自身知識盲區，主動向領域專家求教。放下傲氣，建立學習循環與反思機制。"
    },
    {
      id: 5, name: "需", full_name: "水天需", pinyin: "Xū", binary_code: "111010",
      upper_trigram: "坎", lower_trigram: "乾", upper_nature: "水", lower_nature: "天",
      structure: "雲上於天，耐性等待", core_theme: "靜候時機，蓄養能量，飲食宴樂",
      judgment: "需：有孚，光亨，貞吉。利涉大川。",
      judgment_vernacular: "需卦象徵等待與蓄勢。只要內心誠信充實，前途必定光明亨通。堅守正道獲吉，時機成熟時勇渡大川險阻。",
      image_text: "雲上於天，需；君子以飲食宴樂。",
      tuan_zhuan: "需，須也；險在前也。剛健而不陷，其義不困窮矣。",
      takashima_summary: "《高島易斷》：需者待也。天上有雲尚未化雨，不可操之過急。此時宜充實生活、保養精神以待天時。",
      takashima_case: "占商社投資海外大宗物資：得需卦九五，需于酒食貞吉。斷曰：目前市場波動劇烈，暫且按兵不動，靜候行情反轉。",
      modern_action: "當前外部條件尚未成熟。避免焦慮內耗，保持日常節奏，整備現金流與資源，等待最佳突破口。"
    },
    {
      id: 6, name: "訟", full_name: "天水訟", pinyin: "Sòng", binary_code: "010111",
      upper_trigram: "乾", lower_trigram: "坎", upper_nature: "天", lower_nature: "水",
      structure: "天與水違行，止息爭端", core_theme: "爭執訴訟，防範紛爭，退讓息事",
      judgment: "訟：有孚，窒惕，中吉。終凶。利見大人，不利涉大川。",
      judgment_vernacular: "訟卦象徵爭端與衝突。即便自認有理也常遭阻礙，宜心懷警惕適可而止。將爭執進行到底必致凶險。宜尋公正長者調解。",
      image_text: "天與水違行，訟；君子以作事謀始。",
      tuan_zhuan: "訟，上剛下險，險而健，訟。訟有孚窒惕中吉，剛來而得中也。",
      takashima_summary: "《高島易斷》：訟事終無完局，勝亦有傷。行事宜事先立約防患於未然，若已起衝突，宜及早和解以全大局。",
      takashima_case: "占合夥人股權爭議：得訟卦九二，不克訟歸而逋。斷曰：對方實力雄厚，硬拼必敗，退讓三分尋求妥協反得保全。",
      modern_action: "停止所有情緒化對抗與法律戰耗費。尋求中立第三方介入協調，著手檢查合約漏洞，止損為上。"
    },
    {
      id: 7, name: "師", full_name: "地水師", pinyin: "Shī", binary_code: "010000",
      upper_trigram: "坤", lower_trigram: "坎", upper_nature: "地", lower_nature: "水",
      structure: "地中有水，統帥統御", core_theme: "行軍打仗，嚴明紀律，師出有名",
      judgment: "師：貞，丈人，吉無咎。",
      judgment_vernacular: "師卦象徵統率大眾與用兵。必須名正言順並堅守正道，由沉穩老成、威望深重之統帥領導，方能獲吉免災。",
      image_text: "地中有水，師；君子以容民畜眾。",
      tuan_zhuan: "師，眾也；貞，正也。能以眾正，可以王矣。",
      takashima_summary: "《高島易斷》：師卦聚眾以行正義。紀律是勝敗之鑰，不可任用無德小人，必須號令統一、上下一心。",
      takashima_case: "明治十年西南戰爭占卜：得師卦六五，田有禽利執言。斷曰：此役乃平定叛亂，正義在我，必獲最後全勝。",
      modern_action: "加強團隊紀律與流程規範。指派最具威望與經驗之專案主管，確立明確獎懲機制與共同目標。"
    },
    {
      id: 8, name: "比", full_name: "水地比", pinyin: "Bǐ", binary_code: "000010",
      upper_trigram: "坎", lower_trigram: "坤", upper_nature: "水", lower_nature: "地",
      structure: "地上有水，親附團結", core_theme: "親密團結，誠信合作，擇善而從",
      judgment: "比：吉。原筮元永貞，無咎。不寧方來，後夫凶。",
      judgment_vernacular: "比卦象徵親附與合作，吉祥。初次占問本心需長久純正。周遭不安者紛紛前來依附，遲疑落後者將遭凶險。",
      image_text: "地上有水，比；先王以建萬國，親諸侯。",
      tuan_zhuan: "比，吉也；比，輔也，下順從也。原筮元永貞無咎，以剛中也。",
      takashima_summary: "《高島易斷》：水流依地而行，相親相輔之象。誠信是合作之基石，若三心二意、拖延猶豫，良機稍縱即逝。",
      takashima_case: "占企業策略結盟：得比卦九五，顯比王用三驅。斷曰：以開放胸懷廣納盟友，去留自便，必得忠誠夥伴助力。",
      modern_action: "主動建立戰略夥伴關係，強化團隊向心力。對真心合作者給予充分信任，決策宜快不宜遲。"
    },
    {
      id: 9, name: "小畜", full_name: "風天小畜", pinyin: "Xiǎo Xù", binary_code: "111011",
      upper_trigram: "巽", lower_trigram: "乾", upper_nature: "風", lower_nature: "天",
      structure: "風行天上，積蓄小成", core_theme: "小有蓄積，蓄力微調，不可大進",
      judgment: "小畜：亨。密雲不雨，自我西郊。",
      judgment_vernacular: "小畜卦象徵微小的蓄積。烏雲密布卻尚未化為甘霖。目前力量有限，只宜做小幅度調整與準備，不宜全面進攻。",
      image_text: "風行天上，小畜；君子以懿文德。",
      tuan_zhuan: "小畜；柔得位，而上下應之，曰小畜。健而巽，剛中而志行，乃亨。",
      takashima_summary: "《高島易斷》：力量蓄積尚淺，猶如風吹雲散雨未落。宜修養德行、節約開支，暫做局部改良。",
      takashima_case: "占新產品上市時機：得小畜六四，有孚血去惕出。斷曰：準備工作未完備，市場尚在觀望，先做小規模測試。",
      modern_action: "從小規模 MVP 驗證開始。控制預算，累積小勝，切忌盲目擴展規模。"
    },
    {
      id: 10, name: "履", full_name: "天澤履", pinyin: "Lǚ", binary_code: "110111",
      upper_trigram: "乾", lower_trigram: "兌", upper_nature: "天", lower_nature: "澤",
      structure: "上天下澤，循禮踐行", core_theme: "如履薄冰，謹言慎行，以禮化險",
      judgment: "履：履虎尾，不咥人，亨。",
      judgment_vernacular: "履卦象徵依禮踐行。即便踩到老虎尾巴，老虎也不會咬人，亨通。以謙遜柔順的態度應對剛烈強權，可化險為夷。",
      image_text: "上天下澤，履；君子以辨上下，定民志。",
      tuan_zhuan: "履，柔履剛也。說而應乎乾，是以履虎尾不咥人，亨。",
      takashima_summary: "《高島易斷》：如臨深淵如履薄冰。面對權貴或強大對手時，嚴守禮節與法規，自能化解危機於無形。",
      takashima_case: "占覲見高官爭取特許經營：得履卦九五，夬履貞厲。斷曰：態度必須極其恭敬周全，切莫居功自傲，方能順利通關。",
      modern_action: "嚴格遵守法律法規與商務禮儀。在敏感談判中保持克制與尊重，步步為營避免越界。"
    },
    {
      id: 11, name: "泰", full_name: "地天泰", pinyin: "Tài", binary_code: "111000",
      upper_trigram: "坤", lower_trigram: "乾", upper_nature: "地", lower_nature: "天",
      structure: "天地交泰，萬物通順", core_theme: "上下交融，通達安泰，三陽開泰",
      judgment: "泰：小往大來，吉亨。",
      judgment_vernacular: "泰卦象徵通暢安泰。付出微小而收穫巨大，吉祥亨通。天地之氣相互交感，君子道長、小人道消之黃金時期。",
      image_text: "天地交，泰；后以財成天地之道，輔相天地之宜，以左右民。",
      tuan_zhuan: "泰，小往大來，吉亨。則是天地交，而萬物通也；上下交，而其志同也。",
      takashima_summary: "《高島易斷》：陰陽交泰，萬象繁榮。乃難得之大吉運，然安不忘危，泰極否來之戒不可不察。",
      takashima_case: "占明治經濟改革全景：得泰卦九二，包荒用馮河。斷曰：國家財政步入正軌，應大膽容納改革派，開創盛世局面。",
      modern_action: "抓住上升紅利期加速推進重要項目。建立跨部門順暢溝通，分享成果，居安思危做好備案。"
    },
    {
      id: 12, name: "否", full_name: "天地否", pinyin: "Pǐ", binary_code: "000111",
      upper_trigram: "乾", lower_trigram: "坤", upper_nature: "天", lower_nature: "地",
      structure: "天地不交，閉塞阻隔", core_theme: "閉塞不通，晦暗潛伏，潔身自好",
      judgment: "否：否之匪人，不利君子貞，大往小來。",
      judgment_vernacular: "否卦象徵閉塞不通。天地隔絕不交，小人得勢君子受阻。君子應當退隱自守，不宜強行出頭或爭奪名利。",
      image_text: "天地不交，否；君子以儉德辟難，不可榮以祿。",
      tuan_zhuan: "否之匪人，不利君子貞，大往小來。則是天地不交，而萬物不通也。",
      takashima_summary: "《高島易斷》：世道艱難，溝通斷絕。切勿在此時硬拼投資或高調擴張，當收斂鋒芒以避禍端。",
      takashima_case: "占某官員政爭前途：得否卦初六，拔茅茹以其彙貞吉。斷曰：大勢已去，不如同道好友一同引退暫避風頭。",
      modern_action: "減少不必要的外部衝突與開支。退回內部專注打磨核心能力，靜候外部環境回暖。"
    },
    {
      id: 13, name: "同人", full_name: "天火同人", pinyin: "Tóng Rén", binary_code: "101111",
      upper_trigram: "乾", lower_trigram: "離", upper_nature: "天", lower_nature: "火",
      structure: "天與火同，志同道合", core_theme: "大同世界，集結同道，破除偏見",
      judgment: "同人：同人于野，亨。利涉大川，利君子貞。",
      judgment_vernacular: "同人卦象徵志同道合與廣結善緣。在廣闊曠野中與眾人坦誠相待，亨通順暢。利於勇渡大川，利於君子持守正道。",
      image_text: "天與火，同人；君子以類族辨物。",
      tuan_zhuan: "同人，柔得位得中而應乎乾，曰同人。同人曰：同人于野亨，利涉大川，乾行也。",
      takashima_summary: "《高島易斷》：打破私心門戶之見，與天下人同心協力。只要光明正大、公私分明，必得大眾擁戴。",
      takashima_case: "占創設日本聯合海運株式會社：得同人九二，同人于宗吝。斷曰：不可侷限於家族私利，唯有公眾持股合營方能成就霸業。",
      modern_action: "尋求理念契合的合作夥伴與社群支持。打破信息壁壘，以透明公開的方式推進協同合作。"
    },
    {
      id: 14, name: "大有", full_name: "火天大有", pinyin: "Dà Yǒu", binary_code: "111101",
      upper_trigram: "離", lower_trigram: "乾", upper_nature: "火", lower_nature: "天",
      structure: "火在天上，富饒豐盛", core_theme: "日正當中，豐功偉業，順天休命",
      judgment: "大有：元亨。",
      judgment_vernacular: "大有卦象徵豐收盛大。如太陽高懸於天空普照大地。具備至大亨通之勢，宜抑惡揚善、順應天道天命。",
      image_text: "火在天上，大有；君子以遏惡揚善，順天休命。",
      tuan_zhuan: "大有，柔得尊位大中，而上下應之，曰大有。其德剛健而文明，應乎天而時行，是以元亨。",
      takashima_summary: "《高島易斷》：大有者大富大盛之卦也。居高位者當以德服人，善用財富福澤大眾，不可驕奢放縱。",
      takashima_case: "占明治天皇即位之大運：得大有六五，厥孚交如威如吉。斷曰：皇室德澤四海，萬民歸心，開創富強新時代。",
      modern_action: "處於收穫成果與資源豐沛階段。慷慨激勵團隊夥伴，回饋社會與用戶，保持謙遜正直。"
    },
    {
      id: 15, name: "謙", full_name: "地山謙", pinyin: "Qiān", binary_code: "001000",
      upper_trigram: "坤", lower_trigram: "艮", upper_nature: "地", lower_nature: "山",
      structure: "地中有山，謙遜受益", core_theme: "尊高自抑，虛懷若谷，六爻皆吉",
      judgment: "謙：亨，君子有終。",
      judgment_vernacular: "謙卦象徵謙遜卑退。高山隱伏於大地之中。君子保持謙遜必能暢通無阻，並且能善始善終、長久得福。",
      image_text: "地中有山，謙；君子以裒多益寡，稱物平施。",
      tuan_zhuan: "謙，亨，天道下濟而光明，地道卑而上行。天道虧盈而益謙，地道變盈而流謙，鬼神害盈而福謙，人道惡盈而好謙。",
      takashima_summary: "《高島易斷》：易經六十四卦中唯一六爻皆吉之卦。滿招損謙受益，越具實力越當謙沖自牧。",
      takashima_case: "占內閣大臣政途安危：得謙卦九三，勞謙君子有終吉。斷曰：功高震主之時，唯有更加謙卑退讓、不爭名位，方能永保平安。",
      modern_action: "主動退讓利益給合作夥伴，虛心傾聽一線同仁意見。減少宣傳吹捧，用實打實的成果說話。"
    },
    {
      id: 16, name: "豫", full_name: "雷地豫", pinyin: "Yù", binary_code: "000100",
      upper_trigram: "震", lower_trigram: "坤", upper_nature: "雷", lower_nature: "地",
      structure: "雷出地奮，歡欣和樂", core_theme: "歡欣愉悅，未雨綢繆，居安思危",
      judgment: "豫：利建侯行師。",
      judgment_vernacular: "豫卦象徵歡悅振奮。雷動大地春回生機。利於建立功業、建立組織與出兵征戰。但切戒沉迷逸樂不知戒備。",
      image_text: "雷出地奮，豫；先王以作樂崇德，殷薦之上帝，以配祖考。",
      tuan_zhuan: "豫，剛應而志行，順以動，豫。豫，順以動，故天地如之，而況建侯行師乎？",
      takashima_summary: "《高島易斷》：天地和樂，人心振奮。宜順勢動員眾人推展新事業，但須防樂極生悲，防範於未然。",
      takashima_case: "占舉辦全國博覽會：得豫卦九四，由豫大有得。斷曰：全民響應，盛況空前，將大幅提振國家士氣與工商業發展。",
      modern_action: "策劃激勵團隊的慶祝與發布活動。在熱烈氛圍中凝聚士氣，同時制定風險應對清單。"
    },
    {
      id: 17, name: "隨", full_name: "澤雷隨", pinyin: "Suí", binary_code: "100011",
      upper_trigram: "兌", lower_trigram: "震", upper_nature: "澤", lower_nature: "雷",
      structure: "澤中有雷，順應時勢", core_theme: "隨順客觀，隨方就圓，擇善而從",
      judgment: "隨：元亨利貞，無咎。",
      judgment_vernacular: "隨卦象徵隨順機遇。順應客觀規律與大眾意願，大亨通且持正無咎。不可盲從附和，當追隨正義真理。",
      image_text: "澤中有雷，隨；君子以嚮晦入宴息。",
      tuan_zhuan: "隨，剛來而下柔，動而說，隨。大亨貞無咎，而天下隨時，隨時之義大矣哉！",
      takashima_summary: "《高島易斷》：隨時應變，借力使力。順應市場趨勢與群眾需求，切莫固執己見逆勢而為。",
      takashima_case: "占引進西方新科技機器：得隨卦九五，孚于嘉吉。斷曰：此乃時代所趨，順應文明潮流引進必獲豐厚利潤。",
      modern_action: "順應市場趨勢與用戶反饋迅速迭代產品。放下個人偏執，緊隨最具潛力的行業標準。"
    },
    {
      id: 18, name: "蠱", full_name: "山風蠱", pinyin: "Gǔ", binary_code: "011001",
      upper_trigram: "艮", lower_trigram: "巽", upper_nature: "山", lower_nature: "風",
      structure: "山下有風，整治腐敗", core_theme: "革除積弊，撥亂反正，重獲新生",
      judgment: "蠱：元亨，利涉大川。先甲三日，後甲三日。",
      judgment_vernacular: "蠱卦象徵敗壞與整頓。長久停滯導致內部腐朽生蟲。必須果斷進行徹底改革，深思熟慮策劃三日，執行後追蹤三日方保大吉。",
      image_text: "山下有風，蠱；君子以振民育德。",
      tuan_zhuan: "蠱，剛上而柔下，巽而止，蠱。蠱，元亨，而天下治也。利涉大川，往有事也。",
      takashima_summary: "《高島易斷》：事出因循苟且，積弊已深。此時唯有大刀闊斧清除腐敗，痛定思痛方能中興。",
      takashima_case: "占某官辦公營事業虧損整頓：得蠱卦初六，幹父之蠱有子考無咎。斷曰：需勇於推翻舊有陳規，重組管理層方可起死回生。",
      modern_action: "全面排查組織或程式庫中的歷史包袱與技術債務。制定精確重構計畫，不留死角徹底解決痛點。"
    },
    {
      id: 19, name: "臨", full_name: "地澤臨", pinyin: "Lín", binary_code: "110000",
      upper_trigram: "坤", lower_trigram: "兌", upper_nature: "地", lower_nature: "澤",
      structure: "地上居澤，督導親臨", core_theme: "居高臨下，親民視察，盛極必衰",
      judgment: "臨：元，亨，利，貞。至于八月有凶。",
      judgment_vernacular: "臨卦象徵督導親臨與陽氣漸長。形勢正欣欣向榮大亨順暢。但需提防到了八月（陰盛陽衰時）將面臨凶險，需及早籌謀。",
      image_text: "地上有澤，臨；君子以教思無窮，容保民無疆。",
      tuan_zhuan: "臨，剛浸而長。說而順，剛中而應，大亨以正，天之道也。至于八月有凶，消不久也。",
      takashima_summary: "《高島易斷》：陽剛方長，氣運正盛。長官宜親臨第一線體察民情，並對未來可能之市場衰退預作準備。",
      takashima_case: "占農產收成與期貨行情：得臨卦九二，咸臨吉無不利。斷曰：目前物價大好，宜盡快出售獲利，因下半年恐有跌價之險。",
      modern_action: "深入第一線調研真實用戶需求與反饋。利用當前優勢窗口期加固護城河，儲備現金過冬。"
    },
    {
      id: 20, name: "觀", full_name: "風地觀", pinyin: "Guān", binary_code: "000011",
      upper_trigram: "巽", lower_trigram: "坤", upper_nature: "風", lower_nature: "地",
      structure: "風行地上，觀察示範", core_theme: "靜觀洞察，示範感化，反躬自省",
      judgment: "觀：盥而不薦，有孚顒若。",
      judgment_vernacular: "觀卦象徵觀察與示範。如同祭祀剛洗完手尚未獻祭時那樣莊嚴肅穆，心中充滿誠信與威儀。以身作則感化他人。",
      image_text: "風行地上，觀；先王以省方，觀民設教。",
      tuan_zhuan: "大觀在上，順而巽，中正以觀天下。觀，盥而不薦，有孚顒若，下觀而化也。",
      takashima_summary: "《高島易斷》：上行下效之象。管理者不可輕易言動，應以深邃洞察力觀察全局，以高尚品德感召部屬。",
      takashima_case: "占考察歐美憲政制度：得觀卦九五，觀我生君子無咎。斷曰：出國考察宜博採眾長，反省本國國情，制定最適憲章。",
      modern_action: "暫時退後一步做宏觀行業與競爭對手分析。提升自身產出水準，樹立典範與標準規範。"
    },
    {
      id: 21, name: "噬嗑", full_name: "火雷噬嗑", pinyin: "Shì Kè", binary_code: "100101",
      upper_trigram: "離", lower_trigram: "震", upper_nature: "火", lower_nature: "雷",
      structure: "雷電合嚼，執法除障", core_theme: "咬碎障礙，嚴明刑罰，雷厲風行",
      judgment: "噬嗑：亨。利用獄。",
      judgment_vernacular: "噬嗑卦象徵咬斷障礙與貫徹法治。口中有物必須用力咬碎方能合攏。亨通，利於執行法令、明辨是非、排除奸頑。",
      image_text: "雷電，噬嗑；先王以明罰敕法。",
      tuan_zhuan: "頤中有物，曰噬嗑，噬嗑而亨。剛柔分，動而明，雷電合而章。",
      takashima_summary: "《高島易斷》：中梗阻隔，非用強硬手段不可拔除。商業上宜果斷處置違約債務，內部宜肅清違規人員。",
      takashima_case: "占追討長期拖欠之巨額商款：得噬嗑六五，噬乾肉得黃金貞厲無咎。斷曰：此債務棘手，必須透過法律訴訟施壓方能討回。",
      modern_action: "對拖延瓶頸、違規行為或不良合約採取果斷法律或行政手段。雷厲風行排除路障。"
    },
    {
      id: 22, name: "賁", full_name: "山火賁", pinyin: "Bì", binary_code: "101001",
      upper_trigram: "艮", lower_trigram: "離", upper_nature: "山", lower_nature: "火",
      structure: "山下有火，文飾修飾", core_theme: "禮儀文飾，包裝美化，返璞歸真",
      judgment: "賁：亨。小利有攸往。",
      judgment_vernacular: "賁卦象徵文飾與美化。火在山下映照得山色秀麗。適度包裝修飾可獲小利，但不可過度浮華，最終仍需注重本質。",
      image_text: "山下有火，賁；君子以明庶政，無敢折獄。",
      tuan_zhuan: "賁，亨；柔來而文剛，故亨。分剛上而文柔，故小利有攸往，天文也。",
      takashima_summary: "《高島易斷》：文飾之道在於恰如其分。虛名無益於實質，商業包裝若脫離商品本質，終將失去信譽。",
      takashima_case: "占品牌包裝與廣告宣傳：得賁卦上九，白賁無咎。斷曰：過度花哨反招質疑，回歸簡約純白之高品質風格必得大眾喜愛。",
      modern_action: "優化 UI/UX 與視覺傳達，但核心精力仍應鎖定在產品核心技術與品質本身。"
    },
    {
      id: 23, name: "剝", full_name: "山地剝", pinyin: "Bō", binary_code: "000001",
      upper_trigram: "艮", lower_trigram: "坤", upper_nature: "山", lower_nature: "地",
      structure: "山附於地，剝落崩解", core_theme: "群陰剝陽，基底被蝕，順時隱退",
      judgment: "剝：不利有攸往。",
      judgment_vernacular: "剝卦象徵剝蝕與崩解。陰盛陽衰，僅存一陽高高在上。不利於有所行動，應當順應時勢隱忍退守，厚植根基。",
      image_text: "山附於地，剝；上以厚下，安宅。",
      tuan_zhuan: "剝，剝也，柔變剛也。不利有攸往，小人長也。順而止之，觀象也。",
      takashima_summary: "《高島易斷》：基石遭受蠶食，危如累卵。此時不可勉強投資進取，應全力照顧基層員工，固本培元。",
      takashima_case: "占某銀行資金周轉危機：得剝卦六三，剝之無咎。斷曰：內部派系傾軋，應果斷與腐敗派系切割，方可保全自身名節。",
      modern_action: "全面收縮戰線，停止一切冒險擴張。安撫基層團隊，修復系統脆弱漏洞，以防全面崩盤。"
    },
    {
      id: 24, name: "復", full_name: "地雷復", pinyin: "Fù", binary_code: "100000",
      upper_trigram: "坤", lower_trigram: "震", upper_nature: "地", lower_nature: "雷",
      structure: "雷在地中，一陽來復", core_theme: "冬至復甦，陽氣萌動，重回正道",
      judgment: "復：亨。出入無疾，朋來無咎。反復其道，七日來復，利有攸往。",
      judgment_vernacular: "復卦象徵復甦與回歸。一陽初生於地底深處。亨通順暢，同道朋友前來相助。遵循自然規律循環往復，利於推展行動。",
      image_text: "雷在地中，復；先王以至日閉關，商旅不行，后不省方。",
      tuan_zhuan: "復，亨；剛反，動而以順行，是以出入無疾，朋來無咎。反復其道，七日來復，天行也。",
      takashima_summary: "《高島易斷》：剝極必復，希望之光初現。如冬至陽氣萌發，不可操切躁進，宜休養生息讓萌芽穩健成長。",
      takashima_case: "占久病患者轉機：得復卦初九，不遠復無祗悔元吉。斷曰：病體已見生機，只要遵醫囑安心休養，不日即可康復。",
      modern_action: "捕捉微弱的市場復甦信號。重啟被擱置的優質計畫，從小處做起，逐步恢復業務動能。"
    },
    {
      id: 25, name: "無妄", full_name: "天雷無妄", pinyin: "Wú Wàng", binary_code: "100111",
      upper_trigram: "乾", lower_trigram: "震", upper_nature: "天", lower_nature: "雷",
      structure: "天下雷行，真實無妄", core_theme: "順應自然，合乎天理，切勿妄動",
      judgment: "無妄：元，亨，利，貞。其匪正有眚，不利有攸往。",
      judgment_vernacular: "無妄卦象徵真實不虛與順其自然。大亨通且利於守正。若動機不純或心存僥倖，必招致災禍，不利於有所作為。",
      image_text: "天下雷行，物與無妄；先王以茂對時，育萬物。",
      tuan_zhuan: "無妄，剛自外來，而為主於內。動而健，剛中而應，大亨以正，天之命也。",
      takashima_summary: "《高島易斷》：無妄者無虛妄也。凡事但求問心無愧，順天應理。若貪圖暴利或投機取巧，必遭飛來橫禍。",
      takashima_case: "占某投機股票買賣：得無妄六三，無妄之災或繫之牛行人之得邑人之災。斷曰：此財不可貪，否則無端代人受過承擔巨虧。",
      modern_action: "拒絕任何灰色地帶與僥倖捷徑。恪守職業道德與誠信原則，專注合規穩健經營。"
    },
    {
      id: 26, name: "大畜", full_name: "山天大畜", pinyin: "Dà Xù", binary_code: "111001",
      upper_trigram: "艮", lower_trigram: "乾", upper_nature: "山", lower_nature: "天",
      structure: "天在山中，大有蓄積", core_theme: "蓄積宏大，博學多能，蓄勢勇進",
      judgment: "大畜：利貞，不家食吉，利涉大川。",
      judgment_vernacular: "大畜卦象徵雄厚之蓄積。高山包容廣闊蒼天。利於守正，走出家門服務社會大吉，利於克服重重險阻成就大業。",
      image_text: "天在山中，大畜；君子以多識前言往行，以畜其德。",
      tuan_zhuan: "大畜，剛健篤實輝光，日新其德，剛上而尚賢。能止健，大正也。",
      takashima_summary: "《高島易斷》：才德與資產皆大幅充實。宜廣讀聖賢書、研習歷史教訓，時機成熟時勇於擔當重任。",
      takashima_case: "占青年留學深造：得大畜九二，輿說輹。斷曰：暫且放下功名之心，專注在學府中沉潛苦讀數載，將來必成大器。",
      modern_action: "進行深度技術攻堅與知識儲備。延攬各領域頂尖專家，打造堅不可摧的技術專利庫。"
    },
    {
      id: 27, name: "頤", full_name: "山雷頤", pinyin: "Yí", binary_code: "100001",
      upper_trigram: "艮", lower_trigram: "震", upper_nature: "山", lower_nature: "雷",
      structure: "山下有雷，養生養德", core_theme: "頤養身心，謹言慎食，培養人才",
      judgment: "頤：貞吉。觀頤，自求口實。",
      judgment_vernacular: "頤卦象徵頤養與飲食。上下兩陽夾四陰如口之形。持正獲吉。觀察他人如何修身養德與謀生求食，謹慎言行節制飲食。",
      image_text: "山下有雷，頤；君子以慎言語，節飲食。",
      tuan_zhuan: "頤，貞吉，養正也。觀頤，觀其所養也；自求口實，觀其自養也。天地養萬物，聖人養賢，以及萬民；頤之時大矣哉！",
      takashima_summary: "《高島易斷》：禍從口出病從口入。當管好自己的嘴巴與慾望，同時上位者當注重社會福利與培育英才。",
      takashima_case: "占公關危機處理：得頤卦初九，舍爾靈龜觀我朵頤凶。斷曰：若只顧自身利益貪圖好處，必招致輿論重擊，當慎言自律。",
      modern_action: "嚴密把關對外公關言論與行銷口徑。注重團隊身心健康與福利保障，做好長期人才培育。"
    },
    {
      id: 28, name: "大過", full_name: "澤風大過", pinyin: "Dà Guò", binary_code: "011110",
      upper_trigram: "兌", lower_trigram: "巽", upper_nature: "澤", lower_nature: "風",
      structure: "澤滅木，棟橈荷重", core_theme: "負擔過重，棟樑彎曲，果敢擔當",
      judgment: "大過：棟橈，利有攸往，亨。",
      judgment_vernacular: "大過卦象徵重大過度與超重負荷。四陽盛於中而初上二陰脆弱，如房樑彎曲。雖處非常危局，只要勇於決策前行仍能亨通。",
      image_text: "澤滅木，大過；君子以獨立不懼，遯世無悶。",
      tuan_zhuan: "大過，大者過也。棟橈，本末弱也。剛過而中，巽而說行，利有攸往，乃亨。",
      takashima_summary: "《高島易斷》：非常時期行非常之事。責任極度沉重，不可畏首畏尾，需展現過人魄力獨自扛起大局。",
      takashima_case: "占金融海嘯下重組救市政策：得大過九二，枯楊生稊老夫得其女妻無不利。斷曰：雖危如累卵，但採取非常規手段能絕處逢生。",
      modern_action: "承擔關鍵責任，果斷執行艱難裁決。卸除冗餘負擔，以超常勇氣帶領團隊突圍。"
    },
    {
      id: 29, name: "坎", full_name: "坎為水", pinyin: "Kǎn", binary_code: "010010",
      upper_trigram: "坎", lower_trigram: "坎", upper_nature: "水", lower_nature: "水",
      structure: "重重險陷，習坎行水", core_theme: "險阻重重，誠信貫注，歷練心智",
      judgment: "習坎：有孚，維心亨，行有尚。",
      judgment_vernacular: "坎卦象徵重重陷阱與險難。水流不斷前行。只要內心保持赤誠，心懷坦蕩便能通達，勇毅前行必能受到尊崇。",
      image_text: "水洊至，習坎；君子以常德行，習教事。",
      tuan_zhuan: "習坎，重險也。水流而不盈，行險而不失其信。維心亨，乃以剛中也。行有尚，往有功也。",
      takashima_summary: "《高島易斷》：前後皆險，進退維谷。此時不可心存僥倖妄圖走捷徑，唯有像流水般不畏艱險、以誠相見方能脫困。",
      takashima_case: "占船隊遇颱風救援：得坎卦六四，樽酒簋貳用缶納約自牖終無咎。斷曰：情勢萬分危急，務必簡化指令、同舟共濟，終得平安救援。",
      modern_action: "保持冷靜與誠信，做好最壞情況的應急預案。一步一腳印拆解難題，將危機轉化為團隊凝聚契機。"
    },
    {
      id: 30, name: "離", full_name: "離為火", pinyin: "Lí", binary_code: "101101",
      upper_trigram: "離", lower_trigram: "離", upper_nature: "火", lower_nature: "火",
      structure: "重明繼照，附著光輝", core_theme: "光明美麗，依附正道，照亮四方",
      judgment: "離：利貞，亨。畜牝牛，吉。",
      judgment_vernacular: "離卦象徵光明與依附。雙火重疊輝映。利於持守正道，亨通。蓄養溫順之母牛大吉。如同火必須依附於柴薪，人當依附正道。",
      image_text: "明兩作，離；大人以繼明照于四方。",
      tuan_zhuan: "離，麗也；日月麗乎天，百穀草木麗乎土，重明以麗乎正，乃化成天下。柔麗乎中正，故亨；是以畜牝牛吉也。",
      takashima_summary: "《高島易斷》：文明昌盛之象。如日中天，需依附於正義、法規與良師。切忌性急如火，應以柔和持重為本。",
      takashima_case: "占文化教育新政推行：得離卦六二，黃離元吉。斷曰：得中道之光明，教育大業盛況空前，將培養無數傑出英才。",
      modern_action: "將專長與成熟的大平台或正派組織相結合。展現透明度與專業影響力，照亮並賦能合作夥伴。"
    },
    {
      id: 31, name: "咸", full_name: "澤山咸", pinyin: "Xián", binary_code: "001011",
      upper_trigram: "兌", lower_trigram: "艮", upper_nature: "澤", lower_nature: "山",
      structure: "山上有澤，心靈感應", core_theme: "少男少女，相互感應，心意相通",
      judgment: "咸：亨，利貞，取女吉。",
      judgment_vernacular: "咸卦象徵感應與共鳴。山上有湖澤，虛懷接納。亨通，利於堅守正道，迎娶女子大吉。真誠互感乃和諧之始。",
      image_text: "山上有澤，咸；君子以虛受人。",
      tuan_zhuan: "咸，感也。柔上而剛下，二氣感應以相與，止而說，男下女，是以亨利貞取女吉也。",
      takashima_summary: "《高島易斷》：至誠感天，人心互通。虛懷若谷以接納他人，男女情投意合，商場上亦能迅速促成真誠合作。",
      takashima_case: "占日美親善通商條約締結：得咸卦九四，貞吉悔亡憧憧往來朋從爾思。斷曰：以真誠對待外國使節，必能達成互利雙贏共識。",
      modern_action: "以同理心傾聽用戶與同事感受。建立真誠的情感連結，放下傲慢，創造雙向共贏合作。"
    },
    {
      id: 32, name: "恆", full_name: "雷風恆", pinyin: "Héng", binary_code: "011100",
      upper_trigram: "震", lower_trigram: "巽", upper_nature: "雷", lower_nature: "風",
      structure: "雷風相與，持之以恆", core_theme: "長久穩定，恆常之道，貴在堅持",
      judgment: "恆：亨，無咎，利貞，利有攸往。",
      judgment_vernacular: "恆卦象徵持之以恆與恆久穩定。雷風相生相隨。亨通無過失，利於持守正道，利於有所作為。堅定信念不輕易變更。",
      image_text: "雷風，恆；君子以立不易方。",
      tuan_zhuan: "恆，久也。剛上而柔下，雷風相與，巽而動，剛柔皆應，恆。恆亨無咎利貞，久於其道也。",
      takashima_summary: "《高島易斷》：恆常不變之德。凡事重在持續累積，切忌朝三暮四、半途而廢。守常即可獲致長遠成功。",
      takashima_case: "占家族企業傳承百年規劃：得恆卦九二，悔亡。斷曰：堅守祖傳匠人精神與家訓，世代嚴格落實，家族興旺不衰。",
      modern_action: "保持核心業務的穩定性與節奏感。避免頻繁更改既定戰略，持續深耕核心優勢。"
    },
    {
      id: 33, name: "遯", full_name: "天山遯", pinyin: "Dùn", binary_code: "001111",
      upper_trigram: "乾", lower_trigram: "艮", upper_nature: "天", lower_nature: "山",
      structure: "天下有山，退避隱遁", core_theme: "見機遠引，急流勇退，明哲保身",
      judgment: "遯：亨，小利貞。",
      judgment_vernacular: "遯卦象徵退避與隱退。天高山遠，陰氣漸長逼退陽氣。亨通，小事尚利於持正。當退則退、明哲保身方顯君子遠見。",
      image_text: "天下有山，遯；君子以遠小人，不惡而嚴。",
      tuan_zhuan: "遯，亨，遯而亨也。剛當位而應，與時行也。小利貞，浸而長也。遯之時義大矣哉！",
      takashima_summary: "《高島易斷》：小人得勢之時，君子宜審時度勢退避三舍。退非軟弱，而是為了保全實力等待下一次崛起。",
      takashima_case: "占政治風暴下之大臣去留：得遯卦九五，嘉遯貞吉。斷曰：此時主動遞交辭呈急流勇退，反而能贏得朝野崇高敬重。",
      modern_action: "對無意義的內耗競爭與夕陽專案果斷止損退出。保持距離，儲備實力另闢蹊徑。"
    },
    {
      id: 34, name: "大壯", full_name: "雷天大壯", pinyin: "Dà Zhuàng", binary_code: "111100",
      upper_trigram: "震", lower_trigram: "乾", upper_nature: "雷", lower_nature: "天",
      structure: "雷在天上，陽剛強盛", core_theme: "壯大盛大，克制魯莽，非禮弗履",
      judgment: "大壯：利貞。",
      judgment_vernacular: "大壯卦象徵壯大強盛。雷聲響徹天際，陽剛之氣蒸蒸日上。利於堅守正道。切戒恃強凌弱、盲目衝撞，需合乎規矩。",
      image_text: "雷在天上，大壯；君子以非禮弗履。",
      tuan_zhuan: "大壯，大者壯也。剛以動，故壯。大壯利貞，大者正也。正大而天地之情可見矣！",
      takashima_summary: "《高島易斷》：氣勢如虹，如羝羊觸藩。若盲目濫用力量將自陷困境，必須以正道規範行動，克制衝動。",
      takashima_case: "占軍隊擴編與出擊時機：得大壯九三，小人用壯君子用罔貞厲羝羊觸藩羸其角。斷曰：不可輕敵冒進，嚴防陷入敵軍包圍。",
      modern_action: "處於強勢地位時更要遵守合約與道德底線。避免強行壓制競爭對手，善用智慧而非蠻力。"
    },
    {
      id: 35, name: "晉", full_name: "火地晉", pinyin: "Jìn", binary_code: "000101",
      upper_trigram: "離", lower_trigram: "坤", upper_nature: "火", lower_nature: "地",
      structure: "日出地上，光明晉升", core_theme: "旭日東升，加官晉爵，如日中天",
      judgment: "晉：康侯用錫馬蕃庶，晝日三接。",
      judgment_vernacular: "晉卦象徵晉升與前進。太陽升起普照大地。如同賢明侯爵受到君王賜予大量良馬，一日之內多次接見。前途光明無限。",
      image_text: "明出地上，晉；君子以自昭明德。",
      tuan_zhuan: "晉，進也。明出地上，順而麗乎大明，柔進而上行，是以康侯用錫馬蕃庶晝日三接也。",
      takashima_summary: "《高島易斷》：日出東方，前程似錦。必獲長官賞識與提拔，事業蒸蒸日上，宜更加勤勉發揚德行。",
      takashima_case: "占公職人員晉升升遷：得晉卦六五，悔亡失得勿恤往吉無不利。斷曰：放下得失焦慮，勇敢承擔新職位，必獲卓著政績。",
      modern_action: "抓住升遷與展示成果的關鍵機遇。向高層與客戶匯報最新進展，積極擴展業務範疇。"
    },
    {
      id: 36, name: "明夷", full_name: "地火明夷", pinyin: "Míng Yí", binary_code: "101000",
      upper_trigram: "坤", lower_trigram: "離", upper_nature: "地", lower_nature: "火",
      structure: "日入地中，韜光養晦", core_theme: "光明受傷，黑夜潛伏，內明外柔",
      judgment: "明夷：利艱貞。",
      judgment_vernacular: "明夷卦象徵光明受損進入黑暗。太陽落入地底。利於在艱難逆境中堅守正道。需隱藏聰明才智，內心明亮而外表順從。",
      image_text: "明入地中，明夷；君子以蒞眾，用晦而明。",
      tuan_zhuan: "明入地中，明夷。內文明而外柔順，以蒙大難，文王以之。利艱貞，晦其明也。",
      takashima_summary: "《高島易斷》：身處至暗時刻，四周險惡。切莫彰顯鋒芒招人嫉恨，當如箕子裝瘋、文王演易般隱忍圖存。",
      takashima_case: "占企業遭打壓陷害之困境：得明夷六二，明夷夷于左股用拯馬壯吉。斷曰：雖受重創，但保留核心主力迅速轉移陣地，終能保全。",
      modern_action: "韜光養晦，不做出頭鳥。保護核心資產與數據，忍耐至暗時刻，默默打磨實力以待黎明。"
    },
    {
      id: 37, name: "家人", full_name: "風火家人", pinyin: "Jiā Rén", binary_code: "101011",
      upper_trigram: "巽", lower_trigram: "離", upper_nature: "風", lower_nature: "火",
      structure: "風自火出，治家正位", core_theme: "家庭和睦，各安其位，嚴整家規",
      judgment: "家人：利女貞。",
      judgment_vernacular: "家人卦象徵家庭倫理與內部治理。火生風起，內外相應。利於女性持正治家。各司其職、上下一心，內部穩固則萬事興。",
      image_text: "風自火出，家人；君子以言有物，而行有恆。",
      tuan_zhuan: "家人，女正位乎內，男正位乎外，男女正，天地之大義也。家人有嚴君焉，父母之謂也。",
      takashima_summary: "《高島易斷》：齊家治國之本。內部管理必須嚴明有序，言行一致。家庭和順、團隊團結，事業自能亨通。",
      takashima_case: "占家族企業內部矛盾協調：得家人九五，王假有家勿恤吉。斷曰：當家長者以身作則、處事公允，眾人自然信服歸心。",
      modern_action: "加強核心團隊內部凝聚力與制度建設。確保內部溝通順暢、職責分明，修補內部裂痕。"
    },
    {
      id: 38, name: "睽", full_name: "火澤睽", pinyin: "Kuí", binary_code: "110101",
      upper_trigram: "離", lower_trigram: "兌", upper_nature: "火", lower_nature: "澤",
      structure: "火動上澤動下，異中求同", core_theme: "背道而馳，歧見矛盾，求同存異",
      judgment: "睽：小事吉。",
      judgment_vernacular: "睽卦象徵乖離與歧見。火炎向上而水澤向下，背道而馳。大事難成，小事獲吉。當在分歧中尋求共同點，求同存異。",
      image_text: "上火下澤，睽；君子以同而異。",
      tuan_zhuan: "睽，火動而上，澤動而下；二女同居，其志不同行；說而麗乎明，柔進而上行，得中而應乎剛，是以小事吉。",
      takashima_summary: "《高島易斷》：意見不合，人心相背。切莫強求全面一致，宜包容差異，尋找最大公約數，暫行局部合作。",
      takashima_case: "占政黨跨黨派協商：得睽卦上九，睽孤見豕負塗載鬼一車先張之弧後說之弧往遇雨則吉。斷曰：放下疑神疑鬼之戒心，坦誠接觸終能化解誤會。",
      modern_action: "客觀對待團隊內部不同聲音。不搞一言堂，透過架構設計在多元歧見中找到共通利益。"
    },
    {
      id: 39, name: "蹇", full_name: "水山蹇", pinyin: "Jiǎn", binary_code: "001010",
      upper_trigram: "坎", lower_trigram: "艮", upper_nature: "水", lower_nature: "山",
      structure: "山上有水，行路艱難", core_theme: "寸步難行，知難而退，反身修德",
      judgment: "蹇：利西南，不利東北；利見大人，貞吉。",
      judgment_vernacular: "蹇卦象徵艱難險阻。前有深水後有高山。利於向平易的西南方行進，不利於險峻的東北方。利於尋求貴人相助，持正獲吉。",
      image_text: "山上有水，蹇；君子以反身修德。",
      tuan_zhuan: "蹇，難也，險在前也。見險而能止，知矣哉！蹇利西南，往得中也；不利東北，其道窮也。",
      takashima_summary: "《高島易斷》：涉水登山寸步難行。此時不可強行冒進，宜掉頭避開險路，尋找良師益友相助，反省自身不足。",
      takashima_case: "占探險隊攀登未開發險峰：得蹇卦初六，往蹇來譽。斷曰：前方雪崩路斷，立刻折返營地重整裝備，反得讚譽與安全。",
      modern_action: "遇到無法逾越的技術或政策壁壘時暫時剎車。不要硬撞南牆，繞道而行或尋求行業大佬指點。"
    },
    {
      id: 40, name: "解", full_name: "雷水解", pinyin: "Xiè", binary_code: "010100",
      upper_trigram: "震", lower_trigram: "坎", upper_nature: "雷", lower_nature: "水",
      structure: "雷雨作解，化險為夷", core_theme: "冰消瓦解，赦免罪過，寬大為懷",
      judgment: "解：利西南，無所往，其來復吉。有攸往，夙吉。",
      judgment_vernacular: "解卦象徵解除困難與化險為夷。春雷陣陣甘霖降下，萬物解凍。無事則休養生息，有事則宜早日解決行動，及早行動獲吉。",
      image_text: "雷雨作，解；君子以赦過宥罪。",
      tuan_zhuan: "解，險以動，動而免乎險，解。解，利西南，往得眾也。其來復吉，乃得中也。有攸往夙吉，往有功也。",
      takashima_summary: "《高島易斷》：苦盡甘來，厄運消散。此時宜寬厚待人、赦免過失，把握機遇迅速出擊清掃殘留問題。",
      takashima_case: "占冤獄平反與債務清算：得解卦九二，田獲三狐得黃矢貞吉。斷曰：奸佞小人被肅清，冤情昭雪，債務終得圓滿化解。",
      modern_action: "危機解除後迅速恢復正常運作。主動釋放善意化解過往恩怨，趁勢推進關鍵進展。"
    },
    {
      id: 41, name: "損", full_name: "山澤損", pinyin: "Sǔn", binary_code: "110001",
      upper_trigram: "艮", lower_trigram: "兌", upper_nature: "山", lower_nature: "澤",
      structure: "損下益上，克己節制", core_theme: "減損節制，懲忿窒慾，先付出後收穫",
      judgment: "損：有孚，元吉，無咎，可貞，利有攸往。曷之用？二簋可用享。",
      judgment_vernacular: "損卦象徵減損與付出。減損下層以增益上層。只要心懷誠意便大吉無過。即便用兩隻竹筐盛祭品祭祀也能獲神明喜悅。",
      image_text: "山下有澤，損；君子以懲忿窒慾。",
      tuan_zhuan: "損，損下益上，其道上行。損而有孚，元吉無咎可貞，利有攸往。曷之用？二簋可用享，二簋應有時，損剛益柔有時。",
      takashima_summary: "《高島易斷》：克制私慾，勇於奉獻。表面看似有所損失，實乃播種蓄福。以誠意彌補物質之不足。",
      takashima_case: "占新創事業早期讓利促銷：得損卦六五，或益之十朋之龜弗克違元吉。斷曰：前期慷慨讓利給客戶，後續將迎來百倍豐厚回報。",
      modern_action: "主動削減不必要的慾望與冗餘開支。在早期合作中先讓利他人，建立長久深厚的信任資產。"
    },
    {
      id: 42, name: "益", full_name: "風雷益", pinyin: "Yì", binary_code: "100110",
      upper_trigram: "巽", lower_trigram: "震", upper_nature: "風", lower_nature: "雷",
      structure: "風雷激盪，增益富饒", core_theme: "損上益下，見善則遷，勇渡難關",
      judgment: "益：利有攸往，利涉大川。",
      judgment_vernacular: "益卦象徵增益與助益。風雷交加相得益彰。減損上層以施惠大眾。利於積極有所作為，利於勇渡大川開拓新局面。",
      image_text: "風雷，益；君子以見善則遷，有過則改。",
      tuan_zhuan: "益，損上益下，民說無疆，自上下下，其道大光。利有攸往，中正有慶。利涉大川，木道乃行。",
      takashima_summary: "《高島易斷》：施恩布德，民心大悅。增益他人即是增益自己，宜乘勝追擊、擴大事業版圖並勇於改過自新。",
      takashima_case: "占政府減稅讓利於民之經濟效應：得益卦九五，有孚惠心勿問元吉有孚惠我德。斷曰：藏富於民，國家經濟必現空前繁榮。",
      modern_action: "讓利給用戶與基層員工。積極吸納優秀反饋迅速優化改進，大膽啟動新市場拓展。"
    },
    {
      id: 43, name: "夬", full_name: "澤天夬", pinyin: "Guài", binary_code: "111110",
      upper_trigram: "兌", lower_trigram: "乾", upper_nature: "澤", lower_nature: "天",
      structure: "澤上於天，果斷決斷", core_theme: "五陽決陰，果斷處置，防範反撲",
      judgment: "夬：揚于王庭，孚號，有厲，告自邑，不利即戎，利有攸往。",
      judgment_vernacular: "夬卦象徵決斷與清除。五陽剛健決除一陰。在朝廷上公布真相並誠信呼籲，雖有危險當先安撫內部，不宜動用武力，利於前行。",
      image_text: "澤上於天，夬；君子以施祿及下，居德則忌。",
      tuan_zhuan: "夬，決也，剛決柔也。健而說，決而和，揚于王庭，柔乘五剛也。",
      takashima_summary: "《高島易斷》：果斷掃除陰邪。但小人窮途末路易行極端，處置時務必依法律程序公開透明，切忌私鬥魯莽。",
      takashima_case: "占揭發內部貪瀆大案：得夬卦九四，臀無膚其行次且牽羊悔亡聞言不信。斷曰：不可單打獨鬥，當聯合執法部門公開依法查辦。",
      modern_action: "對拖泥帶水的棘手問題做出果斷裁決。程序需合法合規、公開公正，做好萬全防護措施。"
    },
    {
      id: 44, name: "姤", full_name: "天風姤", pinyin: "Gòu", binary_code: "011111",
      upper_trigram: "乾", lower_trigram: "巽", upper_nature: "天", lower_nature: "風",
      structure: "天下有風，不期而遇", core_theme: "一陰初生，邂逅相遇，防範微杜漸",
      judgment: "姤：女壯，勿用取女。",
      judgment_vernacular: "姤卦象徵邂逅與相遇。風行天下吹拂萬物。一陰在五陽之下萌生，女子過於強勢，不宜娶此女為妻。需防微杜漸防小人暗生。",
      image_text: "天下有風，姤；后以施命誥四方。",
      tuan_zhuan: "姤，遇也，柔遇剛也。勿用取女，不可與長也。天地相遇，品物流形也。",
      takashima_summary: "《高島易斷》：不期而遇之機緣。雖可得意外之財或萍水相逢之交，但須警惕潛伏的危機與不正之誘惑。",
      takashima_case: "占突如其來之高回報投資邀約：得姤卦九三，其行次且厲無大咎。斷曰：此投資暗藏陷阱，切勿輕信陌生人甜言蜜語。",
      modern_action: "對於突如其來的過分優厚條件保持警惕。重視團隊中出現的微小不良苗頭，及早糾偏。"
    },
    {
      id: 45, name: "萃", full_name: "澤地萃", pinyin: "Cuì", binary_code: "000110",
      upper_trigram: "兌", lower_trigram: "坤", upper_nature: "澤", lower_nature: "地",
      structure: "澤上於地，群聚薈萃", core_theme: "菁英薈萃，人才聚集，防患未然",
      judgment: "萃：亨。王假有廟，利見大人，亨，利貞。用大牲吉，利有攸往。",
      judgment_vernacular: "萃卦象徵聚集與薈萃。水澤匯聚於大地之上。亨通。君王親臨宗廟祭祀，利於拜見德高望重之大人，利於有所作為。",
      image_text: "澤上於地，萃；君子以除戎器，戒不虞。",
      tuan_zhuan: "萃，聚也；順以說，剛中而應，故聚也。王假有廟，致孝享也。利見大人亨，聚以正也。",
      takashima_summary: "《高島易斷》：人才與財富大量匯聚之象。聚眾必生事端，宜加強安保與制度建設，以共同信仰凝聚人心。",
      takashima_case: "占大型商會成立與招募會員：得萃卦九五，萃有位無咎匪孚元永貞悔亡。斷曰：位高權重自然眾星拱月，宜以德服人建立崇高公信力。",
      modern_action: "舉辦大型發布會或社群聚集活動。在資源大量湧入時同步強化系統安全與風控流程。"
    },
    {
      id: 46, name: "升", full_name: "地風升", pinyin: "Shēng", binary_code: "011000",
      upper_trigram: "坤", lower_trigram: "巽", upper_nature: "地", lower_nature: "風",
      structure: "地中生木，步步高升", core_theme: "順勢上升，積小成大，不急不躁",
      judgment: "升：元亨，用見大人，勿恤，南征吉。",
      judgment_vernacular: "升卦象徵上升與成長。樹木由地底破土而出逐漸長成參天大樹。大亨通，利於拜見德高長者，無須擔憂，向南前進獲吉。",
      image_text: "地中生木，升；君子以順德，積小以高大。",
      tuan_zhuan: "柔以時升，巽而順，剛中而應，是以大亨。用見大人勿恤，有慶也；南征吉，志行也。",
      takashima_summary: "《高島易斷》：步步高升，如日方升。不可急功近利，應踏實積累微小進步，終將成就參天大樹。",
      takashima_case: "占年輕學者之學術前途：得升卦九二，孚乃利用禴無咎。斷曰：專心著述厚植學問，必獲名師推薦成為學界泰斗。",
      modern_action: "保持踏實每日迭代，不追求一夜暴富。積極向行業前輩請益，尋求更大舞台。"
    },
    {
      id: 47, name: "困", full_name: "澤水困", pinyin: "Kùn", binary_code: "010110",
      upper_trigram: "兌", lower_trigram: "坎", upper_nature: "澤", lower_nature: "水",
      structure: "澤無水，身陷困局", core_theme: "水涸澤竭，窮困考驗，言而無信",
      judgment: "困：亨，貞，大人吉，無咎。有言不信。",
      judgment_vernacular: "困卦象徵困頓與考驗。水漏於澤下致使澤水枯竭。君子身處困境依然堅守正道獲吉。此時多言辯解無人相信，不如沉默篤行。",
      image_text: "澤無水，困；君子以致命遂志。",
      tuan_zhuan: "困，剛揜也。險以說，困而亨，其唯君子乎？貞大人吉，以剛中也。有言不信，尚口乃窮也。",
      takashima_summary: "《高島易斷》：困窮至極，英雄用武無地。多說無益徒增反感，當泰然處之、堅守操守，困境正是淬煉偉大之契機。",
      takashima_case: "占企業遭斷絕資金鍊：得困卦九五，劓刖困于赤紱乃徐有說利用祭祀。斷曰：處境極其狼狽，唯有誠心感動長輩貴人，方能緩解危機。",
      modern_action: "停止一切無意義的公關辯解。低調承受壓力，內部苦練內功，靜待外部轉機。"
    },
    {
      id: 48, name: "井", full_name: "水風井", pinyin: "Jǐng", binary_code: "011010",
      upper_trigram: "坎", lower_trigram: "巽", upper_nature: "水", lower_nature: "風",
      structure: "木入水出，井水滋養", core_theme: "水井常清，養人不窮，慎修汲器",
      judgment: "井：改邑不改井，無喪無得，往來井井。汔至，亦未繘井，羸其瓶，凶。",
      judgment_vernacular: "井卦象徵水井與資源共享。村莊可以遷移而水井永恆不變。井水清冽供眾人飲用。但若汲水即將到頂卻打破水瓶，則為凶險。",
      image_text: "木上有水，井；君子以勞民勸相。",
      tuan_zhuan: "巽乎水而上水，井；井養而不窮也。改邑不改井，乃以剛中也。汔至亦未繘井，未有功也。羸其瓶，是以凶也。",
      takashima_summary: "《高島易斷》：造福大眾之源泉。如深井汲水，功虧一簣最為可惜。必須定期維修保養設備，確保服務始終如一。",
      takashima_case: "占自來水公共事業建設：得井卦九五，井冽寒泉食。斷曰：此為利國利民之偉業，水源甘甜豐沛，造福後代子孫。",
      modern_action: "打造源源不斷提供價值的底層基建或知識庫。在即將交付的最後一里路嚴防差錯。"
    },
    {
      id: 49, name: "革", full_name: "澤火革", pinyin: "Gé", binary_code: "101110",
      upper_trigram: "兌", lower_trigram: "離", upper_nature: "澤", lower_nature: "火",
      structure: "澤中有火，變革翻新", core_theme: "湯武革命，順天應人，革除舊體",
      judgment: "革：巳日乃孚，元亨，利貞，悔亡。",
      judgment_vernacular: "革卦象徵變革與轉型。水火不相容而引發巨變。等到時機成熟那天推行改革必獲大眾信任，大亨通，後悔消除。",
      image_text: "澤中有火，革；君子以治歷明時。",
      tuan_zhuan: "革，水火相息，二女同居，其志不相得，曰革。巳日乃孚，革而信之。文明以說，大亨以正，天人相應。",
      takashima_summary: "《高島易斷》：時勢所迫，不得不改。改革必須合乎民心天理，不可朝令夕改。一旦啟動變革，宜雷厲風行徹底翻新。",
      takashima_case: "占明治維新廢藩置縣國策：得革卦九五，大人虎變未占有孚。斷曰：如猛虎換毛般煥然一新，全國體制徹底現代化，舉世讚嘆。",
      modern_action: "當舊架構已不堪重負時，勇敢推動顛覆性重構。做好內部宣導與平穩過渡計畫。"
    },
    {
      id: 50, name: "鼎", full_name: "火風鼎", pinyin: "Dǐng", binary_code: "011101",
      upper_trigram: "離", lower_trigram: "巽", upper_nature: "火", lower_nature: "風",
      structure: "木上有火，鼎立烹飪", core_theme: "立新定鼎，調和鼎鼐，化育英才",
      judgment: "鼎：元吉，亨。",
      judgment_vernacular: "鼎卦象徵立新與穩固。木上燃火烹煮食物鑄就重器。大吉大利，亨通暢達。象徵建立嶄新制度、穩固根基、養育賢才。",
      image_text: "木上有火，鼎；君子以正位凝命。",
      tuan_zhuan: "鼎，象也。以木巽火，亨飪也。聖人亨以享上帝，而大亨以養聖賢。巽而耳目聰明，柔進而上行，得中而應乎剛，是以元亨。",
      takashima_summary: "《高島易斷》：革故之後必鼎新。由動盪轉入穩定繁榮之黃金期，宜廣納賢士、確立品牌權威與正統地位。",
      takashima_case: "占新憲法頒布與國會成立：得鼎卦六五，鼎黃耳金鉉利貞。斷曰：國家體制穩如泰山，內閣賢明，開啟長治久安之盛世。",
      modern_action: "在變革後確立全新標準與制度。整合各方利益，打造堅實穩固的產品生態與團隊文化。"
    },
    {
      id: 51, name: "震", full_name: "震為雷", pinyin: "Zhèn", binary_code: "100100",
      upper_trigram: "震", lower_trigram: "震", upper_nature: "雷", lower_nature: "雷",
      structure: "重雷驚天，臨危不懼", core_theme: "震驚百里，戒慎恐懼，笑言啞啞",
      judgment: "震：亨。震來虩虩，笑言啞啞。震驚百里，不喪匕鬯。",
      judgment_vernacular: "震卦象徵震動與警醒。雷聲連綿而來。起初令人驚恐恐懼，隨後處之泰然談笑自若。雷聲震驚百里，祭祀者神色自若未灑酒勺。",
      image_text: "洊雷，震；君子以恐懼脩省。",
      tuan_zhuan: "震，亨。震來虩虩，恐致福也。笑言啞啞，後有則也。震驚百里，驚遠而懼邇也。出可以守宗廟社稷，以為祭主也。",
      takashima_summary: "《高島易斷》：突發變故，雷聲大雨點小。面對巨大震盪切莫慌亂，冷靜沉著應對，反思修省可化凶為吉。",
      takashima_case: "占突發大地震與火災救災：得震卦初九，震來虩虩後笑言啞啞吉。斷曰：初起驚心動魄，但處置得宜救災迅速，損失得以有效控制。",
      modern_action: "建立高強度的災備容災機制。面對外界突發公關或突發事件，保持最高冷靜指揮若定。"
    },
    {
      id: 52, name: "艮", full_name: "艮為山", pinyin: "Gèn", binary_code: "001001",
      upper_trigram: "艮", lower_trigram: "艮", upper_nature: "山", lower_nature: "山",
      structure: "重重山岳，適時而止", core_theme: "動靜適時，止其所止，內心澄靜",
      judgment: "艮：艮其背，不獲其身，行其庭，不見其人，無咎。",
      judgment_vernacular: "艮卦象徵靜止與適可而止。群山重疊巍然不動。止於背後不執著於自身，穿行庭院不旁騖他人，心無雜念無所咎害。",
      image_text: "兼山，艮；君子以思不出其位。",
      tuan_zhuan: "艮，止也。時止則止，時行則行，動靜不失其時，其道光明。艮其止，止其所也。",
      takashima_summary: "《高島易斷》：知止不殆。當停則停，不可勉強妄進。守住本分與邊界，讓喧囂的心靈回歸平靜沉著。",
      takashima_case: "占過熱股市是否繼續追高：得艮卦九三，艮其限列其夤厲薰心。斷曰：行情已達頂峰高處不勝寒，應立即獲利了結退場觀望。",
      modern_action: "嚴格設定止損點與邊界。專注核心職責，拒絕盲目跨界追逐熱點，靜心打磨基本功。"
    },
    {
      id: 53, name: "漸", full_name: "風山漸", pinyin: "Jiàn", binary_code: "001110",
      upper_trigram: "巽", lower_trigram: "艮", upper_nature: "風", lower_nature: "山",
      structure: "山上生木，循序漸進", core_theme: "鴻鵠漸進，遵循禮序，按部就班",
      judgment: "漸：女歸吉，利貞。",
      judgment_vernacular: "漸卦象徵循序漸進。山上樹木隨歲月慢慢茁壯。如同女子出嫁遵循六禮步步到位，大吉，利於堅守正道。",
      image_text: "山上有木，漸；君子以居賢德，善俗。",
      tuan_zhuan: "漸之進也，女歸吉也。進得位，往有功也。進以正，可以正邦也。其位剛，得中也。止而巽，動不窮也。",
      takashima_summary: "《高島易斷》：漸進之吉。如鴻雁南飛井然有序，不可跨越常規急功近利。只要遵循規律穩步向前，必獲持久之成功。",
      takashima_case: "占青年創業拓展事業：得漸卦九五，鴻漸于陵婦三歲不孕終莫之勝吉。斷曰：雖進程稍慢初期看似無成，但堅持三年必成大業。",
      modern_action: "制定清晰的中長期路線圖。不跳步、不走偏門，扎實完成每個里程碑節點。"
    },
    {
      id: 54, name: "歸妹", full_name: "雷澤歸妹", pinyin: "Guī Mèi", binary_code: "011100",
      upper_trigram: "震", lower_trigram: "兌", upper_nature: "雷", lower_nature: "澤",
      structure: "澤上有雷，少女妄動", core_theme: "急躁結合，名分未正，防終有憾",
      judgment: "歸妹：征凶，無攸利。",
      judgment_vernacular: "歸妹卦象徵女子出嫁與急躁結合。澤上雷動，少女追隨長男動情。以感情衝動凌駕禮法，前進必遭凶險，無所利益。",
      image_text: "澤上有雷，歸妹；君子以永終知敝。",
      tuan_zhuan: "歸妹，天地之大義也。天地不交，而萬物不興。歸妹，人之終始也。說以動，所歸妹也。征凶，位不當也。",
      takashima_summary: "《高島易斷》：名不正言不順。因一時情感或利益誘惑而匆促合夥簽約，後患無窮，終必破裂。",
      takashima_case: "占匆促兼併收購案：得歸妹初九，歸妹以娣跛能履征吉。斷曰：此收購案缺陷甚多，若非得進行，只宜做次要輔助投資。",
      modern_action: "嚴審未經充分評估的併購、簽約或合作提案。切勿因眼前虛名或衝動承諾做出非理性決策。"
    },
    {
      id: 55, name: "豐", full_name: "雷火豐", pinyin: "Fēng", binary_code: "101100",
      upper_trigram: "震", lower_trigram: "離", upper_nature: "雷", lower_nature: "火",
      structure: "雷電交加，盛大豐盈", core_theme: "日中則昃，盛極巔峰，明以動之",
      judgment: "豐：亨，王假之，勿憂，宜日中。",
      judgment_vernacular: "豐卦象徵盛大豐盛。雷電交加聲勢磅礡。亨通，君王親臨盛會，無須憂慮，應當如日正當中般普照天下。",
      image_text: "雷電皆至，豐；君子以折獄致刑。",
      tuan_zhuan: "豐，大也。明以動，故豐。王假之，尚大也。勿憂宜日中，宜照天下也。日中則昃，月盈則食，天地盈虛，與時消息。",
      takashima_summary: "《高島易斷》：如日中天之極盛。然而太陽過午即偏斜，極盛之時當戒奢防驕，及早為轉折點做好布局。",
      takashima_case: "占企業獲利創歷史新高：得豐卦六五，來章有慶譽吉。斷曰：當前為利潤巔峰，宜重賞有功之臣，並撥款建立防禦儲備金。",
      modern_action: "在業績與流量處於巔峰時，積極拓展第二成長曲線。善待團隊夥伴，不盲目膨脹開支。"
    },
    {
      id: 56, name: "旅", full_name: "火山旅", pinyin: "Lǚ", binary_code: "001101",
      upper_trigram: "離", lower_trigram: "艮", upper_nature: "火", lower_nature: "山",
      structure: "山上有火，異鄉羈旅", core_theme: "羈旅漂泊，居安思危，謙遜守正",
      judgment: "旅：小亨，旅貞吉。",
      judgment_vernacular: "旅卦象徵旅行與羈旅。山上有火蔓延不留。客居異鄉小有亨通，持守端正獲吉。出門在外應謙和謹慎、不惹事端。",
      image_text: "山上有火，旅；君子以明慎用刑，而不留獄。",
      tuan_zhuan: "旅，小亨，柔得中乎外，而順乎剛，止而麗乎明，是以小亨旅貞吉也。旅之時義大矣哉！",
      takashima_summary: "《高島易斷》：離鄉背井如浮萍。寄人籬下宜低調內斂，不可揮霍或自視甚高，以防遭遇無妄之災。",
      takashima_case: "占海外派駐拓展新市場：得旅卦九四，旅于處得其資斧我心不快。斷曰：海外雖有居所與資金，但環境孤立，需步步為營防範盜賊。",
      modern_action: "在新市場或陌生領域探索時，嚴格遵守當地法規與文化習俗。保持精簡靈活，隨時應變。"
    },
    {
      id: 57, name: "巽", full_name: "巽為風", pinyin: "Xùn", binary_code: "011011",
      upper_trigram: "巽", lower_trigram: "巽", upper_nature: "風", lower_nature: "風",
      structure: "隨風順入，無孔不入", core_theme: "謙遜順從，深入細緻，申命行事",
      judgment: "巽：小亨，利有攸往，利見大人。",
      judgment_vernacular: "巽卦象徵順應與滲透。微風相繼吹拂無微不至。小有亨通，利於有所作為，利於拜見德高望重之大人。",
      image_text: "隨風，巽；君子以申命行事。",
      tuan_zhuan: "重巽以申命，剛巽乎中正而志行。柔皆順乎剛，是以小亨，利有攸往，利見大人。",
      takashima_summary: "《高島易斷》：如春風化雨無孔不入。以柔克剛，善於體察人心，反覆宣導政策，細緻入微解決爭端。",
      takashima_case: "占推展新行銷策略深入基層：得巽卦九五，貞吉悔亡無不利無初有終先庚三日後庚三日吉。斷曰：反覆溝通宣導，終能全面普及深入市場。",
      modern_action: "採取潤物細無聲的精細化運營策略。注重細節與多輪反饋，透過反覆宣導凝聚共識。"
    },
    {
      id: 58, name: "兌", full_name: "兌為澤", pinyin: "Duì", binary_code: "110110",
      upper_trigram: "兌", lower_trigram: "兌", upper_nature: "澤", lower_nature: "澤",
      structure: "兩澤相依，和悅歡樂", core_theme: "喜悅和睦，朋友講習，心悅誠服",
      judgment: "兌：亨，利貞。",
      judgment_vernacular: "兌卦象徵喜悅與和樂。兩澤相連滋潤互惠。亨通順暢，利於持守正道。以真誠和悅態度待人，人皆樂於配合隨行。",
      image_text: "麗澤，兌；君子以朋友講習。",
      tuan_zhuan: "兌，說也。剛中而柔外，說以利貞，是以順乎天，而應乎人。說以先民，民忘其勞；說以犯難，民忘其死；說之大，民勸矣哉！",
      takashima_summary: "《高島易斷》：和顏悅色，以誠動人。同道好友切磋砥礪，使人心悅誠服。但切戒諂媚討好與沉溺酒色。",
      takashima_case: "占學術論壇與同行研討：得兌卦九二，孚兌吉悔亡。斷曰：以真誠學問交流，群賢畢至獲益匪淺，聲譽大振。",
      modern_action: "營造開放和睦的團隊溝通氛圍。透過同儕評審與研討會共同精進技術，強化用戶服務體驗。"
    },
    {
      id: 59, name: "渙", full_name: "風水渙", pinyin: "Huàn", binary_code: "010011",
      upper_trigram: "巽", lower_trigram: "坎", upper_nature: "風", lower_nature: "水",
      structure: "風行水上，渙散破冰", core_theme: "化解冰凍，凝聚人心，舟渡險川",
      judgment: "渙：亨。王假有廟，利涉大川，利貞。",
      judgment_vernacular: "渙卦象徵渙散與破冰。風吹水面漣漪化解凝滯。亨通，君王親臨宗廟凝聚人心，利於勇渡大川，利於持守正道。",
      image_text: "風行水上，渙；先王以享于上帝，立廟。",
      tuan_zhuan: "渙，亨。剛來而不窮，柔得位乎外而上同。王假有廟，王乃在中也。利涉大川，乘木有功也。",
      takashima_summary: "《高島易斷》：風吹冰解，人心渙散之際。唯有確立共同宏偉願景與信仰，方能重新集結散落之力量共渡難關。",
      takashima_case: "占搶救破產倒閉邊緣之企業：得渙卦九五，渙汗其大號渙王居無咎。斷曰：宣布重大改革宣言與股權激勵方案，人心大振起死回生。",
      modern_action: "面對團隊迷茫或士氣低落，重新宣示清晰的核心願景。打通阻塞流程，重聚團隊合力。"
    },
    {
      id: 60, name: "節", full_name: "水澤節", pinyin: "Jié", binary_code: "110010",
      upper_trigram: "坎", lower_trigram: "兌", upper_nature: "水", lower_nature: "澤",
      structure: "澤上有水，節制有度", core_theme: "節制適度，立定規矩，不可過苦",
      judgment: "節：亨。苦節不可貞。",
      judgment_vernacular: "節卦象徵節制與規格。水澤容納水量有限度。亨通。但過度嚴苛苦澀的節制無法長久維持，應當合情合理適度調節。",
      image_text: "澤上有水，節；君子以制數度，議德行。",
      tuan_zhuan: "節，亨，剛柔分，而剛得中。苦節不可貞，其道窮也。說以行險，當位以節，中正以通。",
      takashima_summary: "《高島易斷》：節約與規律乃成功之母。制定合理制度與預算，過猶不及。切莫苛刻對待員工以致離心離德。",
      takashima_case: "占企業編列年度預算：得節卦九五，甘節吉往有尚。斷曰：制定合情合理之激勵性預算，執行順暢人人稱便。",
      modern_action: "建立合理的代碼規範、預算控制與工時制度。在自律與彈性之間取得最佳平衡。"
    },
    {
      id: 61, name: "中孚", full_name: "風澤中孚", pinyin: "Zhōng Fú", binary_code: "110011",
      upper_trigram: "巽", lower_trigram: "兌", upper_nature: "風", lower_nature: "澤",
      structure: "澤上有風，心中誠信", core_theme: "內心赤誠，感通豚魚，信守承諾",
      judgment: "中孚：豚魚吉，利涉大川，利貞。",
      judgment_vernacular: "中孚卦象徵內心至誠。中虛外實如鳥孵卵。至誠之心連小豬小魚都能感化，大吉，利於勇渡大川，利於堅守正道。",
      image_text: "澤上有風，中孚；君子以議獄緩死。",
      tuan_zhuan: "中孚，柔在內而剛得中。說而巽，孚，乃化邦也。豚魚吉，信及豚魚也。利涉大川，乘木舟虛也。",
      takashima_summary: "《高島易斷》：誠信乃立身之本。以赤子之心待人，無絲毫虛偽欺詐。即便是頑固對手亦會被真誠打動歸順。",
      takashima_case: "占重大商務合約談判：得中孚九二，鳴鶴在陰其子和之我有好爵吾與爾靡之。斷曰：彼此心意相通，雙方皆抱至誠，合約必成且獲暴利。",
      modern_action: "在所有商業與技術合作中踐行最高透明度。兌現每一項對用戶的承諾，建立牢不可破的品牌信譽。"
    },
    {
      id: 62, name: "小過", full_name: "雷山小過", pinyin: "Xiǎo Guò", binary_code: "001100",
      upper_trigram: "震", lower_trigram: "艮", upper_nature: "雷", lower_nature: "山",
      structure: "山上有雷，小有過越", core_theme: "小事過度，行過於恭，宜下不宜上",
      judgment: "小過：亨，利貞，可小事，不可大事。飛鳥遺之音，不宜上，宜下，大吉。",
      judgment_vernacular: "小過卦象徵微小的超過。四陰在外兩陽在內如飛鳥展翅。只宜做小事不宜做大事。如飛鳥留下啼聲，宜低飛降落不宜高飛，大吉。",
      image_text: "山上有雷，小過；君子以行過乎恭，喪過乎哀，用過乎儉。",
      tuan_zhuan: "小過，小者過而亨也。過以利貞，與時行也。柔得中，是以小事吉也。剛失位而不中，是以不可大事也。",
      takashima_summary: "《高島易斷》：處事寧可過於謹慎謙恭、過於節儉。不可好高騖遠強求大事，專注把手邊微小細節做到極致。",
      takashima_case: "占簽訂大額採購合約：得小過六二，過其祖遇其妣不及其君遇其臣無咎。斷曰：此時不可強行跨級爭取，先做好底層基層對接方得穩妥。",
      modern_action: "保持過度的謹慎與謙遜。加倍進行單元測試與安全檢查，暫緩激進的大型重構。"
    },
    {
      id: 63, name: "既濟", full_name: "水火既濟", pinyin: "Jì Jì", binary_code: "101010",
      upper_trigram: "坎", lower_trigram: "離", upper_nature: "水", lower_nature: "火",
      structure: "水在火上，大功告成", core_theme: "陰陽皆正，圓滿完成，防初吉終亂",
      judgment: "既濟：亨，小利貞，初吉終亂。",
      judgment_vernacular: "既濟卦象徵大功告成與事已完成。水火相濟各當其位。亨通，小事利於持正。起初吉祥但若鬆懈怠慢終將陷入混亂。",
      image_text: "水在火上，既濟；君子以思患而預防之。",
      tuan_zhuan: "既濟，亨，小者亨也。利貞，剛柔正而位當也。初吉，柔得中也。終止則亂，其道窮也。",
      takashima_summary: "《高島易斷》：六爻皆得其位，至為完美。然而物極必反，成功之時正是危機萌生之刻，必須防患於未然。",
      takashima_case: "占大型工程竣工驗收：得既濟初九，曳其輪濡其尾無咎。斷曰：雖然圓滿完工，但後續維護保養萬不可鬆懈，及早煞車防微杜漸。",
      modern_action: "專案順利交付後，立即制定嚴密的後期維護與監控預案。居安思危，防止因自滿導致系統故障。"
    },
    {
      id: 64, name: "未濟", full_name: "火水未濟", pinyin: "Wèi Jì", binary_code: "010101",
      upper_trigram: "離", lower_trigram: "坎", upper_nature: "火", lower_nature: "水",
      structure: "火在水上，未完待續", core_theme: "事未完成，生生不息，希望在前",
      judgment: "未濟：亨，小狐汔濟，濡其尾，無攸利。",
      judgment_vernacular: "未濟卦象徵尚未完成與全新開端。火在水上未能交融。亨通。小狐狸渡河快到彼岸卻沾濕了尾巴，無所利益。慎始敬終方能成功。",
      image_text: "火在水上，未濟；君子以慎辨物居方。",
      tuan_zhuan: "未濟，亨；柔得中也。小狐汔濟，未出中也。濡其尾無攸利，不續終也。雖不當位，剛柔應也。",
      takashima_summary: "《高島易斷》：六十四卦之終亦為新循環之始。事雖未竟但生機無限，唯有保持審慎、堅定信念，方能抵達光輝彼岸。",
      takashima_case: "占明治維新後續改革願景：得未濟九二，曳其輪貞吉。斷曰：改革大業尚未完全鞏固，需像拉住車輪般穩步前行，前景無量。",
      modern_action: "將當前的結束視為全新循環的起點。總結經驗教訓，重新梳理架構，滿懷希望開啟下一階段旅途。"
    }
  ];

  // 爻辭查詢輔助函式
  function getHexagramLineDetail(hexId, linePos) {
    const hex = HEXAGRAMS.find(h => h.id === hexId) || HEXAGRAMS[0];
    const bit = hex.binary_code[linePos - 1];
    const isYang = bit === '1';
    const posNames = ["初", "二", "三", "四", "五", "上"];
    const posPrefix = posNames[linePos - 1];
    const lineName = linePos === 1 ? (isYang ? "初九" : "初六") :
                     linePos === 6 ? (isYang ? "上九" : "上六") :
                     (isYang ? `九${posPrefix}` : `六${posPrefix}`);

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

  // =========================================================================
  // 2. 8-Bit Web Audio 音效合成器
  // =========================================================================
  class RetroAudioEngine {
    constructor() {
      this.ctx = null;
      this.muted = false;
    }

    initContext() {
      if (!this.ctx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) this.ctx = new AudioContext();
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    toggleMute() {
      this.muted = !this.muted;
      return this.muted;
    }

    playClick() {
      if (this.muted) return;
      this.initContext();
      if (!this.ctx) return;
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(880, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(440, this.ctx.currentTime + 0.04);
        gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.04);
      } catch (e) {}
    }

    playCoinToss() {
      if (this.muted) return;
      this.initContext();
      if (!this.ctx) return;
      try {
        [1200, 1600, 2400].forEach((freq, idx) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq + Math.random() * 200, this.ctx.currentTime + idx * 0.04);
          osc.frequency.exponentialRampToValueAtTime(freq * 0.5, this.ctx.currentTime + idx * 0.04 + 0.1);
          gain.gain.setValueAtTime(0.12, this.ctx.currentTime + idx * 0.04);
          gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.04 + 0.12);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(this.ctx.currentTime + idx * 0.04);
          osc.stop(this.ctx.currentTime + idx * 0.04 + 0.12);
        });
      } catch (e) {}
    }

    playCardFlip() {
      if (this.muted) return;
      this.initContext();
      if (!this.ctx) return;
      try {
        [220, 330, 440, 550, 660, 880].forEach((freq, i) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(freq, this.ctx.currentTime + i * 0.05);
          gain.gain.setValueAtTime(0.08, this.ctx.currentTime + i * 0.05);
          gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + (i + 1) * 0.05);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(this.ctx.currentTime + i * 0.05);
          osc.stop(this.ctx.currentTime + (i + 1) * 0.05);
        });
      } catch (e) {}
    }

    playDivinationChime() {
      if (this.muted) return;
      this.initContext();
      if (!this.ctx) return;
      try {
        [330, 440, 660, 880, 1320].forEach((freq, i) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, this.ctx.currentTime + i * 0.08);
          gain.gain.setValueAtTime(0.12, this.ctx.currentTime + i * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + i * 0.08 + 1.0);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(this.ctx.currentTime + i * 0.08);
          osc.stop(this.ctx.currentTime + i * 0.08 + 1.0);
        });
      } catch (e) {}
    }

    playSuccess() {
      if (this.muted) return;
      this.initContext();
      if (!this.ctx) return;
      try {
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'square';
          osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.07);
          gain.gain.setValueAtTime(0.1, this.ctx.currentTime + idx * 0.07);
          gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.07 + 0.16);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(this.ctx.currentTime + idx * 0.07);
          osc.stop(this.ctx.currentTime + idx * 0.07 + 0.16);
        });
      } catch (e) {}
    }

    playError() {
      if (this.muted) return;
      this.initContext();
      if (!this.ctx) return;
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(160, this.ctx.currentTime);
        osc.frequency.setValueAtTime(110, this.ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.22);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.22);
      } catch (e) {}
    }
  }

  const sound = new RetroAudioEngine();

  // =========================================================================
  // 3. 占卜運算引擎 (I Ching Engine)
  // =========================================================================
  function castSingleLineCoins() {
    const coins = [
      Math.random() < 0.5 ? 2 : 3,
      Math.random() < 0.5 ? 2 : 3,
      Math.random() < 0.5 ? 2 : 3
    ];
    const sum = coins[0] + coins[1] + coins[2];
    let initialBit, changedBit, name, isMoving, nature;

    switch (sum) {
      case 6:
        initialBit = '0'; changedBit = '1'; name = '老陰 (⚋ 變 ⚊)'; nature = '老陰'; isMoving = true; break;
      case 7:
        initialBit = '1'; changedBit = '1'; name = '少陽 (⚊)'; nature = '少陽'; isMoving = false; break;
      case 8:
        initialBit = '0'; changedBit = '0'; name = '少陰 (⚋)'; nature = '少陰'; isMoving = false; break;
      case 9:
        initialBit = '1'; changedBit = '0'; name = '老陽 (⚊ 變 ⚋)'; nature = '老陽'; isMoving = true; break;
      default:
        initialBit = '1'; changedBit = '1'; name = '少陽'; nature = '少陽'; isMoving = false;
    }

    return { coins, sum, nature, initialBit, changedBit, isMoving, name };
  }

  function findHexagramByBinary(binaryStr) {
    return HEXAGRAMS.find(h => h.binary_code === binaryStr) || HEXAGRAMS[0];
  }

  function interpretZhuXiRules(primaryHex, changedHex, movingPositions) {
    const count = movingPositions.length;
    let ruleTitle = "", ruleSummary = "", focusNote = "", keyTexts = [];

    switch (count) {
      case 0:
        ruleTitle = "六爻皆靜（無動爻）";
        ruleSummary = "以【本卦卦辭】為主斷，審視當前大局態勢與宏觀走向。";
        focusNote = "目前事物處於平穩發展階段，無突發劇變，遵從本卦卦辭與大象傳心法即可。";
        keyTexts.push({ label: `本卦卦辭【${primaryHex.name}】`, text: primaryHex.judgment, vernacular: primaryHex.judgment_vernacular });
        break;

      case 1: {
        const pos = movingPositions[0];
        const lineDetail = getHexagramLineDetail(primaryHex.id, pos);
        ruleTitle = `一爻發動（第 ${pos} 爻動）`;
        ruleSummary = `以【本卦 ${lineDetail.name} 爻辭】為主斷，參看之卦【${changedHex.name}】作為未來趨勢。`;
        focusNote = `焦點鎖定在第 ${pos} 爻（${lineDetail.name}），此爻為事物轉變之關鍵樞紐。`;
        keyTexts.push({ label: `本卦動爻【${lineDetail.name}】`, text: lineDetail.text, vernacular: lineDetail.takashima_explanation });
        break;
      }

      case 2: {
        const pos1 = movingPositions[0];
        const pos2 = movingPositions[1];
        const lineDetail1 = getHexagramLineDetail(primaryHex.id, pos1);
        const lineDetail2 = getHexagramLineDetail(primaryHex.id, pos2);
        ruleTitle = `二爻發動（第 ${pos1}、${pos2} 爻動）`;
        ruleSummary = `以本卦二動爻爻辭合參，並以【居下位之 ${lineDetail1.name}】為主，【上位之 ${lineDetail2.name}】為輔。`;
        focusNote = `下爻代表根本基底，上爻代表未來延伸。優先解決下爻指出的問題。`;
        keyTexts.push({ label: `本卦主爻【${lineDetail1.name}】(主)`, text: lineDetail1.text, vernacular: lineDetail1.takashima_explanation });
        keyTexts.push({ label: `本卦輔爻【${lineDetail2.name}】(輔)`, text: lineDetail2.text, vernacular: lineDetail2.takashima_explanation });
        break;
      }

      case 3:
        ruleTitle = "三爻發動（半動半靜）";
        ruleSummary = `以【本卦卦辭】為體（佔60%），以【之卦卦辭】為用（佔40%）。`;
        focusNote = "形勢正處於重大轉折交替期，本卦代表現狀，之卦代表轉化後的未來趨勢。";
        keyTexts.push({ label: `本卦卦辭【${primaryHex.name}】(體·現狀)`, text: primaryHex.judgment, vernacular: primaryHex.judgment_vernacular });
        keyTexts.push({ label: `之卦卦辭【${changedHex.name}】(用·趨勢)`, text: changedHex.judgment, vernacular: changedHex.judgment_vernacular });
        break;

      case 4: {
        const staticPositions = [1, 2, 3, 4, 5, 6].filter(p => !movingPositions.includes(p));
        const pos1 = staticPositions[0] || 1;
        const lineDetail1 = getHexagramLineDetail(changedHex.id, pos1);
        ruleTitle = `四爻發動（之卦二靜爻）`;
        ruleSummary = `形勢劇變過半，以【之卦】之二不變爻斷，並以【居下位之 ${lineDetail1.name}】為主斷。`;
        focusNote = "變局已成定局，重心已轉移至之卦，關注之卦中未變的定海神針。";
        keyTexts.push({ label: `之卦主爻【${lineDetail1.name}】(主)`, text: lineDetail1.text, vernacular: lineDetail1.takashima_explanation });
        break;
      }

      case 5: {
        const staticPos = [1, 2, 3, 4, 5, 6].find(p => !movingPositions.includes(p)) || 1;
        const lineDetail = getHexagramLineDetail(changedHex.id, staticPos);
        ruleTitle = `五爻發動（之卦一靜爻）`;
        ruleSummary = `形勢幾乎全變，以【之卦 ${lineDetail.name} 不變爻】之辭為主斷。`;
        focusNote = `全局翻轉，唯有之卦第 ${staticPos} 爻是唯一的守衡之點。`;
        keyTexts.push({ label: `之卦不變爻【${lineDetail.name}】`, text: lineDetail.text, vernacular: lineDetail.takashima_explanation });
        break;
      }

      case 6:
        if (primaryHex.id === 1) {
          ruleTitle = "六爻全變（乾之坤）";
          ruleSummary = "乾卦六陽全動，以【用九：見群龍無首，吉】為主斷。";
          focusNote = "剛健至極轉為純柔，不爭首位、順應群體則大吉。";
          keyTexts.push({ label: "乾卦 用九", text: "用九：見群龍無首，吉。", vernacular: "剛柔並濟，群策群力而不獨攬大權，天下大和之象。" });
        } else if (primaryHex.id === 2) {
          ruleTitle = "六爻全變（坤之乾）";
          ruleSummary = "坤卦六陰全動，以【用六：利永貞】為主斷。";
          focusNote = "純柔至極轉為大剛，長久持守純正堅定之志向。";
          keyTexts.push({ label: "坤卦 用六", text: "用六：利永貞。", vernacular: "順應天命以獲善終，長久持守正道大吉。" });
        } else {
          ruleTitle = "六爻全變（乾坤之外）";
          ruleSummary = `六爻全動，舊局完全崩解重組，以【之卦卦辭【${changedHex.name}】】為主斷。`;
          focusNote = "徹底告別過去，進入全新卦象境界，全盤遵照之卦指引。";
          keyTexts.push({ label: `之卦卦辭【${changedHex.name}】`, text: changedHex.judgment, vernacular: changedHex.judgment_vernacular });
        }
        break;
    }

    return { movingCount: count, ruleTitle, ruleSummary, focusNote, keyTexts };
  }

  function buildDivinationReading(lines, question = "未定事項", category = "決策") {
    const primaryBinary = lines.map(l => l.initialBit).join('');
    const changedBinary = lines.map(l => l.changedBit).join('');
    const primaryHex = findHexagramByBinary(primaryBinary);
    const changedHex = findHexagramByBinary(changedBinary);

    const movingPositions = [];
    lines.forEach((line, index) => {
      if (line.isMoving) movingPositions.push(index + 1);
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

  function buildHexLinesHTML(binaryStr, movingPositions = []) {
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

  function showToast(msg) {
    const toast = document.getElementById('cyber-toast');
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2800);
  }

  // =========================================================================
  // 4. 簡易純 JS 像素 QRCode 繪製引擎
  // =========================================================================
  function renderFallbackPixelQR(text, canvas) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const size = 140;
    canvas.width = size;
    canvas.height = size;
    ctx.imageSmoothingEnabled = false;

    // 背景
    ctx.fillStyle = '#070b10';
    ctx.fillRect(0, 0, size, size);

    // 依據字串 Hash 繪製美觀之 8-bit 像素矩陣
    ctx.fillStyle = '#00ff66';
    const gridSize = 21;
    const pixelSize = Math.floor(size / (gridSize + 4));
    const offset = Math.floor((size - gridSize * pixelSize) / 2);

    // 定位角方塊 (Finder Patterns)
    function drawFinder(r0, c0) {
      for (let r = 0; r < 7; r++) {
        for (let c = 0; c < 7; c++) {
          if (r === 0 || r === 6 || c === 0 || c === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4)) {
            ctx.fillRect(offset + (c0 + c) * pixelSize, offset + (r0 + r) * pixelSize, pixelSize, pixelSize);
          }
        }
      }
    }
    drawFinder(0, 0);
    drawFinder(0, gridSize - 7);
    drawFinder(gridSize - 7, 0);

    // 填充偽隨機資料點
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = (hash << 5) - hash + text.charCodeAt(i);
      hash |= 0;
    }
    let seed = Math.abs(hash) + 12345;

    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        const inFinder = (r < 8 && c < 8) || (r < 8 && c >= gridSize - 8) || (r >= gridSize - 8 && c < 8);
        if (!inFinder) {
          seed = (seed * 9301 + 49297) % 233280;
          if (seed / 233280 > 0.48) {
            ctx.fillRect(offset + c * pixelSize, offset + r * pixelSize, pixelSize, pixelSize);
          }
        }
      }
    }
  }

  // =========================================================================
  // 5. 占卜模組 (Divination Manager - 支援速查卡與手風琴摺疊)
  // =========================================================================
  const divinationManager = {
    currentLines: [],
    currentCategory: '事業',
    isCasting: false,
    currentReading: null,

    init() {
      // 標籤選擇
      document.querySelectorAll('.category-chip').forEach(chip => {
        chip.addEventListener('click', () => {
          sound.playClick();
          document.querySelectorAll('.category-chip').forEach(c => c.classList.remove('active'));
          chip.classList.add('active');
          this.currentCategory = chip.getAttribute('data-cat') || '事業';
        });
      });

      // 熱門範例問題一鍵填入 (Quick Prompt Chips)
      document.querySelectorAll('.quick-prompt-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          sound.playClick();
          const qText = btn.getAttribute('data-q');
          const cat = btn.getAttribute('data-cat');
          const qInput = document.getElementById('divination-question-input');
          if (qInput && qText) qInput.value = qText;
          if (cat) {
            this.currentCategory = cat;
            document.querySelectorAll('.category-chip').forEach(c => {
              c.classList.toggle('active', c.getAttribute('data-cat') === cat);
            });
          }
          showToast(`⚡ 已帶入占問：${btn.textContent}`);
        });
      });

      // 投擲單爻
      const btnCast = document.getElementById('btn-cast-single-line');
      if (btnCast) {
        btnCast.addEventListener('click', () => this.handleStepCast());
      }

      // 量子起卦
      const btnQuick = document.getElementById('btn-quick-quantum-cast');
      if (btnQuick) {
        btnQuick.addEventListener('click', () => this.handleQuickCast());
      }

      // 重設
      const btnReset = document.getElementById('btn-reset-divination');
      if (btnReset) {
        btnReset.addEventListener('click', () => this.resetDivination());
      }

      // 返回重新起卦按鈕 (Stage 2 -> Stage 1)
      const btnBack = document.getElementById('btn-back-to-cast');
      if (btnBack) {
        btnBack.addEventListener('click', () => {
          sound.playClick();
          this.showCastStage();
        });
      }

      // 卡牌翻轉
      const card = document.getElementById('divination-pixel-card');
      if (card) {
        card.addEventListener('click', () => {
          sound.playCardFlip();
          card.classList.toggle('flipped');
        });
      }
    },

    showCastStage() {
      const castStage = document.getElementById('divination-stage-cast');
      const resultStage = document.getElementById('divination-stage-result');
      if (castStage) castStage.style.display = 'block';
      if (resultStage) resultStage.style.display = 'none';
      this.resetDivination();
    },

    showResultStage() {
      const castStage = document.getElementById('divination-stage-cast');
      const resultStage = document.getElementById('divination-stage-result');
      if (castStage) castStage.style.display = 'none';
      if (resultStage) {
        resultStage.style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },

    handleStepCast() {
      if (this.isCasting || this.currentLines.length >= 6) return;
      this.isCasting = true;
      sound.playCoinToss();

      document.querySelectorAll('.pixel-coin').forEach(c => {
        c.classList.add('spinning');
        setTimeout(() => c.classList.remove('spinning'), 350);
      });

      setTimeout(() => {
        const lineResult = castSingleLineCoins();
        this.currentLines.push(lineResult);
        this.updateCoinDisplay(lineResult);
        this.updateProgressBar(this.currentLines.length);
        this.renderIntermediateLines();

        if (this.currentLines.length === 6) {
          setTimeout(() => this.completeDivination(), 300);
        }
        this.isCasting = false;
      }, 400);
    },

    handleQuickCast() {
      if (this.isCasting) return;
      this.resetDivination();
      this.isCasting = true;
      sound.playCoinToss();

      for (let i = 0; i < 6; i++) {
        this.currentLines.push(castSingleLineCoins());
      }

      setTimeout(() => {
        this.updateProgressBar(6);
        this.completeDivination();
        this.isCasting = false;
      }, 450);
    },

    completeDivination() {
      sound.playDivinationChime();
      const qInput = document.getElementById('divination-question-input');
      const question = (qInput ? qInput.value : '').trim() || "天下事問機緣";
      const reading = buildDivinationReading(this.currentLines, question, this.currentCategory);
      this.currentReading = reading;

      this.renderPixelCard(reading);
      this.renderDuoDisplay(reading);
      this.renderReport(reading);
      shareManager.updateReading(reading);

      // 切換到獨立占斷結果頁面
      this.showResultStage();
    },

    renderPixelCard(reading) {
      const card = document.getElementById('divination-pixel-card');
      if (!card) return;
      const titleEl = card.querySelector('.card-hex-title');
      const trigramEl = card.querySelector('.card-hex-trigrams');
      const themeEl = card.querySelector('.card-hex-theme');
      const badgeEl = card.querySelector('.card-binary-badge');
      const visualContainer = card.querySelector('.hexagram-visual-container');

      if (titleEl) titleEl.textContent = `${reading.primaryHex.id}. ${reading.primaryHex.full_name}`;
      if (trigramEl) trigramEl.textContent = `上${reading.primaryHex.upper_trigram}${reading.primaryHex.upper_nature} · 下${reading.primaryHex.lower_trigram}${reading.primaryHex.lower_nature}`;
      if (themeEl) themeEl.textContent = reading.primaryHex.core_theme;
      if (badgeEl) badgeEl.textContent = `BIN: ${reading.primaryHex.binary_code}`;
      if (visualContainer) visualContainer.innerHTML = buildHexLinesHTML(reading.primaryHex.binary_code, reading.movingPositions);

      setTimeout(() => card.classList.add('flipped'), 200);
    },

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
            ${buildHexLinesHTML(reading.primaryHex.binary_code, reading.movingPositions)}
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
            ${buildHexLinesHTML(reading.changedHex.binary_code, [])}
          </div>
          <div class="hex-box-name">${reading.changedHex.full_name}</div>
          <div class="hex-box-sub">${reading.changedHex.structure}</div>
        `;
      }
    },

    renderReport(reading) {
      const reportEl = document.getElementById('reading-hierarchical-report');
      if (!reportEl) return;

      let keyTextsHtml = '';
      reading.zhuXi.keyTexts.forEach(kt => {
        keyTextsHtml += `
          <div class="takashima-box" style="border-left: 3px solid var(--crt-cyan); margin-top: 10px;">
            <div style="font-weight: bold; color: var(--crt-cyan); margin-bottom: 4px;">${kt.label}</div>
            <div style="color: #fff; margin-bottom: 6px; font-family: var(--font-terminal); font-size: 17px;">${kt.text}</div>
            <div style="color: #9eb6cb; font-size: 13px;">${kt.vernacular}</div>
          </div>
        `;
      });

      // 卦象診斷速查摘要
      const movingDesc = reading.movingPositions.length > 0 
        ? `動爻在第 <span class="oracle-summary-highlight">${reading.movingPositions.join(', ')}</span> 爻` 
        : `<span class="oracle-summary-highlight">六爻皆靜</span>`;

      reportEl.innerHTML = `
        <!-- 頂部卦象診斷速查卡 (Oracle Summary Box) -->
        <div class="oracle-summary-box">
          <div class="oracle-summary-title"><span>🔮</span> [ 卦象鑑定速查 // ORACLE SUMMARY ]</div>
          <div class="oracle-summary-content">
            <div><strong>占問：</strong>${reading.question} <span style="color: var(--crt-amber);">[${reading.category}]</span></div>
            <div style="margin-top: 4px;"><strong>格局：</strong>本卦【${reading.primaryHex.full_name}】 ➔ 之卦【${reading.changedHex.full_name}】 (${movingDesc})</div>
            <div style="margin-top: 6px; color: var(--crt-green); font-family: var(--font-terminal); font-size: 16px;">
              💡 核心方針：${reading.primaryHex.modern_action}
            </div>
          </div>
        </div>

        <!-- 手風琴 1: 朱熹動爻定則分析 (預設展開) -->
        <div class="accordion-item active">
          <div class="accordion-header">
            <span>⚙️ [ 朱熹動爻定則核心分析 ]</span>
            <span class="accordion-icon">▶</span>
          </div>
          <div class="accordion-body">
            <div class="zhuxi-focus-box" style="margin-top: 0;">
              <div class="zhuxi-rule-tag">${reading.zhuXi.ruleTitle}</div>
              <div class="zhuxi-focus-text"><strong>斷法指引：</strong>${reading.zhuXi.ruleSummary}</div>
              <div class="zhuxi-focus-text" style="color: var(--crt-text-dim); margin-top: 4px;"><strong>心法提示：</strong>${reading.zhuXi.focusNote}</div>
            </div>
            ${keyTextsHtml}
          </div>
        </div>

        <!-- 手風琴 2: 現代行動決策指引 (預設展開) -->
        <div class="accordion-item active">
          <div class="accordion-header">
            <span>🚀 [ 現代行動決策指引 (SOP) ]</span>
            <span class="accordion-icon">▶</span>
          </div>
          <div class="accordion-body">
            <div class="modern-action-box" style="margin-top: 0;">
              <strong>【針對 ${reading.category} 決策行動】：</strong>
              ${reading.primaryHex.modern_action}
            </div>
          </div>
        </div>

        <!-- 手風琴 3: 本卦周易經傳精華 (可摺疊) -->
        <div class="accordion-item">
          <div class="accordion-header">
            <span>📜 [ 本卦周易經傳原文與白話 ]</span>
            <span class="accordion-icon">▶</span>
          </div>
          <div class="accordion-body">
            <div class="takashima-box" style="margin-top: 0;">
              <div style="color: var(--crt-green); font-weight: bold; margin-bottom: 4px;">【卦辭】 ${reading.primaryHex.judgment}</div>
              <div style="color: #c4d7e8; font-size: 14px; margin-bottom: 10px;">${reading.primaryHex.judgment_vernacular}</div>
              <div style="color: var(--crt-amber); font-weight: bold; margin-bottom: 4px;">【大象傳】 ${reading.primaryHex.image_text}</div>
              <div style="color: #9eb6cb; font-size: 13px;">${reading.primaryHex.tuan_zhuan}</div>
            </div>
          </div>
        </div>

        <!-- 手風琴 4: 高島易斷實戰精解 (可摺疊) -->
        <div class="accordion-item">
          <div class="accordion-header">
            <span>⚔️ [ 高島易斷實戰精解與明治占例 ]</span>
            <span class="accordion-icon">▶</span>
          </div>
          <div class="accordion-body">
            <div class="takashima-box" style="margin-top: 0;">
              <div class="takashima-quote">${reading.primaryHex.takashima_summary}</div>
              <div class="takashima-case-tag">明治歷史實戰占例</div>
              <div style="color: #a3c2de; font-size: 13px; line-height: 1.5;">${reading.primaryHex.takashima_case}</div>
            </div>
          </div>
        </div>
      `;

      // 綁定手風琴點擊展開/收合事件
      reportEl.querySelectorAll('.accordion-header').forEach(header => {
        header.addEventListener('click', () => {
          sound.playClick();
          const item = header.parentElement;
          if (item) item.classList.toggle('active');
        });
      });
    },

    updateCoinDisplay(lineResult) {
      const coins = document.querySelectorAll('.pixel-coin');
      if (coins.length >= 3 && lineResult.coins) {
        lineResult.coins.forEach((val, idx) => {
          const coinEl = coins[idx];
          coinEl.className = 'pixel-coin';
          coinEl.innerHTML = ''; // 純顏色代表，不顯示文字
          if (val === 3) {
            coinEl.classList.add('coin-heads');
            coinEl.title = '金幣 (陽·3)';
          } else {
            coinEl.classList.add('coin-tails');
            coinEl.title = '青銅幣 (陰·2)';
          }
        });
      }
      const logEl = document.getElementById('coin-toss-log-text');
      if (logEl) {
        const posName = ["初", "二", "三", "四", "五", "上"][this.currentLines.length - 1];
        const coinSides = lineResult.coins ? lineResult.coins.map(v => v === 3 ? "陽(3)" : "陰(2)").join('+') : "";
        logEl.textContent = `> 第 ${posName} 爻: [${coinSides}=${lineResult.sum}] ➔ ${lineResult.name}`;
      }
    },

    updateProgressBar(count) {
      const fill = document.getElementById('cast-progress-fill');
      const label = document.getElementById('cast-step-label');
      if (fill) fill.style.width = `${(count / 6) * 100}%`;
      if (label) label.textContent = `[ 起卦進度: ${count} / 6 爻 ]`;
    },

    renderIntermediateLines() {
      const stage = document.getElementById('intermediate-lines-visual');
      if (!stage) return;
      const binary = this.currentLines.map(l => l.initialBit).join('');
      const moving = [];
      this.currentLines.forEach((l, i) => {
        if (l.isMoving) moving.push(i + 1);
      });
      stage.innerHTML = buildHexLinesHTML(binary.padEnd(6, '0'), moving);
    },

    resetDivination() {
      this.currentLines = [];
      this.currentReading = null;
      this.isCasting = false;
      this.updateProgressBar(0);

      const logEl = document.getElementById('coin-toss-log-text');
      if (logEl) logEl.textContent = `> 等待起卦... 點擊 [ 投擲單爻 ] 或 [ 一鍵量子起卦 ]`;

      const stage = document.getElementById('intermediate-lines-visual');
      if (stage) stage.innerHTML = '';

      document.querySelectorAll('.pixel-coin').forEach(c => {
        c.className = 'pixel-coin coin-heads';
        c.innerHTML = '';
        c.title = '金幣 (陽·3)';
      });

      const castBtn = document.getElementById('btn-cast-single-line');
      if (castBtn) {
        castBtn.disabled = false;
        castBtn.textContent = '🎲 投擲單爻';
      }

      const card = document.getElementById('divination-pixel-card');
      if (card) card.classList.remove('flipped');
    },

    loadFromParams(hexId, movingLinesStr, question, category) {
      const hex = HEXAGRAMS.find(h => h.id === parseInt(hexId)) || HEXAGRAMS[0];
      const movingPositions = movingLinesStr ? movingLinesStr.split(',').map(n => parseInt(n)).filter(n => !isNaN(n) && n >= 1 && n <= 6) : [];

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

      document.querySelectorAll('.category-chip').forEach(c => {
        if (c.getAttribute('data-cat') === this.currentCategory) c.classList.add('active');
        else c.classList.remove('active');
      });

      this.updateProgressBar(6);
      this.completeDivination();
    }
  };

  // =========================================================================
  // 6. 學習學院抽認卡模組 (Flashcard Manager)
  // =========================================================================
  const flashcardManager = {
    currentMode: 'A',
    currentHex: null,
    isAnswered: false,
    stats: { totalAnswered: 0, correctCount: 0, currentStreak: 0, maxStreak: 0, errorHexIds: [] },
    isErrorReviewMode: false,

    init() {
      try {
        const saved = localStorage.getItem('cyber_iching_stats_v2');
        if (saved) this.stats = Object.assign(this.stats, JSON.parse(saved));
      } catch (e) {}

      // 模式 A 按鈕
      const btnA = document.getElementById('btn-mode-a');
      if (btnA) {
        btnA.addEventListener('click', () => {
          sound.playClick();
          this.currentMode = 'A';
          btnA.classList.add('active');
          const btnB = document.getElementById('btn-mode-b');
          if (btnB) btnB.classList.remove('active');
          this.nextQuestion();
        });
      }

      // 模式 B 按鈕
      const btnB = document.getElementById('btn-mode-b');
      if (btnB) {
        btnB.addEventListener('click', () => {
          sound.playClick();
          this.currentMode = 'B';
          btnB.classList.add('active');
          if (btnA) btnA.classList.remove('active');
          this.nextQuestion();
        });
      }

      // 錯題本切換
      const errBtn = document.getElementById('btn-toggle-error-mode');
      if (errBtn) {
        errBtn.addEventListener('click', () => {
          sound.playClick();
          this.isErrorReviewMode = !this.isErrorReviewMode;
          if (this.isErrorReviewMode) {
            if (this.stats.errorHexIds.length === 0) {
              showToast("目前無錯題紀錄！已為您抽考全題庫。");
              this.isErrorReviewMode = false;
              errBtn.classList.remove('active');
            } else {
              errBtn.classList.add('active');
              errBtn.textContent = `⚡ 錯題複習中 (${this.stats.errorHexIds.length}題)`;
              this.nextQuestion();
            }
          } else {
            errBtn.classList.remove('active');
            errBtn.textContent = `📚 錯題本 (${this.stats.errorHexIds.length})`;
            this.nextQuestion();
          }
        });
      }

      // 下一題
      const nextBtn = document.getElementById('btn-next-flashcard');
      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          sound.playClick();
          this.nextQuestion();
        });
      }

      // 抽認卡翻牌
      const card = document.getElementById('flashcard-pixel-card');
      if (card) {
        card.addEventListener('click', () => {
          sound.playCardFlip();
          card.classList.toggle('flipped');
        });
      }

      // 口訣 1：朱熹八卦取象歌 展開/收合
      const baguaHeader = document.getElementById('header-bagua-song');
      const baguaItem = document.getElementById('accordion-bagua-song');
      if (baguaHeader && baguaItem) {
        baguaHeader.addEventListener('click', () => {
          sound.playClick();
          baguaItem.classList.toggle('active');
          const icon = baguaHeader.querySelector('.mnemonic-toggle-icon');
          if (icon) {
            icon.textContent = baguaItem.classList.contains('active') ? '▼ 點擊收合' : '▶ 點擊展開';
          }
        });
      }

      // 口訣 2：朱熹64卦卦序歌 展開/收合
      const guaxuHeader = document.getElementById('header-guaxu-song');
      const guaxuItem = document.getElementById('accordion-guaxu-song');
      if (guaxuHeader && guaxuItem) {
        guaxuHeader.addEventListener('click', () => {
          sound.playClick();
          guaxuItem.classList.toggle('active');
          const icon = guaxuHeader.querySelector('.mnemonic-toggle-icon');
          if (icon) {
            icon.textContent = guaxuItem.classList.contains('active') ? '▼ 點擊收合' : '▶ 點擊展開';
          }
        });
      }

      // 重設統計
      const resetBtn = document.getElementById('btn-reset-academy-stats');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          if (confirm("確定要重設學習統計與錯題本嗎？")) {
            this.stats = { totalAnswered: 0, correctCount: 0, currentStreak: 0, maxStreak: 0, errorHexIds: [] };
            try { localStorage.setItem('cyber_iching_stats_v2', JSON.stringify(this.stats)); } catch (e) {}
            this.updateStatsUI();
            showToast("學習統計已重設。");
          }
        });
      }

      this.updateStatsUI();
      this.nextQuestion();
    },

    nextQuestion() {
      this.isAnswered = false;
      const card = document.getElementById('flashcard-pixel-card');
      if (card) card.classList.remove('flipped');

      let pool = HEXAGRAMS;
      if (this.isErrorReviewMode && this.stats.errorHexIds.length > 0) {
        pool = HEXAGRAMS.filter(h => this.stats.errorHexIds.includes(h.id));
        if (pool.length === 0) pool = HEXAGRAMS;
      }

      const randomIndex = Math.floor(Math.random() * pool.length);
      this.currentHex = pool[randomIndex];

      this.renderQuestionCard();
      this.renderQuizOptions();
    },

    renderQuestionCard() {
      const card = document.getElementById('flashcard-pixel-card');
      if (!card || !this.currentHex) return;
      const hex = this.currentHex;

      const frontTitle = card.querySelector('.card-front .card-hex-title');
      const frontTrigrams = card.querySelector('.card-front .card-hex-trigrams');
      const frontTheme = card.querySelector('.card-front .card-hex-theme');
      const frontBadge = card.querySelector('.card-front .card-binary-badge');
      const frontVisual = card.querySelector('.card-front .hexagram-visual-container');

      if (frontTitle) frontTitle.textContent = `${hex.id}. ${hex.full_name}`;
      if (frontTrigrams) frontTrigrams.textContent = `上${hex.upper_trigram}${hex.upper_nature} · 下${hex.lower_trigram}${hex.lower_nature} (${hex.structure})`;
      if (frontTheme) frontTheme.textContent = `【核心心法】${hex.core_theme}\n${hex.judgment_vernacular}`;
      if (frontBadge) frontBadge.textContent = `BIN: ${hex.binary_code}`;
      if (frontVisual) frontVisual.innerHTML = buildHexLinesHTML(hex.binary_code);

      const backContent = document.getElementById('flashcard-back-content');
      if (!backContent) return;

      if (this.currentMode === 'A') {
        backContent.innerHTML = `
          <div class="card-back-icon">🔮</div>
          <div class="card-back-title">? 這是哪一個卦象 ?</div>
          <div class="hexagram-visual-container" style="width: 100%; margin: 8px 0;">
            ${buildHexLinesHTML(hex.binary_code)}
          </div>
          <div class="card-back-hint">請在下方選擇卦名，或點擊翻牌查看詳解</div>
        `;
      } else {
        backContent.innerHTML = `
          <div class="card-back-icon">📜</div>
          <div class="card-back-title" style="font-size: 16px; color: #fff;">【 ${hex.full_name} 】</div>
          <div style="color: var(--crt-amber); font-family: var(--font-pixel-en); font-size: 10px;">第 ${hex.id} 卦 · ${hex.pinyin}</div>
          <div class="card-back-hint" style="margin-top: 14px;">請在腦海中回憶其 6 爻陰陽排列與上下八卦結構</div>
          <div style="color: var(--crt-cyan); font-size: 11px; margin-top: 10px;">[ 點擊卡牌翻轉揭曉線條與心法 ]</div>
        `;
      }
    },

    renderQuizOptions() {
      const container = document.getElementById('quiz-options-container');
      if (!container || !this.currentHex) return;

      if (this.currentMode === 'B') {
        container.style.display = 'none';
        return;
      }

      container.style.display = 'grid';
      container.innerHTML = '';

      const distractors = [];
      const others = HEXAGRAMS.filter(h => h.id !== this.currentHex.id);
      while (distractors.length < 3) {
        const rand = others[Math.floor(Math.random() * others.length)];
        if (!distractors.some(d => d.id === rand.id)) distractors.push(rand);
      }

      const options = [this.currentHex, ...distractors];
      options.sort(() => Math.random() - 0.5);

      const letters = ['A', 'B', 'C', 'D'];
      options.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.className = 'quiz-opt-btn';
        btn.innerHTML = `<span style="color: var(--crt-cyan);">${letters[idx]}.</span> ${opt.full_name}`;
        btn.setAttribute('data-id', opt.id);
        btn.addEventListener('click', () => this.handleAnswer(opt.id, btn));
        container.appendChild(btn);
      });
    },

    handleAnswer(selectedId, btnElement) {
      if (this.isAnswered) return;
      this.isAnswered = true;
      this.stats.totalAnswered++;

      const isCorrect = selectedId === this.currentHex.id;
      if (isCorrect) {
        sound.playSuccess();
        btnElement.classList.add('correct');
        this.stats.correctCount++;
        this.stats.currentStreak++;
        if (this.stats.currentStreak > this.stats.maxStreak) this.stats.maxStreak = this.stats.currentStreak;
        this.stats.errorHexIds = this.stats.errorHexIds.filter(id => id !== this.currentHex.id);
        showToast(`✓ 正確！${this.currentHex.full_name} (${this.currentHex.core_theme})`);
      } else {
        sound.playError();
        btnElement.classList.add('wrong');
        this.stats.currentStreak = 0;

        document.querySelectorAll('.quiz-opt-btn').forEach(b => {
          if (parseInt(b.getAttribute('data-id')) === this.currentHex.id) b.classList.add('correct');
        });

        if (!this.stats.errorHexIds.includes(this.currentHex.id)) {
          this.stats.errorHexIds.push(this.currentHex.id);
        }

        showToast(`✗ 答錯了！提示：上${this.currentHex.upper_trigram}下${this.currentHex.lower_trigram} · 正解為【${this.currentHex.full_name}】`);
      }

      try { localStorage.setItem('cyber_iching_stats_v2', JSON.stringify(this.stats)); } catch (e) {}
      this.updateStatsUI();

      setTimeout(() => {
        const card = document.getElementById('flashcard-pixel-card');
        if (card) card.classList.add('flipped');
      }, 400);
    },

    updateStatsUI() {
      const streakEl = document.getElementById('stat-current-streak');
      const accuracyEl = document.getElementById('stat-accuracy-rate');
      const totalEl = document.getElementById('stat-total-answered');
      const errorCountEl = document.getElementById('error-notebook-count');
      const levelEl = document.getElementById('stat-mastery-level');

      if (streakEl) streakEl.textContent = `🔥 連勝: ${this.stats.currentStreak} (最高: ${this.stats.maxStreak})`;
      if (totalEl) totalEl.textContent = `題數: ${this.stats.totalAnswered}`;
      const accRate = this.stats.totalAnswered > 0 ? Math.round((this.stats.correctCount / this.stats.totalAnswered) * 100) : 100;
      if (accuracyEl) accuracyEl.textContent = `正確率: ${accRate}%`;
      if (errorCountEl) errorCountEl.textContent = this.stats.errorHexIds.length;

      // 修煉等級徽章 (Mastery Level System)
      if (levelEl) {
        if (this.stats.currentStreak >= 20) {
          levelEl.textContent = '👑 易道宗師 (LV.MAX)';
          levelEl.style.color = '#ffd700';
          levelEl.style.borderColor = '#ffd700';
        } else if (this.stats.currentStreak >= 10) {
          levelEl.textContent = '📜 易經專家 (LV.3)';
          levelEl.style.color = '#00f0ff';
          levelEl.style.borderColor = '#00f0ff';
        } else if (this.stats.currentStreak >= 5) {
          levelEl.textContent = '🔮 易卜術士 (LV.2)';
          levelEl.style.color = '#b084cc';
          levelEl.style.borderColor = '#b084cc';
        } else {
          levelEl.textContent = '🌱 易道學徒 (LV.1)';
          levelEl.style.color = '#00ff66';
          levelEl.style.borderColor = '#00ff66';
        }
      }
    }
  };

  // =========================================================================
  // 7. 64 卦全典資料庫模組 (Codex Manager - 支援八卦五行色彩體系)
  // =========================================================================
  const codexManager = {
    currentFilterTrigram: 'ALL',
    searchKeyword: '',

    init() {
      const searchInput = document.getElementById('codex-search-input');
      if (searchInput) {
        searchInput.addEventListener('input', (e) => {
          this.searchKeyword = e.target.value.trim().toLowerCase();
          this.renderCodexGrid();
        });
      }

      document.querySelectorAll('.codex-filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          sound.playClick();
          document.querySelectorAll('.codex-filter-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this.currentFilterTrigram = btn.getAttribute('data-trigram') || 'ALL';
          this.renderCodexGrid();
        });
      });

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
          if (e.target === modalOverlay) modalOverlay.style.display = 'none';
        });
      }

      this.renderCodexGrid();
    },

    getTrigramColorClass(trigName) {
      const map = {
        '乾': 'trig-tag-qian',
        '坤': 'trig-tag-kun',
        '坎': 'trig-tag-kan',
        '離': 'trig-tag-li',
        '震': 'trig-tag-zhen',
        '巽': 'trig-tag-xun',
        '艮': 'trig-tag-gen',
        '兌': 'trig-tag-dui'
      };
      return map[trigName] || '';
    },

    renderCodexGrid() {
      const grid = document.getElementById('codex-cards-grid');
      if (!grid) return;

      let list = HEXAGRAMS;
      if (this.currentFilterTrigram !== 'ALL') {
        list = list.filter(h => h.upper_trigram === this.currentFilterTrigram || h.lower_trigram === this.currentFilterTrigram);
      }
      if (this.searchKeyword) {
        const kw = this.searchKeyword;
        list = list.filter(h =>
          h.name.includes(kw) || h.full_name.includes(kw) || h.pinyin.toLowerCase().includes(kw) ||
          h.id.toString() === kw || h.binary_code.includes(kw) || h.core_theme.includes(kw) || h.judgment.includes(kw)
        );
      }

      grid.innerHTML = '';
      if (list.length === 0) {
        grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: var(--crt-text-dim); padding: 40px;">[ 查無符合卦象資料 ]</div>`;
        return;
      }

      list.forEach(hex => {
        const item = document.createElement('div');
        item.className = 'codex-card-item';
        
        const upperClass = this.getTrigramColorClass(hex.upper_trigram);
        const lowerClass = this.getTrigramColorClass(hex.lower_trigram);

        // 橫向圖文排版：左側精美 6 爻像素圖徽，右側五行八卦色彩標籤
        item.innerHTML = `
          <div class="codex-mini-badge" title="二進位: ${hex.binary_code}">
            ${this.getMiniHexBadgeHTML(hex.binary_code)}
          </div>
          <div class="codex-card-info">
            <div class="codex-item-number">NO.${String(hex.id).padStart(2, '0')}</div>
            <div class="codex-item-name">${hex.full_name}</div>
            <div class="codex-item-sub">
              <span class="trigram-chip ${upperClass}">上${hex.upper_trigram}${hex.upper_nature}</span>
              <span class="trigram-chip ${lowerClass}">下${hex.lower_trigram}${hex.lower_nature}</span>
            </div>
          </div>
        `;
        item.addEventListener('click', () => this.openHexDetailModal(hex));
        grid.appendChild(item);
      });
    },

    getMiniHexBadgeHTML(binaryStr) {
      let lines = '';
      for (let i = 5; i >= 0; i--) {
        const isYang = binaryStr[i] === '1';
        if (isYang) {
          lines += `<div class="codex-mini-line yang"></div>`;
        } else {
          lines += `<div class="codex-mini-line yin"><span></span><span></span></div>`;
        }
      }
      return lines;
    },

    openHexDetailModal(hex) {
      sound.playClick();
      const modal = document.getElementById('codex-detail-modal');
      const content = document.getElementById('codex-modal-content-body');
      if (!modal || !content) return;

      content.innerHTML = `
        <div style="display: flex; gap: 20px; flex-wrap: wrap; margin-bottom: 20px; align-items: center;">
          <div style="background: #090f16; border: 2px solid var(--crt-green); border-radius: 8px; padding: 14px; width: 140px;">
            <div class="hexagram-visual-container" style="margin: 0;">
              ${buildHexLinesHTML(hex.binary_code)}
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
  };

  // =========================================================================
  // 8. 社群分享模組 (Share Manager - 支援頂部硬體面板與彈窗分享)
  // =========================================================================
  const shareManager = {
    currentReading: null,
    qrCanvas: null,

    init() {
      this.qrCanvas = document.getElementById('qr-pixel-canvas');

      // 1. 頂部硬體面板分享按鈕 (CRT開關旁)
      const globalShareBtn = document.getElementById('btn-global-share');
      if (globalShareBtn) {
        globalShareBtn.addEventListener('click', () => {
          sound.playClick();
          this.openShareModal(false);
        });
      }

      // 2. 占斷結果頁頂部與側邊分享按鈕
      const openModalBtn = document.getElementById('btn-open-share-modal');
      if (openModalBtn) {
        openModalBtn.addEventListener('click', () => {
          sound.playClick();
          this.openShareModal(true);
        });
      }

      const sideShareBtn = document.getElementById('btn-side-share');
      if (sideShareBtn) {
        sideShareBtn.addEventListener('click', () => {
          sound.playClick();
          this.openShareModal(true);
        });
      }

      // 3. 關閉彈窗
      const closeBtn = document.getElementById('share-modal-close');
      const modal = document.getElementById('share-action-modal');
      if (closeBtn && modal) {
        closeBtn.addEventListener('click', () => {
          sound.playClick();
          modal.style.display = 'none';
        });
      }
      if (modal) {
        modal.addEventListener('click', (e) => {
          if (e.target === modal) {
            modal.style.display = 'none';
          }
        });
      }

      // 4. 彈窗內按鈕事件
      const modalCopyBtn = document.getElementById('btn-modal-copy-url');
      if (modalCopyBtn) {
        modalCopyBtn.addEventListener('click', () => this.copyShareUrl());
      }

      const shareLineBtn = document.getElementById('btn-share-line');
      if (shareLineBtn) shareLineBtn.addEventListener('click', () => this.shareLine());

      const shareFbBtn = document.getElementById('btn-share-fb');
      if (shareFbBtn) shareFbBtn.addEventListener('click', () => this.shareFacebook());

      const shareEmailBtn = document.getElementById('btn-share-email');
      if (shareEmailBtn) shareEmailBtn.addEventListener('click', () => this.shareEmail());

      const copyReportBtn = document.getElementById('btn-copy-ascii-report');
      if (copyReportBtn) copyReportBtn.addEventListener('click', () => this.copyAsciiReport());

      const downloadQrBtn = document.getElementById('btn-download-qr');
      if (downloadQrBtn) downloadQrBtn.addEventListener('click', () => this.downloadQrCode());
    },

    openShareModal(isReadingShare) {
      this.isReadingShare = !!isReadingShare;
      const modal = document.getElementById('share-action-modal');
      const heading = document.getElementById('share-modal-heading');
      const qrDesc = document.getElementById('share-qr-desc');
      const copyReportBtn = document.getElementById('btn-copy-ascii-report');
      if (!modal) return;

      let shareUrl = window.location.href.split('?')[0];
      if (this.isReadingShare && this.currentReading) {
        shareUrl = this.generateShareUrl(this.currentReading);
        if (heading) heading.textContent = `[ SHARE // 第 ${this.currentReading.primaryHex.id} 卦 ${this.currentReading.primaryHex.full_name} 專屬占斷 ]`;
        if (qrDesc) qrDesc.textContent = '手機直接掃描此二維碼，即可在行動裝置上自動還原此卦象與完整解讀！';
        if (copyReportBtn) copyReportBtn.style.display = 'block';
      } else {
        if (heading) heading.textContent = '[ SHARE_MATRIX // 賽博易斷系統網址分享 ]';
        if (qrDesc) qrDesc.textContent = '手機直接掃描此二維碼，即可隨時在行動裝置開啟賽博易斷 (CyberIChing) 系統！';
        if (copyReportBtn) copyReportBtn.style.display = 'none';
      }

      const urlDisplay = document.getElementById('share-url-text');
      if (urlDisplay) urlDisplay.textContent = shareUrl;

      if (this.qrCanvas) {
        renderFallbackPixelQR(shareUrl, this.qrCanvas);
      }

      modal.style.display = 'flex';
    },

    updateReading(reading) {
      this.currentReading = reading;
    },

    getSiteUrl() {
      return window.location.href.split('?')[0];
    },

    generateShareUrl(reading) {
      if (!reading) return this.getSiteUrl();
      const base = window.location.origin + window.location.pathname;
      const movingStr = (reading.movingPositions || []).join(',');
      const qStr = encodeURIComponent(reading.question || '');
      const catStr = encodeURIComponent(reading.category || '');
      return `${base}?hex=${reading.primaryHex.id}&lines=${movingStr}&q=${qStr}&cat=${catStr}`;
    },

    shareLine() {
      sound.playClick();
      let text = '';
      if (this.isReadingShare && this.currentReading) {
        const r = this.currentReading;
        const url = this.generateShareUrl(r);
        text = `【賽博易斷 CyberIChing 占斷報告】\n` +
          `問事：${r.question}（${r.category}）\n` +
          `卦象：本卦【${r.primaryHex.full_name}】` +
          (r.movingPositions.length > 0 ? ` ➔ 之卦【${r.changedHex.full_name}】` : '') + `\n` +
          `焦點斷語：${r.zhuXi.ruleSummary}\n` +
          `專屬占斷連結：${url}`;
      } else {
        const url = this.getSiteUrl();
        text = `【賽博易斷 CyberIChing】\n` +
          `結合《周易》古法、朱熹動爻定則與高島易斷占例的 8-Bit 像素占卜與學習系統！\n` +
          `立即開啟：${url}`;
      }
      window.open(`https://line.me/R/msg/text/?${encodeURIComponent(text)}`, '_blank');
    },

    shareFacebook() {
      sound.playClick();
      const url = (this.isReadingShare && this.currentReading) ? this.generateShareUrl(this.currentReading) : this.getSiteUrl();
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank', 'width=600,height=500');
    },

    shareEmail() {
      sound.playClick();
      if (this.isReadingShare && this.currentReading) {
        const r = this.currentReading;
        const url = this.generateShareUrl(r);
        const subject = `【賽博易斷占斷報告】${r.question} - ${r.primaryHex.full_name}`;
        const body = `【賽博易斷 CyberIChing 專屬占斷結果】\n\n` +
          `占問事項：${r.question} (${r.category})\n` +
          `本卦：${r.primaryHex.full_name}\n之卦：${r.changedHex.full_name}\n\n` +
          `【朱熹動爻分析】\n${r.zhuXi.ruleTitle} - ${r.zhuXi.ruleSummary}\n\n` +
          `【卦辭】\n${r.primaryHex.judgment}\n\n` +
          `【高島易斷】\n${r.primaryHex.takashima_summary}\n\n` +
          `【現代行動指引】\n${r.primaryHex.modern_action}\n\n` +
          `線上查看：${url}`;
        window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      } else {
        const url = this.getSiteUrl();
        const subject = `推薦一個很棒的易經占卜與學習系統：賽博易斷 CyberIChing`;
        const body = `推薦您試用「賽博易斷 CyberIChing」：\n\n` +
          `結合 8-Bit 像素復古介面、周易六十四卦、高島易斷占例與朱熹動爻定則的現代決策占卜系統！\n\n` +
          `線上體驗網址：${url}`;
        window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      }
    },

    copyShareUrl() {
      sound.playClick();
      const url = (this.isReadingShare && this.currentReading) ? this.generateShareUrl(this.currentReading) : this.getSiteUrl();
      navigator.clipboard.writeText(url).then(() => {
        showToast(this.isReadingShare ? "✓ 專屬占斷網址已複製至剪貼簿！" : "✓ 賽博易斷系統網址已複製至剪貼簿！");
      }).catch(() => showToast("複製失敗。"));
    },

    copyAsciiReport() {
      if (!this.currentReading) return;
      sound.playClick();
      const r = this.currentReading;
      const url = this.generateShareUrl(r);

      const getLineAscii = (isYang, isMoving) => {
        if (isYang) return isMoving ? " [ ⚊ ⚊ ⚊ ⚊ ⚊ ⚊ ] (○ 老陽動爻)" : " [ ⚊ ⚊ ⚊ ⚊ ⚊ ⚊ ]";
        else return isMoving ? " [ ⚊ ⚊     ⚊ ⚊ ] (✗ 老陰動爻)" : " [ ⚊ ⚊     ⚊ ⚊ ]";
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

[ 周易原文與白話 ]
> 卦辭: ${r.primaryHex.judgment}
> 白話: ${r.primaryHex.judgment_vernacular}

[ 高島易斷實戰精解 ]
> 斷語: ${r.primaryHex.takashima_summary}
> 占例: ${r.primaryHex.takashima_case}

[ 現代行動決策 SOP ]
> 指引: ${r.primaryHex.modern_action}
--------------------------------------------------------
> 線上驗證: ${url}
════════════════════════════════════════════════════════`;

      navigator.clipboard.writeText(report).then(() => {
        showToast("✓ ASCII 終端占斷報告已複製！");
      }).catch(() => showToast("複製失敗。"));
    },

    downloadQrCode() {
      if (!this.qrCanvas) return;
      sound.playClick();
      const link = document.createElement('a');
      link.download = `CyberIChing_${(this.isReadingShare && this.currentReading) ? 'Hex_' + this.currentReading.primaryHex.id : 'Site'}.png`;
      link.href = this.qrCanvas.toDataURL('image/png');
      link.click();
      showToast("✓ 像素 QRCode 圖片已下載！");
    }
  };

  // =========================================================================
  // 9. 主程式初始化 (App Lifecycle)
  // =========================================================================
  function initApp() {
    // 綁定頂部硬體面板控制鈕 (純圖示切換)
    const soundBtn = document.getElementById('btn-toggle-sound');
    const soundIcon = document.getElementById('sound-status-icon');
    if (soundBtn) {
      soundBtn.addEventListener('click', () => {
        const isMuted = sound.toggleMute();
        soundBtn.classList.toggle('active', !isMuted);
        if (soundIcon) soundIcon.textContent = isMuted ? '🔇' : '🔊';
        soundBtn.title = isMuted ? '開啟音效' : '關閉音效';
        if (!isMuted) sound.playClick();
      });
    }

    // 綁定分頁 Tab 切換
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetTabId = btn.getAttribute('data-tab');
        sound.playClick();

        tabButtons.forEach(b => b.classList.toggle('active', b === btn));
        tabPanes.forEach(p => p.classList.toggle('active', p.id === targetTabId));
      });
    });

    // 初始化各子模組
    divinationManager.init();
    flashcardManager.init();
    codexManager.init();
    shareManager.init();

    // 檢查 URL 參數
    const params = new URLSearchParams(window.location.search);
    const hexId = params.get('hex');
    if (hexId) {
      const btnDivination = document.getElementById('nav-divination');
      if (btnDivination) btnDivination.click();
      divinationManager.loadFromParams(
        hexId,
        params.get('lines') || '',
        params.get('q') || '',
        params.get('cat') || ''
      );
    }
  }

  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initApp);
    } else {
      initApp();
    }
  }

})();
