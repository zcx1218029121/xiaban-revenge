// utils.js — deepCopy + mkDeck
import { CP } from '../data/cards.js';

export function deepCopy(obj){
  if(obj===null||typeof obj!=='object') return obj;
  if(Array.isArray(obj)) return obj.map(deepCopy);
  var o={};
  for(var k in obj){ if(obj.hasOwnProperty(k)) o[k]=deepCopy(obj[k]); }
  return o;
}
export function mkDeck(){
  var d=[];
  for(var i=0;i<5;i++) d.push(deepCopy(CP.moyu));
  for(var i=0;i<4;i++) d.push(deepCopy(CP.qingjia));
  for(var i=0;i<3;i++) d.push(deepCopy(CP.jiaban));
  for(var i=0;i<3;i++) d.push(deepCopy(CP.baoxiao));
  for(var i=0;i<2;i++) d.push(deepCopy(CP.huiyi));
  for(var i=0;i<2;i++) d.push(deepCopy(CP.zhoubao));
  d.push(deepCopy(CP.kafei));
  return d;
}
