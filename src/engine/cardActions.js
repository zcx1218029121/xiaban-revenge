// cardActions.js — Card effect functions separated from card data
export const cardActions = {
  // === 通用 ===
  moyu:     (g) => g.drawCards(2),
  qingjia:  (g) => g.gainShield(6),
  jiaban:   (g) => { g.dealDamageToEnemy(6); g.addStress(1); },
  baoxiao:  (g) => { g.gainShield(8); g.heal(2); },
  huiyi:    (g) => { g.dealDamageToEnemy(3); g.applyWeak(2); },
  kafei:    (g) => g.modifyEnergy(2),
  zhoubao:  (g) => g.dealDamageToEnemy(9),
  tuanjian: (g) => g.gainShield(10),
  zhangxin: (g) => g.heal(8),
  bianyun:  (g) => g.heal(12),
  cairyuan: (g) => g.dealDamageToEnemy(20),
  paohuiyi: (g) => g.gainShield(18),
  baofu:    (g) => g.dealDamageToEnemy(14),
  kaohe:    (g) => { g.state.tempDmgMult=2; g.dealDamageToEnemy(8); },
  tiaoxin:  (g) => { g.state.stress=Math.max(0,g.state.stress-3); },
  daixinku: (g) => { g.state.stress=Math.max(0,g.state.stress-2); g.heal(5); },
  shuoguo:  (g) => { g.dealDamageToEnemy(5); g.state.stress=Math.max(0,g.state.stress-1); },
  zuihui:   (g) => g.dealDamageToEnemy(25),

  // === 卷王派 ===
  guolaosi:  (g) => { var killed=g.dealDamageToEnemy(25); g.addStress(4); if(killed) g.heal(12); },
  cusi:      (g) => { var killed=g.dealDamageToEnemy(14); g.addStress(2); if(killed) g.heal(8); },
  chongci:   (g) => { g.dealDamageToEnemy(12); g.addStress(2); },
  tongxiao:  (g) => { g.dealDamageToEnemy(22); g.addStress(3); },
  lingqisan: (g) => { g.addStress(6); var mult=g.state.tempDmgMult||1; g.state.tempDmgMult=mult*1.5; g.dealDamageToEnemy(40); },
  jixiao:    (g) => { var killed=g.dealDamageToEnemy(8); g.addStress(1); if(killed) g.gainShield(3); },

  // === 摸鱼派 ===
  paogouqi:  (g) => { g.gainShield(6); g.applyPoison(3); },
  manxing:   (g) => { g.applyPoison(5); g.state.noDrawThisTurn=true; },
  bingjiatiao:(g) => { g.gainShield(4); var e=g.enemy; if(e&&e.poison>0){ var bonus=e.poison; g.dealDamageToEnemy(bonus); g.log("病假加成："+bonus+"额外伤害","special"); g.updateAll(); } },
  zunshixiaban:(g)=> { g.state.stress=Math.max(0,g.state.stress-2); g.state.immuneThisTurn=true; g.log("准时下班！本回合免疫攻击","special"); },
  toulandashi:(g) => { g.state.enemySkipNext=true; g.log("偷懒成功！敌人下回合跳过","special"); },
  xialing:  (g) => { g.modifyEnergy(2); g.state.immuneThisTurn=true; g.log("夏令时！免疫本回合","special"); },
  babaozhou:(g) => { g.heal(4); g.state.stress=Math.max(0,g.state.stress-1); },

  // === 养生派 ===
  wushui:   (g) => { g.heal(10); g.addStress(1); },
  jianshen: (g) => { g.heal(6); g.gainShield(10); },
  yangshengcha:(g) => { g.state.stress=Math.max(0,g.state.stress-3); },
  mingxiang:(g) => { g.state.stress=Math.max(0,g.state.stress-2); g.drawCards(1); },
  tijiandan:(g) => { g.heal(15); g.state.noDrawThisTurn=true; },
  tuina:    (g) => { g.heal(99); g.state.stress=0; g.log("推拿放松！恢复至满状态","special"); },
  anjianyi: (g) => { g.gainShield(20); g.heal(8); },

  // === 社交派 ===
  qingke:   (g) => { g.state.enemyDmgReduction=(g.state.enemyDmgReduction||0)+4; g.log("请客后敌人攻击-4","special"); },
  bagua:    (g) => { g.dealDamageToEnemy(3); g.drawCards(1); },
  lapai:    (g) => { g.modifyEnergy(5); g.gainShield(10); },
  paimapi:  (g) => { g.gainShield(14); g.applyWeak(2); },
  qizhiyanjiang:(g) => {
    var socialCount=g.state._socialPlayed||0;
    var dmg=4+socialCount*4;
    g.dealDamageToEnemy(dmg);
    g.log("即兴演讲："+dmg+"伤害("+socialCount+"张社交卡)","special");
  },
  neibu:    (g) => {
    var lastId=g.state._lastCardPlayed;
    if(lastId&&cardActions[lastId]){
      g.log("内部推荐：复制"+lastId,"special");
      cardActions[lastId](g);
    } else {
      g.drawCards(2);
    }
  },
};

// Track last card played for synergy/recommendation
export function trackCardPlayed(cardId, state) {
  var faction=state._lastFaction||null;
  var currentFaction=null;
  // Look up faction from card data
  if(cardId){
    state._lastCardPlayed=cardId;
  }
}

// Execute a card's action by looking up its id
export function executeCardAction(cardId, ctx) {
  var action = cardActions[cardId];
  if (action) {
    action(ctx);
  }
}
