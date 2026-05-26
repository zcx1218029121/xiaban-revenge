// combat.js — combat flow (Phase 2 extraction)
import { s } from './core.js';
import { makeCtx } from './ctx.js';
import { hasRelic, triggerRelic, drawCards } from './actions.js';
import { log, updateAll, updateEnemyDisplay, showDmgPopup, flashEnemy,
         showScreen, hideAll } from './ui.js';
import { RELICS } from '../data/relics.js';
import { showRelicScreen, showRewardScreen } from './rewards.js';

export function dealDamageToPlayer(n){
  if(s.immuneThisTurn){ log("准时下班！免疫本次攻击","special"); s.immuneThisTurn=false; return; }
  if(s.sh>0){var ab=Math.min(s.sh,n);s.sh-=ab;n-=ab;if(ab>0){showDmgPopup(document.getElementById("shield"),ab,true);log("护盾抵消"+ab,"heal");}}
  if(n>0){
    n=triggerRelic(s,"onDamaged",n);
    if(s.playerWeak>0){ n=Math.floor(n*0.75); }
    s.php=Math.max(0,s.php-n);
    showDmgPopup(document.getElementById("hp"),n);
    document.body.classList.add("shaking");
    setTimeout(function(){ document.body.classList.remove("shaking"); },300);
    log("受到"+n+"伤害","damage");
  }
  updateAll();
  if(s.php<=0) lose();
}

export function playCard(idx){
  if(s.go||!s.ic){ console.warn("playCard: game over or not in combat"); return; }
  if(s.breakdown){ log("崩溃中...无法出牌","stress"); return; }
  var card=s.hand[idx];
  if(!card){ console.warn("playCard: no card at idx",idx); return; }
  if(card.cost>s.en){ log("能量不足！","event"); return; }
  s.en-=card.cost;
  s._pendingKill=false;
  var hel=document.getElementById("hand");
  var cardEl=hel&&hel.children[idx];
  if(cardEl) cardEl.classList.add("playing");
  setTimeout(function(){
    try{
      if(!s.ic){ console.warn("playCard setTimeout: not in combat"); return; }
      var realIdx=s.hand.indexOf(card);
      if(realIdx<0){ console.warn("playCard: card already removed"); updateAll(); return; }
      var ac=makeCtx();
      card.action(ac);
      s.hand.splice(realIdx,1);
      s.disc.push(card);
      updateAll();
      if(s._pendingKill&&s.ic){ s._pendingKill=false; win(); }
    }catch(e){
      console.error("playCard error:",e);
      log("卡牌出错:"+e.message,"damage");
      updateAll();
    }
  },150);
}

export function endTurn(){
  if(s.go||!s.ic) return;
  s._pendingKill=false;
  log("--- 回合 "+s.t+" 结束 ---","turn");
  s.t++;
  if(s.breakdown){
    s.breakdown=false;s.stress=5;
    log("崩溃！本回合伤害x2.5！","breakdown");
    document.body.classList.remove("breakdown");
  }
  if(s.ene&&s.ene.poison>0){
    var pdmg=s.ene.poison;
    if(hasRelic(s,"jiangyan")) pdmg+=2;
    s.ene.hp-=pdmg;
    log("中毒发作！"+pdmg+"伤害","special");
    showDmgPopup(document.getElementById("enemy-sprite"),pdmg);
    if(s.ene.hp<=0){ win();return; }
  }
  if(typeof s === 'undefined') { console.error('FATAL: s is undefined in endTurn!'); return; }
  try{
    if(s.ene && s.ene.onTurn){
      s.ene.onTurn.call(s.ene, makeCtx(), s.ene);
      if(s.ene.hp<=0){ win();return; }
    }
  }catch(e){
    console.error("=== BOSS ACT ERROR ===");
    console.error("s exists:", typeof s !== 'undefined', "s:", s);
    console.error("s.ene:", typeof s !== 'undefined' ? s.ene : 'N/A');
    console.error("Error:", e.message, "Stack:", e.stack);
    log("BOSS行动出错:"+e.message,"damage");
  }
  if(s._pendingKill&&s.ic){ s._pendingKill=false; win(); return; }
  if(!s.ic) return;
  s.nextTurn();
  s.disc=s.disc.concat(s.hand);s.hand=[];
  var drawN=5;if(s.stress>=7) drawN++;
  drawCards(drawN);
  updateAll();
  if(s.ene) updateEnemyDisplay(makeCtx);
}

export function win(){
  if(s.go) return;s.clearBattle();
  triggerRelic(s,"onFightWin");
  if(s.boss){
    if(s.day>=5){setTimeout(function(){ showScreen("finalwin"); },500);}
    else {
      setTimeout(function(){
        var dayTitles=["","Day 1 完成！","Day 2 完成！","Day 3 完成！","Day 4 完成！","通关！"];
        document.getElementById("dayclear-title").textContent=dayTitles[s.day]||"完成！";
        document.getElementById("dayclear-sub").textContent="今天准时下班了，明天继续";
        if(s.day===1&&s.relics.length<10){
          var pool=RELICS.filter(function(r){ return !hasRelic(s,r.id); });
          if(pool.length>0){ showRelicScreen(); }
        }
        hideAll();showScreen("dayclear-screen");
      },500);
    }
    return;
  }
  showRewardScreen();
}

export function lose(){
  s.go=true;s.clearBattle();
  document.body.classList.remove("breakdown");
  document.getElementById("lose-reason").textContent="在第"+s.day+"天倒下了";
  setTimeout(function(){ showScreen("lose-screen"); },300);
}
