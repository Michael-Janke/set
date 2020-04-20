import Card, { Fill, Color, Shape, Number, isSet } from "../src/Model/Card";
import { $enum } from "ts-enum-util";
import { observable, action, decorate, computed } from "mobx";

import { GameStatus } from "../src/common/gameStatus";
import User from "./user";
import { Messages, ErrorMessages } from "../src/common/messages";

export type GameId = string;
const SET_REFILL_DELAY = 3000;
const NO_SET_REFILL_DELAY = 1000;

const NORMAL_CARD_COUNT = 12;

class Game {
  constructor(id: GameId, owner: User) {
    this.id = id;
    this.owner = owner;
    this.generateFullDeck();
  }

  cards: Card[] = [];
  deck: (number | null)[] = [];
  pile: number[] = [];
  selectedCards: number[] = [];
  status: string = GameStatus.LOBBY;
  id: GameId;
  owner: User;

  players: Set<User> = new Set();
  statistics: Map<User, { sets: number; failSets: number }> = new Map();
  blockTimer: NodeJS.Timeout | undefined;

  join(user: User) {
    this.players.add(user);
    this.statistics.set(user, { sets: 0, failSets: 0 });
  }

  leave(user: User) {
    this.players.delete(user);
    this.statistics.delete(user);
  }

  get playerList() {
    return Array.from(this.players).map((user) => ({
      name: user.name,
      id: user.publicId,
      ready: user.ready,
      sets: this.statistics.get(user)?.sets,
      owner: user === this.owner,
      connected: user.connected,
      selecting: user.selecting,
    }));
  }

  clickCard(card: number, user: User) {
    if (!this.players.has(user))
      return user.send(Messages.ERROR, ErrorMessages.PERMISSION_DENIED);

    if (this.selectedCards.length === 0) {
      user.selecting = true;
      this.blockTimer = setTimeout(() => {
        user.selecting = false;
        this.selectedCards.length = 0;
      }, 5000);
    } else {
      if (!user.selecting) {
        return user.send(Messages.SELECTED_CARDS, this.selectedCards);
      }
    }

    this.selectedCards.indexOf(card) >= 0
      ? this.selectedCards.splice(this.selectedCards.indexOf(card), 1)
      : this.selectedCards.push(card);

    this.checkSet(user);
  }

  checkSet(user: User) {
    if (this.selectedCards.length !== 3) return;
    const selectedCards = this.selectedCards.map((id) => this.cards[id]);
    const isSet2 = isSet(selectedCards[0], selectedCards[1], selectedCards[2]);

    const stats = this.statistics.get(user);
    if (isSet2) {
      stats && stats.sets++;
    } else {
      stats && stats.failSets++;
    }

    this.blockTimer && clearTimeout(this.blockTimer);
    user.selecting = false;

    this.players.forEach((user) => user.send(Messages.SELECTED_SET, isSet2));

    setTimeout(
      () => {
        if (isSet2) {
          this.selectedCards.forEach((card) => {
            const i = this.deck.indexOf(card);
            this.deck[i] = null;
          });
          this.fillDeck();
        }

        this.selectedCards.length = 0;
      },
      isSet2 ? SET_REFILL_DELAY : NO_SET_REFILL_DELAY
    );
    return isSet2;
  }

  endGame() {
    this.status = GameStatus.FINISHED;
  }

  fillDeck() {
    if (this.pile.length === 0 && !this.deckContainsSet())
      return this.endGame();

    const cardsOnDeck = this.deck.filter((card) => card !== null) as number[];

    //fill deck with new cards upto 12
    const fill = NORMAL_CARD_COUNT - cardsOnDeck.length;
    for (let i = 0; i < fill; i++) {
      this.pile.length > 0 && this.deck.push(this.pile.pop() as number);
    }

    this.checkExtraCards();

    //if there are extra cards and free spaces, consolidate them
    if (this.deck.indexOf(null) >= 0 && this.deck.length > NORMAL_CARD_COUNT) {
      for (let i = this.deck.length - 1; i >= NORMAL_CARD_COUNT; i--) {
        const nextFreeSpace = this.deck.indexOf(null);
        if (nextFreeSpace >= 0) {
          const lastCard = this.deck.pop();
          if (lastCard !== undefined) this.deck[nextFreeSpace] = lastCard;
        }
      }
    }
  }

  checkExtraCards() {
    const deckContainsSet = this.deckContainsSet();
    if (!deckContainsSet) {
      this.pile.length && this.deck.push(this.pile.pop() as number);
      this.pile.length && this.deck.push(this.pile.pop() as number);
      this.pile.length && this.deck.push(this.pile.pop() as number);
      this.checkExtraCards();
    }
  }

  deckContainsSet() {
    const deck = this.deck.filter((card) => card !== null) as number[];
    if (deck.length < 3) return false;
    return getCombinations(deck, 3).some((combination) =>
      isSet(
        this.cards[combination[0]],
        this.cards[combination[1]],
        this.cards[combination[2]]
      )
    );
  }

  startGame(user: User) {
    if (this.status === GameStatus.RUNNING) return;
    if (!Array.from(this.players).every((user) => user.ready)) {
      this.players.forEach((user) =>
        user.send(Messages.ERROR, ErrorMessages.NOT_ALL_PLAYERS_READY)
      );
      return;
    }
    this.deck.length = 0;
    this.pile = shuffleArray(Array.from(this.cards.keys()));
    this.fillDeck();
    this.statistics.forEach((ref) => (ref.sets = 0));
    this.status = GameStatus.RUNNING;
  }

  generateFullDeck() {
    const cards: Card[] = [];
    let i = 0;
    $enum(Fill).forEach((fill) =>
      $enum(Color).forEach((color) =>
        $enum(Shape).forEach((shape) =>
          $enum(Number).forEach((number) =>
            cards.push(
              new Card(
                {
                  shape,
                  fill,
                  number,
                  color,
                },
                i
              )
            )
          )
        )
      )
    );
    this.cards = cards;
  }
}

decorate(Game, {
  cards: observable,
  deck: observable,
  selectedCards: observable,
  status: observable,
  players: observable,
  statistics: observable,
  clickCard: action,
  startGame: action,
  endGame: action,
  playerList: computed,
});

export default Game;

function shuffleArray(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function getCombinations<T>(a: T[], n: number, s: T[][] = [], t: T[] = []) {
  return a.reduce((p, c, i, a) => {
    n > 1
      ? getCombinations(a.slice(i + 1), n - 1, p, (t.push(c), t))
      : p.push((t.push(c), t).slice(0) as any);
    t.pop();
    return p;
  }, s);
}
