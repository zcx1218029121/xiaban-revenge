// actions.js — state manipulation (Phase 2 extraction)
import { getState } from './core.js';
import { RELICS } from '../data/relics.js';
import { updateHUD, updateHand, updateAll, updateEnemyDisplay, log,
         showDmgPopup, flashEnemy } from './ui.js';
import { relicActions, executeRelicAction } from './relicActions.js';

// Get current state (allows test injection)
function s() { return getState(); }

export function hasRelic(st, id){
  var st = st.state ? st.state : st;
  return st.relics.some(function(r){ return r.id===id||r.name===id; });
}

export function triggerRelic(st, event){
  var args=Array.prototype.slice.call(arguments,2);
  var st = st.state ? st.state : st;
  // Iterate PLAYER INVENTORY (st.relics), call action from relicActions
  (st.relics||[]).forEach(function(r){
    if(r.used===true) return;
    var action = relicActions[r.id];
    if(typeof action === 'function'){
      var result = action(st, event, ...args);
      if(result!==undefined) args[0]=result;
    }
  });
  return args[0];
}

export function addStress(n){
  var state=s(); var prev=state.stress;state.stress+=n;
  if(state.stress>=10&&prev<10){state.breakdown=true;log("崩溃！本回合伤害x2.5！","stress");}
  log("压力 +"+n+" ("+state.stress+"/10)","stress");updateAll();
}

export function heal(n){
  var state=s();
  if(hasRelic(state,"renshen")) n=Math.min(n,12);
  var old=state.php;state.php=Math.min(state.pmax,state.php+n);
  var healed=state.php-old;
  if(healed>0) log("治疗 "+healed+" HP","heal");
}

export function gainShield(n){
  var state=s();
  if(state.noShieldTurns>0){ log("本回合无法获得护盾！","stress"); return; }
  state.sh+=n;log("护盾 +"+n,"heal");
}

export function modifyEnergy(n){ var state=s(); state.en=Math.max(0,state.en+n); updateHUD(); }

export function applyWeak(n){
  var state=s();
  if(!state.ene||state.ene.canWeaken===false) return;
  state.ene.weak=(state.ene.weak||0)+n;
  log(state.ene.name+" 获得"+n+"层虚弱","event");
}

export function applyPoison(n){
  var state=s();
  if(!state.ene) return;
  state.ene.poison=(state.ene.poison||0)+n;
  log(state.ene.name+" 中毒 +"+n+"层（每回合"+n+"伤害）","special");
}

export function shuffle(arr){
  for(var i=arr.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var tmp=arr[i];arr[i]=arr[j];arr[j]=tmp;}
  return arr;
}

export function drawCards(n){
  var state=s();
  if(state.noDrawThisTurn){ state.noDrawThisTurn=false; updateHand(); return; }
  for(var i=0;i<n;i++){
    if(state.deck.length===0){
      if(state.disc.length===0) break; // nowhere to draw from
      state.deck=shuffle(state.disc.slice()); // reshuffle discard -> deck
      state.disc=[];
    }
    var card=state.deck.pop();
    if(card) state.hand.push(card);
  }
  updateHand();
}

// dealDamageToEnemy — pure state mutation, no UI side effects
export function dealDamageToEnemy(n){
  var state=s();
  if(!state.ene) return false;
  var e=state.ene;
  var bonus=0;
  if(hasRelic(state,"jixie")) bonus+=2;
  // Apply onDamageDealt relic effects (e.g., 996cup)
  n=triggerRelic(state,"onDamageDealt",n+bonus);
  var wm=(e.weak&&e.weak>0)?Math.pow(0.75,e.weak):1;
  var fd=Math.floor(n*wm);
  var sm=1;
  if(state.stress>=10){sm=2.5;if(!state.breakdown){state.breakdown=true;log("崩溃！伤害x2.5！","stress");}}
  else if(state.stress>=7) sm=1.5;
  else if(state.stress>=4) sm=1.25;
  fd=Math.floor(fd*sm);
  if(state.tempDmgMult){ fd=Math.floor(fd*state.tempDmgMult); state.tempDmgMult=0; }
  if(state.bossDamageMult>1){ fd=Math.floor(fd*state.bossDamageMult); }
  if(e.armor&&e.armor>0){var ab=Math.min(e.armor,fd);e.armor-=ab;fd-=ab;}
  e.hp=Math.max(0,e.hp-fd);
  if(e.weak>0) e.weak--;
  showDmgPopup(document.getElementById("enemy-sprite"),fd);
  flashEnemy();
  state._pendingKill=(e.hp<=0);
  return (e.hp<=0);
}

// dealDamageToPlayer — pure state mutation, no UI side effects
export function dealDamageToPlayer(n){
  var state=s();
  if(state.immuneThisTurn){ log("准时下班！免疫本次攻击","special"); state.immuneThisTurn=false; return; }
  if(state.enemyDmgReduction>0){ n=Math.max(0,n-state.enemyDmgReduction); state.enemyDmgReduction=0; }
  if(state.sh>0){var ab=Math.min(state.sh,n);state.sh-=ab;n-=ab;if(ab>0){showDmgPopup(document.getElementById("shield"),ab,true);log("护盾抵消"+ab,"heal");}}
  if(n>0){
    n=triggerRelic(state,"onDamaged",n);
    if(state.playerWeak>0){ n=Math.floor(n*0.75); }
    state.php=Math.max(0,state.php-n);
    showDmgPopup(document.getElementById("hp"),n);
    document.body.classList.add("shaking");
    setTimeout(function(){ document.body.classList.remove("shaking"); },300);
    log("受到"+n+"伤害","damage");
  }
  if(state.php<=0){ state._pendingKill=true; }
}
