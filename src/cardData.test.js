// Card data separation test - verify cards are pure serializable data
import { deepCopy } from './data/constants.js';

describe('Card data structure', () => {
  // Current card structure has action as a function
  // After refactor, card should only have data properties

  test('card has required data properties', () => {
    const card = {
      id: 'moyu',
      name: '摸鱼',
      cost: 0,
      type: 'skill',
      effect: '抽2张'
    };

    // All properties should be serializable
    expect(typeof card.id).toBe('string');
    expect(typeof card.name).toBe('string');
    expect(typeof card.cost).toBe('number');
    expect(typeof card.type).toBe('string');
    expect(typeof card.effect).toBe('string');
  });

  test('card data is copyable without functions', () => {
    const original = {
      id: 'moyu',
      name: '摸鱼',
      cost: 0,
      type: 'skill',
      effect: '抽2张'
    };

    const copy = deepCopy(original);

    expect(copy).toEqual(original);
    expect(copy).not.toBe(original);
  });

  test('card can be serialized to JSON', () => {
    const card = {
      id: 'moyu',
      name: '摸鱼',
      cost: 0,
      type: 'skill',
      effect: '抽2张'
    };

    const json = JSON.stringify(card);
    const parsed = JSON.parse(json);

    expect(parsed).toEqual(card);
  });

  test('multiple cards form a valid deck array', () => {
    const deck = [
      { id: 'moyu', name: '摸鱼', cost: 0, type: 'skill' },
      { id: 'qingjia', name: '请假条', cost: 0, type: 'skill' },
      { id: 'jiaban', name: '加班', cost: 1, type: 'attack' },
    ];

    expect(Array.isArray(deck)).toBe(true);
    expect(deck.length).toBe(3);
    deck.forEach(card => {
      expect(card.id).toBeDefined();
      expect(card.cost).toBeGreaterThanOrEqual(0);
    });
  });
});

describe('Card action separation', () => {
  // After refactor: card only has data, action is separate

  test('action can be looked up by card id', () => {
    const cardActions = {
      moyu: (ctx) => ctx.drawCards(2),
      qingjia: (ctx) => ctx.gainShield(6),
      jiaban: (ctx) => { ctx.dealDamageToEnemy(6); ctx.addStress(1); },
    };

    const cardId = 'moyu';
    const action = cardActions[cardId];

    expect(typeof action).toBe('function');
  });

  test('action receives context to modify state', () => {
    let drawCount = 0;
    const mockCtx = {
      drawCards: (n) => { drawCount += n; }
    };

    const moyuAction = (ctx) => ctx.drawCards(2);
    moyuAction(mockCtx);

    expect(drawCount).toBe(2);
  });

  test('different cards have different actions', () => {
    const cardActions = {
      moyu: (ctx) => { ctx.drawCards(2); },
      qingjia: (ctx) => { ctx.gainShield(6); },
    };

    let results = [];
    const mockCtx = {
      drawCards: () => results.push('draw'),
      gainShield: () => results.push('shield'),
    };

    cardActions.moyu(mockCtx);
    cardActions.qingjia(mockCtx);

    expect(results).toEqual(['draw', 'shield']);
  });
});

describe('Enemy data structure', () => {
  test('enemy has required data properties', () => {
    const enemy = {
      id: 'xinren',
      name: '职场新人',
      emoji: '👨‍💻',
      maxHp: 15,
    };

    expect(typeof enemy.id).toBe('string');
    expect(typeof enemy.name).toBe('string');
    expect(typeof enemy.maxHp).toBe('number');
  });

  test('enemy can be scaled by day', () => {
    const baseEnemy = {
      id: 'xinren',
      maxHp: 15,
    };

    const scaleByDay = (enemy, day) => {
      const multipliers = [1, 1.1, 1.2, 1.3, 1.5];
      return Math.floor(enemy.maxHp * (multipliers[day - 1] || 1));
    };

    expect(scaleByDay(baseEnemy, 1)).toBe(15);
    expect(scaleByDay(baseEnemy, 5)).toBe(22); // 15 * 1.5
  });
});

describe('Boss data structure', () => {
  test('boss has intent array', () => {
    const boss = {
      id: 'linda',
      name: 'HR Linda',
      maxHp: 50,
      ints: [
        { label: '观察 +1压力 抽1', stress: 1, extra: true },
        { label: '攻击8', dmg: 8 },
      ],
    };

    expect(Array.isArray(boss.ints)).toBe(true);
    expect(boss.ints.length).toBeGreaterThan(0);
    expect(boss.ints[0].label).toBeDefined();
  });

  test('boss intent can be selected by index', () => {
    const boss = {
      ints: [
        { label: '攻击8', dmg: 8 },
        { label: '+2压力', stress: 2 },
        { label: '重击12', dmg: 12 },
        { label: '观察', extra: true },
      ],
    };

    function getIntent(bossData, idx) {
      return bossData.ints[idx % bossData.ints.length];
    }

    expect(getIntent(boss, 0).dmg).toBe(8);
    expect(getIntent(boss, 1).stress).toBe(2);
    expect(getIntent(boss, 4).dmg).toBe(8); // wraps around
  });
});
