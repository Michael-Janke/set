import { observable, action, decorate } from "mobx";
import { createContext } from "react";
import ReconnectingWebSocket from "reconnecting-websocket";
import Card from "./Card";

const SERVER = "ws://localhost:8080";

class Game {
  constructor() {
    this.startServer();
  }

  startServer() {
    const rws = new ReconnectingWebSocket(SERVER, [], { debug: true });
    this.ws = rws;
    rws.addEventListener("open", () => {
      this.connected = true;
      rws.send(JSON.stringify(["hello"]));
    });

    rws.addEventListener("message", (event) => {
      const [command, data] = JSON.parse(event.data);
      console.log(command, data);
      switch (command) {
        case "all_cards":
          this.setCards(data);
          break;
        case "deck":
          observable(this.deck).replace(data);
          break;
        case "selectedCards":
          observable(this.selectedCards).replace(data);
          break;
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

  selectCard(card: Card) {
    if (!this.ws || !this.connected) return;
    this.selectedCards.push(card.id);
    this.ws.send(JSON.stringify(["click_card", card.id]));
  }

  setCards(data: Card[]) {
    observable(this.cards).replace(data.map((card, i) => new Card(card, i)));
  }

  addCard(card: Card) {}

  removeCard(card: Card) {}

  startGame() {}
}

decorate(Game, {
  cards: observable,
  deck: observable,
  selectedCards: observable,
  connected: observable,
  addCard: action,
  removeCard: action,
  startGame: action,
  selectCard: action,
  setCards: action,
});

export default createContext(new Game());
