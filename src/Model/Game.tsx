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
          observable(this.cards).replace(
            (data as Card[]).map((card, i) => new Card(card, i))
          );
          break;
        case "deck":
          observable(this.deck).replace(data);
          break;
        case "selectedCards":
          observable(this.selectedCards).replace(data);
          break;
        case "status": {
          this.status = data;
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
  status: string = "LOBBY";

  selectCard(i: number) {
    if (!this.ws || !this.connected) return;
    const selectedCardId = this.selectedCards.indexOf(i);
    if (selectedCardId >= 0) {
      this.selectedCards.splice(selectedCardId, 1);
    } else {
      this.selectedCards.push(i);
    }
    this.ws.send(JSON.stringify(["click_card", i]));
  }

  startGame() {
    if (!this.ws || !this.connected) return;
    this.ws.send(JSON.stringify(["start_game"]));
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
});

export default createContext(new Game());
