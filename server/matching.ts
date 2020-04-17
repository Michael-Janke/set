import { observable, action, decorate } from "mobx";
import Game, { GameId } from "./game";
import * as ws from "ws";
import { Messages } from "../src/common/messages";
import { autorun } from "mobx";
import { GameStatus } from "../src/common/gameStatus";
import User from "./user";

export type UserId = string;

class Matching {
  games: Map<GameId, Game> = new Map();
  users: Map<UserId, User> = new Map();
  matching: Map<UserId, Game> = new Map();

  registerUser(user: User) {
    this.users.set(user.id, user);
    if (this.matching.has(user.id)) {
      user.connectToGame(this.matching.get(user.id) as Game);
    }
  }

  unregisterUser(user: User) {
    this.users.delete(user.id);
  }

  createGame(game: Game) {
    this.games.set(game.id, game);
  }

  joinGame(userId: UserId, game: Game) {
    this.matching.set(userId, game);
    game.join(userId);
    this.users.get(userId)?.connectToGame(game);
  }

  leaveGame(userId: UserId) {
    this.matching.get(userId)?.leave(userId);
    this.matching.delete(userId);
    const user = this.users.get(userId);
    user?.disconnectFromGame();
    user?.send(Messages.STATUS, GameStatus.NONE);
  }

  abortGame(game: Game) {
    game.players.forEach((userId) => this.leaveGame(userId));
    this.games.delete(game.id);
  }

  getCurrentGame(userId: UserId) {
    return this.matching.get(userId);
  }
}

decorate(Matching, {
  games: observable,
  matching: observable,
  users: observable,
});

export default Matching;
