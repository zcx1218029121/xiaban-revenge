// Card Pool (CP) — 44 playable cards, pure data, no behavior
import { deepCopy } from './constants.js';

// Rarity: C=common, U=uncommon, R=rare
// Faction: 通用/卷王/摸鱼/养生/社交

var CP = {
  // === 通用 (18) ===
  moyu:     { id:"moyu",     name:"摸鱼",     cost:0, type:"skill",  rarity:"C", faction:"通用", effect:"抽2张" },
  qingjia:  { id:"qingjia",  name:"请假条",   cost:0, type:"skill",  rarity:"C", faction:"通用", effect:"6护盾" },
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

  // === 卷王派 (6) — 高风险高伤害 ===
  guolaosi: { id:"guolaosi", name:"过劳死",   cost:3, type:"attack", rarity:"U", faction:"卷王", effect:"25伤+4压力,击杀回复12HP" },
  cusi:     { id:"cusi",     name:"猝死急救", cost:2, type:"attack", rarity:"U", faction:"卷王", effect:"14伤+2压力,击杀回复8HP" },
  chongci:  { id:"chongci",  name:"冲刺",     cost:2, type:"attack", rarity:"C", faction:"卷王", effect:"12伤害,+2压力" },
  tongxiao: { id:"tongxiao", name:"通宵",     cost:3, type:"attack", rarity:"U", faction:"卷王", effect:"22伤害,+3压力" },
  lingqisan: { id:"lingqisan", name:"007套餐",  cost:4, type:"attack", rarity:"R", faction:"卷王", effect:"40伤+6压力,下次攻击x1.5" },
  jixiao:   { id:"jixiao",   name:"绩效冲刺", cost:1, type:"attack", rarity:"C", faction:"卷王", effect:"8伤+1压力,击杀获3护盾" },

  // === 摸鱼派 (7) — 毒dot+免伤 ===
  paogouqi: { id:"paogouqi", name:"泡枸杞",   cost:1, type:"skill",  rarity:"C", faction:"摸鱼", effect:"6护盾+3层中毒" },
  manxing:  { id:"manxing",  name:"慢性中毒", cost:2, type:"skill",  rarity:"U", faction:"摸鱼", effect:"5层中毒,本回合不抽牌" },
  bingjiatiao:{ id:"bingjiatiao", name:"病假条",  cost:0, type:"skill",  rarity:"C", faction:"摸鱼", effect:"4护盾,中毒层数越高伤害越多" },
  zunshixiaban:{ id:"zunshixiaban", name:"准时下班",cost:0,type:"skill", rarity:"C", faction:"摸鱼", effect:"本回合免疫攻击,-2压力" },
  toulandashi:{ id:"toulandashi", name:"偷懒大师",cost:2,type:"skill", rarity:"U", faction:"摸鱼", effect:"下回合敌人跳过行动" },
  xialing:  { id:"xialing",  name:"夏令时调休",cost:1,type:"skill",  rarity:"U", faction:"摸鱼", effect:"+2能量,免疫下回合" },
  babaozhou:{ id:"babaozhou", name:"八宝粥",    cost:1, type:"skill",  rarity:"C", faction:"摸鱼", effect:"治疗4HP,压力-1" },

  // === 养生派 (7) — 续航+防御 ===
  wushui:   { id:"wushui",   name:"午睡",     cost:1, type:"skill",  rarity:"C", faction:"养生", effect:"治疗10HP,+1压力" },
  jianshen: { id:"jianshen", name:"健身卡",   cost:2, type:"skill",  rarity:"U", faction:"养生", effect:"治疗6HP,10护盾" },
  yangshengcha:{ id:"yangshengcha", name:"养生茶",cost:0,type:"skill",rarity:"C", faction:"养生", effect:"压力-3" },
  mingxiang:{ id:"mingxiang", name:"冥想",     cost:1, type:"skill",  rarity:"U", faction:"养生", effect:"压力-2,抽1张" },
  tijiandan:{ id:"tijiandan", name:"体检单",   cost:2, type:"skill",  rarity:"U", faction:"养生", effect:"治疗15HP,下回合不抽牌" },
  tuina:    { id:"tuina",    name:"推拿券",   cost:2, type:"skill",  rarity:"R", faction:"养生", effect:"治疗至满血,移除全部压力" },
  anjianyi: { id:"anjianyi", name:"人体工学家",cost:3,type:"skill",  rarity:"U", faction:"养生", effect:"20护盾,治疗8HP" },

  // === 社交派 (6) — 控场+辅助 ===
  qingke:   { id:"qingke",   name:"请客吃饭", cost:2, type:"skill",  rarity:"C", faction:"社交", effect:"敌人下次伤害-4" },
  bagua:    { id:"bagua",    name:"八卦",     cost:1, type:"attack", rarity:"C", faction:"社交", effect:"3伤害,抽1张" },
  lapai:    { id:"lapai",    name:"拉帮结派", cost:3, type:"skill",  rarity:"U", faction:"社交", effect:"获得5能量,10护盾" },
  paimapi:  { id:"paimapi",  name:"拍马屁",   cost:2, type:"skill",  rarity:"U", faction:"社交", effect:"14护盾,敌人2层虚弱" },
  qizhiyanjiang:{ id:"qizhiyanjiang", name:"即兴演讲",cost:2,type:"attack",rarity:"R",faction:"社交", effect:"每张社交卡额外+4伤害" },
  neibu:    { id:"neibu",    name:"内部推荐", cost:1, type:"skill",  rarity:"U", faction:"社交", effect:"复制上一张打出的卡" },
};

export { CP };
export function getCard(id) { return CP[id]; }
