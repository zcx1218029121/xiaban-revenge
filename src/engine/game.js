// game.js — day/game flow with branching routes (Phase 5)
import { s } from './core.js';
import { triggerRelic } from './actions.js';
import { log, hideAll, showScreen, updateAll, updateDayProgress } from './ui.js';
import { RELICS } from '../data/relics.js';
import { ROUTES } from '../data/routes.js';
import { startBoss, processCurrentEvent, resetRouteState } from './events.js';

export function startGame(){
  s.reset();
  resetRouteState();
  hideAll();
  showScreen("day-transition");
  updateDayProgress();
  document.getElementById("day-banner").textContent = "Day " + s.day;
  document.getElementById("time-label").textContent = "09:00";
}

export function restartGame(){ startGame(); }

export function retryBoss(){
  // Find boss event from day's neutral branch
  var route = ROUTES[s.day];
  var bossKey = "linda"; // default
  if(route && route.branches){
    var branches = Object.values(route.branches);
    for(var i = 0; i < branches.length; i++){
      var bossEv = branches[i].filter(function(e){ return e.type === "boss"; })[0];
      if(bossEv){ bossKey = bossEv.key; break; }
    }
  }
  s.go = false;
  s.php = s.pmax;
  s.t = 1;
  hideAll();
  showScreen("battle-ui");
  startBoss(bossKey);
}

export function nextDay(){
  triggerRelic(s, "onDayEnd");
  s.day++;
  if(s.day > 5){ showScreen("finalwin-screen"); return; }
  triggerRelic(s, "onDayStart");
  s.idx = 0; s.stress = Math.floor(s.stress / 2); s.skipNextEvent = false;
  s.bossDamageMult = 1; s.en = 3; s.men = 3; s.equipment = [];
  resetRouteState();
  window._pendingAdvance = true;
  hideAll(); showScreen("day-transition"); updateDayProgress();
  document.getElementById("day-banner").textContent = "Day " + s.day;
  document.getElementById("time-label").textContent = "09:00";
}

export function winGameEarly(){
  s.go = true; s.clearBattle();
  setTimeout(function(){ showScreen("finalwin-screen"); }, 300);
}

export function proceedFromTransition(){
  hideAll(); showScreen("battle-ui");
  log("=== Day " + s.day + " 开始 ===", "turn");
  processCurrentEvent();
}

export function endDay(){
  window._pendingAdvance = false;
  hideAll();
  if(s.day >= 5){ showScreen("finalwin-screen"); }
  else {
    document.getElementById("dayclear-title").textContent = "Day " + s.day + " 完成！";
    document.getElementById("dayclear-sub").textContent = "今天准时下班了，明天继续";
    showScreen("dayclear-screen");
  }
}
