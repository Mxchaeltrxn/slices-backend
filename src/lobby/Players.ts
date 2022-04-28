import { Role } from 'src/types';
import Player from './Player';

export default class Players {
  #players: Player[];

  constructor(playerId: string, playerName: string) {
    const player = new Player(playerId, Role.NextDrawer);
    player.name = playerName;
    this.#players = [player];
  }
}
