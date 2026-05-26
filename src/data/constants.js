// Utility functions shared across all modules
export function deepCopy(obj){
  if(obj===null||typeof obj!=='object') return obj;
  if(Array.isArray(obj)) return obj.map(deepCopy);
  var o={};
  for(var k in obj){ if(obj.hasOwnProperty(k)) o[k]=deepCopy(obj[k]); }
  return o;
}
