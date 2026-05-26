// core.js — GameState class + global state s
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

export var s = new GameState();
