import { LobbyPhase } from './LobbyPhase';

export class LobbyPhaseContext {
  #lobbyPhase: LobbyPhase;

  constructor(state: LobbyPhase) {
    this.transitionTo(state);
  }

  transitionTo(state: LobbyPhase): void {
    // console.log(`Context: Transition to ${(<any>state).constructor.name}.`);
    this.#lobbyPhase = state;
    this.#lobbyPhase.setContext(this);
  }
}
