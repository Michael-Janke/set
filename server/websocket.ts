import * as ws from "ws";
import * as express from "express";
import { autorun } from "mobx";
import { Messages } from "../src/common/messages";

import Game from "./game";
import { GameStatus } from "../src/common/gameStatus";

const DEBUG = process.env.NODE_ENV !== "production";

export default function websocket(ws: ws, req: express.Request) {
  let game: Game | null = null;
  let unconnectGame: () => void = () => {};

  ws.send(JSON.stringify([Messages.STATUS, GameStatus.NONE]));

  ws.on("message", function (msg) {
    let command: string = "";
    let data: any;
    try {
      [command, data] = JSON.parse(msg as string);
    } catch (e) {
      console.error(e);
    }

    switch (command) {
      case Messages.CLICK_CARD:
        DEBUG &&
          console.log("[received]:", "click", data, game && game.cards[data]);
        game && game.clickCard(data);

        break;
      case Messages.START_GAME:
        DEBUG && console.log("[received]:", "game start request");
        game && game.startGame();
        break;
      case Messages.CREATE_GAME:
        DEBUG && console.log("[received]:", "game create request");
        game = game || new Game();
        unconnectGame = connectToGame(ws, game);

        break;
      case Messages.ABORT_GAME:
        DEBUG && console.log("[received]:", "abort game");
        game = null;
        unconnectGame();
        ws.send(JSON.stringify([Messages.STATUS, GameStatus.NONE]));
        break;
    }
  });
}

const connectToGame = (ws: ws, game: Game) => {
  const connect: { [key in Messages]?: keyof Game } = {
    [Messages.DECK]: "deck",
    [Messages.CARDS]: "cards",
    [Messages.SELECTED_CARDS]: "selectedCards",
    [Messages.STATUS]: "status",
  };

  const disposer = Object.entries(connect).map(([message, key]) =>
    autorun((event) => {
      DEBUG && console.log("[send]:", message, game[key as keyof Game]);
      ws.send(JSON.stringify([message, game[key as keyof Game]]));
    })
  );

  ws.on("close", () => {
    disposer.forEach((dispose) => dispose());
  });

  return () => disposer.forEach((dispose) => dispose());
};
