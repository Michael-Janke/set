import { observable, action, decorate } from "mobx";
import { createContext } from "react";
import ReconnectingWebSocket from "reconnecting-websocket";
import Card from "./Card";
import { GameStatus } from "../common/gameStatus";
import { Messages } from "../common/messages";

const SERVER = "ws://localhost:8080";

class Game {
  constructor() {
    this.setUserId();
    this.startServer();
  }
  setUserId() {
    const userId = localStorage.getItem("userId");
    if (userId !== null) {
      this.userId = userId;
    } else {
      this.userId = uuidv4();
      localStorage.setItem("userId", this.userId);
    }
  }

  startServer() {
    if (this.userId === undefined) throw new Error("no userID");
    const rws = new ReconnectingWebSocket(SERVER, [], { debug: false });
    this.ws = rws;
    rws.addEventListener("open", () => {
      this.connected = true;
      rws.send(JSON.stringify([Messages.USER_ID, this.userId]));
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
        case Messages.USER_NAME: {
          this.userName = data;
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

  userId: string | undefined;
  userName: string = "";

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

  setName(name: string) {
    if (!this.ws || !this.connected) return;
    this.ws.send(JSON.stringify([Messages.USER_NAME, name]));
    this.userName = name;
  }
}

decorate(Game, {
  cards: observable,
  deck: observable,
  selectedCards: observable,
  status: observable,
  connected: observable,
  userName: observable,
  selectCard: action,
  startGame: action,
  abortGame: action,
  createGame: action,
  setName: action,
});

export default createContext(new Game());

function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
