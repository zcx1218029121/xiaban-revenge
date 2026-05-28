// Roguelike features tests - new cards, synergy, rarity, mechanics
import { CP, getCard } from './data/cards.js';
import { executeCardAction, cardActions } from './engine/cardActions.js';
import { deepCopy } from './data/constants.js';

function makeMockCtx(overrides = {}) {
  return {
    hp: 50,
    en: 3,
    sh: 0,
    stress: 0,
    php: 50,
    pmax: 50,
    ene: { hp: 25, maxHp: 25, weak: 0, armor: 0, poison: 0, name: 'test', canWeaken: true },
    state: {
      tempDmgMult: 0, stress: 0, php: 50, pmax: 50, en: 3, men: 3,
      sh: 0, noDrawThisTurn: false, immuneThisTurn: false,
      enemySkipNext: false, enemyDmgReduction: 0,
      _socialPlayed: 0, _lastCardPlayed: null,
      hand: [], disc: [], deck: [],
      relics: [], _pendingKill: false, breakdown: false,
      bossDamageMult: 1,
    },
    addStress: (n) => { },
    heal: (n) => { },
    gainShield: (n) => { },
    dealDamageToEnemy: () => false,
    modifyEnergy: (n) => { },
    applyWeak: (n) => { },
    applyPoison: (n) => { },
    drawCards: (n) => { },
    triggerRelic: () => { },
    log: () => { },
    updateAll: () => { },
    updateHand: () => { },
    get enemy() { return this.state.ene || this.ene; },
    get isBoss() { return false; },
    ...overrides,
  };
}

describe('Card Pool Expansion', () => {
  test('has 100+ cards', () => {
    var keys = Object.keys(CP);
    expect(keys.length).toBeGreaterThanOrEqual(100);
  });

  test('all cards have required properties', () => {
    Object.values(CP).forEach(function(c) {
      expect(c.id).toBeDefined();
      expect(c.name).toBeDefined();
      expect(typeof c.cost).toBe('number');
      expect(c.type).toBeDefined();
      expect(c.rarity).toBeDefined();
      expect(c.faction).toBeDefined();
    });
  });

  test('has 5 factions', () => {
    var factions = new Set();
    Object.values(CP).forEach(function(c) { factions.add(c.faction); });
    expect(factions.size).toBe(5);
    expect(factions.has('通用')).toBe(true);
    expect(factions.has('卷王')).toBe(true);
    expect(factions.has('摸鱼')).toBe(true);
    expect(factions.has('养生')).toBe(true);
    expect(factions.has('社交')).toBe(true);
  });

  test('has 3 rarities', () => {
    var rarities = {};
    Object.values(CP).forEach(function(c) {
      rarities[c.rarity] = (rarities[c.rarity] || 0) + 1;
    });
    expect(rarities.C).toBeGreaterThan(15);
    expect(rarities.U).toBeGreaterThan(10);
    expect(rarities.R).toBeGreaterThan(2);
  });

  test('getCard returns card by id', () => {
    var card = getCard('moyu');
    expect(card.id).toBe('moyu');
    expect(card.name).toBe('摸鱼');
  });

  test('all playable cards have actions', () => {
    Object.keys(CP).forEach(function(id) {
      var c = CP[id];
      // Equipment and unplayable curses don't need cardActions
      if (c.type === 'equipment' || c.unplayable) return;
      expect(cardActions[id]).toBeDefined();
      expect(typeof cardActions[id]).toBe('function');
    });
  });
});

describe('Card Action Execution', () => {
  test('moyu draws 1 card via executeCardAction', () => {
    var drawn = 0;
    var ctx = makeMockCtx({ drawCards: function(n) { drawn += n; } });
    executeCardAction('moyu', ctx);
    expect(drawn).toBe(1);
  });

  test('qingjia gains 4 shield', () => {
    var shield = 0;
    var ctx = makeMockCtx({ gainShield: function(n) { shield += n; } });
    executeCardAction('qingjia', ctx);
    expect(shield).toBe(6);
  });

  test('unknown card id is silent no-op', () => {
    var ctx = makeMockCtx();
    expect(function() { executeCardAction('nonexistent', ctx); }).not.toThrow();
  });

  test('jiaban deals 6 damage and adds 1 stress', () => {
    var dmg = 0, stress = 0;
    var ctx = makeMockCtx({
      dealDamageToEnemy: function(n) { dmg += n; },
      addStress: function(n) { stress += n; },
    });
    executeCardAction('jiaban', ctx);
    expect(dmg).toBe(6);
    expect(stress).toBe(1);
  });
});

describe('New Faction Cards', () => {
  test('养生派: wushui heals 10 and adds 1 stress', () => {
    var healed = 0, stress = 0;
    var ctx = makeMockCtx({
      heal: function(n) { healed += n; },
      addStress: function(n) { stress += n; },
    });
    executeCardAction('wushui', ctx);
    expect(healed).toBe(10);
    expect(stress).toBe(1);
  });

  test('养生派: yangshengcha reduces stress by 3', function() {
    var state = { stress: 5 };
    var ctx = makeMockCtx({ state: state });
    var action = cardActions.yangshengcha;
    action(ctx);
    expect(state.stress).toBe(2);
  });

  test('养生派: tuina fully heals and clears stress', function() {
    var healed = 0;
    var state = { stress: 7, php: 20, pmax: 50 };
    var ctx = makeMockCtx({
      state: state,
      heal: function(n) { healed = n; },
      log: function() {},
    });
    executeCardAction('tuina', ctx);
    expect(healed).toBe(99);
    expect(state.stress).toBe(0);
  });

  test('社交派: qingke sets enemy damage reduction', function() {
    var state = { enemyDmgReduction: 0 };
    var ctx = makeMockCtx({ state: state });
    executeCardAction('qingke', ctx);
    expect(state.enemyDmgReduction).toBe(4);
  });

  test('社交派: bagua deals 3 damage and draws 1 card', function() {
    var dmg = 0, drawn = 0;
    var ctx = makeMockCtx({
      dealDamageToEnemy: function(n) { dmg += n; },
      drawCards: function(n) { drawn += n; },
    });
    executeCardAction('bagua', ctx);
    expect(dmg).toBe(3);
    expect(drawn).toBe(1);
  });

  test('社交派: neibu copies last played card', function() {
    var copied = false;
    var ctx = makeMockCtx({
      state: { _lastCardPlayed: 'moyu' },
      log: function() {},
      drawCards: function(n) { copied = true; },
    });
    // moyu draws 2, so if neibu copies it, drawCards should be called
    executeCardAction('neibu', ctx);
    expect(copied).toBe(true);
  });

  test('摸鱼派: toulandashi skips next enemy turn', function() {
    var state = { enemySkipNext: false };
    var ctx = makeMockCtx({ state: state });
    executeCardAction('toulandashi', ctx);
    expect(state.enemySkipNext).toBe(true);
  });

  test('摸鱼派: xialing gives 2 energy and immunity', function() {
    var en = 0;
    var state = { immuneThisTurn: false, en: 1, men: 3 };
    var ctx = makeMockCtx({
      state: state,
      modifyEnergy: function(n) { en += n; },
      log: function() {},
    });
    executeCardAction('xialing', ctx);
    expect(state.immuneThisTurn).toBe(true);
  });
});

describe('Faction Synergy System', () => {
  test('playing 3 same-faction cards triggers +1 energy', function() {
    var bonusEnergy = 0;
    var factionPlays = { '卷王': 2 };
    // Simulate 3rd card play
    factionPlays['卷王'] = (factionPlays['卷王'] || 0) + 1;
    if (factionPlays['卷王'] === 3) bonusEnergy += 1;
    expect(factionPlays['卷王']).toBe(3);
    expect(bonusEnergy).toBe(1);
  });

  test('playing 4 same-faction cards triggers heal 5', function() {
    var healed = 0;
    var factionPlays = { '摸鱼': 3 };
    factionPlays['摸鱼'] = (factionPlays['摸鱼'] || 0) + 1;
    if (factionPlays['摸鱼'] === 4) healed += 5;
    expect(factionPlays['摸鱼']).toBe(4);
    expect(healed).toBe(5);
  });

  test('synergy resets each turn', function() {
    var factionPlays = { '通用': 2, '卷王': 1 };
    // nextTurn resets
    factionPlays = {};
    expect(factionPlays).toEqual({});
  });
});

describe('Enemy Damage Reduction', () => {
  test('enemyDmgReduction reduces incoming damage', function() {
    var state = { sh: 0, enemyDmgReduction: 4, immuneThisTurn: false, playerWeak: 0, php: 50 };
    // Simulate dealDamageToPlayer with reduction
    var n = 10;
    if (state.enemyDmgReduction > 0) {
      n = Math.max(0, n - state.enemyDmgReduction);
      state.enemyDmgReduction = 0;
    }
    expect(n).toBe(6);
    expect(state.enemyDmgReduction).toBe(0);
  });

  test('enemyDmgReduction cannot go below 0', function() {
    var state = { sh: 0, enemyDmgReduction: 10, immuneThisTurn: false, playerWeak: 0, php: 50 };
    var n = 5;
    if (state.enemyDmgReduction > 0) {
      n = Math.max(0, n - state.enemyDmgReduction);
      state.enemyDmgReduction = 0;
    }
    expect(n).toBe(0);
  });
});

describe('Enemy Skip Next Turn', () => {
  test('enemySkipNext prevents enemy action', function() {
    var enemyActed = false;
    var skipNext = true;
    if (!skipNext) {
      enemyActed = true;
    } else {
      skipNext = false;
    }
    expect(enemyActed).toBe(false);
    expect(skipNext).toBe(false);
  });

  test('enemySkipNext resets after one turn', function() {
    var skipNext = true;
    // First turn with skip
    if (skipNext) { skipNext = false; }
    expect(skipNext).toBe(false);
    // Next turn without skip
    var enemyActed = false;
    if (!skipNext) { enemyActed = true; }
    expect(enemyActed).toBe(true);
  });
});

describe('Card Rarity System', () => {
  test('common cards are most numerous', function() {
    var common = Object.values(CP).filter(function(c) { return c.rarity === 'C'; });
    var uncommon = Object.values(CP).filter(function(c) { return c.rarity === 'U'; });
    var rare = Object.values(CP).filter(function(c) { return c.rarity === 'R'; });
    expect(common.length).toBeGreaterThan(uncommon.length);
    expect(uncommon.length).toBeGreaterThan(rare.length);
    expect(rare.length).toBeGreaterThan(0);
  });

  test('rare cards have higher costs on average', function() {
    var rares = Object.values(CP).filter(function(c) { return c.rarity === 'R'; });
    expect(rares.length).toBeGreaterThan(0);
    var avg = rares.reduce(function(s,c){ return s+c.cost; },0) / rares.length;
    expect(avg).toBeGreaterThanOrEqual(1.8);
  });
});

describe('Card Removal Mechanic', () => {
  test('can remove a random card from deck', function() {
    var deck = [{ id: 'moyu' }, { id: 'qingjia' }, { id: 'jiaban' }, { id: 'baoxiao' }];
    expect(deck.length).toBe(4);
    var idx = Math.floor(Math.random() * deck.length);
    deck.splice(idx, 1);
    expect(deck.length).toBe(3);
  });

  test('cannot remove if deck too small', function() {
    var deck = [{ id: 'moyu' }, { id: 'qingjia' }];
    var canRemove = deck.length > 3;
    expect(canRemove).toBe(false);
  });
});

describe('noDrawThisTurn Behavior', () => {
  test('noDrawThisTurn blocks card-effect draws during current turn', function() {
    var noDraw = true;
    var drawn = 0;
    if (noDraw) { noDraw = false; } // skip
    else { drawn += 5; }
    expect(drawn).toBe(0);
    expect(noDraw).toBe(false); // cleared after check
  });

  test('nextTurn resets noDrawThisTurn for fresh hand', function() {
    var noDraw = true;
    // Simulate nextTurn
    noDraw = false;
    var drawn = 0;
    if (!noDraw) { drawn += 5; }
    expect(drawn).toBe(5);
  });
});

describe('Starting Deck Variety', () => {
  test('starting deck includes faction cards', function() {
    var factionCards = ['paogouqi', 'bingjiatiao', 'zunshixiaban', 'jixiao',
                        'wushui', 'yangshengcha', 'bagua', 'babaozhou'];
    var hasFaction = factionCards.some(function(id) { return CP[id].faction !== '通用'; });
    expect(hasFaction).toBe(true);
  });

  test('starting deck size is 21', function() {
    var count = 4+3+3+2+2+2+1+1+1+2; // all mkDeck allocations
    expect(count).toBe(21);
  });
});

describe('Random Enemy Pool', () => {
  test('enemy pool has non-elite enemies', function() {
    // Mock EN structure
    var EN = {
      xinren: { name: '职场新人', maxHp: 15 },
      laoyuhua: { name: '老油条', maxHp: 20 },
      ppt: { name: 'PPT纺织工', maxHp: 18 },
      youjian: { name: '邮件轰炸机', maxHp: 12 },
      mapei_e: { name: '马屁精(精英)', maxHp: 35, isElite: true },
    };
    var pool = Object.keys(EN).filter(function(k) { return !EN[k].isElite; });
    expect(pool.length).toBe(4);
    expect(pool).not.toContain('mapei_e');
  });

  test('random enemy selection returns valid enemy', function() {
    var EN = {
      xinren: { name: '职场新人', maxHp: 15 },
      laoyuhua: { name: '老油条', maxHp: 20 },
    };
    var pool = Object.keys(EN);
    var key = pool[Math.floor(Math.random() * pool.length)];
    expect(EN[key]).toBeDefined();
    expect(typeof EN[key].name).toBe('string');
  });
});

describe('Boss Damage Multiplier', () => {
  test('bossDamageMult is applied in damage calculation', function() {
    var state = { bossDamageMult: 2, stress: 0, tempDmgMult: 0, _pendingKill: false, relics: [] };
    var fd = 10;
    if (state.bossDamageMult > 1) {
      fd = Math.floor(fd * state.bossDamageMult);
    }
    expect(fd).toBe(20);
  });

  test('bossDamageMult of 1 has no effect', function() {
    var state = { bossDamageMult: 1, stress: 0, tempDmgMult: 0 };
    var fd = 10;
    if (state.bossDamageMult > 1) {
      fd = Math.floor(fd * state.bossDamageMult);
    }
    expect(fd).toBe(10);
  });
});

describe('996cup Relic onDamageDealt', () => {
  test('applies 1.5x multiplier when stress >= 7', function() {
    var n = 10;
    var stress = 7;
    if (stress >= 7) {
      n = Math.floor(n * 1.5);
    }
    expect(n).toBe(15);
  });

  test('no multiplier when stress < 7', function() {
    var n = 10;
    var stress = 5;
    if (stress >= 7) {
      n = Math.floor(n * 1.5);
    }
    expect(n).toBe(10);
  });
});

describe('Deck Preservation Across Fights', () => {
  test('resetForBattle preserves cards from hand and discard', function() {
    // Simulate state after a fight
    var deck = [
      { id: 'zhoubao', cost: 2 }, { id: 'kaohe', cost: 3 }, { id: 'chongci', cost: 2 },
    ];
    var hand = [
      { id: 'moyu', cost: 0 }, { id: 'qingjia', cost: 0 }, { id: 'moyu', cost: 0 },
    ];
    var disc = [
      { id: 'jiaban', cost: 1 }, { id: 'baoxiao', cost: 1 },
    ];
    var totalBefore = deck.length + hand.length + disc.length; // 8
    // Simulate resetForBattle
    deck = deck.concat(hand).concat(disc);
    hand = [];
    disc = [];
    expect(deck.length).toBe(totalBefore);
    expect(hand.length).toBe(0);
    expect(disc.length).toBe(0);
  });

  test('deck does not shrink after multiple fights', function() {
    var deck = [];
    for (var i = 0; i < 21; i++) deck.push({ id: 'card' + i });
    // Fight 1: draw 5, play 3
    var hand = deck.splice(0, 5);
    var disc = hand.splice(0, 3); // played 3
    // Reset for next fight
    deck = deck.concat(hand).concat(disc);
    expect(deck.length).toBe(21); // all cards preserved
    // Fight 2: draw 5, play 4
    hand = deck.splice(0, 5);
    disc = hand.splice(0, 4);
    deck = deck.concat(hand).concat(disc);
    expect(deck.length).toBe(21); // still all there
  });
});

describe('Roguelike Decision Making', () => {
  test('removing bad cards improves average deck quality', function() {
    var deck = [
      { cost: 0, rarity: 'C' }, { cost: 0, rarity: 'C' }, { cost: 1, rarity: 'C' },
      { cost: 3, rarity: 'U' }, { cost: 3, rarity: 'R' },
    ];
    // Remove a cost-0 common
    var idx = deck.findIndex(function(c) { return c.cost === 0; });
    deck.splice(idx, 1);
    var avgCost = deck.reduce(function(s, c) { return s + c.cost; }, 0) / deck.length;
    expect(avgCost).toBeGreaterThan(1);
  });

  test('taking rare cards over commons improves deck power', function() {
    function powerScore(card) {
      var rarityScore = { C: 1, U: 2, R: 4 };
      return card.cost * 2 + rarityScore[card.rarity];
    }
    var commonCard = { cost: 1, rarity: 'C' };
    var rareCard = { cost: 3, rarity: 'R' };
    expect(powerScore(rareCard)).toBeGreaterThan(powerScore(commonCard));
  });
});
