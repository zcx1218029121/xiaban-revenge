// init.js — expose game object to window for HTML onclick handlers (Phase 2)
// This is the bridge between HTML inline handlers and the engine module system
import { s } from './core.js';
import { makeCtx } from './ctx.js';
import { triggerRelic, hasRelic, drawCards, applyWeak, applyPoison } from './actions.js';
import { log, hideAll, showScreen, updateAll, updateDayProgress, updateHand } from './ui.js';
import { RELICS } from '../data/relics.js';
import { EVENTS } from '../data/events.js';

// Re-export core game functions for window.game
export {startGame} from './game.js';
export {restartGame} from './game.js';
export {retryBoss} from './game.js';
export {nextDay} from './game.js';
export {winGameEarly} from './game.js';
export {proceedFromTransition} from './game.js';
export {endDay} from './game.js';
export { makeCtx } from './ctx.js';
export { advanceEvent, processCurrentEvent, showChoice, handleLunch, startFight, startBoss } from './events.js';
export { showCardRewards, showRelicRewards } from './rewards.js';
export { playCard, endTurn, win, lose } from './combat.js';
export { s };
