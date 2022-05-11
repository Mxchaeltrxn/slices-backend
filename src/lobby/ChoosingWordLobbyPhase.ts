import Player from '../old_code/Player';
import { Phase } from './types';
import { LobbyPhase } from './LobbyPhase';


export class ChoosingWordLobbyPhase extends LobbyPhase {
  wordsToGuess: string[];

  constructor(players: Player[], wordsToGuess: string[]) {
    super(Phase.ChoosingWord, players);
    this.wordsToGuess = wordsToGuess;
  }
}
