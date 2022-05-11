import { Phase, Role } from '../lobby/types';
import Tile from '../Tile';
import Player from './Player';
import { PlayerData } from './PlayerData';

type Error = {
  code: string;
  message: string;
};

type UnitResult<E> = {
  isSuccess: boolean;
  isFailure: boolean;
  error: E | null;
};

const unitResult = {
  success<E>(): UnitResult<E> {
    return {
      isSuccess: true,
      isFailure: false,
      error: null,
    };
  },
  failure<E>(error: E): UnitResult<E> {
    return {
      isSuccess: false,
      isFailure: true,
      error,
    };
  },
};

const errors = {
  lobby: {
    startRoundPhase(): Error {
      return {
        code: 'start.round.in.wrong.phase',
        message: `Round can only be started in waiting phase`,
      };
    },
    startRoundPlayerCount(): Error {
      return {
        code: 'start.round.with.less.than.two.players',
        message: `Round cannot be started with less than two players`,
      };
    },
  },
  players: {
    maxPlayerLimit(maxPlayerCount: number): Error {
      return {
        code: 'cannot.add.new.player',
        message: `Max player limit: '${maxPlayerCount}' reached so no new players can join`,
      };
    },
    playerNotFound(player: Player): Error {
      return { code: 'player.not.found', message: '' };
    },
  },
};

class Players {
  #players: Player[];

  constructor(playerId: string, playerName: string, role: Role = Role.None) {
    const player = new Player(playerId, playerName, role);
    this.#players = [player];
  }

  get players(): Player[] {
    return this.#players;
  }

  get playersCount(): number {
    return this.#players.length;
  }

  getPlayerById(id: string): Player | null {
    return this.#players.find((player) => player.id === id) ?? null;
  }

  canAddPlayer(): UnitResult<Error> {
    const maxPlayerCount = 4; // TODO: Configurable
    if (this.playersCount === maxPlayerCount) {
      return unitResult.failure(errors.players.maxPlayerLimit(maxPlayerCount));
    }
    return unitResult.success();
  }

  addPlayer({ playerId, playerName, playerRole }: PlayerData): void {
    const player = new Player(playerId, playerName, playerRole);
    const canAddPlayerOrError = this.canAddPlayer();
    if (canAddPlayerOrError.isFailure) {
      throw Error(`Unable to add player`);
    }

    this.#players.push(player);
  }

  canRemovePlayer(player: Player): UnitResult<Error> {
    const containsPlayer = this.#players.find((p) => p === player);
    if (!containsPlayer) {
      return unitResult.failure(errors.players.playerNotFound(player));
    }

    return unitResult.success();
  }

  removePlayer(player: Player): void {
    const canRemovePlayerOrError = this.canRemovePlayer(player);
    if (canRemovePlayerOrError.isFailure) {
      throw Error(`Unable to remove player`);
    }

    this.#players = this.#players.filter((p) => p === player);
  }

  getCurrentDrawer(): Player | null {
    return this.#findPlayerWithRole(Role.CurrentDrawer);
  }

  getCurrentRevealer(): Player | null {
    return this.#findPlayerWithRole(Role.CurrentRevealer);
  }

  getNextDrawer(): Player {
    return this.#findPlayerWithRole(Role.NextDrawer) as Player;
  }

  getNextRevealer(): Player | null {
    return this.#findPlayerWithRole(Role.NextRevealer);
  }

  updateNextDrawerBasedOnCurrentDrawer() {
    const 
  }

  #getNextPlayer(player: Player): Player {
    return this.#players[(this.#players.findIndex((p) => p === player) + 1) % this.#players.length];
  }

  #findPlayerWithRole(role: Role): Player | null {
    return this.#players.find((player) => player.hasRole(role)) ?? null;
  }
}

export class Lobby {
  #code: string;

  #players: Players;

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
    this.#players = new Players(firstPlayerId, firstPlayerName, Role.NextDrawer);
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

  canStartRound(): UnitResult<Error> {
    if (this.#players.playersCount < 2) return unitResult.failure(errors.lobby.startRoundPhase());

    if (this.#phase !== Phase.Waiting) return unitResult.failure(errors.lobby.startRoundPlayerCount());

    return unitResult.success();
  }

  startRound(): void {
    if (this.canStartRound().isFailure) {
      throw Error("Can't start round");
    }

    this.#wordsToDraw = ['word1', 'word2', 'word3'];
    this.#roundNumber += 1;
    this.#phase = Phase.ChoosingWord;

    const nextDrawer = this.getNextDrawer();
    nextDrawer.updateRole(Role.CurrentDrawer);
    // set next drawer
    // this.#players.updateCurrentDrawer(this.#phase);
    // this.#players.updateNextDrawer();
  }

  get players(): Player[] {
    return this.#players.players;
  }

  get playersCount(): number {
    return this.#players.playersCount;
  }

  getPlayerById(id: string): Player | null {
    return this.#players.getPlayerById(id);
  }

  getNextDrawer(): Player {
    return this.#players.getNextDrawer();
  }

  getNextRevealer(): Player | null {
    return this.#players.getNextRevealer();
  }

  getCurrentDrawer(): Player | null {
    return this.#players.getCurrentDrawer();
  }

  getCurrentRevealer(): Player | null {
    return this.#players.getCurrentRevealer();
  }

  addPlayer(playerData: PlayerData): void {
    this.#players.addPlayer(playerData);
  }

  removePlayer(player: Player): void {
    this.#players.removePlayer(player);
  }
}

// class Result<T> {
//   #isSuccess: boolean;

//   #isFailure: boolean;

//   #result: T;

//   public get result() {
//     return this.#result;
//   }

//   /**
//    *
//    */
//   constructor(result: T) {
//     this.#result = result;
//   }

//   static Success(result: T): Result<T> {
//     return new Result(result);
//   }

//   static Failure() { }
// }
