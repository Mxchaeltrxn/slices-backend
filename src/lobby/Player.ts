import { Role } from 'src/types';

export default class Player {
  #id: string;

  name: string;

  #roles: Set<Role>;

  #isAlive: boolean;

  constructor(playerId: string, role: Role = Role.None) {
    this.#id = playerId;
    this.name = '';
    this.#roles = new Set([role]);
    this.#isAlive = false;
  }
}
