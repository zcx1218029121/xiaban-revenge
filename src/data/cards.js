// Card Pool (CP) — all playable cards
import { deepCopy } from './constants.js';

var CP = {
  moyu:     { name:"摸鱼",     cost:0, type:"skill",  effect:"抽2张",             action:function(g){ g.drawCards(2); } },
  qingjia:  { name:"请假条",   cost:0, type:"skill",  effect:"6护盾",            action:function(g){ g.gainShield(6); } },
  jiaban:   { name:"加班",     cost:1, type:"attack", effect:"6伤害,+1压力",     action:function(g){ g.dealDamageToEnemy(6); g.addStress(1); } },
  baoxiao:  { name:"报销",     cost:1, type:"skill",  effect:"8护盾,治疗2HP",    action:function(g){ g.gainShield(8); g.heal(2); } },
  huiyi:    { name:"会议纪要", cost:1, type:"attack", effect:"3伤害,2层虚弱",    action:function(g){ g.dealDamageToEnemy(3); g.applyWeak(2); } },
  kafei:    { name:"咖啡",     cost:1, type:"skill",  effect:"+2能量",           action:function(g){ g.modifyEnergy(2); } },
  zhoubao:  { name:"周报",     cost:2, type:"attack", effect:"9伤害",            action:function(g){ g.dealDamageToEnemy(9); } },
  tuanjian: { name:"团建",     cost:2, type:"skill",  effect:"10护盾",           action:function(g){ g.gainShield(10); } },
  zhangxin: { name:"泡茶",     cost:2, type:"skill",  effect:"治疗8HP",           action:function(g){ g.heal(8); } },
  bianyun:  { name:"便当",     cost:2, type:"skill",  effect:"治疗12HP",          action:function(g){ g.heal(12); } },
  cairyuan: { name:"裁员",     cost:3, type:"attack", effect:"20伤害",            action:function(g){ g.dealDamageToEnemy(20); } },
  paohuiyi: { name:"泡会议室", cost:3, type:"skill",  effect:"18护盾",           action:function(g){ g.gainShield(18); } },
  baofu:    { name:"汇报",     cost:3, type:"attack", effect:"14伤害",            action:function(g){ g.dealDamageToEnemy(14); } },
  kaohe:    { name:"绩效考核", cost:3, type:"attack", effect:"本回合伤害x2",      action:function(g){ g.state.tempDmgMult=2; g.dealDamageToEnemy(8); } },
  tiaoxin:  { name:"调休",     cost:1, type:"skill",  effect:"压力-3",           action:function(g){ g.state.stress=Math.max(0,g.state.stress-3); } },
  daixinku: { name:"带薪哭",   cost:1, type:"skill",  effect:"压力-2,治疗5HP",   action:function(g){ g.state.stress=Math.max(0,g.state.stress-2); g.heal(5); } },
  chongci:  { name:"冲刺",     cost:2, type:"attack", effect:"12伤害,+2压力",    action:function(g){ g.dealDamageToEnemy(12); g.addStress(2); } },
  tongxiao: { name:"通宵",     cost:3, type:"attack", effect:"22伤害,+3压力",    action:function(g){ g.dealDamageToEnemy(22); g.addStress(3); } },
  shuoguo:  { name:"甩锅",     cost:1, type:"attack", effect:"5伤害,压力-1",      action:function(g){ g.dealDamageToEnemy(5); g.state.stress=Math.max(0,g.state.stress-1); } },
  zuihui:   { name:"最终汇报", cost:3, type:"attack", effect:"25伤害",            action:function(g){ g.dealDamageToEnemy(25); } },
  // === 卷王派 ===
  guolaosi: { name:"过劳死",   cost:3, type:"attack", effect:"25伤+4压力，击杀回复12HP",action:function(g){ var killed=g.dealDamageToEnemy(25); g.addStress(4); if(killed) g.heal(12); } },
  cusi:     { name:"猝死急救", cost:2, type:"attack", effect:"14伤+2压力，击杀回复8HP", action:function(g){ var killed=g.dealDamageToEnemy(14); g.addStress(2); if(killed) g.heal(8); } },
  lingqisan: { name:"007套餐",  cost:4, type:"attack", effect:"40伤+6压力，下次攻击x1.5",action:function(g){ g.addStress(6); var mult=g.state.tempDmgMult||1; g.state.tempDmgMult=mult*1.5; g.dealDamageToEnemy(40); } },
  jixiao:   { name:"绩效冲刺", cost:1, type:"attack", effect:"8伤+1压力，击杀获得3护盾",action:function(g){ var killed=g.dealDamageToEnemy(8); g.addStress(1); if(killed) g.gainShield(3); } },
  // === 摸鱼派 ===
  paogouqi: { name:"泡枸杞",   cost:1, type:"skill",  effect:"6护盾+3层中毒",         action:function(g){ g.gainShield(6); g.applyPoison(3); } },
  manxing:  { name:"慢性中毒", cost:2, type:"skill",  effect:"5层中毒，本回合不抽牌",  action:function(g){ g.applyPoison(5); g.state.noDrawThisTurn=true; } },
  bingjiatiao:{ name:"病假条",  cost:0, type:"skill",  effect:"4护盾，中毒层数越高敌人受伤越多",action:function(g){ g.gainShield(4); var e=g.enemy; if(e&&e.poison>0){ var bonus=e.poison; dealDamageToEnemy(bonus); log("病假加成："+bonus+"额外伤害","special"); updateAll(); } } },
  zunshixiaban:{ name:"准时下班",cost:0,type:"skill", effect:"本回合不受攻击，-2压力",action:function(g){ g.state.stress=Math.max(0,g.state.stress-2); g.state.immuneThisTurn=true; log("准时下班！本回合免疫攻击","special"); } },
};

export { CP };
export function getCard(id) { return CP[id]; }
