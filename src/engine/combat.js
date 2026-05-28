// combat.js — combat flow (Phase 2 extraction)
import { s } from './core.js';
import { makeCtx } from './ctx.js';
import { hasRelic, triggerRelic, drawCards, dealDamageToPlayer, heal } from './actions.js';
import { executeCardAction } from './cardActions.js';
import { processEquipment } from './cardActions.js';
import { log, updateAll, updateEnemyDisplay, showDmgPopup, flashEnemy,
         showScreen, hideAll } from './ui.js';
import { RELICS } from '../data/relics.js';
import { showRelicScreen, showRewardScreen } from './rewards.js';
import { startEndlessFight } from './events.js';

export function playCard(idx){
  if(s.go||!s.ic){ console.warn("playCard: game over or not in combat"); return; }
  if(s.breakdown){ log("崩溃中...无法出牌","stress"); return; }
  var card=s.hand[idx];
  if(!card){ console.warn("playCard: no card at idx",idx); return; }
  if(card.unplayable){ log("这张诅咒无法打出！","event"); return; }
  if(card.cost>s.en){ log("能量不足！","event"); return; }
  s.en-=card.cost;
  s._pendingKill=false;
  var isSpell=card.type==="spell";
  var isEquip=card.type==="equipment";
  // Track faction and synergy
  var faction=card.faction||"通用";
  s._factionPlays=s._factionPlays||{};
  s._factionPlays[faction]=(s._factionPlays[faction]||0)+1;
  var hel=document.getElementById("hand");
  var cardEl=hel&&hel.children[idx];
  if(cardEl) cardEl.classList.add("playing");
  setTimeout(function(){
    try{
      if(!s.ic){ console.warn("playCard setTimeout: not in combat"); return; }
      var realIdx=s.hand.indexOf(card);
      if(realIdx<0){ console.warn("playCard: card already removed"); updateAll(); return; }
      var ac=makeCtx();
      executeCardAction(card.id, ac);
      // Faction synergy: 3+ cards of same faction in one turn
      var count=s._factionPlays[faction]||0;
      if(count===3){ s.en+=1; log(faction+"派系共鸣：+1能量","special"); }
      if(count===4){ heal(5); log(faction+"派系共鸣：治疗5HP","heal"); }
      s.hand.splice(realIdx,1);
      if(isSpell || card.type === "curse"){
        log(card.name+(isSpell?"使用后消失":"已净化"),"special");
      } else if(isEquip){
        if(s.equipment.length>=3){
          // Remove oldest equipment if at max
          var old=s.equipment.shift();
          log(old.name+"被替换","event");
        }
        s.equipment.push(card);
        log("装备了 "+card.name,"special");
      } else {
        s.disc.push(card);
      }
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
  // Process equipment effects before enemy acts
  processEquipment(s);
  if(s.breakdown){
    s.breakdown=false;
    log("崩溃结束，下一回合恢复正常","breakdown");
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
    if(s.enemySkipNext){
      s.enemySkipNext=false;
      log("敌人本回合被跳过！","special");
    } else if(s.ene && s.ene.onTurn){
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
  if(s._pendingKill){ s._pendingKill=false; lose(); return; }
  if(s._pendingKill&&s.ic){ s._pendingKill=false; win(); return; }
  if(!s.ic) return;
  // Handle multi-turn immunity
  if(s._immuneTurns&&s._immuneTurns>0){
    s.immuneThisTurn=true;
    s._immuneTurns--;
  }
  // Handle next-battle energy bonus
  if(s._nextBattleEnergy>0){
    s.en+=s._nextBattleEnergy;
    s.men+=s._nextBattleEnergy;
    s._nextBattleEnergy=0;
  }
  // Process curses in hand (tick down turnsLeft, auto-remove)
  for(var ci=s.hand.length-1;ci>=0;ci--){
    var curse=s.hand[ci];
    if(curse.type==="curse"&&curse.turnsLeft!==undefined){
      curse.turnsLeft--;
      if(curse.turnsLeft<=0){
        s.hand.splice(ci,1);
        s.disc.push(curse);
        log(curse.name+" 时效已过，移出手中","event");
      }
    }
  }
  s.nextTurn();
  s.disc=s.disc.concat(s.hand);s.hand=[];
  var drawN=5;if(s.stress>=7) drawN++;
  if(s._equipDrawBonus>0){ drawN+=s._equipDrawBonus; s._equipDrawBonus=0; }
  drawCards(drawN);
  updateAll();
  if(s.ene) updateEnemyDisplay(makeCtx);
}

export function win(){
  if(s.go) return;s.clearBattle();
  triggerRelic(s,"onFightWin");
  if(s.endless) s.floor++;
  if(s.boss){
    // Day 5 boss: enter endless mode
    if(s.day>=5){
      if(!s.endless){
        s.endless=true;s.floor=1;
        log("🏆 通关！进入无限加班模式...","special");
      }
      showRewardScreen();
      window._bossRewardDone=function(){
        s.php=Math.min(s.pmax,s.php+Math.floor(s.pmax*0.3));
        log("休息一下...HP回复30%","heal");
        startEndlessFight();
      };
    } else {
      // Boss fight: show reward screen with relic option, then dayclear
      showRewardScreen();
      window._bossRewardDone=function(){
        hideAll();showScreen("dayclear-screen");
        var dayTitles=["","Day 1 完成！","Day 2 完成！","Day 3 完成！","Day 4 完成！","通关！"];
        document.getElementById("dayclear-title").textContent=dayTitles[s.day]||"完成！";
        document.getElementById("dayclear-sub").textContent="今天准时下班了，明天继续";
      };
    }
    return;
  }
  // Normal fight or endless fight
  showRewardScreen();
  if(s.endless){
    window._bossRewardDone=function(){ startEndlessFight(); };
  }
}

export function lose(){
  s.go=true;s.clearBattle();
  document.body.classList.remove("breakdown");
  if(s.endless){
    document.getElementById("lose-reason").textContent="在第"+s.floor+"层倒下了（Day"+s.day+"通关）";
  }else{
    document.getElementById("lose-reason").textContent="在第"+s.day+"天倒下了";
  }
  setTimeout(function(){ showScreen("lose-screen"); },300);
}
