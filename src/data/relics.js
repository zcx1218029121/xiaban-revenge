// Relics definition — pure data, no behavior
var RELICS = [
  { id:"jixie",  name:"机械键盘", emoji:"⌨️", desc:"所有攻击 +2 伤害",     rarity:1 },
  { id:"renshen",name:"人体工学椅", emoji:"🪑", desc:"单次治疗最多12点",    rarity:1 },
  { id:"jiangya",name:"降压药",   emoji:"💊", desc:"初始压力 -2",          rarity:1 },
  { id:"kafei",  name:"咖啡机",   emoji:"☕", desc:"战斗开始 +1 能量",     rarity:2 },
  { id:"parking",name:"停车场车位",emoji:"🅿️", desc:"战斗开始 +8 护盾",     rarity:2 },
  { id:"yugang", name:"鱼缸",     emoji:"🐠", desc:"战斗胜利 30% 抽1张",  rarity:2 },
  { id:"beiyong",name:"备用金",   emoji:"💵", desc:"可抵消一次最多15点伤害",rarity:3 },
  { id:"hrtousu",name:"HR投诉热线",emoji:"📞", desc:"敌人开局自带1层虚弱",rarity:3 },
  { id:"jinsheng",name:"晋升通知书",emoji:"📬", desc:"每天结束时压力 -3",   rarity:2 },
  { id:"huiyi",  name:"会议室预订",emoji:"📅", desc:"每天开始额外抽2张",    rarity:3 },
  // === 卷王派遗物 ===
  { id:"996cup",  name:"996奖杯",   emoji:"🏆", desc:"压力≥7时攻击+50%，击杀回复5HP", rarity:2 },
  // === 摸鱼派遗物 ===
  { id:"jiangyan",name:"降噪耳机",  emoji:"🎧", desc:"敌人受中毒伤害时额外受2伤害",   rarity:2 },
];

export { RELICS };
export function getRelic(id) { return RELICS.find(r => r.id === id || r.name === id); }
