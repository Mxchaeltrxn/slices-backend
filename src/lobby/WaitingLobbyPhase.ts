import Player from '../old_code/Player';
import { Phase, Role } from './types';
import { LobbyPhase } from './LobbyPhase';
import { ChoosingWordLobbyPhase } from './ChoosingWordLobbyPhase';

class WaitingLobbyPhase extends LobbyPhase {
  roundNumber: number;

  #maxPlayerCount = 4;

  constructor(player: Player) {
    player.addRole(Role.NextDrawer);
    super({ phase: Phase.Waiting, players: [player] });
    this.roundNumber = 0;
  }

  override canAddPlayer(): boolean {
    if (this.players.length >= this.#maxPlayerCount) return false;

    return true;
  }

  override addPlayer(player: Player): void {
    if (!this.canAddPlayer()) throw Error("Can't add player");
    this.players.push(player);

    if (this.players.length === 2) this.updateNextRevealer();
  }

  override removePlayer(player: Player): void {
    if (!super.canRemovePlayer(player)) {
      throw Error(`Unable to remove player: ${player}`);
    }
    // todo: has only one role
    if (player.hasRole(Role.NextDrawer)) {
      this.updateNextDrawer();
      if (this.getNextDrawer()?.hasRole(Role.NextRevealer)) this.updateNextRevealer();
    } else if (player.hasRole(Role.NextRevealer)) {
      this.updateNextRevealer();
    }

    this.players = this.players.filter((p) => p !== player);
  }

  override updateNextDrawer(): void {
    if (this.players.length === 0) {
      throw Error(`Unable to update next drawer when there are 0 players in phase: '${Phase.Waiting}'`);
    }
    const currentNextDrawer = this.getNextDrawer()!;
    // TODO: I think this is wrong
    // if (this.players.length === 1) {
    //   currentNextDrawer.removeRole(Role.NextDrawer);
    // }

    const nextDrawer = this.getNextDrawer()!;
    const newNextDrawer = super.getNextPlayer(nextDrawer);
    newNextDrawer.addRole(Role.NextDrawer);
    nextDrawer.removeRole(Role.NextDrawer);
  }

  override updateCurrentDrawer(): void {
    const currentNextDrawer = this.getNextDrawer();
    if (currentNextDrawer === null) {
      throw Error(`Cannot update current drawer when next drawer does not exist`);
    }
    currentNextDrawer.addRole(Role.CurrentDrawer);
  }

  override updateNextRevealer(): void {
    if (this.players.length < 2) {
      throw Error(`Unable to update next revealer when there are less than 2 players in phase: '${Phase.Waiting}'`);
    }
    const currentNextRevealer = this.getNextRevealer();
    if (this.players.length === 2) {
      if (currentNextRevealer === null) {
        const nextDrawer = this.getNextDrawer()!;
        const newNextRevealer = super.getNextPlayer(nextDrawer);
        newNextRevealer.addRole(Role.NextRevealer);
        return;
      }

      currentNextRevealer!.removeRole(Role.NextRevealer);
      return;
    }

    if (currentNextRevealer === null) {
      throw Error(`There must be a next revealer if there are more than two players in phase: '${Phase.Waiting}'`);
    }

    let newNextRevealer = super.getNextPlayer(currentNextRevealer);
    if (this.getNextDrawer() === newNextRevealer) {
      newNextRevealer = super.getNextPlayer(newNextRevealer);
    }
    newNextRevealer.addRole(Role.NextRevealer);
    currentNextRevealer.removeRole(Role.NextRevealer);
  }

  override updateSettings({ revealTime, drawTime }: { revealTime: number; drawTime: number }): void {
    this.revealTimeInSeconds = revealTime;
    this.drawTimeInSeconds = drawTime;
  }

  override canStartRound(): boolean {
    if (this.players.length < 2) return false;

    return true;
  }

  override startRound(): void {
    if (!this.canStartRound()) {
      throw Error("Can't start round");
    }

    if (!this.context) {
      throw Error(`Unable to start round when context does not exist`);
    }

    this.roundNumber += 1;

    this.updateCurrentDrawer();
    this.updateNextDrawer();

    this.context.transitionTo(new ChoosingWordLobbyPhase(this.players, ['word1', 'word2', 'word3']));
  }
}

export default WaitingLobbyPhase;
