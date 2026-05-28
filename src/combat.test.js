// Combat logic tests - pure functions
import { deepCopy } from './data/constants.js';

describe('Damage calculation', () => {
  function calculateDamage(baseDamage, { weak = 0, armor = 0, stressMult = 1, tempDmgMult = 1, relicBonus = 0 }) {
    // Apply weak
    let dmg = baseDamage + relicBonus;
    if (weak > 0) {
      dmg = Math.floor(dmg * Math.pow(0.75, weak));
    }
    // Apply stress multiplier
    dmg = Math.floor(dmg * stressMult);
    // Apply temp damage multiplier
    dmg = Math.floor(dmg * tempDmgMult);
    // Apply armor
    if (armor > 0) {
      const ab = Math.min(armor, dmg);
      dmg -= ab;
    }
    return Math.max(0, dmg);
  }

  test('base damage with no modifiers', () => {
    expect(calculateDamage(10, {})).toBe(10);
  });

  test('weak reduces damage by 25% per stack', () => {
    expect(calculateDamage(10, { weak: 1 })).toBe(7);
    expect(calculateDamage(10, { weak: 2 })).toBe(5);
  });

  test('armor absorbs damage before health', () => {
    expect(calculateDamage(10, { armor: 3 })).toBe(7);
    expect(calculateDamage(10, { armor: 10 })).toBe(0);
  });

  test('armor does not reduce below 0', () => {
    expect(calculateDamage(0, { armor: 5 })).toBe(0);
  });

  test('stress multiplier stacks with other modifiers', () => {
    expect(calculateDamage(10, { stressMult: 1.5 })).toBe(15);
    expect(calculateDamage(10, { stressMult: 1.25 })).toBe(12);
  });

  test('temp damage multiplier applies', () => {
    expect(calculateDamage(10, { tempDmgMult: 2 })).toBe(20);
    expect(calculateDamage(10, { tempDmgMult: 1.5 })).toBe(15);
  });

  test('relic bonus adds flat damage', () => {
    expect(calculateDamage(10, { relicBonus: 2 })).toBe(12);
  });

  test('all modifiers stack correctly', () => {
    // Base 10, +2 relic = 12, weak 1 (0.75) = 9, stress 1.5 = 13.5 -> 13
    expect(calculateDamage(10, { weak: 1, relicBonus: 2, stressMult: 1.5 })).toBe(13);
  });
});

describe('Shield absorption', () => {
  function absorbShield(damage, shield) {
    let remaining = damage;
    let absorbed = 0;
    if (shield > 0) {
      const ab = Math.min(shield, remaining);
      absorbed = ab;
      remaining -= ab;
    }
    return { absorbed, remaining };
  }

  test('full shield absorbs all damage', () => {
    expect(absorbShield(5, 10)).toEqual({ absorbed: 5, remaining: 0 });
  });

  test('partial shield absorbs what it can', () => {
    expect(absorbShield(8, 5)).toEqual({ absorbed: 5, remaining: 3 });
  });

  test('no shield passes all damage through', () => {
    expect(absorbShield(10, 0)).toEqual({ absorbed: 0, remaining: 10 });
  });
});

describe('HP limits', () => {
  function clampHp(hp, maxHp) {
    return Math.max(0, Math.min(maxHp, hp));
  }

  test('hp clamped to max', () => {
    expect(clampHp(60, 50)).toBe(50);
  });

  test('hp clamped to 0 minimum', () => {
    expect(clampHp(-10, 50)).toBe(0);
  });

  test('hp unchanged within range', () => {
    expect(clampHp(30, 50)).toBe(30);
  });
});

describe('Poison tick', () => {
  function calculatePoisonTick(poisonStacks, hasNoiseCancelling = false) {
    return hasNoiseCancelling ? poisonStacks + 2 : poisonStacks;
  }

  test('poison deals stack damage', () => {
    expect(calculatePoisonTick(3)).toBe(3);
    expect(calculatePoisonTick(5)).toBe(5);
  });

  test('noise cancelling adds 2 bonus', () => {
    expect(calculatePoisonTick(3, true)).toBe(5);
    expect(calculatePoisonTick(0, true)).toBe(2);
  });
});

describe('Energy management', () => {
  function spendEnergy(current, cost) {
    return Math.max(0, current - cost);
  }

  function gainEnergy(current, gain, max) {
    return Math.min(max, current + gain);
  }

  test('spending energy reduces current', () => {
    expect(spendEnergy(3, 2)).toBe(1);
    expect(spendEnergy(3, 3)).toBe(0);
  });

  test('spending more than available gives 0', () => {
    expect(spendEnergy(2, 5)).toBe(0);
  });

  test('gaining energy capped at max', () => {
    expect(gainEnergy(2, 3, 3)).toBe(3);
    expect(gainEnergy(1, 2, 3)).toBe(3);
  });

  test('gaining energy below max works normally', () => {
    expect(gainEnergy(1, 1, 3)).toBe(2);
  });
});

describe('Weak duration', () => {
  function decrementWeak(weak) {
    return Math.max(0, weak - 1);
  }

  test('weak decrements by 1', () => {
    expect(decrementWeak(3)).toBe(2);
    expect(decrementWeak(1)).toBe(0);
  });

  test('weak at 0 stays at 0', () => {
    expect(decrementWeak(0)).toBe(0);
  });
});

describe('Breakdown trigger', () => {
  function checkBreakdown(stress, wasAlreadyBreakingDown, maxHp) {
    if (stress >= 10 && !wasAlreadyBreakingDown) {
      var dmg = Math.floor(maxHp * 0.3);
      return { triggered: true, breakdown: true, damage: dmg, newStress: 5 };
    }
    return { triggered: false, breakdown: wasAlreadyBreakingDown, damage: 0, newStress: stress };
  }

  test('breakdown triggers at stress 10, deals 30% max HP, resets stress to 5', () => {
    var result = checkBreakdown(10, false, 50);
    expect(result.triggered).toBe(true);
    expect(result.breakdown).toBe(true);
    expect(result.damage).toBe(15);
    expect(result.newStress).toBe(5);
  });

  test('breakdown does not re-trigger if already breaking down', () => {
    expect(checkBreakdown(11, true, 50)).toEqual({ triggered: false, breakdown: true, damage: 0, newStress: 11 });
  });

  test('no breakdown below stress 10', () => {
    expect(checkBreakdown(9, false, 50)).toEqual({ triggered: false, breakdown: false, damage: 0, newStress: 9 });
  });
});

describe('Draw pile reshuffle', () => {
  function drawCards(drawCount, deck, disc) {
    const drawn = [];
    let remainingDeck = [...deck];
    let remainingDisc = [...disc];

    for (let i = 0; i < drawCount; i++) {
      if (remainingDeck.length === 0) {
        if (remainingDisc.length === 0) break;
        remainingDeck = shuffle([...remainingDisc]);
        remainingDisc = [];
      }
      const card = remainingDeck.pop();
      if (card) drawn.push(card);
    }

    return { drawn, remainingDeck, remainingDisc };
  }

  function shuffle(arr) {
    const result = [...arr];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  test('draws from deck when cards available', () => {
    const deck = ['card1', 'card2', 'card3'];
    const result = drawCards(2, deck, []);
    expect(result.drawn.length).toBe(2);
    expect(result.remainingDeck.length).toBe(1);
  });

  test('reshuffles disc when deck empty', () => {
    const deck = ['card1'];
    const disc = ['card2', 'card3'];
    const result = drawCards(3, deck, disc);
    expect(result.drawn.length).toBe(3);
    expect(result.remainingDeck.length).toBe(0);
    expect(result.remainingDisc.length).toBe(0);
  });

  test('stops when both piles empty', () => {
    const result = drawCards(5, [], []);
    expect(result.drawn.length).toBe(0);
  });
});

describe('Enemy intent rotation', () => {
  function getNextIntentIndex(currentIndex, intentCount) {
    return (currentIndex + 1) % intentCount;
  }

  test('cycles through intents in order', () => {
    expect(getNextIntentIndex(0, 4)).toBe(1);
    expect(getNextIntentIndex(1, 4)).toBe(2);
    expect(getNextIntentIndex(2, 4)).toBe(3);
  });

  test('wraps around at end', () => {
    expect(getNextIntentIndex(3, 4)).toBe(0);
  });

  test('works with 3 intents', () => {
    expect(getNextIntentIndex(0, 3)).toBe(1);
    expect(getNextIntentIndex(1, 3)).toBe(2);
    expect(getNextIntentIndex(2, 3)).toBe(0);
  });
});

describe('Kill detection', () => {
  function checkKill(hp) {
    return hp <= 0;
  }

  test('kills when hp reaches 0', () => {
    expect(checkKill(0)).toBe(true);
  });

  test('not killed above 0', () => {
    expect(checkKill(1)).toBe(false);
    expect(checkKill(50)).toBe(false);
  });
});
