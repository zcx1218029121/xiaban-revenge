// Relics definition
var RELICS = [
  { id:"jixie",  name:"机械键盘", emoji:"⌨️", desc:"所有攻击 +2 伤害",     rarity:1,
    onDamageDealt:function(n){ return n+2; } },
  { id:"renshen",name:"人体工学椅", emoji:"🪑", desc:"单次治疗最多12点",    rarity:1,
    onHeal:function(n){ return Math.min(n,12); } },
  { id:"jiangya",name:"降压药",   emoji:"💊", desc:"初始压力 -2",          rarity:1,
    onBattleStart:function(){ s.stress=Math.max(0,s.stress-2); } },
  { id:"kafei",  name:"咖啡机",   emoji:"☕", desc:"战斗开始 +1 能量",     rarity:2,
    onBattleStart:function(){ s.en=Math.min(s.men,s.en+1); log("咖啡提神！能量+1","special"); } },
  { id:"parking",name:"停车场车位",emoji:"🅿️", desc:"战斗开始 +8 护盾",     rarity:2,
    onBattleStart:function(){ s.sh+=8; log("占了个好车位！+8护盾","special"); } },
  { id:"yugang", name:"鱼缸",     emoji:"🐠", desc:"战斗胜利 30% 抽1张",  rarity:2,
    onFightWin:function(){ if(Math.random()<0.3){ drawCards(1); log("鱼缸里的鱼给你带来了好运！抽1张","special"); } } },
  { id:"beiyong",name:"备用金",   emoji:"💵", desc:"可抵消一次最多15点伤害",rarity:3,
    onDamaged:function(n){ var playerRelic=s.relics.find(function(r){ return r.id==="beiyong"; }); if(!playerRelic||playerRelic.used||n<=0) return n; playerRelic.used=true; log("备用金用尽！抵消"+(Math.min(n,15))+"伤害","special"); return Math.max(0,n-15); } },
  { id:"hrtousu",name:"HR投诉热线",emoji:"📞", desc:"敌人开局自带1层虚弱",rarity:3,
    onBattleStart:function(){ if(s.ene){ s.ene.weak=(s.ene.weak||0)+1; log("HR已投诉！敌人获得1层虚弱","special"); } } },
  { id:"jinsheng",name:"晋升通知书",emoji:"📬", desc:"每天结束时压力 -3",   rarity:2,
    onDayEnd:function(){ s.stress=Math.max(0,s.stress-3); log("收到晋升通知！压力-3","special"); } },
  { id:"huiyi",  name:"会议室预订",emoji:"📅", desc:"每天开始额外抽2张",    rarity:3,
    onDayStart:function(){ drawCards(2); log("预定了会议室！抽2张","special"); } },
  // === 卷王派遗物 ===
  { id:"996cup",  name:"996奖杯",   emoji:"🏆", desc:"压力≥7时攻击+50%，击杀回复5HP", rarity:2,
    onDamageDealt:function(n){ if(s.stress>=7) return Math.floor(n*1.5); return n; },
    onFightWin:function(){ if(s.stress>=7){ heal(5); log("996奖杯：击杀回血5HP","special"); } } },
  // === 摸鱼派遗物 ===
  { id:"jiangyan",name:"降噪耳机",  emoji:"🎧", desc:"敌人受中毒伤害时额外受2伤害",   rarity:2,
    onDamaged:function(n){ return n; } }, // handled inline in poison tick
];

export { RELICS };
export function getRelic(id) { return RELICS.find(r => r.id === id || r.name === id); }
