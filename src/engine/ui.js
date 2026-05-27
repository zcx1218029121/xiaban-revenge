// ui.js — DOM rendering and updates (Phase 2 extraction)
import { s } from './core.js';
import { playCard } from './combat.js';

export function log(msg,type){
  type=type||"";
  var icons={"":"","damage":"⚔️","heal":"💚","stress":"😰","event":"📌","turn":"🔄","player":"🃏","breakdown":"💥","special":"🌟"};
  var icon=icons[type]||"";
  var logEl=document.getElementById("log");
  if(!logEl) return;
  var entry=document.createElement("div");
  entry.className="log-entry "+type;
  entry.innerHTML=(icon?"<span class='log-icon'>"+icon+"</span> ":"")+"<span>"+msg+"</span>";
  logEl.appendChild(entry);
  logEl.scrollTop=logEl.scrollHeight;
  while(logEl.children.length>60) logEl.removeChild(logEl.firstChild);
}

export function hideAll(){
  ["title-screen","day-transition","event-screen","battle-ui","win-screen","lose-screen","dayclear-screen","finalwin-screen"].forEach(function(id){
    var el=document.getElementById(id);
    if(el) el.classList.add("hidden");
  });
}

export function showScreen(id){
  var el=document.getElementById(id);
  if(el) el.classList.remove("hidden");
}

export function showDmgPopup(el,dm,isSh){
  try{
    var popup=document.createElement("div");
    popup.className="dmg-popup"+(isSh?" shield-popup":"");
    popup.textContent=(isSh?"":"-")+Math.abs(dm);
    var rect=el.getBoundingClientRect();
    popup.style.left=(rect.left+rect.width/2-20)+"px";
    popup.style.top=(rect.top-10)+"px";
    document.body.appendChild(popup);
    setTimeout(function(){ popup.remove(); },800);
  }catch(e){}
}

export function flashEnemy(){
  var el=document.getElementById("enemy-sprite");
  if(el){ el.classList.add("hit"); setTimeout(function(){ el.classList.remove("hit"); },200); }
}

export function updateAll(){ updateHUD();updateHand();updateRelics();updateEnemyDisplay(); }

export function updateHUD(){
  document.getElementById("hp").textContent=Math.max(0,s.php)+"/"+s.pmax;
  document.getElementById("energy").textContent=s.en+"/"+s.men;
  document.getElementById("shield").textContent=s.sh;
  document.getElementById("stress").textContent=s.stress+"/10";
}

export function updateHand(){
  var handEl=document.getElementById("hand");
  if(!handEl) return;handEl.innerHTML="";
  s.hand.forEach(function(card,idx){
    var el=createCardEl(card,idx);
    var canPlay=card.cost<=s.en&&!s.breakdown;
    if(canPlay) el.classList.add("playable");else el.classList.add("unplayable");
    el.onclick=(function(i){return function(){if(!s.breakdown&&card.cost<=s.en) playCard(i);};})(idx);
    handEl.appendChild(el);
  });
}

export function createCardEl(card,idx){
  var el=document.createElement("div");
  var costCls="cost-"+Math.min(card.cost,3);
  // Rarity color
  var rarityBorder={'C':'','U':'2px solid #60a5fa','R':'2px solid #fbbf24'}[card.rarity]||'';
  var rarityBadge={'U':'<span style="position:absolute;top:-4px;left:4px;font-size:.5rem;color:#60a5fa">◆</span>','R':'<span style="position:absolute;top:-4px;left:4px;font-size:.5rem;color:#fbbf24">★</span>'}[card.rarity]||'';
  if(rarityBorder) el.style.border=rarityBorder;
  // Faction tag
  var factionTag=card.faction&&card.faction!=="通用"?'<span style="position:absolute;bottom:3px;right:4px;font-size:.45rem;color:rgba(255,255,255,.35)">'+card.faction+'</span>':'';
  el.className="card "+costCls;
  var costColor=["#4ade80","#60a5fa","#fb923c","#f472b6","#a78bfa"][Math.min(card.cost,4)];
  var typeLabel={'attack':'攻击','skill':'技能','power':'能力','curse':'诅咒'}[card.type]||'技能';
  var typeCls={'attack':'type-attack','skill':'type-skill','power':'type-power','curse':'type-curse'}[card.type]||'type-skill';
  el.innerHTML=rarityBadge+'<div class="card-cost" style="background:'+costColor+'">'+card.cost+'</div><div class="card-name">'+card.name+'</div><div class="card-effect">'+card.effect+'</div><div class="card-type '+typeCls+'">'+typeLabel+factionTag+'</div>';
  return el;
}

export function updateEnemyDisplay(makeCtx){
  if(!s.ene) return;
  document.getElementById("enemy-sprite").textContent=s.ene.emoji;
  var poisonStr=s.ene.poison>0?" 🧪×"+s.ene.poison:"";
  var floorStr=s.endless?" | 第"+s.floor+"层":"";
  document.getElementById("enemy-name").textContent=s.ene.name+poisonStr+floorStr;
  var pct=Math.max(0,(s.ene.hp/s.ene.maxHp)*100);
  var hpFill=document.getElementById("enemy-hp-fill");
  hpFill.style.width=pct+"%";
  hpFill.style.background=s.ene.poison>0?"linear-gradient(90deg,#e94560,#4ecdc4)":"#e94560";
  var intentEl=document.getElementById("enemy-intent");
  if(intentEl && makeCtx){
    try{
      if(s.ene&&s.ene.getIL){intentEl.textContent=s.ene.getIL(makeCtx(),s.ene);}
    }catch(e){ intentEl.textContent="❓"; }
  }
}

export function updateRelics(){
  var el=document.getElementById("relic-display");
  if(!el) return;
  el.innerHTML=(s.relics||[]).map(function(r){ return '<span class="relic-tag" title="'+(r.desc||'')+'">'+(r.emoji||'')+' '+r.name+'</span>'; }).join("");
}

export function updateDayProgress(){
  var el=document.getElementById("day-progress");
  if(!el) return;
  var html="";
  for(var d=1;d<=5;d++){
    var cls="day-dot";
    if(d<s.day) cls+=" done";else if(d===s.day) cls+=" current";
    html+='<div class="'+cls+'"></div>';
  }
  el.innerHTML=html;
}

