import * as ws from "ws";
import * as express from "express";
import { reaction, autorun, observe } from "mobx";

import Game from "./game";

export default function websocket(ws: ws, req: express.Request) {
  ws.send(JSON.stringify(["all_cards", game.cards]));

  ws.on("message", function (msg) {
    const [command, data] = JSON.parse(msg as string);
    switch (command) {
      case "click_card":
        game.clickCard(data);
        break;
      case "start_game":
        game.startGame();
        break;
    }
  });

  const dispose1 = autorun((event) => {
    ws.send(JSON.stringify(["deck", game.deck]));
  });

  const dispose2 = autorun((event) => {
    ws.send(JSON.stringify(["selectedCards", game.selectedCards]));
  });

  const dispose3 = autorun((event) => {
    ws.send(JSON.stringify(["status", game.status]));
  });

  ws.on("close", () => {
    dispose1();
    dispose2();
    dispose3();
  });
}

const game = new Game();
