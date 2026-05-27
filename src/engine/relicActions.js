// relicActions.js — Relic effect functions separated from relic data
import { getState } from './core.js';
import { log } from './ui.js';
import { drawCards, heal } from './actions.js';

// Relic behavior lookup by relic id
export const relicActions = {
  jiangya: (st, event) => {
    if (event === 'onBattleStart') st.stress = Math.max(0, st.stress - 2);
  },
  kafei: (st, event) => {
    if (event === 'onBattleStart') {
      st.en = Math.min(st.men, st.en + 1);
      log("咖啡提神！能量+1", "special");
    }
  },
  parking: (st, event) => {
    if (event === 'onBattleStart') {
      st.sh += 8;
      log("占了个好车位！+8护盾", "special");
    }
  },
  yugang: (st, event) => {
    if (event === 'onFightWin') {
      if (Math.random() < 0.3) {
        drawCards(1);
        log("鱼缸里的鱼给你带来了好运！抽1张", "special");
      }
    }
  },
  beiyong: (st, event, n) => {
    if (event === 'onDamaged') {
      var playerRelic = st.relics.find(function(r) { return r.id === "beiyong"; });
      if (!playerRelic || playerRelic.used || n <= 0) return n;
      playerRelic.used = true;
      log("备用金用尽！抵消" + Math.min(n, 15) + "伤害", "special");
      return Math.max(0, n - 15);
    }
  },
  hrtousu: (st, event) => {
    if (event === 'onBattleStart') {
      if (st.ene) {
        st.ene.weak = (st.ene.weak || 0) + 1;
        log("HR已投诉！敌人获得1层虚弱", "special");
      }
    }
  },
  jinsheng: (st, event) => {
    if (event === 'onDayEnd') {
      st.stress = Math.max(0, st.stress - 3);
      log("收到晋升通知！压力-3", "special");
    }
  },
  huiyi: (st, event) => {
    if (event === 'onDayStart') {
      drawCards(2);
      log("预定了会议室！抽2张", "special");
    }
  },
  '996cup': (st, event, n) => {
    if (event === 'onDamageDealt') {
      if (st.stress >= 7) return Math.floor(n * 1.5);
      return n;
    }
    if (event === 'onFightWin') {
      if (st.stress >= 7) {
        heal(5);
        log("996奖杯：击杀回血5HP", "special");
      }
    }
  },
  jiangyan: (st, event, n) => {
    if (event === 'onDamaged') return n; // handled inline in poison tick
  },
};

// Execute a relic's action
export function executeRelicAction(relicId, event, ...args) {
  var state = typeof relicId === 'object' ? relicId : getState();
  var id = typeof relicId === 'object' ? relicId.id : relicId;
  var action = relicActions[id];
  if (action) {
    return action(state, event, ...args);
  }
}
