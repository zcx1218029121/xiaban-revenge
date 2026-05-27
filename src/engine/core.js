// core.js — GameState class + state accessor
import { deepCopy, mkDeck } from './utils.js';
import { RELICS } from '../data/relics.js';

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
    this.relics = [deepCopy(RELICS[2])];
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
    this.endless = false;
    this.floor = 0;
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
    this.deck = mkDeck();
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
    this.relics = [deepCopy(RELICS[2])];
    this.immuneThisTurn = false;
    this.playerWeak = 0;
    this.breakdown = false;
    this.endless = false;
    this.floor = 0;
  }

  resetForBattle() {
    // Preserve all cards — shuffle hand+disc back into deck
    this.deck = this.deck.concat(this.hand).concat(this.disc);
    this.shuffleDeck();
    this.hand = [];
    this.disc = [];
    this.en = 3;
    this.men = 3;
    this.sh = 0;
    this.tempDmgMult = 0;
    this.noShieldTurns = 0;
    this.noDrawThisTurn = false;
    this.immuneThisTurn = false;
    this.enemySkipNext = false;
    this.enemyDmgReduction = 0;
    this.playerWeak = 0;
    this.breakdown = false;
  }

  shuffleDeck() {
    for (var i = this.deck.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = this.deck[i];
      this.deck[i] = this.deck[j];
      this.deck[j] = tmp;
    }
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
    this.noDrawThisTurn = false;
    this.noShieldTurns = Math.max(0, this.noShieldTurns - 1);
    this.playerWeak = Math.max(0, this.playerWeak - 1);
    this.breakdown = false;
    this._factionPlays = {};
  }
}

// State accessor pattern for testability
var _stateProvider = () => s;

export function setStateProvider(provider) {
  _stateProvider = provider;
}

export function getState() {
  return _stateProvider();
}

// Backwards compatibility - default global state
export var s = new GameState();
export { GameState };
