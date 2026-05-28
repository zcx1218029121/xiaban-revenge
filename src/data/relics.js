// Relics definition — 40 relics, pure data, no behavior
// Rarity: 1=Common, 2=Uncommon, 3=Rare, 4=Legendary
// cursed=true means it has a permanent drawback

var RELICS = [
  // ============================================================
  // Common (1) — 16 total
  // ============================================================
  { id:"jixie",    name:"机械键盘",   emoji:"⌨️", desc:"所有攻击 +2 伤害",           rarity:1 },
  { id:"renshen",  name:"人体工学椅", emoji:"🪑", desc:"单次治疗最多12点",           rarity:1 },
  { id:"jiangya",  name:"降压药",     emoji:"💊", desc:"战斗开始时压力 -2",          rarity:1 },
  // New Common (13)
  { id:"baowen_rc",name:"保温杯",     emoji:"🫖", desc:"每场战斗开始治疗3HP",       rarity:1 },
  { id:"bianqian", name:"便签纸",     emoji:"📝", desc:"每回合结束+1护盾",           rarity:1 },
  { id:"chongdian",name:"充电器",     emoji:"🔌", desc:"每场战斗开始+1能量",         rarity:1 },
  { id:"lvzhi",    name:"绿植",       emoji:"🪴", desc:"每天结束治疗5HP",            rarity:1 },
  { id:"kouxiang", name:"口香糖",     emoji:"🍬", desc:"压力达10时抵消防一次(+5压替代)",rarity:1 },
  { id:"tuoxie",   name:"办公室拖鞋", emoji:"🩴", desc:"首次受伤-3(每场战斗1次)",   rarity:1 },
  { id:"makebei",  name:"马克杯",     emoji:"🪆", desc:"每场战斗开始抽1张",          rarity:1 },
  { id:"erji",     name:"耳机",       emoji:"🎧", desc:"压力≥6时每回合压力-1",      rarity:1 },
  { id:"lingshi",  name:"零食抽屉",   emoji:"🍪", desc:"击杀敌人治疗3HP",            rarity:1 },
  { id:"naozhong", name:"闹钟",       emoji:"⏰", desc:"每天开始+1能量",              rarity:1 },
  { id:"shubiaodian",name:"鼠标垫",   emoji:"🖱️", desc:"所有攻击+1伤害",             rarity:1 },
  { id:"humujing", name:"护目镜",     emoji:"🥽", desc:"每场战斗首次攻击+5伤害",     rarity:1 },
  { id:"taideng",  name:"台灯",       emoji:"💡", desc:"有护盾时回合结束+1护盾",     rarity:1 },

  // ============================================================
  // Uncommon (2) — 12 total
  // ============================================================
  { id:"kafei",    name:"咖啡机",     emoji:"☕", desc:"战斗开始 +1 能量",           rarity:2 },
  { id:"parking",  name:"停车场车位", emoji:"🅿️", desc:"战斗开始 +8 护盾",           rarity:2 },
  { id:"yugang",   name:"鱼缸",       emoji:"🐠", desc:"战斗胜利30%抽1张",           rarity:2 },
  { id:"jinsheng", name:"晋升通知书", emoji:"📬", desc:"每天结束压力 -3",            rarity:2 },
  { id:"996cup",   name:"996奖杯",    emoji:"🏆", desc:"压力≥7时攻击+50%,击杀回5HP",rarity:2 },
  { id:"jiangyan", name:"降噪耳机",   emoji:"🎧", desc:"敌人中毒额外+2伤害",         rarity:2 },
  // New Uncommon (6)
  { id:"zhediechuang",name:"折叠床",  emoji:"🛏️", desc:"午餐效果翻倍",               rarity:2 },
  { id:"kafeijiaonang",name:"咖啡胶囊",emoji:"💊",desc:"每回合+2能量但+2压力",       rarity:2 },
  { id:"gongsi_gupiao",name:"公司股票",emoji:"📈",desc:"战斗胜利25%获得稀有卡",      rarity:2 },
  { id:"gongpaitao",name:"工牌套",    emoji:"🪪", desc:"boss战开始+15护盾",          rarity:2 },
  { id:"yanzhao",  name:"午休眼罩",   emoji:"😴", desc:"每天开始治疗10HP",           rarity:2 },
  { id:"yinxiang", name:"蓝牙音箱",   emoji:"🔊", desc:"敌人首次攻击-5伤害(每场)",  rarity:2 },

  // ============================================================
  // Rare (3) — 8 total
  // ============================================================
  { id:"beiyong",  name:"备用金",     emoji:"💵", desc:"抵消一次最多15点伤害",       rarity:3 },
  { id:"hrtousu",  name:"HR投诉热线", emoji:"📞", desc:"敌人开局自带1层虚弱",       rarity:3 },
  { id:"huiyi",    name:"会议室预订", emoji:"📅", desc:"每天开始额外抽2张",          rarity:3 },
  // New Rare (5)
  { id:"diantika", name:"电梯卡",     emoji:"🛗", desc:"所有获得的护盾+50%",         rarity:3 },
  { id:"jiabanfei",name:"加班费",     emoji:"💰", desc:"压力≥7时治疗翻倍",           rarity:3 },
  { id:"caiyuan_md",name:"裁员名单",  emoji:"📋", desc:"boss战伤害x2",               rarity:3 },
  { id:"nianzhongjiang",name:"年终奖",emoji:"🧧",desc:"每天开始抽3张+压力-5",        rarity:3 },
  { id:"peiche",   name:"公司配车",   emoji:"🚗", desc:"永久能量上限+1",             rarity:3 },

  // ============================================================
  // Legendary (4) — 4 total
  // ============================================================
  { id:"duli_bangongshi",name:"独立办公室",emoji:"🏢",desc:"所有卡费用-1(最低0)",    rarity:4 },
  { id:"wuqixian",  name:"无限期合同",emoji:"📜", desc:"死亡时满血复活1次",          rarity:4 },
  { id:"shangshi",  name:"公司上市",  emoji:"🚀", desc:"奖励选择变为2个",             rarity:4 },
  { id:"laoban_xinren",name:"老板信任",emoji:"🤝",desc:"战斗开始能量回满+手牌补满",   rarity:4 },

  // ============================================================
  // Cursed Relics — powerful effect + permanent drawback
  // ============================================================
  // Uncommon cursed (2)
  { id:"jiaban_xieyi",name:"加班协议",emoji:"📝",desc:"每回合+2能量",                rarity:2, cursed:true, drawback:"每回合+1压力" },
  { id:"jiujiu_hetong",name:"996合同",emoji:"📄",desc:"所有伤害+30%",                rarity:2, cursed:true, drawback:"无法获得护盾" },
  // Rare cursed (2)
  { id:"jingye_xieyi",name:"竞业协议",emoji:"🔒",desc:"每回合多抽2张",               rarity:3, cursed:true, drawback:"无法治疗" },
  { id:"junlingzhuang",name:"绩效军令状",emoji:"🎯",desc:"boss战伤害x3",             rarity:3, cursed:true, drawback:"普通敌人+50%HP" },
  // Legendary cursed (2)
  { id:"zhongshen", name:"终身合同",   emoji:"🔗", desc:"能量上限+3",                rarity:4, cursed:true, drawback:"每场战斗开始-10%最大HP" },
  { id:"hehuoren",  name:"合伙人协议",emoji:"🤝", desc:"所有卡牌稀有度提升1级",      rarity:4, cursed:true, drawback:"每场战斗结束丢弃全部手牌" },
];

export { RELICS };
export function getRelic(id) { return RELICS.find(r => r.id === id || r.name === id); }
