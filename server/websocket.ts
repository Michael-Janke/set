import * as ws from "ws";
import * as express from "express";

import { Messages, ErrorMessages } from "../src/common/messages";

import Game, { GameId } from "./game";
import {
  GameStatus,
  GAME_ID_CHARACTERS,
  GAME_ID_LENGTH,
} from "../src/common/gameStatus";

import Matching from "./matching";
import User, { UserId } from "./user";
import { DEBUG } from ".";

const matching = new Matching();

export default function websocket(ws: ws, req: express.Request) {
  let user: User | null = null;
  ws.send(JSON.stringify([Messages.STATUS, GameStatus.NONE]));

  ws.on("message", (msg) => {
    let command: string = "";
    let data: any;
    try {
      [command, data] = JSON.parse(msg as string);
    } catch (e) {
      console.error(e);
    }

    //userId guard
    if (user === null) {
      if (command === Messages.USER_ID) {
        DEBUG && console.log("[received]:", "userId", data);
        const userId = data as UserId;
        user = matching.users.get(userId) || new User(userId);
        user.registerSocket(ws);
        matching.registerUser(user);
      } else {
        ws.send(JSON.stringify([Messages.ERROR, "No Initial UserID"]));
        ws.close();
        return;
      }
    }

    const game = matching.getCurrentGame(user.id);

    switch (command) {
      case Messages.USER_ID:
        break;
      case Messages.CLICK_CARD:
        DEBUG &&
          console.log("[received]:", "click", data, game && game.cards[data]);
        game && game.clickCard(data, user);
        break;
      case Messages.START_GAME:
        DEBUG && console.log("[received]:", "game start request");
        game && game.startGame(user);
        break;
      case Messages.CREATE_GAME:
        DEBUG && console.log("[received]:", "game create request");
        const newGame = new Game(makeGameId(), user);
        matching.createGame(newGame);
        matching.joinGame(user.id, newGame);
        DEBUG && console.log("[created]:", "game", newGame.id);
        break;
      case Messages.JOIN_GAME:
        DEBUG && console.log("[received]:", "game create request");
        const reqGame = matching.games.get(data);
        if (reqGame) {
          matching.joinGame(user.id, reqGame);
        } else {
          user.send(Messages.ERROR, ErrorMessages.GAME_NOT_EXIST);
        }
        break;
      case Messages.LEAVE_GAME:
        DEBUG && console.log("[received]:", "abort game");
        if (!game) break;
        matching.leaveGame(user.id);
        break;
      case Messages.ABORT_GAME:
        DEBUG && console.log("[received]:", "abort game");
        if (!game || game.owner !== user) break;
        matching.abortGame(game);
        break;
      case Messages.USER_NAME:
        DEBUG && console.log("[received]:", "new user name", data);
        user.name = data;
        break;
      case Messages.SET_READINESS:
        DEBUG &&
          console.log(
            "[received]:",
            user.name,
            ["is not ready anymore", "is ready"][data ? 1 : 0]
          );
        user.ready = data;
        break;

      case Messages.KICK:
        DEBUG && console.log("[received]:", user.publicId, "kicks", data);
        if (game?.owner === user) {
          const user = Array.from(matching.users.values()).find(
            (user) => user.publicId === data
          );
          user && matching.leaveGame(user.id);
        }
        break;

      default:
        console.warn("[received]:", "unhandled message", msg);
    }
  });
}

const makeGameId = () => {
  let newId: GameId;
  do {
    newId = makeid(GAME_ID_LENGTH);
  } while (matching.games.has(newId));
  return newId;
  function makeid(length: number) {
    var result = "";
    var characters = GAME_ID_CHARACTERS;
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
};
