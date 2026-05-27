// rewards.js — reward screens (Phase 2 extraction)
import { s } from './core.js';
import { deepCopy } from './utils.js';
import { hasRelic } from './actions.js';
import { log, hideAll, showScreen, updateAll, createCardEl } from './ui.js';
import { RELICS } from '../data/relics.js';
import { CP } from '../data/cards.js';
import { advanceEvent } from './events.js';

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
  // Only boss fights offer relic rewards
  if(s.boss){
    section.innerHTML='<div style="color:#ffc107;margin-bottom:6px">选择奖励</div><div style="display:flex;gap:8px;margin-bottom:8px" id="reward-tabs"><button class="screen-btn" style="flex:1" id="tab-cards" onclick="game.showCardRewards()">选择卡牌</button><button class="screen-btn" style="flex:1;opacity:.6" id="tab-relics" onclick="game.showRelicRewards()">选择遗物</button></div><div id="reward-content"></div>';
    window._rewardMode="cards";
    setTimeout(function(){ showCardRewards(); }, 50);
  } else {
    section.innerHTML='<div style="color:#ffc107;margin-bottom:6px">选择奖励</div><div id="reward-content"></div>';
    window._rewardMode="cards";
    setTimeout(function(){ showCardRewards(); }, 50);
  }
  window._rewardMode="cards";
  window._pendingAdvance=true;
  setTimeout(function(){ hideAll();showScreen("win-screen"); },100);
}

function finishReward(){
  hideAll();showScreen("battle-ui");
  if(window._bossRewardDone){
    window._bossRewardDone();
    window._bossRewardDone=null;
  } else if(window._pendingAdvance){
    advanceEvent();
  }
}

export function showCardRewards(){
  // Offer varied cards: 1 guaranteed uncommon, chance for rare
  var allCards=Object.values(CP);
  var common=allCards.filter(function(c){ return c.rarity==='C'; });
  var uncom=allCards.filter(function(c){ return c.rarity==='U'; });
  var rare=allCards.filter(function(c){ return c.rarity==='R'; });
  var rewards=[];
  // Pick 1 uncommon
  if(uncom.length>0) rewards.push(uncom[Math.floor(Math.random()*uncom.length)]);
  else rewards.push(common[Math.floor(Math.random()*common.length)]);
  // Pick 1 common
  rewards.push(common[Math.floor(Math.random()*common.length)]);
  // 20% chance for rare card
  if(rare.length>0&&Math.random()<0.2) rewards.push(rare[Math.floor(Math.random()*rare.length)]);
  else rewards.push(common[Math.floor(Math.random()*common.length)]);
  // Shuffle order
  rewards=rewards.sort(function(){ return Math.random()-0.5; });
  var content=document.getElementById("reward-content");
  content.innerHTML="";
  // Add skip button
  var skipBtn=document.createElement("button");
  skipBtn.className="screen-btn";
  skipBtn.style.cssText="width:100%;margin-top:6px;opacity:.5;font-size:.7rem";
  skipBtn.textContent="跳过奖励（移除一张卡）";
  skipBtn.onclick=function(){
    if(s.deck.length>3){
      var idx=Math.floor(Math.random()*s.deck.length);
      s.deck.splice(idx,1);
      log("移除了一张卡牌","event");
    }
    finishReward();
  };
  rewards.forEach(function(card){
    var cardEl=createCardEl(card,0);
    cardEl.onclick=function(){
      s.deck.push(deepCopy(card));
      finishReward();
    };
    content.appendChild(cardEl);
  });
  content.appendChild(skipBtn);
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
      finishReward();
    };
    content.appendChild(el);
  });
  document.getElementById("tab-cards").style.opacity=".6";
  document.getElementById("tab-relics").style.opacity="1";
  window._rewardMode="relics";
}

