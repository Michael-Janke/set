import * as ws from "ws";
import * as express from "express";
import { reaction, autorun, observe } from "mobx";

import Game from "./game";

export default function websocket(ws: ws, req: express.Request) {
  ws.send(JSON.stringify(["all_cards", game.cards]));
  ws.send(JSON.stringify(["deck", game.deck]));
  ws.on("message", function (msg) {
    const [command, data] = JSON.parse(msg as string);
    switch (command) {
      case "click_card": {
        game.clickCard(data);
      }
    }
  });

  const dispose1 = autorun((event) => {
    ws.send(JSON.stringify(["deck", game.deck]));
  });

  const dispose2 = autorun((event) => {
    ws.send(JSON.stringify(["selectedCards", game.selectedCards]));
  });

  ws.on("close", () => {
    dispose1();
    dispose2();
  });
}

const game = new Game();
game.startGame();
