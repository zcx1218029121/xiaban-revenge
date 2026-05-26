// events.js — event system (Phase 2 extraction)
import { s } from './core.js';
import { makeCtx } from './ctx.js';
import { triggerRelic, heal, drawCards } from './actions.js';
import { log, hideAll, showScreen, updateAll, updateEnemyDisplay } from './ui.js';
import { RELICS } from '../data/relics.js';
import { EVENTS } from '../data/events.js';
import { EN } from '../data/enemies.js';
import { BD } from '../data/bosses.js';
import { endDay } from './game.js';

export function processCurrentEvent(){
  var evts=EVENTS[s.day];
  if(s.idx>=evts.length){ endDay(); return; }
  var ev=evts[s.idx];
  if(s.skipNextEvent&&s.idx<evts.length-1){s.skipNextEvent=false;s.idx++;processCurrentEvent();return;}
  document.getElementById("time-label").textContent=ev.time;
  if(ev.type==="lunch"){ handleLunch(); }
  else if(ev.type==="fight"){ startFight(ev.key); }
  else if(ev.type==="boss"){ startBoss(ev.key); }
  else if(ev.type==="ch"){ showChoice(ev); }
}

export function advanceEvent(){ s.idx++;processCurrentEvent(); }

export function handleLunch(){
  var healAmt=s.day>=5?15:(s.day>=3?12:10);
  heal(healAmt);
  s.stress=Math.max(0,s.stress-2);
  s.en=s.men; // 刷新能量
  if(s.day>=5){ s.stress=0;log("周五午餐！压力清零，能量已刷新！","heal"); }
  else { log("午餐时间！回复"+healAmt+"HP，压力-2，能量已刷新","heal"); }
  updateAll();
  setTimeout(function(){ advanceEvent(); },900);
}

export function startFight(key){
  var e=EN[key];
  if(!e) return;
  var hpMult=[1,1.1,1.2,1.3,1.5][s.day-1]||1;
  s.resetForBattle();
  s.boss=false;s.ic=true;
  s.ene={name:e.name,emoji:e.emoji,maxHp:Math.floor(e.maxHp*hpMult),hp:Math.floor(e.maxHp*hpMult),weak:0,shield:0,armor:0,poison:0,isElite:e.isElite||false,canWeaken:e.canWeaken,getIL:e.getIL,onTurn:e.onTurn};
  if(s.nextBattleBonusDmg){ s.tempDmgMult+=(s.nextBattleBonusDmg/8);s.nextBattleBonusDmg=0; }
  if(s.nextBattleStress){ s.stress+=s.nextBattleStress;s.nextBattleStress=0; }
  var drawN=5+(s.nextBattleDraw||0);s.nextBattleDraw=0;
  drawCards(drawN);
  triggerRelic(s,"onBattleStart");
  updateEnemyDisplay(makeCtx);updateAll();
  log(e.name+" 出现了！","event");
}

export function startBoss(key){
  var b=BD[key];
  if(!b) return;
  var hpMult=[1,1.1,1.2,1.3,1.5][s.day-1]||1;
  s.resetForBattle();
  s.boss=true;s.ic=true;s.biIdx=0;
  s.ene={name:b.name,emoji:b.emoji,maxHp:Math.floor(b.maxHp*hpMult),hp:Math.floor(b.maxHp*hpMult),weak:0,shield:0,armor:0,charge:0,poison:0,ints:b.ints,onTurn:b.onTurn,getIL:b.getIL};
  if(s.nextBattleBonusDmg){ s.tempDmgMult+=(s.nextBattleBonusDmg/8);s.nextBattleBonusDmg=0; }
  drawCards(5);
  triggerRelic(s,"onBattleStart");
  updateEnemyDisplay(makeCtx);updateAll();
  log("BOSS战："+b.name+"！","event");
}

export function showChoice(ev){
  hideAll();
  s.ene=null;
  var enemyNameEl=document.getElementById("enemy-name");
  if(enemyNameEl) enemyNameEl.textContent="";
  var enemyHpFill=document.getElementById("enemy-hp-fill");
  if(enemyHpFill) enemyHpFill.style.width="0%";
  var enemyIntentEl=document.getElementById("enemy-intent");
  if(enemyIntentEl) enemyIntentEl.textContent="";
  var enemySpriteEl=document.getElementById("enemy-sprite");
  if(enemySpriteEl) enemySpriteEl.textContent="?";
  showScreen("event-screen");
  document.getElementById("event-title").textContent=ev.title;
  document.getElementById("event-desc").textContent=ev.desc;
  var btns=document.getElementById("choice-btns");
  btns.innerHTML="";
  ev.chs.forEach(function(c){
    var btn=document.createElement("button");
    btn.className="choice-btn";
    btn.textContent=c.text;
    btn.onclick=function(){
      c.ef(makeCtx());
      hideAll();showScreen("battle-ui");updateAll();advanceEvent();
    };
    btns.appendChild(btn);
  });
}
