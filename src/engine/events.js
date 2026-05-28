// events.js — event system with branching routes (Phase 5)
import { s } from './core.js';
import { makeCtx } from './ctx.js';
import { triggerRelic, heal, drawCards } from './actions.js';
import { log, hideAll, showScreen, updateAll, updateEnemyDisplay } from './ui.js';
import { deepCopy } from '../data/constants.js';
import { CP } from '../data/cards.js';
import { RELICS } from '../data/relics.js';
import { ROUTES } from '../data/routes.js';
import { EN, ENEMY_POOLS, getRandomEnemy, getRandomElite } from '../data/enemies.js';
import { BD } from '../data/bosses.js';
import { endDay } from './game.js';

var _currentEvents = [];
var _currentBranch = null;

export function processCurrentEvent(){
  var evts = _currentEvents.length > 0 ? _currentEvents : getRouteEvents();
  if(evts.length === 0) return; // route choice showing, wait for player
  _currentEvents = evts;
  if(s.idx >= evts.length){ endDay(); return; }
  var ev = evts[s.idx];
  if(s.skipNextEvent && s.idx < evts.length - 1){
    s.skipNextEvent = false; s.idx++; processCurrentEvent(); return;
  }
  document.getElementById("time-label").textContent = ev.time;
  if(ev.type === "lunch"){ handleLunch(); }
  else if(ev.type === "fight"){ startFight(ev.key); }
  else if(ev.type === "elite_fight"){ startEliteFight(); }
  else if(ev.type === "heal"){ handleHealNode(ev.value || 5); }
  else if(ev.type === "curse_event"){ handleCurseEvent(ev); }
  else if(ev.type === "boss"){ startBoss(ev.key); }
  else if(ev.type === "ch"){ showChoice(ev); }
}

function getRouteEvents(){
  var route = ROUTES[s.day];
  if(!route) return [];
  // Use saved branch or show route choice
  if(!_currentBranch){
    showRouteChoice(route);
    return []; // wait for player choice
  }
  return route.branches[_currentBranch] || [];
}

function showRouteChoice(route){
  hideAll();
  s.ene = null;
  showScreen("event-screen");
  document.getElementById("event-title").textContent = "选择路线";
  var branches = Object.keys(route.branches);
  var descriptions = {
    safe: "🟢 安全路线 — 轻松战斗、更多治疗、较少奖励",
    neutral: "🔵 中立路线 — 均衡战斗与奖励",
    risk: "🔴 风险路线 — 精英战斗、诅咒卡、丰厚回报",
  };
  document.getElementById("event-desc").textContent = "Day "+s.day+" — 选择你的路线：";
  var btns = document.getElementById("choice-btns");
  btns.innerHTML = "";
  branches.forEach(function(branch){
    var btn = document.createElement("button");
    btn.className = "choice-btn";
    btn.textContent = (descriptions[branch] || branch);
    btn.onclick = function(){
      _currentBranch = branch;
      _currentEvents = route.branches[branch].slice();
      s.idx = 0;
      hideAll(); showScreen("battle-ui"); updateAll();
      processCurrentEvent();
    };
    btns.appendChild(btn);
  });
}

export function advanceEvent(){ s.idx++; processCurrentEvent(); }

export function handleLunch(){
  var healAmt = s.day >= 5 ? 15 : (s.day >= 3 ? 12 : 10);
  // Check for 折叠床 relic (doubles lunch effect)
  if(s.relics.some(function(r){ return r.id === "zhediechuang"; })){
    healAmt *= 2;
    log("折叠床上好好休息！午餐效果翻倍","heal");
  }
  heal(healAmt);
  s.stress = Math.max(0, s.stress - 2);
  s.en = s.men;
  if(s.day >= 5){ s.stress = 0; log("周五午餐！压力清零，能量已刷新！","heal"); }
  else { log("午餐时间！回复"+healAmt+"HP，压力-2，能量已刷新","heal"); }
  updateAll();
  setTimeout(function(){ advanceEvent(); }, 900);
}

export function startFight(key, isElite){
  var e;
  if(isElite){
    e = getRandomElite(s.day);
  } else if(!key || key === "random"){
    e = getRandomEnemy(s.day);
  } else {
    e = EN[key];
  }
  if(!e) return;
  var hpMult = [1, 1.1, 1.2, 1.3, 1.5][s.day - 1] || 1;
  s.resetForBattle();
  s.boss = false; s.ic = true;
  s.ene = {name: e.name, emoji: e.emoji, maxHp: Math.floor(e.maxHp * hpMult), hp: Math.floor(e.maxHp * hpMult),
           weak: 0, shield: 0, armor: 0, poison: 0, isElite: e.isElite || false, canWeaken: e.canWeaken,
           getIL: e.getIL, onTurn: e.onTurn, faction: e.faction};
  if(s.nextBattleBonusDmg){ s.tempDmgMult += (s.nextBattleBonusDmg / 8); s.nextBattleBonusDmg = 0; }
  if(s.nextBattleStress){ s.stress += s.nextBattleStress; s.nextBattleStress = 0; }
  var drawN = 5 + (s.nextBattleDraw || 0); s.nextBattleDraw = 0;
  drawCards(drawN);
  triggerRelic(s, "onBattleStart");
  updateEnemyDisplay(makeCtx); updateAll();
  log(e.name + " 出现了！", "event");
}

export function startEliteFight(){
  startFight(null, true);
}

export function handleHealNode(value){
  heal(value);
  log("休息节点：回复"+value+"HP", "heal");
  updateAll();
  setTimeout(function(){ advanceEvent(); }, 800);
}

export function handleCurseEvent(ev){
  // Narrative event that may add a curse to deck
  hideAll();
  showScreen("event-screen");
  document.getElementById("event-title").textContent = ev.title || "诅咒事件";
  document.getElementById("event-desc").textContent = ev.desc || "前方有危险...";
  var btns = document.getElementById("choice-btns");
  btns.innerHTML = "";
  // Option 1: Risk it (get curse + reward)
  var btn1 = document.createElement("button");
  btn1.className = "choice-btn";
  btn1.textContent = ev.riskText || "冒险前进（获得诅咒卡+奖励）";
  btn1.onclick = function(){
    if(ev.curseCard){
      s.deck.push(deepCopy(CP[ev.curseCard]));
      log("获得诅咒卡：" + CP[ev.curseCard].name, "stress");
    }
    if(ev.reward) ev.reward(makeCtx());
    hideAll(); showScreen("battle-ui"); updateAll(); advanceEvent();
  };
  // Option 2: Avoid (take stress penalty)
  var btn2 = document.createElement("button");
  btn2.className = "choice-btn";
  btn2.textContent = ev.avoidText || "绕道（+2压力）";
  btn2.onclick = function(){
    var g = makeCtx();
    g.addStress(2);
    hideAll(); showScreen("battle-ui"); updateAll(); advanceEvent();
  };
  btns.appendChild(btn1);
  btns.appendChild(btn2);
}

export function startBoss(key){
  var b = BD[key];
  if(!b) return;
  var hpMult = [1, 1.1, 1.2, 1.3, 1.5][s.day - 1] || 1;
  s.resetForBattle();
  s.boss = true; s.ic = true; s.biIdx = 0;
  s.ene = {name: b.name, emoji: b.emoji, maxHp: Math.floor(b.maxHp * hpMult), hp: Math.floor(b.maxHp * hpMult),
           weak: 0, shield: 0, armor: 0, charge: 0, poison: 0, ints: b.ints, onTurn: b.onTurn, getIL: b.getIL};
  if(s.nextBattleBonusDmg){ s.tempDmgMult += (s.nextBattleBonusDmg / 8); s.nextBattleBonusDmg = 0; }
  drawCards(5);
  triggerRelic(s, "onBattleStart");
  updateEnemyDisplay(makeCtx); updateAll();
  log("BOSS战：" + b.name + "！", "event");
}

// Endless mode
export function startEndlessFight(){
  s.resetForBattle();
  s.ic = true;
  var isBoss = s.floor % 5 === 0;
  var isSuper = s.floor % 10 === 0;
  var allBosses = Object.keys(BD);
  var allEnemies = Object.keys(EN).filter(function(k){ return !EN[k].isElite; });
  var allElites = Object.keys(EN).filter(function(k){ return EN[k].isElite; });
  var scale = 1 + Math.floor((s.floor - 1) * 0.08 * 10) / 10;
  if(isSuper){
    var b = BD[allBosses[Math.floor(Math.random() * allBosses.length)]];
    s.boss = true; s.biIdx = 0;
    s.ene = {name: b.name + " ⭐", emoji: b.emoji, maxHp: Math.floor(b.maxHp * scale * 1.8),
             hp: Math.floor(b.maxHp * scale * 1.8), weak: 0, shield: 0, armor: 0, charge: 0, poison: 0,
             ints: b.ints, onTurn: b.onTurn, getIL: b.getIL};
    log("超级BOSS！第" + s.floor + "层：" + b.name, "event");
  } else if(isBoss){
    var b2 = BD[allBosses[Math.floor(Math.random() * allBosses.length)]];
    s.boss = true; s.biIdx = 0;
    s.ene = {name: b2.name, emoji: b2.emoji, maxHp: Math.floor(b2.maxHp * scale),
             hp: Math.floor(b2.maxHp * scale), weak: 0, shield: 0, armor: 0, charge: 0, poison: 0,
             ints: b2.ints, onTurn: b2.onTurn, getIL: b2.getIL};
    log("BOSS！第" + s.floor + "层：" + b2.name, "event");
  } else if(s.floor % 3 === 0 && allElites.length > 0){
    var e = allElites[Math.floor(Math.random() * allElites.length)];
    var ed = EN[e];
    s.boss = false;
    s.ene = {name: ed.name + "(精英)", emoji: ed.emoji, maxHp: Math.floor(ed.maxHp * scale),
             hp: Math.floor(ed.maxHp * scale), weak: 0, shield: 0, armor: 0, poison: 0,
             isElite: true, canWeaken: ed.canWeaken, getIL: ed.getIL, onTurn: ed.onTurn};
    log("精英！第" + s.floor + "层：" + ed.name, "event");
  } else {
    var k2 = allEnemies[Math.floor(Math.random() * allEnemies.length)];
    var d2 = EN[k2];
    s.boss = false;
    s.ene = {name: d2.name, emoji: d2.emoji, maxHp: Math.floor(d2.maxHp * scale),
             hp: Math.floor(d2.maxHp * scale), weak: 0, shield: 0, armor: 0, poison: 0,
             isElite: d2.isElite || false, canWeaken: d2.canWeaken, getIL: d2.getIL, onTurn: d2.onTurn};
  }
  var drawN = 5 + (s.stress >= 7 ? 1 : 0);
  drawCards(drawN);
  hideAll(); showScreen("battle-ui");
  updateEnemyDisplay(makeCtx); updateAll();
}

export function showChoice(ev){
  hideAll();
  s.ene = null;
  var enemyNameEl = document.getElementById("enemy-name");
  if(enemyNameEl) enemyNameEl.textContent = "";
  var enemyHpFill = document.getElementById("enemy-hp-fill");
  if(enemyHpFill) enemyHpFill.style.width = "0%";
  var enemyIntentEl = document.getElementById("enemy-intent");
  if(enemyIntentEl) enemyIntentEl.textContent = "";
  var enemySpriteEl = document.getElementById("enemy-sprite");
  if(enemySpriteEl) enemySpriteEl.textContent = "?";
  showScreen("event-screen");
  document.getElementById("event-title").textContent = ev.title;
  document.getElementById("event-desc").textContent = ev.desc;
  var btns = document.getElementById("choice-btns");
  btns.innerHTML = "";
  ev.chs.forEach(function(c){
    var btn = document.createElement("button");
    btn.className = "choice-btn";
    btn.textContent = c.text;
    btn.onclick = function(){
      c.ef(makeCtx());
      hideAll(); showScreen("battle-ui"); updateAll(); advanceEvent();
    };
    btns.appendChild(btn);
  });
}

// Reset route state (called on new game / new day)
export function resetRouteState(){
  _currentEvents = [];
  _currentBranch = null;
}

export { _currentEvents, _currentBranch };
