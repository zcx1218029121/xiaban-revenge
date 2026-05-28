// cardActions.js — Card effect functions + equipment effects
import { log } from './ui.js';

export const cardActions = {
  // ============================================================
  // === 通用 ===
  // ============================================================
  moyu:     (g) => g.drawCards(1),
  qingjia:  (g) => g.gainShield(6),
  xiehuier: (g) => g.gainShield(3),
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
  // New 通用
  cizhixin: (g) => { g.dealDamageToEnemy(30); g.log("辞职信燃尽！","special"); },
  tiaocao:  (g) => { g.state.tempDmgMult=(g.state.tempDmgMult||1)*3; g.dealDamageToEnemy(10); },
  nianduzongjie:(g) => { g.drawCards(3); },
  zhinengshoubiao:(g) => { g.gainShield(8); g.drawCards(1); },
  fengshui: (g) => { g.heal(10); g.state.stress=Math.max(0,g.state.stress-2); },
  qianggong:(g) => { g.dealDamageToEnemy(12); g.heal(5); },
  daidaka:  (g) => g.gainShield(4),
  diaogang: (g) => { g.dealDamageToEnemy(18); g.applyWeak(2); g.state.stress=Math.max(0,g.state.stress-2); },

  // ============================================================
  // === 卷王派 ===
  // ============================================================
  guolaosi:  (g) => { var killed=g.dealDamageToEnemy(25); g.addStress(4); if(killed) g.heal(12); },
  cusi:      (g) => { var killed=g.dealDamageToEnemy(14); g.addStress(2); if(killed) g.heal(8); },
  chongci:   (g) => { g.dealDamageToEnemy(12); g.addStress(2); },
  tongxiao:  (g) => { g.dealDamageToEnemy(22); g.addStress(3); },
  lingqisan: (g) => { g.addStress(6); var mult=g.state.tempDmgMult||1; g.state.tempDmgMult=mult*1.5; g.dealDamageToEnemy(40); },
  jixiao:    (g) => { var killed=g.dealDamageToEnemy(8); g.addStress(1); if(killed) g.gainShield(3); },
  // New 卷王
  jiujiufubao:(g) => { g.addStress(5); g.dealDamageToEnemy(50); },
  lianhuanjiaban:(g) => { g.dealDamageToEnemy(20); g.addStress(3); },
  mobanditie:(g) => { g.dealDamageToEnemy(10); g.addStress(1); },
  zhoumojiaban:(g) => { g.dealDamageToEnemy(16); g.addStress(2); g.drawCards(1); },
  sixianchongci:(g) => { g.dealDamageToEnemy(15); },
  duomingcall:(g) => { g.state.enemySkipNext=true; g.addStress(2); g.log("连环夺命call！敌人跳过","special"); },
  lingchen3: (g) => { var killed=g.dealDamageToEnemy(28); g.addStress(3); if(killed) g.heal(12); },
  dengxia:   (g) => { var dmg=g.state.stress>=7?12:7; g.dealDamageToEnemy(dmg); },

  // ============================================================
  // === 摸鱼派 ===
  // ============================================================
  paogouqi:  (g) => { g.gainShield(6); g.applyPoison(3); },
  manxing:   (g) => { g.applyPoison(5); g.state.noDrawThisTurn=true; },
  bingjiatiao:(g) => { g.gainShield(4); var e=g.enemy; if(e&&e.poison>0){ var bonus=e.poison; g.dealDamageToEnemy(bonus); g.log("病假加成："+bonus+"额外伤害","special"); g.updateAll(); } },
  zunshixiaban:(g)=> { g.state.stress=Math.max(0,g.state.stress-2); g.state.immuneThisTurn=true; g.log("准时下班！本回合免疫攻击","special"); },
  toulandashi:(g) => { g.state.enemySkipNext=true; g.log("偷懒成功！敌人下回合跳过","special"); },
  xialing:  (g) => { g.modifyEnergy(2); g.state.immuneThisTurn=true; g.log("夏令时！免疫本回合","special"); },
  babaozhou:(g) => { g.heal(4); g.state.stress=Math.max(0,g.state.stress-1); },
  // New 摸鱼
  daixinlashi:(g) => { g.state.immuneThisTurn=true; g.state._immuneTurns=(g.state._immuneTurns||0)+3; g.state.stress=Math.max(0,g.state.stress-3); g.log("带薪拉屎！免疫3回合","special"); },
  gongweiyinshen:(g) => { g.gainShield(20); },
  cesuobilan:(g) => { g.gainShield(6); g.state.stress=Math.max(0,g.state.stress-1); },
  zhuangmang:(g) => g.gainShield(3),
  zaotui:   (g) => { g.gainShield(8); g.state.immuneThisTurn=true; g.log("早退！免疫本回合","special"); },
  pingmu:   (g) => { g.applyWeak(1); g.gainShield(3); },
  shuaweibo:(g) => { g.drawCards(1); g.state.stress=Math.max(0,g.state.stress-1); },
  naicha:   (g) => { g.heal(6); g.drawCards(1); },

  // ============================================================
  // === 养生派 ===
  // ============================================================
  wushui:   (g) => { g.heal(10); g.addStress(1); },
  jianshen: (g) => { g.heal(6); g.gainShield(10); },
  yangshengcha:(g) => { g.state.stress=Math.max(0,g.state.stress-3); },
  mingxiang:(g) => { g.state.stress=Math.max(0,g.state.stress-2); g.drawCards(1); },
  tijiandan:(g) => { g.heal(15); g.state.noDrawThisTurn=true; },
  tuina:    (g) => { g.heal(99); g.state.stress=0; g.log("推拿放松！恢复至满状态","special"); },
  anjianyi: (g) => { g.gainShield(20); g.heal(8); },
  // New 养生
  yangshengdashi:(g) => { g.heal(25); g.state.stress=0; g.log("养生大师！完全恢复","special"); },
  mingxiangkongjian:(g) => { g.gainShield(15); g.state.stress=Math.max(0,g.state.stress-3); },
  yanbaojiancao:(g) => { g.heal(3); },
  gouqipaoshui:(g) => { g.heal(5); g.state.stress=Math.max(0,g.state.stress-1); },
  sanbu:    (g) => { g.gainShield(4); g.heal(3); },
  weishengsu:(g) => { g.heal(8); g.state._nextBattleEnergy=(g.state._nextBattleEnergy||0)+1; g.log("维生素：下回合+1能量","special"); },
  lashen:   (g) => { g.state.stress=Math.max(0,g.state.stress-2); },
  zhongyi:  (g) => { g.heal(18); g.state.playerWeak=0; g.state.noShieldTurns=0; g.log("中医调理！移除所有负面状态","special"); },

  // ============================================================
  // === 社交派 ===
  // ============================================================
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
  // New 社交
  tuanjianhuodong:(g) => { g.dealDamageToEnemy(15); g.applyWeak(2); },
  lizhiyanshuo:(g) => { g.applyWeak(3); g.applyPoison(5); g.log("离职演说！虚弱+中毒","special"); },
  chashui:  (g) => { g.dealDamageToEnemy(5); g.drawCards(1); },
  jucan:    (g) => { g.gainShield(6); g.heal(3); },
  kuabumen: (g) => {
    var socialInHand=g.state.hand.filter(function(c){ return c.faction==="社交"; }).length;
    var dmg=10+socialInHand*3;
    g.dealDamageToEnemy(dmg);
    g.log("跨部门合作："+socialInHand+"张社交卡="+dmg+"伤害","special");
  },
  lietou:   (g) => {
    // Draw 3 cards from deck/disc, if any rare card is found, add it to hand
    var picks=[];
    var allCards=g.state.deck.concat(g.state.disc);
    var rares=allCards.filter(function(c){ return c.rarity==="R"; });
    if(rares.length>0){
      var pick=rares[Math.floor(Math.random()*rares.length)];
      g.state.hand.push(pick);
      g.log("猎头电话：获得 "+pick.name+"！","special");
      g.updateHand();
    } else {
      g.drawCards(3);
      g.log("猎头电话：没有稀有卡，抽3张","special");
    }
  },
  neibuxiaoxi:(g) => { g.drawCards(2); },
  gaoxiaotuanti:(g) => { g.applyWeak(2); g.gainShield(6); },
  // Curse removal cards (playable curses - pay cost to remove)
  xueyashenggao:(g) => { g.dealDamageToPlayer ? g.dealDamageToPlayer(3) : (g.state.php=Math.max(0,g.state.php-3)); g.log("血压飙升！受到3伤害","damage"); },
  wuliaohuiyi:(g) => { g.drawCards(1); g.addStress(1); g.log("无聊会议...","stress"); },
  jingzhuibing:(g) => { g.state.breakdown=true; g.log("颈椎病发作！下回合无法出牌","stress"); },
  bangongshi:(g) => { g.addStress(3); g.log("办公室政治！压力+3","stress"); },
};

// ============================================================
// Equipment per-turn effects
// ============================================================
export const equipmentEffects = {
  bijiben:  function(s) { s.en+=1; s.men+=1; },
  mingpian: function(s) { s.sh+=2; },
  richen:   function(s) { s._equipDrawBonus=(s._equipDrawBonus||0)+1; },
  neijuan:  function(s) { s.tempDmgMult=(s.tempDmgMult||1)*1.3; },
  kafeiyin: function(s) { s.en+=1; s.men+=1; s.stress+=1; },
  moyu_master: function(s) { s.en+=1; s.men+=1; },
  equip_jiangzao: function(s) { s.enemyDmgReduction=(s.enemyDmgReduction||0)+2; },
  baowenbei:function(s) { s.php=Math.min(s.pmax,s.php+2); },
  anmoyi:   function(s) { s.php=Math.min(s.pmax,s.php+4); s.stress=Math.max(0,s.stress-1); },
  renmai:   function(s) { s._equipDrawBonus=(s._equipDrawBonus||0)+2; },
  minghao:  function(s) { s.tempDmgMult=(s.tempDmgMult||1)*1.2; },
};

// Process all equipment at end of turn
export function processEquipment(state) {
  var eqs=state.equipment||[];
  for(var i=eqs.length-1;i>=0;i--){
    var eq=eqs[i];
    var eff=equipmentEffects[eq.id];
    if(eff) eff(state);
    if(eq.charges!==undefined&&eq.charges>0){
      eq.charges--;
      if(eq.charges<=0){
        var removed=eqs.splice(i,1)[0];
        log(removed.name+" 耐久耗尽","event");
      }
    }
  }
}

// Track last card played for synergy/recommendation
export function trackCardPlayed(cardId, state) {
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
