// Events — 5 days of daily schedule
import { deepCopy } from './constants.js';

var EVENTS = {
1:[
{time:"09:00",type:"ch",title:"早会通知",desc:"组长：「9点早会，必须参加。」",chs:[{text:"\u2705 参加（+1压力，下次战斗伤害+3）",ef:function(g){ g.addStress(1); g.state.nextBattleBonusDmg=(g.state.nextBattleBonusDmg||0)+3; }},{text:"\u274C 跳过（下次战斗多抽1张）",ef:function(g){ g.state.nextBattleDraw=(g.state.nextBattleDraw||0)+1; }}]},
{time:"10:00",type:"fight",key:"xinren"},
{time:"11:00",type:"ch",title:"同事借刀",desc:"老王：「刀坏了，借用一下？」",chs:[{text:"\uD83D\uDD2A 借（获得周报卡）",ef:function(g){ g.state.deck.push(deepCopy(CP.zhoubao)); g.log("获得周报卡！","event"); }},{text:"\uD83D\uDEAB 不借（+1压力）",ef:function(g){ g.addStress(1); }}]},
{time:"12:00",type:"lunch"},
{time:"13:00",type:"fight",key:"laoyuhua"},
{time:"14:00",type:"ch",title:"免费下午茶",desc:"公司买奶茶！先到先得！",chs:[{text:"\uD83E\uDDCB 奶茶（+8HP,-1压力）",ef:function(g){ g.heal(8); g.state.stress=Math.max(0,g.state.stress-1); }},{text:"\uD83C\uDF70 蛋糕（-2压力,+5护盾）",ef:function(g){ g.state.stress=Math.max(0,g.state.stress-2); g.gainShield(5); }},{text:"\uD83E\uDD14 两个都要（+1压力，全拿）",ef:function(g){ g.heal(8); g.state.stress=Math.max(0,g.state.stress-1); g.gainShield(5); }}]},
{time:"15:00",type:"fight",key:"ppt"},
{time:"16:00",type:"ch",title:"紧急任务",desc:"组长：「有紧急任务，需要人加班。」",chs:[{text:"\uD83D\uDCAA 主动（得加班卡x2，下次战斗+2压力）",ef:function(g){ g.state.deck.push(deepCopy(CP.jiaban)); g.state.deck.push(deepCopy(CP.jiaban)); g.state.nextBattleStress=(g.state.nextBattleStress||0)+2; g.log("主动加班！","event"); }},{text:"\uD83D\uDE34 假装没看到",ef:function(g){ }}]},
{time:"17:00",type:"fight",key:"youjian"},
{time:"18:00",type:"boss",key:"linda"},
],
2:[
{time:"09:00",type:"ch",title:"需求变更通知",desc:"PM Mike发来消息：「需求有变更，下午之前要改完。」",chs:[{text:"\uD83D\uDCCB 接受变更（得加班卡x2，+2压力）",ef:function(g){ g.state.deck.push(deepCopy(CP.jiaban)); g.state.deck.push(deepCopy(CP.jiaban)); g.addStress(2); }},{text:"\u274C 拒绝（获得周报卡）",ef:function(g){ g.state.deck.push(deepCopy(CP.zhoubao)); }}]},
{time:"10:00",type:"fight",key:"kaihui"},
{time:"11:00",type:"ch",title:"1v1辅导",desc:"PM Mike想找你单独聊聊：「有空吗？」",chs:[{text:"\u2705 接受辅导（获得绩效考核卡）",ef:function(g){ g.state.deck.push(deepCopy(CP.kaohe)); g.log("获得绩效考核卡！","event"); }},{text:"\u274C 拒绝（-1压力）",ef:function(g){ g.state.stress=Math.max(0,g.state.stress-1); }}]},
{time:"12:00",type:"lunch"},
{time:"13:00",type:"fight",key:"mapei"},
{time:"14:00",type:"ch",title:"部门聚餐",desc:"部门群发消息：「今晚一起聚餐吧！」",chs:[{text:"\uD83C\uDF7D\uFE0F 参加（-2压力,+8HP）",ef:function(g){ g.state.stress=Math.max(0,g.state.stress-2); g.heal(8); }},{text:"\uD83D\uDE34 不参加（+1压力）",ef:function(g){ g.addStress(1); }}]},
{time:"15:00",type:"fight",key:"mapei_e"},
{time:"16:00",type:"ch",title:"代码评审",desc:"CR消息：「你的代码需要review。」",chs:[{text:"\u2705 通过（+3护盾）",ef:function(g){ g.gainShield(3); }},{text:"\u274C 驳回（+2压力）",ef:function(g){ g.addStress(2); }}]},
{time:"17:00",type:"fight",key:"laoyuhua"},
{time:"18:00",type:"boss",key:"mike"},
],
3:[
{time:"09:00",type:"ch",title:"HR约谈",desc:"HR发来邮件：「请到会议室来一趟。」",chs:[{text:"\uD83D\uDE2C 紧张应对（+3压力）",ef:function(g){ g.addStress(3); }},{text:"\uD83D\uDE10 淡定应对（-2压力）",ef:function(g){ g.state.stress=Math.max(0,g.state.stress-2); }}]},
{time:"10:00",type:"fight",key:"youjian"},
{time:"11:00",type:"ch",title:"跨部门协作",desc:"项目经理：「需要有人牵头这个项目。」",chs:[{text:"\uD83D\uDCAA 主动牵头（获得团建卡）",ef:function(g){ g.state.deck.push(deepCopy(CP.tuanjian)); g.addStress(1); }},{text:"\uD83D\uDEAB 推脱（获得甩锅卡）",ef:function(g){ g.state.deck.push(deepCopy(CP.shuoguo)); }}]},
{time:"12:00",type:"lunch"},
{time:"13:00",type:"fight",key:"laoyuhua"},
{time:"14:00",type:"ch",title:"强制培训",desc:"公司通知：「今天有职业素养培训，必须参加。」",chs:[{text:"\uD83D\uDDA5\uFE0F 认真学习（获得会议纪要卡）",ef:function(g){ g.state.deck.push(deepCopy(CP.huiyi)); }},{text:"\uD83D\uDE34 摸鱼（50%被发现，+2压力）",ef:function(g){ if(Math.random()<0.5){ g.addStress(2); g.log("被发现了！+2压力","stress"); } else { g.log("摸鱼成功","event"); } }}]},
{time:"15:00",type:"fight",key:"mapei_e"},
{time:"16:00",type:"ch",title:"KPI对赌",desc:"老板：「完成这个项目，奖励翻倍。失败了要扣绩效。」",chs:[{text:"\uD83D\uDE80 接受对赌（获得冲刺卡,+2压力）",ef:function(g){ g.state.deck.push(deepCopy(CP.chongci)); g.addStress(2); }},{text:"\uD83D\uDEAB 拒绝",ef:function(g){ }}]},
{time:"17:00",type:"fight",key:"kaihui"},
{time:"18:00",type:"boss",key:"jessica"},
],
4:[
{time:"09:00",type:"ch",title:"架构重构",desc:"CTO David：「这套系统需要全面重构。」",chs:[{text:"\uD83D\uDCAA 大改（获得裁员卡,+4压力）",ef:function(g){ g.state.deck.push(deepCopy(CP.cairyuan)); g.addStress(4); }},{text:"\uD83D\uDED1 小改（获得汇报卡,+1压力）",ef:function(g){ g.state.deck.push(deepCopy(CP.baofu)); g.addStress(1); }}]},
{time:"10:00",type:"fight",key:"mapei"},
{time:"11:00",type:"ch",title:"技术分享会",desc:"技术部通知：「今天有技术分享，欢迎参加。」",chs:[{text:"\uD83C\uDFAD 演讲（+2压力,下次战斗+50%伤害）",ef:function(g){ g.addStress(2); g.state.nextBattleBonusDmg=(g.state.nextBattleBonusDmg||0)+4; }},{text:"\uD83C\uDFA8 听众（无效果）",ef:function(g){ }}]},
{time:"12:00",type:"lunch"},
{time:"13:00",type:"fight",key:"ppt"},
{time:"14:00",type:"ch",title:"紧急发布",desc:"运维：「线上出了P0故障，需要紧急发布。」",chs:[{text:"\u26A1 紧急修复（跳过下一事件）",ef:function(g){ g.state.skipNextEvent=true; }},{text:"\u274C 拒绝（+1压力）",ef:function(g){ g.addStress(1); }}]},
{time:"15:00",type:"fight",key:"youjian"},
{time:"16:00",type:"ch",title:"代码冻结检查",desc:"项目经理：「代码冻结前最后检查。」",chs:[{text:"\u2705 检查通过",ef:function(g){ }},{text:"\u274C 驳回（+2压力）",ef:function(g){ g.addStress(2); }}]},
{time:"17:00",type:"fight",key:"laoyuhua"},
{time:"18:00",type:"boss",key:"david"},
],
5:[
{time:"09:00",type:"ch",title:"年终考核",desc:"HR：「今年绩效评定开始了。」",chs:[{text:"\uD83D\uDE80 拼命表现（+3压力,BOSS伤害x2）",ef:function(g){ g.addStress(3); g.state.bossDamageMult=2; }},{text:"\uD83D\uDE10 低调（+1压力,+10HP）",ef:function(g){ g.addStress(1); g.heal(10); }}]},
{time:"10:00",type:"fight",key:"laoyuhua"},
{time:"11:00",type:"ch",title:"股权谈判",desc:"CEO：「给你期权，留下来一起干。」",chs:[{text:"\u2705 接受（获得通宵卡）",ef:function(g){ g.state.deck.push(deepCopy(CP.tongxiao)); }},{text:"\u274C 拒绝",ef:function(g){ }}]},
{time:"12:00",type:"lunch"},
{time:"13:00",type:"fight",key:"kaihui"},
{time:"14:00",type:"ch",title:"CEO全员大会",desc:"CEO Alexander宣布：「今天有重要公告。」",chs:[{text:"\uD83C\uDF7D\uFE0F 参加大会（获得最终汇报卡）",ef:function(g){ g.state.deck.push(deepCopy(CP.zuihui)); g.log("获得最终汇报卡！","event"); }}]},
{time:"15:00",type:"fight",key:"mapei_e"},
{time:"16:00",type:"ch",title:"最终抉择",desc:"5天过去了。你要离开这家公司吗？",chs:[{text:"\uD83D\uDEAA 辞职离开（跳过BOSS，直接通关！）",ef:function(g){ g.winGameEarly(); }},{text:"\uD83D\uDCAA 坚持到底（进入最终BOSS战）",ef:function(g){ }}]},
{time:"18:00",type:"boss",key:"alexander"},
],
};

export { EVENTS };
export function getDayEvents(day) { return EVENTS[day] || []; }
