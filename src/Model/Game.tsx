import { observable, action, decorate, computed } from "mobx";
import { createContext } from "react";
import ReconnectingWebSocket from "reconnecting-websocket";
import Card from "../common/Card";
import { GameStatus } from "../common/gameStatus";
import { Messages, ErrorMessages } from "../common/messages";
import SoundPool, { Sounds } from "../components/SoundPool";
import PublicUser from "common/publicUser";

let SERVER = [
  "wss://" + window.location.hostname + "/ws",
  "ws://localhost:8080/ws",
][window.location.hostname === "localhost" ? 1 : 0];

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
          data.length > 0 &&
            data.length - this.deck.length >= 0 &&
            SoundPool.play(Sounds.DECK);
          observable(this.deck).replace(data);
          break;

        case Messages.SELECTED_CARDS:
          observable(this.selectedCards).replace(data);
          data.length && SoundPool.play(Sounds.CLICK);
          break;

        case Messages.STATUS:
          this.status = data as GameStatus;
          SoundPool.init();

          break;

        case Messages.PUBLIC_ID:
          this.publicId = data;
          break;

        case Messages.GAME_ID:
          this.gameId = data;
          window.location.hash = data;
          break;

        case Messages.PLAYERS:
          observable(this.players).replace(data);
          break;

        case Messages.ERROR:
          this.error = data;
          SoundPool.play(Sounds.ERROR);
          window.setTimeout(() => {
            if (this.error === data) this.error = undefined;
          }, 5000);
          break;

        case Messages.SELECTED_SET:
          SoundPool.play(data ? Sounds.SUCCESS : Sounds.FAILURE);
          break;

        case Messages.HIGHLIGHTED_CARDS:
          this.highlightedCards = data;
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
  status: string = GameStatus.LOBBY;

  userId: string | undefined;
  publicId: string | undefined;
  gameId: string | undefined;
  error: ErrorMessages | undefined;

  players: PublicUser[] = [];

  highlightedCards: { [key: string]: string[] } = {};

  get userName() {
    return this.players.find((p) => p.id === this.publicId)?.name || "loading";
  }

  get ready() {
    return this.players.find((p) => p.id === this.publicId)?.ready || false;
  }

  getPlayerById(id: string) {
    return this.players.find((p) => p.id === id);
  }

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

  joinGame(code: string) {
    if (!this.ws || !this.connected) return;
    this.ws.send(JSON.stringify([Messages.JOIN_GAME, code]));
  }

  leaveGame() {
    if (!this.ws || !this.connected) return;
    this.ws.send(JSON.stringify([Messages.LEAVE_GAME]));
  }

  setName(name: string) {
    if (!this.ws || !this.connected) return;
    this.ws.send(JSON.stringify([Messages.USER_NAME, name]));
  }

  setReadiness(ready: boolean) {
    if (!this.ws || !this.connected) return;
    this.ws.send(JSON.stringify([Messages.SET_READINESS, ready]));
  }

  kick(id: string) {
    if (!this.ws || !this.connected) return;
    this.ws.send(JSON.stringify([Messages.KICK, id]));
  }

  highlightCard(cardNumber: number) {
    if (!this.ws || !this.connected) return;
    this.ws.send(JSON.stringify([Messages.HIGHLIGHT_CARDS, cardNumber]));
  }
}

decorate(Game, {
  cards: observable,
  deck: observable,
  selectedCards: observable,
  status: observable,
  connected: observable,
  userName: computed,
  selectCard: action,
  startGame: action,
  abortGame: action,
  joinGame: action,
  leaveGame: action,
  createGame: action,
  setName: action,
  kick: action,
  error: observable,
  gameId: observable,
  players: observable,
  setReadiness: action,
  ready: computed,
  publicId: observable,
  highlightedCards: observable,
});

export default createContext(new Game());

function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
