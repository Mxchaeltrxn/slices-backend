import { Role } from '../lobby/types';

export default class Player {
  id: string;

  name: string;

  #roles: Set<Role>;

  #isAlive: boolean;

  constructor(id: string, name: string, role: Role = Role.None) {
    this.id = id;
    this.name = name;
    this.#roles = new Set([role]);
    this.#isAlive = false;
  }

  hasRole(role: Role): boolean {
    return this.#roles.has(role);
  }

  // todo: deprecated
  updateRole(role: Role): void {
    this.#roles.add(role);
  }

  addRole(role: Role): void {
    this.#roles.add(role);
  }

  removeRole(role: Role): void {
    this.#roles.delete(role);
  }
}
