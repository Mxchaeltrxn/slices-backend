import { Role } from '../lobby/types';
import { Lobby } from './Lobby';
import type { PlayerData } from './PlayerData';

function createPlayerData(id: number, role = Role.None): PlayerData {
  return { playerId: `player-id${id}`, playerName: `player-name${id}`, playerRole: role };
}

describe('get players', () => {
  test('one player', () => {
    const playerName = 'player-name';
    const lobby = new Lobby('lobby-code', 'player-id', playerName);

    expect(lobby.players[0].name).toEqual(playerName);
    expect(lobby.players[0].hasRole(Role.NextDrawer)).toBeTruthy();
  });
});

describe('get player count', () => {
  test('one player', () => {
    const lobby = new Lobby('lobby-code', 'player-id', 'player-name');
    expect(lobby.playersCount).toEqual(1);
  });
});

describe('get next drawer', () => {
  test('exists', () => {
    const lobby = new Lobby('lobby-code', 'player-id', 'player-name');
    const nextDrawer = lobby.getNextDrawer();
    expect(nextDrawer.hasRole(Role.NextDrawer)).toBeTruthy();
    expect(nextDrawer.hasRole(Role.NextRevealer)).toBeFalsy();
    expect(nextDrawer.hasRole(Role.CurrentDrawer)).toBeFalsy();
    expect(nextDrawer.hasRole(Role.CurrentRevealer)).toBeFalsy();
    expect(nextDrawer.hasRole(Role.None)).toBeFalsy();
  });
});

describe('get next revealer', () => {
  test("doesn't exist", () => {
    const lobby = new Lobby('lobby-code', 'player-id', 'player-name');
    const nextRevealer = lobby.getNextRevealer();
    expect(nextRevealer).toBeNull();
  });
});

describe('get current drawer', () => {
  test("doesn't exist", () => {
    const lobby = new Lobby('lobby-code', 'player-id', 'player-name');
    const currentDrawer = lobby.getCurrentDrawer();
    expect(currentDrawer).toBeNull();
  });
});

describe('get current revealer', () => {
  test("doesn't exist", () => {
    const lobby = new Lobby('lobby-code', 'player-id', 'player-name');
    const currentRevealer = lobby.getCurrentRevealer();
    expect(currentRevealer).toBeNull();
  });
});

describe('add player', () => {
  test('does not exceed max player count', () => {
    const lobby = new Lobby('lobby-code', 'player-id', 'player-name');
    lobby.addPlayer(createPlayerData(2));
    lobby.addPlayer(createPlayerData(3));
    lobby.addPlayer(createPlayerData(4));
    expect(lobby.playersCount).toBe(4);
  });

  test('exceed max player count', () => {
    const lobby = new Lobby('lobby-code', 'player-id', 'player-name');
    lobby.addPlayer(createPlayerData(2));
    lobby.addPlayer(createPlayerData(3));
    lobby.addPlayer(createPlayerData(4));
    expect(() => lobby.addPlayer(createPlayerData(5))).toThrowError();
  });
});

describe('remove player', () => {
  test('player does not exist', () => {
    const player2Id = 'player-id2';
    const lobby = new Lobby('lobby-code', 'player-id', 'player-name');
    const lobby2 = new Lobby('lobby-code2', player2Id, 'player-name2');
    const player2 = lobby2.getPlayerById(player2Id);

    expect(() => lobby.removePlayer(player2!)).toThrowError();
  });
});
