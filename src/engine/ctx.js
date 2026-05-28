// ctx.js — context factory (Phase 2 extraction)
import { s } from './core.js';
import { hasRelic, triggerRelic, addStress, heal, gainShield,
         modifyEnergy, drawCards, applyWeak, applyPoison,
         shuffle, dealDamageToEnemy, dealDamageToPlayer } from './actions.js';
import { updateHand, log, updateAll } from './ui.js';
import { winGameEarly } from './game.js';

export function makeCtx() {
  return {
    get day()              { return s.day; },
    get hp()               { return s.php; },
    get maxHp()            { return s.pmax; },
    get energy()           { return s.en; },
    get maxEnergy()        { return s.men; },
    get shield()           { return s.sh; },
    get stress()           { return s.stress; },
    get hand()             { return s.hand; },
    get discard()          { return s.disc; },
    get deck()             { return s.deck; },
    get enemy()            { return s.ene; },
    get isBoss()           { return s.boss; },
    get relics()           { return s.relics; },
    get equipment()        { return s.equipment; },
    get biIdx()            { return s.biIdx; },
    get bossDamageMult()   { return s.bossDamageMult; },
    get skipNextEvent()    { return s.skipNextEvent; },
    get nextBattleBonusDmg() { return s.nextBattleBonusDmg; },
    get nextBattleDraw()   { return s.nextBattleDraw; },
    addStress,
    heal,
    gainShield,
    modifyEnergy,
    drawCards,
    dealDamageToEnemy,
    applyWeak,
    applyPoison,
    dealDamageToPlayer,
    triggerRelic,
    updateHand,
    shuffle,
    log,
    updateAll,
    winGameEarly,
    state: s,
  };
}
