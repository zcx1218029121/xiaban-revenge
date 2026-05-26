// rewards.js — reward screens (Phase 2 extraction)
import { s } from './core.js';
import { deepCopy } from './utils.js';
import { hasRelic } from './actions.js';
import { log, hideAll, showScreen, updateAll } from './ui.js';
import { RELICS } from '../data/relics.js';

export function showRelicScreen(){
  if(s.day===1&&s.boss&&s.relics.length<10){
    var pool=RELICS.filter(function(r){ return !hasRelic(s,r.id); });
    if(pool.length===0){ showRewardScreen(); return; }
    var choices=[];
    while(choices.length<3&&pool.length>0){
      var idx=Math.floor(Math.random()*pool.length);
      choices.push(pool.splice(idx,1)[0]);
    }
    var container=document.getElementById("relic-options");
    container.innerHTML="";
    choices.forEach(function(r){
      var el=document.createElement("div");
      el.className="relic-choice";
      el.innerHTML="<div style='font-size:2rem'>"+r.emoji+"</div><div style='color:#fff;font-weight:700;margin:6px 0'>"+r.name+"</div><div style='color:#aaa;font-size:.75rem'>"+r.desc+"</div>";
      el.onclick=function(){
        s.relics.push(deepCopy(r));
        hideAll();showScreen("battle-ui");updateAll();
        setTimeout(function(){ showRewardScreen(); },200);
      };
      container.appendChild(el);
    });
    setTimeout(function(){ hideAll();showScreen("relic-screen"); },300);
  } else {
    showRewardScreen();
  }
}

export function skipRelic(){
  hideAll();showScreen("battle-ui");
  setTimeout(function(){ showRewardScreen(); },200);
}

export function showRewardScreen(){
  var section=document.getElementById("reward-section");
  section.innerHTML='<div style="color:#ffc107;margin-bottom:6px">选择奖励</div><div style="display:flex;gap:8px;margin-bottom:8px" id="reward-tabs"><button class="screen-btn" style="flex:1" id="tab-cards" onclick="game.showCardRewards()">选择卡牌</button><button class="screen-btn" style="flex:1;opacity:.6" id="tab-relics" onclick="game.showRelicRewards()">选择遗物</button></div><div id="reward-content"></div>';
  window._rewardMode="cards";
  window._pendingAdvance=true;
  setTimeout(function(){ hideAll();showScreen("win-screen"); },100);
}

export function showCardRewards(){
  var rewards=[deepCopy(CP.zhoubao),deepCopy(CP.chongci),deepCopy(CP.tiaoxin)];
  var content=document.getElementById("reward-content");
  content.innerHTML="";
  rewards.forEach(function(card){
    var cardEl=createCardEl(card,0);
    cardEl.onclick=function(){
      s.deck.push(deepCopy(card));
      hideAll();showScreen("battle-ui");
      if(window._pendingAdvance) advanceEvent();
    };
    content.appendChild(cardEl);
  });
  document.getElementById("tab-cards").style.opacity="1";
  document.getElementById("tab-relics").style.opacity=".6";
  window._rewardMode="cards";
}

export function showRelicRewards(){
  var pool=RELICS.filter(function(r){ return !hasRelic(s,r.id)&&r.rarity<=2; });
  if(pool.length===0){
    var content=document.getElementById("reward-content");
    content.innerHTML="<div style='color:#888;text-align:center;padding:20px'>暂无可选遗物</div>";
    return;
  }
  var choices=[];
  var p=pool.slice();
  while(choices.length<3&&p.length>0){
    var idx=Math.floor(Math.random()*p.length);
    choices.push(p.splice(idx,1)[0]);
  }
  var content=document.getElementById("reward-content");
  content.innerHTML="";
  choices.forEach(function(r){
    var el=document.createElement("div");
    el.className="relic-choice";
    el.innerHTML="<div style='font-size:2rem'>"+r.emoji+"</div><div style='color:#fff;font-weight:700;margin:6px 0'>"+r.name+"</div><div style='color:#aaa;font-size:.75rem'>"+r.desc+"</div>";
    el.onclick=function(){
      s.relics.push(deepCopy(r));
      hideAll();showScreen("battle-ui");
      if(window._pendingAdvance) advanceEvent();
    };
    content.appendChild(el);
  });
  document.getElementById("tab-cards").style.opacity=".6";
  document.getElementById("tab-relics").style.opacity="1";
  window._rewardMode="relics";
}

