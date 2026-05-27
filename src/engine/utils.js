// utils.js — mkDeck
import { deepCopy } from '../data/constants.js';
import { CP } from '../data/cards.js';

export { deepCopy } from '../data/constants.js';

export function mkDeck(){
  var d=[];
  // 初始通用卡
  for(var i=0;i<4;i++) d.push(deepCopy(CP.moyu));
  for(var i=0;i<3;i++) d.push(deepCopy(CP.qingjia));
  for(var i=0;i<3;i++) d.push(deepCopy(CP.jiaban));
  for(var i=0;i<2;i++) d.push(deepCopy(CP.baoxiao));
  for(var i=0;i<2;i++) d.push(deepCopy(CP.huiyi));
  for(var i=0;i<2;i++) d.push(deepCopy(CP.zhoubao));
  d.push(deepCopy(CP.kafei));
  d.push(deepCopy(CP.tiaoxin));
  d.push(deepCopy(CP.shuoguo));
  // 随机加入2张派系卡
  var factionCards=[CP.paogouqi,CP.bingjiatiao,CP.zunshixiaban,CP.jixiao,
                    CP.wushui,CP.yangshengcha,CP.bagua,CP.babaozhou];
  var picks=factionCards.slice().sort(function(){ return Math.random()-0.5; });
  d.push(deepCopy(picks[0]));
  d.push(deepCopy(picks[1]));
  return d;
}
