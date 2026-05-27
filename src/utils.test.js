// deepCopy utility tests
import { deepCopy } from './data/constants.js';

describe('deepCopy', () => {
  test('primitives return as-is', () => {
    expect(deepCopy(42)).toBe(42);
    expect(deepCopy('hello')).toBe('hello');
    expect(deepCopy(null)).toBe(null);
    expect(deepCopy(undefined)).toBe(undefined);
  });

  test('arrays are cloned', () => {
    const original = [1, 2, 3];
    const copy = deepCopy(original);
    expect(copy).toEqual([1, 2, 3]);
    expect(copy).not.toBe(original);
  });

  test('nested arrays are deep cloned', () => {
    const original = [1, [2, [3]]];
    const copy = deepCopy(original);
    expect(copy).toEqual([1, [2, [3]]]);
    expect(copy[1]).not.toBe(original[1]);
    expect(copy[1][1]).not.toBe(original[1][1]);
  });

  test('objects are cloned', () => {
    const original = { a: 1, b: 2 };
    const copy = deepCopy(original);
    expect(copy).toEqual({ a: 1, b: 2 });
    expect(copy).not.toBe(original);
  });

  test('nested objects are deep cloned', () => {
    const original = { a: { b: { c: 1 } } };
    const copy = deepCopy(original);
    expect(copy).toEqual({ a: { b: { c: 1 } } });
    expect(copy.a).not.toBe(original.a);
    expect(copy.a.b).not.toBe(original.a.b);
  });

  test('card-like objects are cloned with all properties', () => {
    const card = {
      id: 'test',
      name: '测试卡',
      cost: 2,
      type: 'attack',
      effect: '造成6点伤害',
      action: function(g) { g.dealDamageToEnemy(6); }
    };
    const copy = deepCopy(card);
    expect(copy).toEqual(card);
    expect(copy.action).toBe(card.action); // functions are same reference
    expect(copy.id).toBe('test');
    expect(copy.cost).toBe(2);
  });
});
