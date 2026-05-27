/**
 * 下班复仇记 — Main Entry Point
 * Phase 2: Engine modules extracted
 * 
 * Imports data modules (already exported) and engine modules.
 * Sets up window.game for HTML onclick handlers.
 */
export { deepCopy, CP, EN, RELICS, BD, EVENTS } from './data/index.js';
export { getCard } from './data/cards.js';
export { getEnemy } from './data/enemies.js';
export { getRelic } from './data/relics.js';
export { getBoss } from './data/bosses.js';
export { getDayEvents } from './data/events.js';

// Engine exports (for external use)
export { s } from './engine/core.js';
export { makeCtx } from './engine/ctx.js';
export { startGame, restartGame, retryBoss, nextDay, winGameEarly,
         proceedFromTransition, endDay } from './engine/game.js';
export { advanceEvent, processCurrentEvent, showChoice,
         handleLunch, startFight, startBoss } from './engine/events.js';
export { showCardRewards, showRelicRewards, showRelicScreen, skipRelic,
         showRewardScreen } from './engine/rewards.js';
export { playCard, endTurn, win, lose } from './engine/combat.js';

// Setup window.game for HTML onclick handlers
import { startGame, restartGame, retryBoss, nextDay, winGameEarly,
         proceedFromTransition, endDay } from './engine/game.js';
import { advanceEvent, processCurrentEvent, showChoice,
         handleLunch, startFight, startBoss } from './engine/events.js';
import { showCardRewards, showRelicRewards, showRelicScreen, skipRelic,
         showRewardScreen } from './engine/rewards.js';
import { playCard, endTurn, win, lose } from './engine/combat.js';

window.game = {
  startGame, restartGame, retryBoss, nextDay, winGameEarly,
  proceedFromTransition, endDay,
  advanceEvent, processCurrentEvent, showChoice,
  handleLunch, startFight, startBoss,
  showCardRewards, showRelicRewards, showRelicScreen, skipRelic,
  showRewardScreen,
  playCard, endTurn, win, lose,
};

console.log('[xiaban-revenge] Phase 2 engine loaded');
