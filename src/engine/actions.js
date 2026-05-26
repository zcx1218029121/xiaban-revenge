// actions.js — state manipulation (Phase 2 extraction)
import { s } from './core.js';
import { RELICS } from '../data/relics.js';
import { updateHUD, updateHand, log, updateAll } from './ui.js';

export function hasRelic(st, id){
  var s = st.state ? st.state : st;
  return s.relics.some(function(r){ return r.id===id||r.name===id; });
}

export function triggerRelic(st, event){
  var args=Array.prototype.slice.call(arguments,2);
  var s = st.state ? st.state : st;
  // Iterate PLAYER INVENTORY (s.relics), not template array (RELICS)
  (s.relics||[]).forEach(function(r){
    if(r.used===true) return;
    if(typeof r[event]==='function'){ var result=r[event].apply(r,args); if(result!==undefined) args[0]=result; }
  });
  return args[0];
}

export function addStress(n){
  var prev=s.stress;s.stress+=n;
  if(s.stress>=10&&prev<10){s.breakdown=true;document.body.classList.add("breakdown");log("崩溃！本回合伤害x2.5！","stress");}
  log("压力 +"+n+" ("+s.stress+"/10)","stress");updateAll();
}

export function heal(n){
  if(hasRelic(s,"renshen")) n=Math.min(n,12);
  var old=s.php;s.php=Math.min(s.pmax,s.php+n);
  var healed=s.php-old;
  if(healed>0) log("治疗 "+healed+" HP","heal");
}

export function gainShield(n){
  if(s.noShieldTurns>0){ log("本回合无法获得护盾！","stress"); return; }
  s.sh+=n;log("护盾 +"+n,"heal");
}

export function modifyEnergy(n){ s.en=Math.max(0,s.en+n); updateHUD(); }

export function applyWeak(n){
  if(!s.ene||s.ene.canWeaken===false) return;
  s.ene.weak=(s.ene.weak||0)+n;
  log(s.ene.name+" 获得"+n+"层虚弱","event");
}

export function applyPoison(n){
  if(!s.ene) return;
  s.ene.poison=(s.ene.poison||0)+n;
  log(s.ene.name+" 中毒 +"+n+"层（每回合"+n+"伤害）","special");
}

export function shuffle(arr){
  for(var i=arr.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var tmp=arr[i];arr[i]=arr[j];arr[j]=tmp;}
  return arr;
}

export function drawCards(n){
  if(s.noDrawThisTurn){ s.noDrawThisTurn=false; updateHand(); return; }
  for(var i=0;i<n;i++){
    if(s.deck.length===0){
      if(s.disc.length===0) break; // nowhere to draw from
      s.deck=shuffle(s.disc.slice()); // reshuffle discard -> deck
      s.disc=[];
    }
    var card=s.deck.pop();
    if(card) s.hand.push(card);
  }
  updateHand();
}

// dealDamageToEnemy moved from combat.js (Phase 2)
export function dealDamageToEnemy(n){
  if(!s.ene) return false;
  var e=s.ene;
  var bonus=0;
  if(hasRelic(s,"jixie")) bonus+=2;
  var wm=(e.weak&&e.weak>0)?Math.pow(0.75,e.weak):1;
  var fd=Math.floor((n+bonus)*wm);
  var sm=1;
  if(s.stress>=10){sm=2.5;if(!s.breakdown){s.breakdown=true;document.body.classList.add("breakdown");log("崩溃！伤害x2.5！","stress");}}
  else if(s.stress>=7) sm=1.5;
  else if(s.stress>=4) sm=1.25;
  fd=Math.floor(fd*sm);
  if(s.tempDmgMult){ fd=Math.floor(fd*s.tempDmgMult); s.tempDmgMult=0; } // consume after use
  if(e.armor&&e.armor>0){var ab=Math.min(e.armor,fd);e.armor-=ab;fd-=ab;if(ab>0) log("护甲抵消"+ab+"伤害","heal");}
  e.hp=Math.max(0,e.hp-fd);
  if(e.weak>0) e.weak--;
  flashEnemy();
  showDmgPopup(document.getElementById("enemy-sprite"),fd);
  var wstr=e.weak>0?" (剩"+e.weak+"层虚弱)":"";
  log("造成"+fd+"伤害"+wstr+(sm>1?" ("+Math.round((sm-1)*100)+"%愤怒)":""),"damage");
  updateEnemyDisplay(makeCtx);
  s._pendingKill=(e.hp<=0); // mark kill for post-action check
  return (e.hp<=0);
}
