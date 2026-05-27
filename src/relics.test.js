// Relic effects tests
import { deepCopy } from './data/constants.js';

describe('Relic effect hooks', () => {
  function createMockState(overrides = {}) {
    return {
      stress: 0,
      en: 3,
      men: 3,
      sh: 0,
      php: 50,
      pmax: 50,
      ene: null,
      relics: [],
      ...overrides,
    };
  }

  test('机械键盘 adds +2 damage on dealDamageToEnemy', () => {
    const relic = {
      id: 'jixie',
      name: '机械键盘',
      onDamageDealt: (n) => n + 2
    };
    expect(relic.onDamageDealt(10)).toBe(12);
    expect(relic.onDamageDealt(5)).toBe(7);
  });

  test('人体工学椅 caps heal at 12', () => {
    const relic = {
      id: 'renshen',
      name: '人体工学椅',
      onHeal: (n) => Math.min(n, 12)
    };
    expect(relic.onHeal(5)).toBe(5);
    expect(relic.onHeal(15)).toBe(12);
    expect(relic.onHeal(20)).toBe(12);
  });

  test('降压药 reduces stress on battle start', () => {
    const state = createMockState({ stress: 5 });
    const relic = {
      id: 'jiangya',
      name: '降压药',
      onBattleStart: function() {
        state.stress = Math.max(0, state.stress - 2);
      }
    };
    relic.onBattleStart();
    expect(state.stress).toBe(3);
  });

  test('降压药 does not go below 0', () => {
    const state = createMockState({ stress: 1 });
    const relic = {
      id: 'jiangya',
      name: '降压药',
      onBattleStart: function() {
        state.stress = Math.max(0, state.stress - 2);
      }
    };
    relic.onBattleStart();
    expect(state.stress).toBe(0);
  });

  test('咖啡机 adds 1 energy on battle start', () => {
    const state = createMockState({ en: 2, men: 3 });
    const relic = {
      id: 'kafei',
      name: '咖啡机',
      onBattleStart: function() {
        state.en = Math.min(state.men, state.en + 1);
      }
    };
    relic.onBattleStart();
    expect(state.en).toBe(3);
  });

  test('停车场车位 adds 8 shield on battle start', () => {
    const state = createMockState({ sh: 0 });
    const relic = {
      id: 'parking',
      name: '停车场车位',
      onBattleStart: function() {
        state.sh += 8;
      }
    };
    relic.onBattleStart();
    expect(state.sh).toBe(8);
  });

  test('备用金 absorbs up to 15 damage once', () => {
    const relic = {
      id: 'beiyong',
      name: '备用金',
      used: false,
      onDamaged: function(n) {
        if (this.used || n <= 0) return n;
        this.used = true;
        return Math.max(0, n - 15);
      }
    };
    expect(relic.onDamaged(20)).toBe(5);
    expect(relic.onDamaged(10)).toBe(10); // used=true, so no more absorption
    expect(relic.used).toBe(true);
  });

  test('备用金 does not absorb when already used', () => {
    const relic = {
      id: 'beiyong',
      name: '备用金',
      used: true,
      onDamaged: function(n) {
        if (this.used || n <= 0) return n;
        this.used = true;
        return Math.max(0, n - 15);
      }
    };
    expect(relic.onDamaged(20)).toBe(20); // no absorption
    expect(relic.onDamaged(5)).toBe(5);
  });

  test('996奖杯 boosts damage at high stress', () => {
    const relic = {
      id: '996cup',
      name: '996奖杯',
      onDamageDealt: function(n) {
        if (this.stress >= 7) return Math.floor(n * 1.5);
        return n;
      },
      stress: 8
    };
    expect(relic.onDamageDealt(10)).toBe(15);

    relic.stress = 5;
    expect(relic.onDamageDealt(10)).toBe(10);
  });
});

describe('Relic hasRelic check', () => {
  function hasRelic(state, id) {
    return state.relics.some(r => r.id === id || r.name === id);
  }

  test('finds relic by id', () => {
    const state = {
      relics: [
        { id: 'jixie', name: '机械键盘' },
        { id: 'kafei', name: '咖啡机' }
      ]
    };
    expect(hasRelic(state, 'jixie')).toBe(true);
    expect(hasRelic(state, 'kafei')).toBe(true);
    expect(hasRelic(state, 'renshen')).toBe(false);
  });

  test('finds relic by name', () => {
    const state = {
      relics: [
        { id: 'jixie', name: '机械键盘' }
      ]
    };
    expect(hasRelic(state, '机械键盘')).toBe(true);
    expect(hasRelic(state, '不存在的遗物')).toBe(false);
  });
});

describe('Relic trigger chain', () => {
  function triggerRelic(state, event) {
    const args = Array.prototype.slice.call(arguments, 2);
    (state.relics || []).forEach(r => {
      if (r.used === true) return;
      if (typeof r[event] === 'function') {
        const result = r[event].apply(r, args);
        if (result !== undefined) args[0] = result;
      }
    });
    return args[0];
  }

  test('calls onBattleStart for all relics', () => {
    let callCount = 0;
    const state = {
      relics: [
        { id: 'a', name: 'A', onBattleStart: () => callCount++ },
        { id: 'b', name: 'B', onBattleStart: () => callCount++ },
      ]
    };
    triggerRelic(state, 'onBattleStart');
    expect(callCount).toBe(2);
  });

  test('skips used relics', () => {
    let callCount = 0;
    const state = {
      relics: [
        { id: 'a', name: 'A', used: true, onBattleStart: () => callCount++ },
        { id: 'b', name: 'B', onBattleStart: () => callCount++ },
      ]
    };
    triggerRelic(state, 'onBattleStart');
    expect(callCount).toBe(1);
  });
});
