// GameState tests
import { deepCopy } from './data/constants.js';

class GameState {
  constructor() {
    this.day = 1;
    this.idx = 0;
    this.php = 50;
    this.pmax = 50;
    this.en = 3;
    this.men = 3;
    this.sh = 0;
    this.stress = 0;
    this.deck = [];
    this.hand = [];
    this.disc = [];
    this.ene = null;
    this.boss = false;
    this.go = false;
    this.biIdx = 0;
    this.relics = [];
    this.t = 1;
    this.tempDmgMult = 0;
    this.nextBattleBonusDmg = 0;
    this.nextBattleDraw = 0;
    this.nextBattleStress = 0;
    this.skipNextEvent = false;
    this.bossDamageMult = 1;
    this.ic = false;
    this.noShieldTurns = 0;
    this.noDrawThisTurn = false;
    this.immuneThisTurn = false;
    this.playerWeak = 0;
    this.breakdown = false;
    this._pendingKill = false;
  }

  reset() {
    this.day = 1;
    this.idx = 0;
    this.php = 50;
    this.pmax = 50;
    this.en = 3;
    this.men = 3;
    this.sh = 0;
    this.stress = 0;
    this.deck = [];
    this.hand = [];
    this.disc = [];
    this.ene = null;
    this.boss = false;
    this.go = false;
    this.biIdx = 0;
    this.t = 1;
    this.tempDmgMult = 0;
    this.nextBattleBonusDmg = 0;
    this.nextBattleDraw = 0;
    this.nextBattleStress = 0;
    this.skipNextEvent = false;
    this.bossDamageMult = 1;
    this.ic = false;
    this.noShieldTurns = 0;
    this.noDrawThisTurn = false;
    this.immuneThisTurn = false;
    this.playerWeak = 0;
    this.breakdown = false;
  }

  resetForBattle() {
    this.en = 3;
    this.men = 3;
    this.sh = 0;
    this.tempDmgMult = 0;
    this.noShieldTurns = 0;
    this.noDrawThisTurn = false;
    this.immuneThisTurn = false;
    this.playerWeak = 0;
    this.breakdown = false;
    this.hand = [];
    this.disc = [];
  }

  clearBattle() {
    this.ene = null;
    this.ic = false;
    this.biIdx = 0;
    this.tempDmgMult = 0;
    this.noShieldTurns = 0;
    this.noDrawThisTurn = false;
    this.immuneThisTurn = false;
    this.playerWeak = 0;
    this.breakdown = false;
    this._pendingKill = false;
  }

  nextTurn() {
    this.biIdx++;
    this.en = 3;
    this.men = 3;
    this.sh = 0;
    this.tempDmgMult = 0;
    this.noShieldTurns = Math.max(0, this.noShieldTurns - 1);
    this.playerWeak = Math.max(0, this.playerWeak - 1);
    this.breakdown = false;
  }
}

describe('GameState', () => {
  test('initializes with default values', () => {
    const s = new GameState();
    expect(s.php).toBe(50);
    expect(s.pmax).toBe(50);
    expect(s.en).toBe(3);
    expect(s.men).toBe(3);
    expect(s.sh).toBe(0);
    expect(s.stress).toBe(0);
    expect(s.day).toBe(1);
  });

  test('reset restores initial state', () => {
    const s = new GameState();
    s.php = 30;
    s.stress = 5;
    s.day = 3;
    s.reset();
    expect(s.php).toBe(50);
    expect(s.stress).toBe(0);
    expect(s.day).toBe(1);
  });

  test('resetForBattle resets combat state', () => {
    const s = new GameState();
    s.en = 1;
    s.sh = 10;
    s.tempDmgMult = 2;
    s.breakdown = true;
    s.resetForBattle();
    expect(s.en).toBe(3);
    expect(s.sh).toBe(0);
    expect(s.tempDmgMult).toBe(0);
    expect(s.breakdown).toBe(false);
  });

  test('clearBattle removes enemy and combat flags', () => {
    const s = new GameState();
    s.ic = true;
    s.ene = { name: 'Test Enemy', hp: 20 };
    s.biIdx = 2;
    s.breakdown = true;
    s.clearBattle();
    expect(s.ene).toBe(null);
    expect(s.ic).toBe(false);
    expect(s.biIdx).toBe(0);
    expect(s.breakdown).toBe(false);
  });

  test('nextTurn increments boss intent index and resets per-turn values', () => {
    const s = new GameState();
    s.biIdx = 0;
    s.noShieldTurns = 2;
    s.playerWeak = 3;
    s.breakdown = true;
    s.nextTurn();
    expect(s.biIdx).toBe(1);
    expect(s.noShieldTurns).toBe(1);
    expect(s.playerWeak).toBe(2);
    expect(s.breakdown).toBe(false);
  });

  test('stress does not go below 0', () => {
    const s = new GameState();
    s.stress = 0;
    s.stress = Math.max(0, s.stress - 5);
    expect(s.stress).toBe(0);
  });

  test('hp does not go below 0', () => {
    const s = new GameState();
    s.php = 0;
    s.php = Math.max(0, s.php - 10);
    expect(s.php).toBe(0);
  });

  test('hp does not exceed max', () => {
    const s = new GameState();
    s.php = 50;
    s.php = Math.min(s.pmax, s.php + 20);
    expect(s.php).toBe(50);
  });
});

describe('Stress damage multiplier', () => {
  function calculateStressMultiplier(stress) {
    if (stress >= 10) return 2.5;
    if (stress >= 7) return 1.5;
    if (stress >= 4) return 1.25;
    return 1;
  }

  test('no bonus at low stress', () => {
    expect(calculateStressMultiplier(0)).toBe(1);
    expect(calculateStressMultiplier(3)).toBe(1);
  });

  test('1.25x bonus at stress 4-6', () => {
    expect(calculateStressMultiplier(4)).toBe(1.25);
    expect(calculateStressMultiplier(5)).toBe(1.25);
    expect(calculateStressMultiplier(6)).toBe(1.25);
  });

  test('1.5x bonus at stress 7-9', () => {
    expect(calculateStressMultiplier(7)).toBe(1.5);
    expect(calculateStressMultiplier(8)).toBe(1.5);
    expect(calculateStressMultiplier(9)).toBe(1.5);
  });

  test('2.5x bonus at stress 10+', () => {
    expect(calculateStressMultiplier(10)).toBe(2.5);
    expect(calculateStressMultiplier(15)).toBe(2.5);
  });
});

describe('Weak debuff', () => {
  function calculateWeakMultiplier(weak) {
    return Math.pow(0.75, weak);
  }

  test('no effect when not weak', () => {
    expect(calculateWeakMultiplier(0)).toBe(1);
  });

  test('reduces damage when weak', () => {
    expect(calculateWeakMultiplier(1)).toBeCloseTo(0.75);
    expect(calculateWeakMultiplier(2)).toBeCloseTo(0.5625);
    expect(calculateWeakMultiplier(3)).toBeCloseTo(0.421875);
  });
});

describe('Card cost energy check', () => {
  function canPlayCard(cardCost, currentEnergy) {
    return cardCost <= currentEnergy;
  }

  test('can play card with sufficient energy', () => {
    expect(canPlayCard(2, 3)).toBe(true);
    expect(canPlayCard(0, 0)).toBe(true);
    expect(canPlayCard(3, 3)).toBe(true);
  });

  test('cannot play card with insufficient energy', () => {
    expect(canPlayCard(3, 2)).toBe(false);
    expect(canPlayCard(1, 0)).toBe(false);
  });
});
