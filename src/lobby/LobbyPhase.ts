import Player from '../old_code/Player';
import { Phase, Role } from './types';
import { LobbyPhaseContext } from './LobbyPhaseContext';

export abstract class LobbyPhase {
  protected phase: Phase;

  protected players: Player[];

  protected context?: LobbyPhaseContext;

  protected revealTimeInSeconds: number;

  protected drawTimeInSeconds: number;

  setContext(context: LobbyPhaseContext): void {
    this.context = context;
  }

  constructor({
    phase,
    players,
    revealTimeInSeconds,
    drawTimeInSeconds,
  }: {
    phase: Phase;
    players: Player[];
    revealTimeInSeconds?: number;
    drawTimeInSeconds?: number;
  }) {
    this.phase = phase;
    this.players = players;
    this.revealTimeInSeconds = revealTimeInSeconds ?? 5;
    this.drawTimeInSeconds = drawTimeInSeconds ?? 300;
  }

  /// ////////////////////////////////////////////////
  // PLAYER METHODS
  /// ////////////////////////////////////////////////
  canAddPlayer(): boolean {
    throw Error(LobbyPhase.#phaseError(this.canAddPlayer, Phase.Waiting));
  }

  addPlayer(player: Player): void {
    throw Error(LobbyPhase.#phaseError(this.addPlayer, Phase.Waiting));
  }

  canRemovePlayer(player: Player): boolean {
    if (!this.players.find((p) => p === player)) return false;

    return true;
  }

  abstract removePlayer(player: Player): void;

  getPlayers(): Player[] {
    return this.players;
  }

  updateCurrentDrawer(): void {
    throw Error(
      LobbyPhase.#phasesError(this.updateCurrentDrawer, [Phase.Waiting, Phase.ChoosingWord, Phase.Drawing, Phase.ChoosingSlice, Phase.RevealedSlice])
    );
  }

  updateCurrentRevealer(): void {
    throw Error(LobbyPhase.#phasesError(this.updateCurrentRevealer, [Phase.ChoosingWord, Phase.Drawing, Phase.ChoosingSlice, Phase.RevealedSlice]));
  }

  abstract updateNextDrawer(): void;

  abstract updateNextRevealer(): void;

  getCurrentDrawer(): Player | null {
    return this.#findPlayerByRole(Role.CurrentDrawer);
  }

  getCurrentRevealer(): Player | null {
    return this.#findPlayerByRole(Role.CurrentRevealer);
  }

  getNextDrawer(): Player | null {
    return this.#findPlayerByRole(Role.NextDrawer);
  }

  getNextRevealer(): Player | null {
    return this.#findPlayerByRole(Role.NextRevealer);
  }

  protected getNextPlayer(player: Player): Player {
    return this.players[(this.players.findIndex((p) => p === player) + 1) % this.players.length];
  }

  /// ////////////////////////////////////////////////
  // LOBBY METHODS
  /// ////////////////////////////////////////////////
  updateSettings({ revealTime, drawTime }: any): void {
    throw Error(LobbyPhase.#phaseError(this.updateSettings, Phase.Waiting));
  }

  canStartRound(): boolean {
    throw Error(LobbyPhase.#phaseError(this.canStartRound, Phase.Waiting));
  }

  startRound(): void {
    throw Error(LobbyPhase.#phaseError(this.startRound, Phase.Waiting));
  }

  chooseWord(): void {
    throw Error(LobbyPhase.#phaseError(this.chooseWord, Phase.ChoosingWord));
  }

  submitDrawing(): void {
    throw Error(LobbyPhase.#phaseError(this.submitDrawing, Phase.Drawing));
  }

  revealSlice(): void {
    throw Error(LobbyPhase.#phaseError(this.revealSlice, Phase.ChoosingSlice));
  }

  handleGuess(guess: string): void {
    throw Error(LobbyPhase.#phasesError(this.handleGuess, [Phase.ChoosingSlice, Phase.RevealedSlice]));
  }

  hideSlice(): void {
    throw Error(LobbyPhase.#phaseError(this.hideSlice, Phase.RevealedSlice));
  }

  endRound(): void {
    throw Error(LobbyPhase.#phaseError(this.endRound, Phase.Finished));
  }

  #findPlayerByRole(role: Role): Player | null {
    return this.players.find((player) => player.hasRole(role)) ?? null;
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  static #phaseError(method: Function, phase: Phase): string {
    return `'${method.name}' can only be called in phase: '${phase}'`;
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  static #phasesError(method: Function, phases: Phase[]): string {
    return `'${method.name}' can only be called in phases: ${phases.join(', ')}`;
  }
}
