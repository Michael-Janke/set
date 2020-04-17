import * as ws from "ws";
import { decorate, observable, autorun, IReactionDisposer } from "mobx";
import Game from "./game";
import { Messages } from "../src/common/messages";
import { DEBUG } from ".";

const names = ["Captain America", "Ironman", "Superman", "Batman", "Flash"];
let lastIndex = 0;

export type UserId = string;

class User {
  constructor(id: UserId) {
    this.name = names[lastIndex++ % names.length];
    this.id = id;
  }
  sockets: Set<ws> = new Set();
  name: string;
  id: UserId;
  disposer: IReactionDisposer[] = [];

  registerSocket(ws: ws) {
    this.sockets.add(ws);
    const dispose = autorun(() => this.send(Messages.USER_NAME, this.name));

    ws.on("close", () => {
      this.sockets.delete(ws);
      dispose();
    });
  }

  send(message: string, data: any) {
    this.sockets.forEach((ws) => ws.send(JSON.stringify([message, data])));
  }

  disconnectFromGame() {
    this.disposer.forEach((dispose) => dispose());
  }

  connectToGame(game: Game) {
    this.disconnectFromGame();
    const connect: { [key in Messages]?: keyof Game } = {
      [Messages.DECK]: "deck",
      [Messages.CARDS]: "cards",
      [Messages.SELECTED_CARDS]: "selectedCards",
      [Messages.STATUS]: "status",
    };

    this.disposer = Object.entries(connect).map(([message, key]) =>
      autorun((event) => {
        DEBUG &&
          console.log(
            "[send " + game.id + "]:",
            message,
            game[key as keyof Game]
          );
        this.send(message, game[key as keyof Game]);
      })
    );

    this.sockets.forEach((ws) =>
      ws.on("close", () => this.disconnectFromGame())
    );
  }
}

decorate(User, {
  name: observable,
});

export default User;
