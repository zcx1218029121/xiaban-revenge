// Routes — branching path system replacing linear events
import { deepCopy } from './constants.js';
import { CP } from './cards.js';

var ROUTES = {
  1: {
    branches: {
      safe: [
        {time:"09:00",type:"ch",title:"早会通知",desc:"组长：「9点早会，大家参加。」",chs:[
          {text:"✅ 参加（+1压力,+3伤害）",ef:function(g){g.addStress(1);g.state.nextBattleBonusDmg=(g.state.nextBattleBonusDmg||0)+3;}},
          {text:"❌ 摸鱼跳过",ef:function(g){g.heal(3);}}
        ]},
        {time:"10:00",type:"fight",key:"xinren"},
        {time:"11:00",type:"heal",value:6},
        {time:"12:00",type:"lunch"},
        {time:"13:00",type:"fight",key:"laoyuhua"},
        {time:"14:00",type:"ch",title:"同事求助",desc:"老王：「帮我个小忙。」",chs:[
          {text:"🤝 帮忙（获得周报卡）",ef:function(g){g.state.deck.push(deepCopy(CP.zhoubao));}},
          {text:"🙅 不帮（+1压力）",ef:function(g){g.addStress(1);}}
        ]},
        {time:"15:00",type:"heal",value:4},
        {time:"16:00",type:"ch",title:"下午茶",desc:"奶茶到了！",chs:[
          {text:"🧋 来一杯（+8HP,-1压力）",ef:function(g){g.heal(8);g.state.stress=Math.max(0,g.state.stress-1);}}
        ]},
        {time:"17:00",type:"fight",key:"ppt"},
        {time:"18:00",type:"boss",key:"linda"},
      ],
      neutral: [
        {time:"09:00",type:"ch",title:"早会通知",desc:"组长：「9点早会，必须参加。」",chs:[
          {text:"✅ 参加（+1压力,+3伤害）",ef:function(g){g.addStress(1);g.state.nextBattleBonusDmg=(g.state.nextBattleBonusDmg||0)+3;}},
          {text:"❌ 跳过（抽1张）",ef:function(g){g.state.nextBattleDraw=(g.state.nextBattleDraw||0)+1;}}
        ]},
        {time:"10:00",type:"fight",key:"xinren"},
        {time:"11:00",type:"ch",title:"同事借刀",desc:"老王：「刀坏了，借用一下？」",chs:[
          {text:"🔪 借（获得周报卡）",ef:function(g){g.state.deck.push(deepCopy(CP.zhoubao));}},
          {text:"🚫 不借（+1压力）",ef:function(g){g.addStress(1);}}
        ]},
        {time:"12:00",type:"lunch"},
        {time:"13:00",type:"fight",key:"laoyuhua"},
        {time:"14:00",type:"ch",title:"免费下午茶",desc:"公司买奶茶！",chs:[
          {text:"🧋 奶茶（+8HP,-1压力）",ef:function(g){g.heal(8);g.state.stress=Math.max(0,g.state.stress-1);}},
          {text:"🍰 蛋糕（-2压力,+5护盾）",ef:function(g){g.state.stress=Math.max(0,g.state.stress-2);g.gainShield(5);}}
        ]},
        {time:"15:00",type:"fight",key:"ppt"},
        {time:"16:00",type:"ch",title:"紧急任务",desc:"组长：「有紧急任务。」",chs:[
          {text:"💪 主动（得加班卡x2）",ef:function(g){g.state.deck.push(deepCopy(CP.jiaban));g.state.deck.push(deepCopy(CP.jiaban));}},
          {text:"😴 假装没看到",ef:function(g){}}
        ]},
        {time:"17:00",type:"fight",key:"youjian"},
        {time:"18:00",type:"boss",key:"linda"},
      ],
      risk: [
        {time:"09:00",type:"ch",title:"早会通知",desc:"组长：「紧急会议！项目要黄了。」",chs:[
          {text:"💪 主动请缨（+2压力,获得冲刺卡）",ef:function(g){g.addStress(2);g.state.deck.push(deepCopy(CP.chongci));}},
          {text:"😰 装病（-2压力）",ef:function(g){g.state.stress=Math.max(0,g.state.stress-2);}}
        ]},
        {time:"10:00",type:"elite_fight"},
        {time:"11:00",type:"ch",title:"甩锅大会",desc:"项目出问题了，开始甩锅。",chs:[
          {text:"🎭 甩回去（+2压力,下次+50%伤害）",ef:function(g){g.addStress(2);g.state.nextBattleBonusDmg=(g.state.nextBattleBonusDmg||0)+5;}},
          {text:"🛡️ 接下（获得甩锅卡+加班卡）",ef:function(g){g.state.deck.push(deepCopy(CP.shuoguo));g.state.deck.push(deepCopy(CP.jiaban));}}
        ]},
        {time:"12:00",type:"lunch"},
        {time:"13:00",type:"fight",key:"laoyuhua"},
        {time:"14:00",type:"ch",title:"即兴汇报",desc:"CTO突然要听取汇报。",chs:[
          {text:"📊 即兴演讲（获得即兴演讲卡）",ef:function(g){g.state.deck.push(deepCopy(CP.qizhiyanjiang));}},
          {text:"😨 紧张（+2压力）",ef:function(g){g.addStress(2);}}
        ]},
        {time:"15:00",type:"elite_fight"},
        {time:"16:00",type:"ch",title:"风险奖励",desc:"你扛住了风险路径，选择奖励。",chs:[
          {text:"🃏 获得稀有卡（调岗申请）",ef:function(g){g.state.deck.push(deepCopy(CP.diaogang));}},
          {text:"💊 治疗15HP",ef:function(g){g.heal(15);}}
        ]},
        {time:"18:00",type:"boss",key:"linda"},
      ],
    }
  },
  2: {
    branches: {
      safe: [
        {time:"09:00",type:"ch",title:"需求变更",desc:"PM Mike：「有变更，不大。」",chs:[
          {text:"📋 接受（获得会议纪要卡）",ef:function(g){g.state.deck.push(deepCopy(CP.huiyi));}},
          {text:"❌ 拒绝（治疗5HP）",ef:function(g){g.heal(5);}}
        ]},
        {time:"10:00",type:"fight",key:"kaihui"},
        {time:"11:00",type:"heal",value:8},
        {time:"12:00",type:"lunch"},
        {time:"13:00",type:"fight",key:"mapei"},
        {time:"14:00",type:"ch",title:"午休时光",desc:"难得的安静时间。",chs:[
          {text:"😴 午睡（+10HP）",ef:function(g){g.heal(10);}},
          {text:"📖 学习（抽2张）",ef:function(g){g.drawCards(2);}}
        ]},
        {time:"15:00",type:"fight",key:"kaoheguan"},
        {time:"16:00",type:"ch",title:"代码评审",desc:"你的代码需要review。",chs:[
          {text:"✅ 快速通过（+3护盾）",ef:function(g){g.gainShield(3);}}
        ]},
        {time:"17:00",type:"heal",value:5},
        {time:"18:00",type:"boss",key:"mike"},
      ],
      neutral: [
        {time:"09:00",type:"ch",title:"需求变更",desc:"PM Mike：「需求有变更，下午前改完。」",chs:[
          {text:"📋 接受（加班卡x2,+2压力）",ef:function(g){g.state.deck.push(deepCopy(CP.jiaban));g.state.deck.push(deepCopy(CP.jiaban));g.addStress(2);}},
          {text:"❌ 拒绝（获得周报卡）",ef:function(g){g.state.deck.push(deepCopy(CP.zhoubao));}}
        ]},
        {time:"10:00",type:"fight",key:"kaihui"},
        {time:"11:00",type:"ch",title:"1v1辅导",desc:"PM Mike想找你单独聊。",chs:[
          {text:"✅ 接受（获得绩效考核卡）",ef:function(g){g.state.deck.push(deepCopy(CP.kaohe));}},
          {text:"❌ 拒绝（-1压力）",ef:function(g){g.state.stress=Math.max(0,g.state.stress-1);}}
        ]},
        {time:"12:00",type:"lunch"},
        {time:"13:00",type:"fight",key:"mapei"},
        {time:"14:00",type:"ch",title:"部门聚餐",desc:"部门群发消息：「今晚聚餐！」",chs:[
          {text:"🍽️ 参加（-2压力,+8HP）",ef:function(g){g.state.stress=Math.max(0,g.state.stress-2);g.heal(8);}},
          {text:"😴 不参加（+1压力）",ef:function(g){g.addStress(1);}}
        ]},
        {time:"15:00",type:"fight",key:"yangshengdaren"},
        {time:"16:00",type:"ch",title:"代码评审",desc:"你的代码需要review。",chs:[
          {text:"✅ 通过（+3护盾）",ef:function(g){g.gainShield(3);}},
          {text:"❌ 驳回（+2压力）",ef:function(g){g.addStress(2);}}
        ]},
        {time:"17:00",type:"fight",key:"laoyuhua"},
        {time:"18:00",type:"boss",key:"mike"},
      ],
      risk: [
        {time:"09:00",type:"ch",title:"紧急重构",desc:"PM Mike：「需要紧急重构代码。」",chs:[
          {text:"💪 接受挑战（+3压力,获得裁员卡）",ef:function(g){g.addStress(3);g.state.deck.push(deepCopy(CP.cairyuan));}},
          {text:"😰 勉强应对（+1压力,+5护盾）",ef:function(g){g.addStress(1);g.gainShield(5);}}
        ]},
        {time:"10:00",type:"elite_fight"},
        {time:"11:00",type:"ch",title:"高强度会议",desc:"连续3小时的会议。",chs:[
          {text:"💪 坚持（+2压力,获得汇报卡）",ef:function(g){g.addStress(2);g.state.deck.push(deepCopy(CP.baofu));}},
          {text:"🚽 厕所避难（-1压力）",ef:function(g){g.state.stress=Math.max(0,g.state.stress-1);}}
        ]},
        {time:"12:00",type:"lunch"},
        {time:"13:00",type:"elite_fight"},
        {time:"14:00",type:"ch",title:"技术角斗",desc:"你要在技术评审中捍卫方案。",chs:[
          {text:"🗣️ 辩论到底（获得最终汇报卡）",ef:function(g){g.state.deck.push(deepCopy(CP.zuihui));}},
          {text:"🤐 沉默（+2压力）",ef:function(g){g.addStress(2);}}
        ]},
        {time:"15:00",type:"ch",title:"风险奖励",desc:"你在风险路径上的坚持获得了回报。",chs:[
          {text:"🃏 稀有卡",ef:function(g){g.state.deck.push(deepCopy(CP.kaohe));}},
          {text:"🛡️ 15护盾",ef:function(g){g.gainShield(15);}}
        ]},
        {time:"18:00",type:"boss",key:"mike"},
      ],
    }
  },
  3: {
    branches: {
      safe: [
        {time:"09:00",type:"ch",title:"HR约谈",desc:"HR发来邮件：「谈谈。」",chs:[
          {text:"😊 淡定（-2压力）",ef:function(g){g.state.stress=Math.max(0,g.state.stress-2);}}
        ]},
        {time:"10:00",type:"fight",key:"youjian"},
        {time:"11:00",type:"heal",value:10},
        {time:"12:00",type:"lunch"},
        {time:"13:00",type:"fight",key:"laoyuhua"},
        {time:"14:00",type:"ch",title:"安全培训",desc:"公司：「安全培训。」",chs:[
          {text:"📖 学习（抽2张）",ef:function(g){g.drawCards(2);}}
        ]},
        {time:"15:00",type:"fight",key:"baguajing"},
        {time:"16:00",type:"heal",value:8},
        {time:"17:00",type:"fight",key:"kaoheguan"},
        {time:"18:00",type:"boss",key:"jessica"},
      ],
      neutral: [
        {time:"09:00",type:"ch",title:"HR约谈",desc:"HR发来邮件：「来会议室。」",chs:[
          {text:"😬 紧张（+3压力）",ef:function(g){g.addStress(3);}},
          {text:"😊 淡定（-2压力）",ef:function(g){g.state.stress=Math.max(0,g.state.stress-2);}}
        ]},
        {time:"10:00",type:"fight",key:"youjian"},
        {time:"11:00",type:"ch",title:"跨部门协作",desc:"项目经理：「需要人牵头。」",chs:[
          {text:"💪 主动（获得团建卡）",ef:function(g){g.state.deck.push(deepCopy(CP.tuanjian));g.addStress(1);}},
          {text:"🚫 推脱（获得甩锅卡）",ef:function(g){g.state.deck.push(deepCopy(CP.shuoguo));}}
        ]},
        {time:"12:00",type:"lunch"},
        {time:"13:00",type:"fight",key:"laoyuhua"},
        {time:"14:00",type:"ch",title:"强制培训",desc:"公司：「职业素养培训。」",chs:[
          {text:"💻 学习（获得会议纪要卡）",ef:function(g){g.state.deck.push(deepCopy(CP.huiyi));}},
          {text:"😴 摸鱼（50%被发现）",ef:function(g){if(Math.random()<0.5){g.addStress(2);g.log("被发现了！","stress");}else{g.log("摸鱼成功","event");}}}
        ]},
        {time:"15:00",type:"fight",key:"kaoheguan"},
        {time:"16:00",type:"ch",title:"KPI对赌",desc:"老板：「完成项目奖励翻倍。」",chs:[
          {text:"🚀 对赌（获得冲刺卡,+2压力）",ef:function(g){g.state.deck.push(deepCopy(CP.chongci));g.addStress(2);}},
          {text:"🚫 拒绝",ef:function(g){}}
        ]},
        {time:"17:00",type:"fight",key:"kaihui"},
        {time:"18:00",type:"boss",key:"jessica"},
      ],
      risk: [
        {time:"09:00",type:"ch",title:"HR约谈",desc:"HR：「你的绩效有问题。」",chs:[
          {text:"💪 据理力争（+3压力,下次战斗+4伤害）",ef:function(g){g.addStress(3);g.state.nextBattleBonusDmg=(g.state.nextBattleBonusDmg||0)+4;}},
          {text:"😰 认错（治疗10HP）",ef:function(g){g.heal(10);}}
        ]},
        {time:"10:00",type:"elite_fight"},
        {time:"11:00",type:"ch",title:"高压项目",desc:"需要加班到凌晨。",chs:[
          {text:"💀 通宵（+4压力,获得通宵卡x2）",ef:function(g){g.addStress(4);g.state.deck.push(deepCopy(CP.tongxiao));g.state.deck.push(deepCopy(CP.tongxiao));}},
          {text:"🚫 拒绝（获得甩锅卡）",ef:function(g){g.state.deck.push(deepCopy(CP.shuoguo));}}
        ]},
        {time:"12:00",type:"lunch"},
        {time:"13:00",type:"elite_fight"},
        {time:"14:00",type:"ch",title:"办公室政治",desc:"有人要搞你。",chs:[
          {text:"🤝 拉帮结派（获得拉帮结派卡）",ef:function(g){g.state.deck.push(deepCopy(CP.lapai));}},
          {text:"🛡️ 隐忍（+15护盾）",ef:function(g){g.gainShield(15);}}
        ]},
        {time:"15:00",type:"ch",title:"风险奖励",desc:"高风险高回报。",chs:[
          {text:"🃏 获得稀有卡（过劳死）",ef:function(g){g.state.deck.push(deepCopy(CP.guolaosi));}},
          {text:"💊 移除压力+治疗15HP",ef:function(g){g.state.stress=0;g.heal(15);}}
        ]},
        {time:"18:00",type:"boss",key:"jessica"},
      ],
    }
  },
  4: {
    branches: {
      safe: [
        {time:"09:00",type:"ch",title:"架构评审",desc:"CTO David审查架构。",chs:[
          {text:"✅ 配合检查（治疗8HP）",ef:function(g){g.heal(8);}}
        ]},
        {time:"10:00",type:"fight",key:"mapei"},
        {time:"11:00",type:"heal",value:12},
        {time:"12:00",type:"lunch"},
        {time:"13:00",type:"fight",key:"ppt"},
        {time:"14:00",type:"ch",title:"午休",desc:"部门难得的安静。",chs:[
          {text:"😴 午睡（+15HP）",ef:function(g){g.heal(15);}},
          {text:"☕ 喝咖啡（+2能量）",ef:function(g){g.modifyEnergy(2);}}
        ]},
        {time:"15:00",type:"fight",key:"zhichangdaoshi"},
        {time:"16:00",type:"heal",value:8},
        {time:"17:00",type:"fight",key:"kaoheguan"},
        {time:"18:00",type:"boss",key:"david"},
      ],
      neutral: [
        {time:"09:00",type:"ch",title:"架构重构",desc:"CTO David：「需要重构。」",chs:[
          {text:"💪 大改（获得裁员卡,+4压力）",ef:function(g){g.state.deck.push(deepCopy(CP.cairyuan));g.addStress(4);}},
          {text:"🛑 小改（获得汇报卡,+1压力）",ef:function(g){g.state.deck.push(deepCopy(CP.baofu));g.addStress(1);}}
        ]},
        {time:"10:00",type:"fight",key:"mapei"},
        {time:"11:00",type:"ch",title:"技术分享",desc:"部门：「技术分享会。」",chs:[
          {text:"🎭 演讲（+2压力,+50%伤害）",ef:function(g){g.addStress(2);g.state.nextBattleBonusDmg=(g.state.nextBattleBonusDmg||0)+4;}},
          {text:"🎨 听众",ef:function(g){}}
        ]},
        {time:"12:00",type:"lunch"},
        {time:"13:00",type:"fight",key:"ppt"},
        {time:"14:00",type:"ch",title:"紧急发布",desc:"运维：「P0故障！」",chs:[
          {text:"⚡ 修复（跳过下一事件）",ef:function(g){g.state.skipNextEvent=true;}},
          {text:"❌ 拒绝（+1压力）",ef:function(g){g.addStress(1);}}
        ]},
        {time:"15:00",type:"fight",key:"chengxuyuan"},
        {time:"16:00",type:"ch",title:"代码冻结",desc:"最后检查。",chs:[
          {text:"✅ 通过",ef:function(g){}},
          {text:"❌ 驳回（+2压力）",ef:function(g){g.addStress(2);}}
        ]},
        {time:"17:00",type:"fight",key:"laoyuhua"},
        {time:"18:00",type:"boss",key:"david"},
      ],
      risk: [
        {time:"09:00",type:"ch",title:"架构重构",desc:"CTO David：「系统需要推倒重来。」",chs:[
          {text:"💀 全面重构（+5压力,获得过劳死卡）",ef:function(g){g.addStress(5);g.state.deck.push(deepCopy(CP.guolaosi));}},
          {text:"💪 局部优化（+2压力,获得汇报卡）",ef:function(g){g.addStress(2);g.state.deck.push(deepCopy(CP.baofu));}}
        ]},
        {time:"10:00",type:"elite_fight"},
        {time:"11:00",type:"ch",title:"线上事故",desc:"P0故障！所有人都要救火。",chs:[
          {text:"🔥 冲锋（+3压力,获得007套餐）",ef:function(g){g.addStress(3);g.state.deck.push(deepCopy(CP.lingqisan));}},
          {text:"🧯 协助（治疗8HP）",ef:function(g){g.heal(8);}}
        ]},
        {time:"12:00",type:"lunch"},
        {time:"13:00",type:"elite_fight"},
        {time:"14:00",type:"ch",title:"高压谈判",desc:"与CTO的直接谈判。",chs:[
          {text:"💰 争取利益（获得备用金卡效果,+10护盾）",ef:function(g){g.gainShield(10);g.heal(8);}},
          {text:"🤝 妥协（-2压力）",ef:function(g){g.state.stress=Math.max(0,g.state.stress-2);}}
        ]},
        {time:"15:00",type:"ch",title:"风险奖励",desc:"高风险路径的回报。",chs:[
          {text:"🃏 稀有卡（猝死急救）",ef:function(g){g.state.deck.push(deepCopy(CP.cusi));}},
          {text:"🛡️ 20护盾+治疗10HP",ef:function(g){g.gainShield(20);g.heal(10);}}
        ]},
        {time:"18:00",type:"boss",key:"david"},
      ],
    }
  },
  5: {
    branches: {
      safe: [
        {time:"09:00",type:"ch",title:"年终考核",desc:"HR：「绩效评定。」",chs:[
          {text:"😊 低调（+1压力,+10HP）",ef:function(g){g.addStress(1);g.heal(10);}}
        ]},
        {time:"10:00",type:"fight",key:"laoyuhua"},
        {time:"11:00",type:"ch",title:"最后午餐",desc:"和同事吃最后一顿。",chs:[
          {text:"🍽️ 聚餐（-3压力,+12HP）",ef:function(g){g.state.stress=Math.max(0,g.state.stress-3);g.heal(12);}}
        ]},
        {time:"12:00",type:"lunch"},
        {time:"13:00",type:"fight",key:"kaihui"},
        {time:"14:00",type:"heal",value:15},
        {time:"15:00",type:"fight",key:"kaoheguan"},
        {time:"16:00",type:"ch",title:"最终抉择",desc:"5天过去了。你要离开吗？",chs:[
          {text:"🚪 辞职（跳过BOSS,直接通关！）",ef:function(g){g.winGameEarly();}},
          {text:"💪 坚持到底（BOSS战）",ef:function(g){}}
        ]},
        {time:"18:00",type:"boss",key:"alexander"},
      ],
      neutral: [
        {time:"09:00",type:"ch",title:"年终考核",desc:"HR：「绩效评定。」",chs:[
          {text:"🚀 拼命（+3压力,BOSS伤害x2）",ef:function(g){g.addStress(3);g.state.bossDamageMult=2;}},
          {text:"😊 低调（+1压力,+10HP）",ef:function(g){g.addStress(1);g.heal(10);}}
        ]},
        {time:"10:00",type:"fight",key:"laoyuhua"},
        {time:"11:00",type:"ch",title:"股权谈判",desc:"CEO：「给你期权。」",chs:[
          {text:"✅ 接受（获得通宵卡）",ef:function(g){g.state.deck.push(deepCopy(CP.tongxiao));}},
          {text:"❌ 拒绝",ef:function(g){}}
        ]},
        {time:"12:00",type:"lunch"},
        {time:"13:00",type:"fight",key:"kaihui"},
        {time:"14:00",type:"ch",title:"CEO大会",desc:"CEO Alexander宣布重要公告。",chs:[
          {text:"🍽️ 参加（获得最终汇报卡）",ef:function(g){g.state.deck.push(deepCopy(CP.zuihui));}}
        ]},
        {time:"15:00",type:"fight",key:"jiaban_e"},
        {time:"16:00",type:"ch",title:"最终抉择",desc:"5天过去了。",chs:[
          {text:"🚪 辞职（跳过BOSS,直接通关！）",ef:function(g){g.winGameEarly();}},
          {text:"💪 坚持到底（BOSS战）",ef:function(g){}}
        ]},
        {time:"18:00",type:"boss",key:"alexander"},
      ],
      risk: [
        {time:"09:00",type:"ch",title:"年终考核",desc:"HR：「你的去留由CEO决定。」",chs:[
          {text:"🚀 拼命（+5压力,BOSS伤害x2）",ef:function(g){g.addStress(5);g.state.bossDamageMult=2;}},
          {text:"💪 奋战（+2压力,BOSS伤害x1.5）",ef:function(g){g.addStress(2);g.state.bossDamageMult=1.5;}}
        ]},
        {time:"10:00",type:"elite_fight"},
        {time:"11:00",type:"ch",title:"CEO亲自考验",desc:"Alexander：「证明你的价值。」",chs:[
          {text:"💀 接受（+3压力,获得过劳死卡）",ef:function(g){g.addStress(3);g.state.deck.push(deepCopy(CP.guolaosi));}},
          {text:"🎯 对赌（获得007套餐）",ef:function(g){g.state.deck.push(deepCopy(CP.lingqisan));}}
        ]},
        {time:"12:00",type:"lunch"},
        {time:"13:00",type:"elite_fight"},
        {time:"14:00",type:"ch",title:"最终赏赐",desc:"在最后一关前的选择。",chs:[
          {text:"🃏 获得传奇卡（加班费的诅咒遗物效果）",ef:function(g){g.state.nextBattleBonusDmg=(g.state.nextBattleBonusDmg||0)+8;g.heal(20);}},
          {text:"🛡️ 满血+30护盾",ef:function(g){g.heal(99);g.gainShield(30);}}
        ]},
        {time:"15:00",type:"ch",title:"最终抉择",desc:"是时候了。",chs:[
          {text:"🚪 辞职（跳过BOSS,直接通关！）",ef:function(g){g.winGameEarly();}},
          {text:"💀 死战到底（BOSS战,伤害x2）",ef:function(g){g.state.bossDamageMult=(g.state.bossDamageMult||1)*2;}}
        ]},
        {time:"18:00",type:"boss",key:"alexander"},
      ],
    }
  },
};

export { ROUTES };
