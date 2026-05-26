/**
 * 下班复仇记 — Main Entry Point
 * Phase 1: Data modules + Vite dev server
 * 
 * This module imports all game data and re-exports it.
 * The inline game script in index.html uses these globals.
 */

export { deepCopy, CP, EN, RELICS, BD, EVENTS } from './data/index.js';
export { getCard } from './data/cards.js';
export { getEnemy } from './data/enemies.js';
export { getRelic } from './data/relics.js';
export { getBoss } from './data/bosses.js';
export { getDayEvents } from './data/events.js';

console.log('[xiaban-revenge] Module system ready');
