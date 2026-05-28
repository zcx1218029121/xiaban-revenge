// Enemies — 15 enemies with factions + day-tiered pools
// Faction: 通用/卷王/摸鱼/养生/社交

var EN = {
  // ============================================================
  // Day 1-2: Easy pool
  // ============================================================
  xinren:  { name:"职场新人",   emoji:"👨‍💻", maxHp:15, faction:"通用", onTurn:function(g, e){ g.dealDamageToPlayer(5); g.drawCards(1); g.log("新人请教了你","damage"); }, getIL:function(ctx, enemy){ return "👇 攻击5+抽1"; } },
  laoyuhua:{ name:"老油条",     emoji:"💔",  maxHp:20, faction:"摸鱼", canWeaken:false, onTurn:function(g, e){ g.dealDamageToPlayer(8); g.log("老油条推诿甩锅","damage"); }, getIL:function(ctx, enemy){ return "👇 攻击8"; } },
  ppt:     { name:"PPT纺织工",  emoji:"📊", maxHp:18, faction:"通用", onTurn:function(g, e){ g.dealDamageToPlayer(6); g.log("PPT轰炸了","damage"); }, getIL:function(ctx, enemy){ return "📊 攻击6"; } },

  // ============================================================
  // Day 2-3: Medium pool
  // ============================================================
  youjian: { name:"邮件轰炸机", emoji:"📧",  maxHp:12, faction:"社交", onTurn:function(g, e){ g.dealDamageToPlayer(4); setTimeout(function(){ g.dealDamageToPlayer(4); },250); g.log("邮件轰炸x2！","damage"); }, getIL:function(ctx, enemy){ return "📧 攻击4x2"; } },
  kaihui:  { name:"开会狂魔",   emoji:"🗣️", maxHp:22, faction:"社交", onTurn:function(g, e){ g.dealDamageToPlayer(5); g.dealDamageToPlayer(5); g.log("全体攻击x2！","damage"); }, getIL:function(ctx, enemy){ return "🗣️ 全体10"; } },
  mapei:   { name:"马屁精",     emoji:"🤢",  maxHp:18, faction:"社交", onTurn:function(g, e){ g.dealDamageToPlayer(7); g.log("马屁攻击","damage"); }, getIL:function(ctx, enemy){ return "🤢 攻击7"; } },
  // New Day 2-3
  yangshengdaren:{ name:"养生达人",emoji:"🧘",maxHp:20,faction:"养生",onTurn:function(g,e){ g.dealDamageToPlayer(4); g.state.ene.hp=Math.min(g.state.ene.maxHp,g.state.ene.hp+3);g.log("养生达人回复了3HP","heal");},getIL:function(ctx,enemy){return"🧘 攻击4+回复3";}},
  kaoheguan:{ name:"绩效考核官", emoji:"📊", maxHp:22, faction:"卷王", onTurn:function(g,e){ g.dealDamageToPlayer(9); g.addStress(1); g.log("考核不通过！","damage"); }, getIL:function(ctx,enemy){ return "📊 攻击9+压力+1"; } },

  // ============================================================
  // Day 3-4: Hard pool
  // ============================================================
  mapei_e: { name:"马屁精(精英)",emoji:"🤢", maxHp:35, isElite:true,faction:"社交", onTurn:function(g, e){ g.dealDamageToPlayer(10); g.log("精英马屁攻击！","damage"); }, getIL:function(ctx, enemy){ return "🤢 精英10"; } },
  shuogua: { name:"甩锅侠(精英)",emoji:"🎭", maxHp:30, isElite:true,faction:"摸鱼", onTurn:function(g, e){ g.dealDamageToPlayer(12); g.addStress(2); g.log("甩锅侠反甩！+2压力","damage"); }, getIL:function(ctx, enemy){ return "🎭 攻击12+压力+2"; } },
  // New Day 3-4
  baguajing:{ name:"八卦精",    emoji:"👂", maxHp:24, faction:"社交", onTurn:function(g,e){ g.dealDamageToPlayer(5); g.drawCards(1); g.log("八卦精打听到了更多消息","damage"); }, getIL:function(ctx,enemy){ return "👂 攻击5+抽1"; } },
  zhichangdaoshi:{ name:"职场导师",emoji:"👨‍🏫",maxHp:28,faction:"通用",onTurn:function(g,e){ var dmg=8; if(Math.random()<0.4){dmg=4;g.heal(5);g.log("导师给了些建议","heal");}else{g.dealDamageToPlayer(dmg);g.log("导师的严厉批评","damage");} },getIL:function(ctx,enemy){return"🏫 8伤害或治疗";}},
  chengxuyuan:{ name:"程序猿(精英)",emoji:"👨‍💻",maxHp:32,isElite:true,faction:"卷王",onTurn:function(g,e){var dmg=14;if(e.hp<e.maxHp*0.5){dmg=22;g.log("程序猿爆发了！","damage");}g.dealDamageToPlayer(dmg);},getIL:function(ctx,enemy){return"💻 精英14(低血量22)";}},

  // ============================================================
  // Day 4-5: Elite pool
  // ============================================================
  jiaban_e:{ name:"加班狂人(精英)",emoji:"😤",maxHp:40, isElite:true,faction:"卷王", onTurn:function(g, e){ var lost=40-(e.hp||40); var bonus=Math.floor(lost/5)*3; g.dealDamageToPlayer(15+bonus); g.log("加班狂人攻击"+(15+bonus)+"(+"+bonus+"加成)","damage"); }, getIL:function(ctx, enemy){ return "😤 攻击15+失去HP"; } },
  // New Day 4-5
  jiujiuxintu:{ name:"996信徒(精英)",emoji:"😰",maxHp:38,isElite:true,faction:"卷王",onTurn:function(g,e){g.dealDamageToPlayer(16);g.addStress(2);g.log("996是福报！","damage");},getIL:function(ctx,enemy){return"😰 精英16+压力+2";}},
  guolaosi_e:{ name:"过劳死(精英)",emoji:"💀",maxHp:45,isElite:true,faction:"卷王",onTurn:function(g,e){var dmg=18;if(g.state.stress>=7)dmg=25;g.dealDamageToPlayer(dmg);g.log("过劳死的怒火！","damage");},getIL:function(ctx,enemy){return"💀 精英18(高压25)";}},
};

// Day-tiered enemy pools for random selection
var ENEMY_POOLS = {
  1: ["xinren","laoyuhua","ppt"],                                          // Day 1: easy
  2: ["xinren","laoyuhua","ppt","youjian","yangshengdaren"],              // Day 2
  3: ["laoyuhua","ppt","youjian","kaihui","mapei","kaoheguan"],           // Day 3
  4: ["youjian","kaihui","mapei","mapei_e","shuogua","baguajing","zhichangdaoshi","chengxuyuan"], // Day 4
  5: ["kaihui","mapei","mapei_e","shuogua","jiaban_e","jiujiuxintu","guolaosi_e","chengxuyuan"], // Day 5: hard
};

// Elite-only pools (for risky route encounters)
var ELITE_POOLS = {
  1: ["mapei_e"],
  2: ["mapei_e","shuogua"],
  3: ["mapei_e","shuogua","chengxuyuan"],
  4: ["mapei_e","shuogua","chengxuyuan","jiaban_e"],
  5: ["shuogua","chengxuyuan","jiaban_e","jiujiuxintu","guolaosi_e"],
};

export { EN, ENEMY_POOLS, ELITE_POOLS };
export function getEnemy(id) { return EN[id]; }
export function getRandomEnemy(day) {
  var pool = ENEMY_POOLS[day] || ENEMY_POOLS[1];
  var key = pool[Math.floor(Math.random() * pool.length)];
  return EN[key];
}
export function getRandomElite(day) {
  var pool = ELITE_POOLS[day] || ELITE_POOLS[1];
  var key = pool[Math.floor(Math.random() * pool.length)];
  return EN[key];
}
