// relicActions.js — Relic effect functions
import { getState } from './core.js';
import { log } from './ui.js';
import { drawCards, heal } from './actions.js';

export const relicActions = {
  // ============================================================
  // Common
  // ============================================================
  jiangya: (st, event) => {
    if (event === 'onBattleStart') st.stress = Math.max(0, st.stress - 2);
  },
  baowen_rc: (st, event) => {
    if (event === 'onBattleStart') { st.php = Math.min(st.pmax, st.php + 3); log("保温杯暖暖的！+3HP","heal"); }
  },
  bianqian: (st, event) => {
    if (event === 'onTurnEnd') { st.sh += 1; }
  },
  chongdian: (st, event) => {
    if (event === 'onBattleStart') { st.en = Math.min(st.men, st.en + 1); log("充电器！能量+1","special"); }
  },
  lvzhi: (st, event) => {
    if (event === 'onDayEnd') { st.php = Math.min(st.pmax, st.php + 5); log("绿植净化空气！+5HP","heal"); }
  },
  kouxiang: (st, event, n) => {
    if (event === 'onStress' && st._kouxiangUsed !== true) {
      st._kouxiangUsed = true;
      return Math.min(n, 1);
    }
  },
  tuoxie: (st, event, n) => {
    if (event === 'onDamaged' && st._tuoxieUsed !== true && n > 0) {
      st._tuoxieUsed = true;
      log("拖鞋帮你挡了一下！-3伤害","special");
      return Math.max(0, n - 3);
    }
  },
  makebei: (st, event) => {
    if (event === 'onBattleStart') { drawCards(1); log("来杯咖啡！抽1张","special"); }
  },
  erji: (st, event) => {
    if (event === 'onTurnEnd' && st.stress >= 6) {
      st.stress = Math.max(0, st.stress - 1);
    }
  },
  lingshi: (st, event) => {
    if (event === 'onFightWin') { heal(3); log("吃点零食补充能量！+3HP","heal"); }
  },
  naozhong: (st, event) => {
    if (event === 'onDayStart') { st.en = Math.min(st.men, st.en + 1); st.men = Math.min(st.men, st.men + 0); }
  },
  shubiaodian: (st, event, n) => {
    if (event === 'onDamageDealt' && typeof n === 'number') return n + 1;
  },
  humujing: (st, event, n) => {
    if (event === 'onDamageDealt' && typeof n === 'number' && st._humujingUsed !== true) {
      st._humujingUsed = true;
      return n + 5;
    }
  },
  taideng: (st, event) => {
    if (event === 'onTurnEnd' && st.sh > 0) { st.sh += 1; }
  },
  naozhong: (st, event) => {
    if (event === 'onDayStart') { st.en += 1; st.men += 1; }
  },

  // ============================================================
  // Uncommon
  // ============================================================
  kafei: (st, event) => {
    if (event === 'onBattleStart') {
      st.en = Math.min(st.men, st.en + 1);
      log("咖啡提神！能量+1","special");
    }
  },
  parking: (st, event) => {
    if (event === 'onBattleStart') {
      st.sh += 8;
      log("占了个好车位！+8护盾","special");
    }
  },
  yugang: (st, event) => {
    if (event === 'onFightWin') {
      if (Math.random() < 0.3) {
        drawCards(1);
        log("鱼缸里的鱼给你带来了好运！抽1张","special");
      }
    }
  },
  jinsheng: (st, event) => {
    if (event === 'onDayEnd') {
      st.stress = Math.max(0, st.stress - 3);
      log("收到晋升通知！压力-3","special");
    }
  },
  '996cup': (st, event, n) => {
    if (event === 'onDamageDealt') {
      if (st.stress >= 7) return Math.floor(n * 1.5);
      return n;
    }
    if (event === 'onFightWin') {
      if (st.stress >= 7) { heal(5); log("996奖杯：击杀回血5HP","special"); }
    }
  },
  jiangyan: (st, event, n) => {
    if (event === 'onDamaged') return n;
  },
  zhediechuang: (st, event) => {
    // handled in events.js lunch logic
  },
  kafeijiaonang: (st, event) => {
    if (event === 'onBattleStart') {
      st.en = Math.min(st.men, st.en + 2);
      st.stress = Math.min(10, st.stress + 2);
      log("咖啡胶囊！能量+2，但压力+2","special");
    }
  },
  gongsi_gupiao: (st, event) => {
    // handled in rewards.js
  },
  gongpaitao: (st, event) => {
    if (event === 'onBattleStart' && st.boss) {
      st.sh += 15;
      log("工牌护体！+15护盾","special");
    }
  },
  yanzhao: (st, event) => {
    if (event === 'onDayStart') {
      st.php = Math.min(st.pmax, st.php + 10);
      log("午睡后精神饱满！+10HP","heal");
    }
  },
  yinxiang: (st, event, n) => {
    if (event === 'onDamaged' && st._yinxiangUsed !== true && n > 0) {
      st._yinxiangUsed = true;
      log("音箱的震动分散了注意力！-5伤害","special");
      return Math.max(0, n - 5);
    }
  },

  // ============================================================
  // Rare
  // ============================================================
  beiyong: (st, event, n) => {
    if (event === 'onDamaged') {
      var pr = st.relics.find(function(r) { return r.id === "beiyong"; });
      if (!pr || pr.used || n <= 0) return n;
      pr.used = true;
      log("备用金用尽！抵消" + Math.min(n, 15) + "伤害","special");
      return Math.max(0, n - 15);
    }
  },
  hrtousu: (st, event) => {
    if (event === 'onBattleStart' && st.ene) {
      st.ene.weak = (st.ene.weak || 0) + 1;
      log("HR已投诉！敌人获得1层虚弱","special");
    }
  },
  huiyi: (st, event) => {
    if (event === 'onDayStart') {
      drawCards(2);
      log("预定了会议室！抽2张","special");
    }
  },
  diantika: (st, event, n) => {
    if (event === 'onGainShield' && typeof n === 'number') {
      return Math.floor(n * 1.5);
    }
  },
  jiabanfei: (st, event, n) => {
    if (event === 'onHeal' && st.stress >= 7 && typeof n === 'number') {
      return n * 2;
    }
  },
  caiyuan_md: (st, event, n) => {
    if (event === 'onDamageDealt' && st.boss && typeof n === 'number') {
      return n * 2;
    }
  },
  nianzhongjiang: (st, event) => {
    if (event === 'onDayStart') {
      drawCards(3);
      st.stress = Math.max(0, st.stress - 5);
      log("年终奖到账！抽3张，压力-5","special");
    }
  },
  peiche: (st, event) => {
    if (event === 'onDayStart' || event === 'onBattleStart') {
      st.men += 1;
      st.en = Math.min(st.men, st.en + 1);
    }
  },

  // ============================================================
  // Legendary
  // ============================================================
  duli_bangongshi: (st, event, n) => {
    if (event === 'onCardCost' && typeof n === 'number') {
      return Math.max(0, n - 1);
    }
  },
  wuqixian: (st, event) => {
    if (event === 'onDeath' && st._wuqixianUsed !== true) {
      st._wuqixianUsed = true;
      st.php = st.pmax;
      st.go = false;
      log("无限期合同！满血复活！","special");
      return true; // revived
    }
  },
  shangshi: (st, event) => {
    // handled in rewards.js — double picks
  },
  laoban_xinren: (st, event) => {
    if (event === 'onBattleStart') {
      st.en = st.men;
      var drawN = st.pmax > 0 ? 7 - st.hand.length : 5;
      if (drawN > 0) drawCards(drawN);
      log("老板的信任！能量全满+手牌补满","special");
    }
  },

  // ============================================================
  // Cursed Relics
  // ============================================================
  jiaban_xieyi: (st, event) => {
    if (event === 'onBattleStart') {
      st.en = Math.min(st.men, st.en + 2);
      st.stress = Math.min(10, st.stress + 1);
    }
  },
  jiujiu_hetong: (st, event, n) => {
    if (event === 'onDamageDealt' && typeof n === 'number') return Math.floor(n * 1.3);
    if (event === 'onGainShield') { log("996合同：无法获得护盾！","stress"); return 0; }
  },
  jingye_xieyi: (st, event) => {
    if (event === 'onHeal') { log("竞业协议：无法治疗！","stress"); return 0; }
  },
  junlingzhuang: (st, event, n) => {
    if (event === 'onDamageDealt' && st.boss && typeof n === 'number') return n * 3;
    if (event === 'onEnemySpawn' && !st.boss) return Math.floor(n * 1.5);
  },
  zhongshen: (st, event) => {
    if (event === 'onBattleStart') {
      var loss = Math.floor(st.pmax * 0.1);
      st.php = Math.max(1, st.php - loss);
      st.pmax = Math.max(1, st.pmax - Math.floor(st.pmax * 0.05));
      log("终身合同的代价...失去"+loss+"HP上限","stress");
    }
  },
  hehuoren: (st, event) => {
    if (event === 'onFightWin') {
      st.disc = [];
      st.hand = [];
      log("合伙人协议：丢弃全部手牌","special");
    }
  },
};

export function executeRelicAction(relicId, event, ...args) {
  var state = typeof relicId === 'object' ? relicId : getState();
  var id = typeof relicId === 'object' ? relicId.id : relicId;
  var action = relicActions[id];
  if (action) {
    return action(state, event, ...args);
  }
}
