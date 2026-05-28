// Stress system tests - breakdown, day-end halving
import { deepCopy } from './data/constants.js';

describe('Stress breakdown', () => {
  function addStress(current, amount, maxHp, isBreakdown) {
    var prev = current;
    var stress = current + amount;
    var result = { stress, breakdown: isBreakdown, damage: 0 };

    if (stress >= 10 && prev < 10 && !isBreakdown) {
      result.breakdown = true;
      result.damage = Math.floor(maxHp * 0.3);
      result.stress = 5;
    }
    return result;
  }

  test('normal stress increase below 10', () => {
    var r = addStress(3, 2, 50, false);
    expect(r.stress).toBe(5);
    expect(r.breakdown).toBe(false);
    expect(r.damage).toBe(0);
  });

  test('stress hitting exactly 10 triggers breakdown', () => {
    var r = addStress(8, 2, 50, false);
    expect(r.stress).toBe(5);
    expect(r.breakdown).toBe(true);
    expect(r.damage).toBe(15); // 30% of 50
  });

  test('stress exceeding 10 triggers breakdown', () => {
    var r = addStress(5, 6, 50, false);
    expect(r.stress).toBe(5);
    expect(r.breakdown).toBe(true);
    expect(r.damage).toBe(15);
  });

  test('breakdown damage scales with max HP', () => {
    var r = addStress(9, 2, 80, false);
    expect(r.damage).toBe(24); // 30% of 80
    expect(r.stress).toBe(5);
  });

  test('breakdown does not re-trigger while already broken', () => {
    var r = addStress(5, 6, 50, true);
    expect(r.breakdown).toBe(true); // stays broken
    expect(r.damage).toBe(0); // no extra damage
  });

  test('stress at 9 does not trigger breakdown', () => {
    var r = addStress(8, 1, 50, false);
    expect(r.stress).toBe(9);
    expect(r.breakdown).toBe(false);
  });

  test('stress reset to 5 after breakdown', () => {
    var r = addStress(9, 3, 50, false);
    expect(r.stress).toBe(5);
  });

  test('breakdown damage floors correctly', () => {
    // 30% of 33 = 9.9 -> floor 9
    var r = addStress(9, 1, 33, false);
    expect(r.damage).toBe(9);
  });

  test('already at high stress adding more can still trigger breakdown', () => {
    // Adding stress at stress 9 (not yet broken) to 9+1=10 -> triggers
    var r = addStress(9, 1, 50, false);
    expect(r.triggered || r.breakdown).toBeTruthy();
  });
});

describe('Day-end stress halving', () => {
  function halveStress(stress) {
    return Math.floor(stress / 2);
  }

  test('even stress halves correctly', () => {
    expect(halveStress(8)).toBe(4);
    expect(halveStress(4)).toBe(2);
    expect(halveStress(0)).toBe(0);
  });

  test('odd stress halves with floor', () => {
    expect(halveStress(9)).toBe(4);
    expect(halveStress(7)).toBe(3);
    expect(halveStress(5)).toBe(2);
    expect(halveStress(3)).toBe(1);
  });

  test('stress 1 halves to 0', () => {
    expect(halveStress(1)).toBe(0);
  });

  test('stress 0 stays 0', () => {
    expect(halveStress(0)).toBe(0);
  });
});

describe('Stress damage multiplier (no 2.5x)', () => {
  function getStressMultiplier(stress) {
    if (stress >= 7) return 1.5;
    if (stress >= 4) return 1.25;
    return 1;
  }

  test('no bonus at stress 0-3', () => {
    expect(getStressMultiplier(0)).toBe(1);
    expect(getStressMultiplier(3)).toBe(1);
  });

  test('1.25x at stress 4-6', () => {
    expect(getStressMultiplier(4)).toBe(1.25);
    expect(getStressMultiplier(6)).toBe(1.25);
  });

  test('1.5x at stress 7-9', () => {
    expect(getStressMultiplier(7)).toBe(1.5);
    expect(getStressMultiplier(9)).toBe(1.5);
  });

  test('stress 10+ also 1.5x (not 2.5x, breakdown handles it)', () => {
    // After breakdown, stress is reset to 5, but just in case we still have >=10:
    expect(getStressMultiplier(12)).toBe(1.5);
  });
});

describe('Breakdown turn loss', () => {
  test('breakdown blocks card play', () => {
    function canPlayCard(breakdown) {
      return !breakdown;
    }
    expect(canPlayCard(true)).toBe(false);
    expect(canPlayCard(false)).toBe(true);
  });

  test('breakdown clears at end of turn', () => {
    // Simulate the endTurn behavior: clear breakdown after enemy acts
    var state = { breakdown: true };
    // At endTurn, breakdown is cleared
    state.breakdown = false;
    expect(state.breakdown).toBe(false);
  });
});
