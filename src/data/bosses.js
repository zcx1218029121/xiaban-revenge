// Boss Data (BD) — one boss per day
var BD = {
  linda: {
    name:"HR Linda", emoji:"\uD83D\uDC94", maxHp:50,
    ints:[
      { label:"\uD83D\uDC41\uFE0F 观察 +1压力 抽1", stress:1, extra:true },
      { label:"\uD83D\uDC47 攻击8",          dmg:8 },
      { label:"\uD83D\uDE30 +2压力",          stress:2 },
      { label:"\uD83D\uDDA2 重击12",          dmg:12 },
    ],
    onTurn:function(g, e){
      var bi=g.state.biIdx%4;
      var it=this.ints[bi];
      if(it.dmg) g.dealDamageToPlayer(it.dmg);
      if(it.stress) g.addStress(it.stress);
      if(it.extra) g.drawCards(1);
    },
    getIL:function(g, e){ return this.ints[g.state.biIdx%4].label; }
  },
  mike: {
    name:"PM Mike", emoji:"\uD83D\uDC6C", maxHp:60,
    ints:[
      { label:"\uD83D\uDCCB 需求:5伤+弃2牌", dmg:5, discard:2 },
      { label:"\uD83D\uDCDD 追加:10伤害",    dmg:10 },
      { label:"\uD83D\uDCE2 紧急会议:8伤+能量-1", dmg:8, energyDrain:1 },
      { label:"\u2705 验收:15伤害",    dmg:15 },
    ],
    onTurn:function(g, e){
      var bi=g.state.biIdx%4;
      var it=this.ints[bi];
      if(it.dmg) g.dealDamageToPlayer(it.dmg);
      if(it.energyDrain){ g.modifyEnergy(-it.energyDrain); g.log("能量-1！","event"); }
      if(it.discard){ for(var i=0;i<it.discard;i++){ if(g.state.hand.length>0) g.state.disc.push(g.state.hand.pop()); } g.log("被迫弃"+it.discard+"张","event"); g.updateHand(); }
    },
    getIL:function(g, e){ return this.ints[g.state.biIdx%4].label; }
  },
  jessica: {
    name:"总监 Jessica", emoji:"\uD83D\uDC69\u200D\uD83D\uDCBC", maxHp:70,
    ints:[
      { label:"\uD83D\uDD04 巻き込み:+3压力",   stress:3, noShield:true },
      { label:"\uD83D\uDCCA 汇报:10伤+J回复5HP", dmg:10, healSelf:5 },
      { label:"\uD83D\uDCE7 邮件:6全体",       aoe:6 },
      { label:"\uD83D\uDCDA 培训:2层虚弱",     weak:2 },
    ],
    onTurn:function(g, e){
      var bi=g.state.biIdx%4;
      var it=this.ints[bi];
      if(it.aoe){ g.dealDamageToPlayer(it.aoe); }
      else { if(it.dmg) g.dealDamageToPlayer(it.dmg); if(it.healSelf){ e.hp=Math.min(e.maxHp,(e.hp||70)+it.healSelf); g.log("Jessica回复"+it.healSelf+"HP","heal"); } }
      if(it.stress) g.addStress(it.stress);
      if(it.noShield){ g.state.noShieldTurns=1; g.log("本回合无法获得护盾！","stress"); }
      if(it.weak){ g.state.playerWeak=(g.state.playerWeak||0)+it.weak; g.log("获得"+it.weak+"层虚弱","event"); }
    },
    getIL:function(g, e){ return this.ints[g.state.biIdx%4].label; }
  },
  david: {
    name:"CTO David", emoji:"\uD83E\uDDD9", maxHp:80,
    ints:[
      { label:"\uD83D\uDD27 重构:+8护甲",      armor:8 },
      { label:"\u26A1 修复:15伤+弃3牌",  dmg:15, discard:3 },
      { label:"\uD83D\uDCB8 技术债:+5压-30%伤",stress:5, dmgDegrade:true },
      { label:"\uD83C\uDFE2 终极架构",          charge:true },
    ],
    onTurn:function(g, e){
      var bi=g.state.biIdx%4;
      var it=this.ints[bi];
      if(e.charge&&e.charge>0){
        e.charge--;
        if(e.charge===0){ g.dealDamageToPlayer(40); g.log("终极架构！40伤害！","damage"); }
        else { g.log("蓄力中...("+(3-e.charge-1)+"/3)","event"); }
        return;
      }
      if(it.armor){ e.armor=(e.armor||0)+it.armor; g.log("David获得"+it.armor+"护甲","event"); }
      if(it.dmg){ var dmg=it.dmg; if(it.dmgDegrade){ dmg=Math.floor(dmg*0.7); } g.dealDamageToPlayer(dmg); }
      if(it.discard){ for(var i=0;i<it.discard;i++){ if(g.state.hand.length>0) g.state.disc.push(g.state.hand.pop()); } g.log("被迫弃"+it.discard+"张","event"); g.updateHand(); }
      if(it.stress) g.addStress(it.stress);
      if(it.charge){ e.charge=3; g.log("终极架构开始蓄力！","event"); }
      if(it.dmgDegrade){ g.state.tempDmgMult=(g.state.tempDmgMult||1)*0.7; g.log("伤害-30%！","stress"); }
    },
    getIL:function(g, e){
      if(e.charge&&e.charge>0) return "\uD83C\uDFE2 蓄力中...("+(3-e.charge)+"/3)";
      return this.ints[g.state.biIdx%4].label;
    }
  },
  alexander: {
    name:"CEO Alexander", emoji:"\uD83C\uDF51", maxHp:100,
    ints:[
      { label:"\u23F0 996:10全体+3压力",  aoe:10, stressAll:3 },
      { label:"\uD83D\uDCC9 KPI:20伤+弃全部",    dmg:20, discardAll:true },
      { label:"\u23FB 末位:HP降至1",       onetap:true },
      { label:"\uD83D\uDCB0 股权:回复20HP+10甲",  healArm:true },
      { label:"\uD83D\uDC80 终极压榨",          榨取:true },
    ],
    onTurn:function(g, e){
      var bi=g.state.biIdx%5;
      var it=this.ints[bi];
      if(it.aoe){ g.dealDamageToPlayer(it.aoe); if(it.stressAll) g.addStress(it.stressAll); }
      else if(it.onetap){ var dmg=g.php-1; if(dmg>0) g.dealDamageToPlayer(dmg); }
      else if(it.healArm){ e.hp=Math.min(e.maxHp,(e.hp||100)+20); e.armor=(e.armor||0)+10; g.log("Alexander回复20HP+10护甲","heal"); }
      else if(it.榨取){ var lost=100-g.state.php; var bonus=Math.floor(lost/5); g.dealDamageToPlayer(8+bonus); g.log("终极压榨"+(8+bonus)+"伤害(+"+bonus+"加成)","damage"); }
      else { if(it.dmg) g.dealDamageToPlayer(it.dmg); if(it.discardAll){ g.state.disc.push.apply(g.state.disc,g.state.hand); g.state.hand=[]; g.log("被迫弃全部手牌","event"); g.updateHand(); } }
    },
    getIL:function(g, e){ return this.ints[g.state.biIdx%5].label; }
  },
};

export { BD };
export function getBoss(id) { return BD[id]; }
