// Regular Enemies (EN)
var EN = {
  xinren:  { name:"职场新人",   emoji:"\uD83D\uDC68\u200D\uD83D\uDCBB", maxHp:15, onTurn:function(g, e){ g.dealDamageToPlayer(5); g.drawCards(1); g.log("新人请教了你","damage"); }, getIL:function(ctx, enemy){ return "\uD83D\uDC47 攻击5+抽1"; } },
  laoyuhua:{ name:"老油条",     emoji:"\uD83D\uDC94",  maxHp:20, canWeaken:false, onTurn:function(g, e){ g.dealDamageToPlayer(8); g.log("老油条推诿甩锅","damage"); }, getIL:function(ctx, enemy){ return "\uD83D\uDC47 攻击8"; } },
  ppt:     { name:"PPT纺织工",  emoji:"\uD83D\uDCCA", maxHp:18, onTurn:function(g, e){ g.dealDamageToPlayer(6); g.log("PPT轰炸了","damage"); }, getIL:function(ctx, enemy){ return "\uD83D\uDCCA 攻击6"; } },
  youjian: { name:"邮件轰炸机", emoji:"\uD83D\uDCE7",  maxHp:12, onTurn:function(g, e){ var orig=this; setTimeout(function(){ g.dealDamageToPlayer(4); }, 250); g.dealDamageToPlayer(4); g.log("邮件轰炸x2！","damage"); }, getIL:function(ctx, enemy){ return "\uD83D\uDCE7 攻击4x2"; } },
  kaihui:  { name:"开会狂魔",   emoji:"\uD83D\uDDE3\uFE0F", maxHp:22, onTurn:function(g, e){ g.dealDamageToPlayer(5); g.dealDamageToPlayer(5); g.log("全体攻击x2！","damage"); }, getIL:function(ctx, enemy){ return "\uD83D\uDDE3\uFE0F 全体10"; } },
  mapei:   { name:"马屁精",     emoji:"\uD83E\uDD22",  maxHp:18, onTurn:function(g, e){ g.dealDamageToPlayer(7); g.log("马屁攻击","damage"); }, getIL:function(ctx, enemy){ return "\uD83E\uDD22 攻击7"; } },
  mapei_e: { name:"马屁精(精英)",emoji:"\uD83E\uDD22", maxHp:35, isElite:true, onTurn:function(g, e){ g.dealDamageToPlayer(10); g.log("精英马屁攻击！","damage"); }, getIL:function(ctx, enemy){ return "\uD83E\uDD22 精英10"; } },
  shuogua: { name:"甩锅侠(精英)",emoji:"\uD83C\uDFAD", maxHp:30, isElite:true, onTurn:function(g, e){ g.dealDamageToPlayer(12); g.addStress(2); g.log("甩锅侠反甩！+2压力","damage"); }, getIL:function(ctx, enemy){ return "\uD83C\uDFAD 攻击12+压力+2"; } },
  jiaban_e:{ name:"加班狂人(精英)",emoji:"\uD83D\uDE24",maxHp:40, isElite:true, onTurn:function(g, e){ var lost=40-(e.hp||40); var bonus=Math.floor(lost/5)*3; g.dealDamageToPlayer(15+bonus); g.log("加班狂人攻击"+(15+bonus)+"(+"+bonus+"加成)","damage"); }, getIL:function(ctx, enemy){ return "\uD83D\uDE24 攻击15+失去HP"; } },
};

export { EN };
export function getEnemy(id) { return EN[id]; }
