import { observable, action, decorate } from "mobx";
import { createContext } from "react";
import ReconnectingWebSocket from "reconnecting-websocket";
import Card from "./Card";
import { GameStatus } from "../common/gameStatus";
import { Messages } from "../common/messages";

const SERVER = "ws://localhost:8080";

class Game {
  constructor() {
    this.startServer();
  }

  startServer() {
    const rws = new ReconnectingWebSocket(SERVER, [], { debug: false });
    this.ws = rws;
    rws.addEventListener("open", () => {
      this.connected = true;
      rws.send(JSON.stringify(["hello"]));
    });

    rws.addEventListener("message", (event) => {
      const [command, data] = JSON.parse(event.data);
      switch (command) {
        case Messages.CARDS:
          observable(this.cards).replace(
            (data as Card[]).map((card, i) => new Card(card, i))
          );
          break;
        case Messages.DECK:
          observable(this.deck).replace(data);
          break;
        case Messages.SELECTED_CARDS:
          observable(this.selectedCards).replace(data);
          break;
        case Messages.STATUS: {
          this.status = data as GameStatus;
        }
        default:
          break;
      }
    });

    rws.addEventListener("close", () => {
      this.connected = false;
    });
  }

  connected = false;
  ws: ReconnectingWebSocket | null = null;

  cards: Card[] = [];
  deck: (number | null)[] = [];
  selectedCards: number[] = [];
  status: string = GameStatus.LOBBY;

  selectCard(i: number) {
    if (!this.ws || !this.connected) return;
    const selectedCardId = this.selectedCards.indexOf(i);
    if (selectedCardId >= 0) {
      this.selectedCards.splice(selectedCardId, 1);
    } else {
      this.selectedCards.push(i);
    }
    this.ws.send(JSON.stringify([Messages.CLICK_CARD, i]));
  }

  startGame() {
    if (!this.ws || !this.connected) return;
    this.ws.send(JSON.stringify([Messages.START_GAME]));
  }

  createGame() {
    if (!this.ws || !this.connected) return;
    this.ws.send(JSON.stringify([Messages.CREATE_GAME]));
  }

  abortGame() {
    if (!this.ws || !this.connected) return;
    this.ws.send(JSON.stringify([Messages.ABORT_GAME]));
  }
}

decorate(Game, {
  cards: observable,
  deck: observable,
  selectedCards: observable,
  status: observable,
  connected: observable,
  selectCard: action,
  startGame: action,
  abortGame: action,
  createGame: action,
});

export default createContext(new Game());
