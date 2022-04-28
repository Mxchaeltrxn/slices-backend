import { Phase } from 'src/types';
import Tile from '../Tile';
import Players from './Players';

class Lobby {
  #code: string;

  #playersList: Players;

  #roundNumber: number;

  #drawTime: number;

  #revealTime: number;

  #phase: Phase;

  #drawAndChooseWordTime: number;

  turnNumber: number;

  wordToGuess: string | null;

  #wordsToDraw: string[];

  #drawingSlices: Tile[];

  #hasRevealedSlice: boolean;

  constructor(code: string, firstPlayerId: string, firstPlayerName: string) {
    this.#code = code;
    this.#playersList = new Players(firstPlayerId, firstPlayerName);
    this.#roundNumber = 1;
    this.#drawTime = 30;
    this.#revealTime = 5;
    this.#phase = Phase.Waiting;
    this.#drawAndChooseWordTime = 240;
    this.turnNumber = 0;
    this.wordToGuess = null;
    this.#wordsToDraw = [];
    this.#drawingSlices = [];
    this.#hasRevealedSlice = false;
  }
}

export default Lobby;
