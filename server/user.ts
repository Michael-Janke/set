import * as ws from "ws";
import {
  decorate,
  observable,
  autorun,
  IReactionDisposer,
  computed,
  action,
} from "mobx";
import Game from "./game";
import { Messages } from "../src/common/messages";
import Statistics from "./statistics";

const names = ["Captain America", "Ironman", "Superman", "Batman", "Flash"];
let lastIndex = 0;

const HIGHLIGHT_DURATION = 3000;

export type UserId = string;
const connect: [keyof User] = [Messages.PUBLIC_ID];

class User {
  constructor(id: UserId) {
    this.name = names[lastIndex++ % names.length];
    this.publicId = lastIndex.toString();
    this.id = id;

    this.disposerUser = connect.map((key) =>
      autorun(() => this.send(key, this[key]))
    );
  }
  sockets: Set<ws> = new Set();
  name: string;
  color: string[] = generateColorSet();
  id: UserId;
  publicId: string;
  disposer: IReactionDisposer[] = [];
  disposerUser: IReactionDisposer[];
  ready: boolean = false;
  selecting: boolean = false;
  coolDown: boolean = false;
  coolDownTimer: NodeJS.Timeout | null = null;
  statistics = new Statistics();
  highlightedCard: string | null = null;
  highlightedCardTimer: NodeJS.Timeout | null = null;

  highlightCard(card: string) {
    this.highlightedCardTimer && clearTimeout(this.highlightedCardTimer);
    this.highlightedCard = card;
    this.highlightedCardTimer = setTimeout(
      () => (this.highlightedCard = null),
      HIGHLIGHT_DURATION
    );
  }

  startCoolDown(duration: number) {
    this.coolDownTimer && clearTimeout(this.coolDownTimer);
    this.coolDown = true;
    this.coolDownTimer = setTimeout(() => (this.coolDown = false), duration);
  }

  registerSocket(ws: ws) {
    this.sockets.add(ws);

    ws.on("close", () => {
      this.sockets.delete(ws);
      console.log("disconnected:", this.name, this.publicId);
    });
  }

  send(message: string, data: any) {
    this.sockets.forEach((ws) => ws.send(JSON.stringify([message, data])));
  }

  disconnectFromGame() {
    this.disposer.forEach((dispose) => dispose());
    this.ready = false;
  }

  connectToGame(game: Game) {
    this.disconnectFromGame();
    const connect: { [key in Messages]?: keyof Game } = {
      [Messages.DECK]: "deck",
      [Messages.CARDS]: "cards",
      [Messages.SELECTED_CARDS]: "selectedCards",
      [Messages.STATUS]: "status",
      [Messages.GAME_ID]: "id",
      [Messages.PLAYERS]: "playerList",
      [Messages.HIGHLIGHTED_CARDS]: "highlightedCards",
      [Messages.TIPP_AVAILABLE]: "tippIsAvailable",
    };

    this.disposer = Object.entries(connect).map(([message, key]) =>
      autorun(() => {
        this.send(message, game[key as keyof Game]);
      })
    );

    this.sockets.forEach((ws) =>
      ws.on("close", () => this.disconnectFromGame())
    );
  }

  get connected() {
    return this.sockets.size > 0;
  }
}

decorate(User, {
  name: observable,
  color: observable,
  sockets: observable,
  ready: observable,
  selecting: observable,
  connected: computed,
  publicId: observable,
  statistics: observable,
  coolDown: observable,
  startCoolDown: action,
  highlightedCard: observable,
  highlightCard: action,
});

export default User;

let i = 0;
function generateColorSet() {
  const colors = [
    "#f6d365",
    "#fda085",
    "#f093fb",
    "#f5576c",
    "#5ee7df",
    "#b490ca",
    "#c3cfe2",
  ];
  const color1 = colors[(i * 2) % colors.length];
  const color2 =
    colors[(i * 2 + 1 + Math.floor(i / colors.length)) % colors.length];

  i++;
  return [color1, color2];
}
