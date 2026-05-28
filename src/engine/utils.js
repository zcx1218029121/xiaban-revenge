// utils.js — mkDeck
import { deepCopy } from '../data/constants.js';
import { CP } from '../data/cards.js';

export { deepCopy } from '../data/constants.js';

export function mkDeck(){
  var d=[];
  // 简单初始牌组 — 只有基础攻击/防御/过牌
  for(var i=0;i<4;i++) d.push(deepCopy(CP.moyu));       // 0费过1
  for(var i=0;i<4;i++) d.push(deepCopy(CP.xiehuier));   // 0费3盾
  for(var i=0;i<4;i++) d.push(deepCopy(CP.jiaban));     // 1费6伤+1压
  for(var i=0;i<3;i++) d.push(deepCopy(CP.qingjia));    // 1费6盾
  for(var i=0;i<2;i++) d.push(deepCopy(CP.zhoubao));    // 2费9伤
  for(var i=0;i<2;i++) d.push(deepCopy(CP.baoxiao));    // 1费8盾+2血
  d.push(deepCopy(CP.kafei));                            // 1费+2能
  d.push(deepCopy(CP.shuoguo));                          // 1费5伤-1压
  return d;
}
