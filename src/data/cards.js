// Card Pool (CP) — 105+ playable cards, pure data, no behavior
import { deepCopy } from './constants.js';

// Rarity: C=common, U=uncommon, R=rare
// Faction: 通用/卷王/摸鱼/养生/社交
// Type: attack/skill/spell/equipment/curse

var CP = {
  // ============================================================
  // === 通用 (30) — All types showcase ===
  // ============================================================
  moyu:     { id:"moyu",     name:"摸鱼",     cost:0, type:"skill",  rarity:"C", faction:"通用", effect:"抽1张" },
  qingjia:  { id:"qingjia",  name:"请假条",   cost:1, type:"skill",  rarity:"C", faction:"通用", effect:"6护盾" },
  xiehuier: { id:"xiehuier", name:"歇会儿",   cost:0, type:"skill",  rarity:"C", faction:"通用", effect:"3护盾" },
  jiaban:   { id:"jiaban",   name:"加班",     cost:1, type:"attack", rarity:"C", faction:"通用", effect:"6伤害,+1压力" },
  baoxiao:  { id:"baoxiao",  name:"报销",     cost:1, type:"skill",  rarity:"C", faction:"通用", effect:"8护盾,治疗2HP" },
  huiyi:    { id:"huiyi",    name:"会议纪要", cost:1, type:"attack", rarity:"C", faction:"通用", effect:"3伤害,2层虚弱" },
  kafei:    { id:"kafei",    name:"咖啡",     cost:1, type:"skill",  rarity:"C", faction:"通用", effect:"+2能量" },
  zhoubao:  { id:"zhoubao",  name:"周报",     cost:2, type:"attack", rarity:"C", faction:"通用", effect:"9伤害" },
  tuanjian: { id:"tuanjian", name:"团建",     cost:2, type:"skill",  rarity:"C", faction:"通用", effect:"10护盾" },
  zhangxin: { id:"zhangxin", name:"泡茶",     cost:2, type:"skill",  rarity:"U", faction:"通用", effect:"治疗8HP" },
  bianyun:  { id:"bianyun",  name:"便当",     cost:2, type:"skill",  rarity:"U", faction:"通用", effect:"治疗12HP" },
  cairyuan: { id:"cairyuan", name:"裁员",     cost:3, type:"attack", rarity:"U", faction:"通用", effect:"20伤害" },
  paohuiyi: { id:"paohuiyi", name:"泡会议室", cost:3, type:"skill",  rarity:"C", faction:"通用", effect:"18护盾" },
  baofu:    { id:"baofu",    name:"汇报",     cost:3, type:"attack", rarity:"U", faction:"通用", effect:"14伤害" },
  kaohe:    { id:"kaohe",    name:"绩效考核", cost:3, type:"attack", rarity:"R", faction:"通用", effect:"本回合伤害x2" },
  tiaoxin:  { id:"tiaoxin",  name:"调休",     cost:1, type:"skill",  rarity:"C", faction:"通用", effect:"压力-3" },
  daixinku: { id:"daixinku", name:"带薪哭",   cost:1, type:"skill",  rarity:"U", faction:"通用", effect:"压力-2,治疗5HP" },
  shuoguo:  { id:"shuoguo",  name:"甩锅",     cost:1, type:"attack", rarity:"C", faction:"通用", effect:"5伤害,压力-1" },
  zuihui:   { id:"zuihui",   name:"最终汇报", cost:3, type:"attack", rarity:"U", faction:"通用", effect:"25伤害" },
  // New 通用 (12)
  cizhixin: { id:"cizhixin", name:"辞职信",   cost:3, type:"spell",  rarity:"U", faction:"通用", effect:"30伤害,一次性" },
  tiaocao:  { id:"tiaocao",  name:"跳槽",     cost:2, type:"spell",  rarity:"R", faction:"通用", effect:"本回合伤害x3,一次性" },
  nianduzongjie:{ id:"nianduzongjie", name:"年度总结",cost:1,type:"spell",rarity:"C",faction:"通用",effect:"抽3张,一次性" },
  bijiben:  { id:"bijiben",  name:"笔记本电脑",cost:2,type:"equipment",rarity:"U",faction:"通用",effect:"每回合+1能量",charges:3},
  mingpian: { id:"mingpian", name:"名片夹",   cost:1, type:"equipment", rarity:"C", faction:"通用", effect:"每回合+2护盾", charges:4},
  richen:   { id:"richen",   name:"日程表",   cost:1, type:"equipment", rarity:"U", faction:"通用", effect:"每回合抽1张", charges:3},
  tuoyanzheng:{ id:"tuoyanzheng", name:"拖延症",cost:0,type:"curse",rarity:"C",faction:"通用",effect:"无法打出,回合结束丢弃1手牌",unplayable:true},
  zhinengshoubiao:{ id:"zhinengshoubiao", name:"智能手表",cost:1,type:"skill",rarity:"C",faction:"通用",effect:"8护盾,抽1张"},
  fengshui: { id:"fengshui", name:"工位风水", cost:2, type:"skill",  rarity:"U", faction:"通用", effect:"治疗10HP,压力-2" },
  qianggong: { id:"qianggong", name:"抢功报告",cost:2,type:"attack",rarity:"U",faction:"通用",effect:"12伤害,治疗5HP"},
  daidaka:  { id:"daidaka",  name:"代打卡",   cost:0, type:"skill",  rarity:"C", faction:"通用", effect:"4护盾" },
  diaogang: { id:"diaogang", name:"调岗申请", cost:3, type:"attack", rarity:"R", faction:"通用", effect:"18伤害,2层虚弱,压力-2" },

  // ============================================================
  // === 卷王派 (18) — High-risk spells, equipment ===
  // ============================================================
  guolaosi: { id:"guolaosi", name:"过劳死",   cost:3, type:"attack", rarity:"U", faction:"卷王", effect:"25伤+4压力,击杀回复12HP" },
  cusi:     { id:"cusi",     name:"猝死急救", cost:2, type:"attack", rarity:"U", faction:"卷王", effect:"14伤+2压力,击杀回复8HP" },
  chongci:  { id:"chongci",  name:"冲刺",     cost:2, type:"attack", rarity:"C", faction:"卷王", effect:"12伤害,+2压力" },
  tongxiao: { id:"tongxiao", name:"通宵",     cost:3, type:"attack", rarity:"U", faction:"卷王", effect:"22伤害,+3压力" },
  lingqisan: { id:"lingqisan", name:"007套餐",cost:4,type:"attack",rarity:"R",faction:"卷王",effect:"40伤+6压力,下次攻击x1.5"},
  jixiao:   { id:"jixiao",   name:"绩效冲刺", cost:1, type:"attack", rarity:"C", faction:"卷王", effect:"8伤+1压力,击杀获3护盾" },
  // New 卷王 (12)
  jiujiufubao:{ id:"jiujiufubao", name:"996福报",cost:4,type:"spell",rarity:"R",faction:"卷王",effect:"50伤害+5压力,一次性"},
  lianhuanjiaban:{ id:"lianhuanjiaban", name:"连环加班",cost:3,type:"spell",rarity:"U",faction:"卷王",effect:"20伤害+3压力,一次性"},
  neijuan:  { id:"neijuan",  name:"内卷之魂", cost:2, type:"equipment", rarity:"R", faction:"卷王", effect:"每回合伤害+30%" },
  kafeiyin: { id:"kafeiyin", name:"咖啡因依赖",cost:1,type:"equipment",rarity:"U",faction:"卷王",effect:"每回合+1能量+1压力",charges:4},
  guolaofei:{ id:"guolaofei", name:"过劳肥",  cost:0, type:"curse", rarity:"C", faction:"卷王", effect:"每回合-2HP,无法打出", unplayable:true },
  xueyashenggao:{ id:"xueyashenggao", name:"血压飙升",cost:1,type:"curse",rarity:"U",faction:"卷王",effect:"受到3伤害后移除诅咒"},
  mobanditie:{ id:"mobanditie", name:"末班地铁",cost:1,type:"attack",rarity:"C",faction:"卷王",effect:"10伤害,+1压力"},
  zhoumojiaban:{ id:"zhoumojiaban", name:"周末加班",cost:2,type:"attack",rarity:"U",faction:"卷王",effect:"16伤害+2压力,抽1张"},
  sixianchongci:{ id:"sixianchongci", name:"死线冲刺",cost:2,type:"attack",rarity:"C",faction:"卷王",effect:"15伤害"},
  duomingcall:{ id:"duomingcall", name:"连环call",cost:1,type:"skill",rarity:"U",faction:"卷王",effect:"敌人下回合跳过,+2压力"},
  lingchen3:{ id:"lingchen3", name:"凌晨三点",cost:3,type:"attack",rarity:"R",faction:"卷王",effect:"28伤害+3压力,击杀回复12HP"},
  dengxia:  { id:"dengxia",  name:"灯下苦战", cost:1, type:"attack", rarity:"C", faction:"卷王", effect:"7伤害,压力>=7则+5伤害" },

  // ============================================================
  // === 摸鱼派 (19) — Curses, poison equipment ===
  // ============================================================
  paogouqi: { id:"paogouqi", name:"泡枸杞",   cost:1, type:"skill",  rarity:"C", faction:"摸鱼", effect:"6护盾+3层中毒" },
  manxing:  { id:"manxing",  name:"慢性中毒", cost:2, type:"skill",  rarity:"U", faction:"摸鱼", effect:"5层中毒,本回合不抽牌" },
  bingjiatiao:{ id:"bingjiatiao", name:"病假条",cost:0,type:"skill",rarity:"C",faction:"摸鱼",effect:"4护盾,中毒层数越高伤害越多"},
  zunshixiaban:{ id:"zunshixiaban", name:"准时下班",cost:0,type:"skill",rarity:"C",faction:"摸鱼",effect:"本回合免疫攻击,-2压力"},
  toulandashi:{ id:"toulandashi", name:"偷懒大师",cost:2,type:"skill",rarity:"U",faction:"摸鱼",effect:"下回合敌人跳过行动"},
  xialing:  { id:"xialing",  name:"夏令时调休",cost:1,type:"skill",rarity:"U",faction:"摸鱼",effect:"+2能量,免疫本回合"},
  babaozhou:{ id:"babaozhou", name:"八宝粥",    cost:1, type:"skill",  rarity:"C", faction:"摸鱼", effect:"治疗4HP,压力-1" },
  // New 摸鱼 (12)
  daixinlashi:{ id:"daixinlashi", name:"带薪拉屎",cost:2,type:"spell",rarity:"R",faction:"摸鱼",effect:"免疫3回合,压力-3,一次性"},
  gongweiyinshen:{ id:"gongweiyinshen", name:"工位隐身",cost:1,type:"spell",rarity:"U",faction:"摸鱼",effect:"20护盾,一次性"},
  moyu_master:{ id:"moyu_master", name:"摸鱼大师证",cost:1,type:"equipment",rarity:"R",faction:"摸鱼",effect:"每回合+1能量"},
  equip_jiangzao:{ id:"equip_jiangzao", name:"降噪耳机",cost:2,type:"equipment",rarity:"U",faction:"摸鱼",effect:"每回合敌人伤害-2",charges:3},
  beifaxian:{ id:"beifaxian", name:"被发现摸鱼",cost:0,type:"curse",rarity:"C",faction:"摸鱼",effect:"+2压力,无法打出",unplayable:true},
  wuliaohuiyi:{ id:"wuliaohuiyi", name:"无聊会议",cost:1,type:"curse",rarity:"U",faction:"摸鱼",effect:"抽1张,+1压力后移除"},
  cesuobilan:{ id:"cesuobilan", name:"厕所避难",cost:1,type:"skill",rarity:"C",faction:"摸鱼",effect:"6护盾,压力-1"},
  zhuangmang:{ id:"zhuangmang", name:"装忙",     cost:0, type:"skill",  rarity:"C", faction:"摸鱼", effect:"3护盾" },
  zaotui:   { id:"zaotui",   name:"早退",     cost:1, type:"skill",  rarity:"U", faction:"摸鱼", effect:"8护盾,免疫本回合" },
  pingmu:   { id:"pingmu",   name:"屏幕保护膜",cost:1,type:"skill",rarity:"C",faction:"摸鱼",effect:"敌人1层虚弱,3护盾"},
  shuaweibo:{ id:"shuaweibo", name:"刷微博",   cost:0, type:"skill",  rarity:"C", faction:"摸鱼", effect:"抽1张,压力-1" },
  naicha:   { id:"naicha",   name:"奶茶时间", cost:1, type:"skill",  rarity:"U", faction:"摸鱼", effect:"治疗6HP,抽1张" },

  // ============================================================
  // === 养生派 (19) — Persistent equipment, shields ===
  // ============================================================
  wushui:   { id:"wushui",   name:"午睡",     cost:1, type:"skill",  rarity:"C", faction:"养生", effect:"治疗10HP,+1压力" },
  jianshen: { id:"jianshen", name:"健身卡",   cost:2, type:"skill",  rarity:"U", faction:"养生", effect:"治疗6HP,10护盾" },
  yangshengcha:{ id:"yangshengcha", name:"养生茶",cost:0,type:"skill",rarity:"C",faction:"养生",effect:"压力-3"},
  mingxiang:{ id:"mingxiang", name:"冥想",     cost:1, type:"skill",  rarity:"U", faction:"养生", effect:"压力-2,抽1张" },
  tijiandan:{ id:"tijiandan", name:"体检单",   cost:2, type:"skill",  rarity:"U", faction:"养生", effect:"治疗15HP,下回合不抽牌" },
  tuina:    { id:"tuina",    name:"推拿券",   cost:2, type:"skill",  rarity:"R", faction:"养生", effect:"治疗至满血,移除全部压力" },
  anjianyi: { id:"anjianyi", name:"人体工学家",cost:3,type:"skill",rarity:"U",faction:"养生",effect:"20护盾,治疗8HP"},
  // New 养生 (12)
  yangshengdashi:{ id:"yangshengdashi", name:"养生大师",cost:3,type:"spell",rarity:"R",faction:"养生",effect:"治疗25HP,移除全部压力,一次性"},
  mingxiangkongjian:{ id:"mingxiangkongjian", name:"冥想空间",cost:2,type:"spell",rarity:"U",faction:"养生",effect:"15护盾,压力-3,一次性"},
  baowenbei:{ id:"baowenbei", name:"保温杯",   cost:1, type:"equipment", rarity:"C", faction:"养生", effect:"每回合治疗2HP", charges:5},
  anmoyi:   { id:"anmoyi",   name:"按摩椅",   cost:3, type:"equipment", rarity:"R", faction:"养生", effect:"每回合治疗4HP+压力-1" },
  yajiankang:{ id:"yajiankang", name:"亚健康",cost:0,type:"curse",rarity:"C",faction:"养生",effect:"无法治疗,2回合后移除",unplayable:true,turnsLeft:2},
  jingzhuibing:{ id:"jingzhuibing", name:"颈椎病",cost:1,type:"curse",rarity:"U",faction:"养生",effect:"下回合无法出牌后移除"},
  yanbaojiancao:{ id:"yanbaojiancao", name:"眼保健操",cost:0,type:"skill",rarity:"C",faction:"养生",effect:"治疗3HP"},
  gouqipaoshui:{ id:"gouqipaoshui", name:"枸杞泡水",cost:1,type:"skill",rarity:"C",faction:"养生",effect:"治疗5HP,压力-1"},
  sanbu:    { id:"sanbu",    name:"散步",     cost:1, type:"skill",  rarity:"C", faction:"养生", effect:"4护盾,治疗3HP" },
  weishengsu:{ id:"weishengsu", name:"维生素",cost:2,type:"skill",rarity:"U",faction:"养生",effect:"治疗8HP,下回合+1能量"},
  lashen:   { id:"lashen",   name:"拉伸运动", cost:0, type:"skill",  rarity:"C", faction:"养生", effect:"压力-2" },
  zhongyi:  { id:"zhongyi",  name:"中医调理", cost:3, type:"skill",  rarity:"R", faction:"养生", effect:"治疗18HP,移除所有debuff" },

  // ============================================================
  // === 社交派 (18) — Control spells, aoe ===
  // ============================================================
  qingke:   { id:"qingke",   name:"请客吃饭", cost:2, type:"skill",  rarity:"C", faction:"社交", effect:"敌人下次伤害-4" },
  bagua:    { id:"bagua",    name:"八卦",     cost:1, type:"attack", rarity:"C", faction:"社交", effect:"3伤害,抽1张" },
  lapai:    { id:"lapai",    name:"拉帮结派", cost:3, type:"skill",  rarity:"U", faction:"社交", effect:"获得5能量,10护盾" },
  paimapi:  { id:"paimapi",  name:"拍马屁",   cost:2, type:"skill",  rarity:"U", faction:"社交", effect:"14护盾,敌人2层虚弱" },
  qizhiyanjiang:{ id:"qizhiyanjiang", name:"即兴演讲",cost:2,type:"attack",rarity:"R",faction:"社交",effect:"每张社交卡额外+4伤害"},
  neibu:    { id:"neibu",    name:"内部推荐", cost:1, type:"skill",  rarity:"U", faction:"社交", effect:"复制上一张打出的卡" },
  // New 社交 (12)
  tuanjianhuodong:{ id:"tuanjianhuodong", name:"团建活动",cost:3,type:"spell",rarity:"U",faction:"社交",effect:"15伤害+2层虚弱,一次性"},
  lizhiyanshuo:{ id:"lizhiyanshuo", name:"离职演说",cost:2,type:"spell",rarity:"R",faction:"社交",effect:"3层虚弱+5层中毒,一次性"},
  renmai:   { id:"renmai",   name:"人脉网络", cost:2, type:"equipment", rarity:"R", faction:"社交", effect:"每回合抽2张", charges:3},
  minghao:  { id:"minghao",  name:"名号响亮", cost:1, type:"equipment", rarity:"U", faction:"社交", effect:"每回合+2伤害", charges:5},
  shekong:  { id:"shekong",  name:"社恐",     cost:0, type:"curse", rarity:"C", faction:"社交", effect:"无法获得护盾,2回合后移除",unplayable:true,turnsLeft:2},
  bangongshi: { id:"bangongshi", name:"办公室政治",cost:1,type:"curse",rarity:"U",faction:"社交",effect:"+3压力后移除"},
  chashui:  { id:"chashui",  name:"茶水间八卦",cost:1,type:"attack",rarity:"C",faction:"社交",effect:"5伤害,抽1张"},
  jucan:    { id:"jucan",    name:"同事聚餐", cost:1, type:"skill",  rarity:"C", faction:"社交", effect:"6护盾,治疗3HP" },
  kuabumen: { id:"kuabumen", name:"跨部门合作",cost:2,type:"attack",rarity:"U",faction:"社交",effect:"10伤害,每张社交手牌+3伤害"},
  lietou:   { id:"lietou",   name:"猎头电话", cost:2, type:"skill",  rarity:"R", faction:"社交", effect:"从牌组选1张稀有卡加入手牌" },
  neibuxiaoxi:{ id:"neibuxiaoxi", name:"内部消息",cost:0,type:"skill",rarity:"C",faction:"社交",effect:"抽2张"},
  gaoxiaotuanti:{ id:"gaoxiaotuanti", name:"搞小团体",cost:2,type:"skill",rarity:"U",faction:"社交",effect:"敌人2层虚弱,6护盾"},
};

export { CP };
export function getCard(id) { return CP[id]; }
