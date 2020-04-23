import Card, {
  Fill,
  Color,
  Shape,
  Number,
  isSet,
  isOma,
} from "../src/common/Card";
import { $enum } from "ts-enum-util";
import { observable, action, decorate, computed } from "mobx";

import { GameStatus } from "../src/common/gameStatus";
import PublicUser from "../src/common/publicUser";
import User from "./user";
import { Messages, ErrorMessages } from "../src/common/messages";
import Statistics from "./statistics";

export type GameId = string;
const SET_REFILL_DELAY = 3000;
const NO_SET_REFILL_DELAY = 1000;
const NO_SET_COOL_DOWN = 5000;
const MAX_SELECT_TIME = 5000;
const TIPP_WAIT_TIME = 30000;

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
  highlightedCardsMap = new Map<number, User>();
  status: string = GameStatus.LOBBY;
  id: GameId;
  owner: User;

  players: Set<User> = new Set();
  blockTimer: NodeJS.Timeout | undefined;

  lastSetTime = Date.now();

  join(user: User) {
    this.players.add(user);
    user.statistics = new Statistics();
  }

  leave(user: User) {
    this.players.delete(user);
    user.statistics = new Statistics();
  }

  get playerList() {
    return Array.from(this.players).map(
      (user) =>
        ({
          name: user.name,
          color: user.color,
          id: user.publicId,
          ready: user.ready,
          sets: user.statistics.sets,
          fails: user.statistics.fails,
          connected: user.connected,
          selecting: user.selecting || user.coolDown,
          owner: this.owner === user,
        } as PublicUser)
    );
  }

  get highlightedCards() {
    const obj: { [key: string]: string[] } = {};
    this.players.forEach((user) => {
      if (user.highlightedCard === null) return;
      obj[user.highlightedCard] = obj[user.highlightedCard] || [];
      obj[user.highlightedCard].push(user.publicId);
    });
    return obj;
  }

  get allPlayersReady() {
    let allReady = true;
    this.players.forEach((p) => (allReady = allReady && p.ready));
    return allReady;
  }

  clickCard(card: number, user: User) {
    if (!this.players.has(user))
      return user.send(Messages.ERROR, ErrorMessages.PERMISSION_DENIED);

    const someoneElseIsSelecting = [...this.players.values()].some(
      (u) => u !== user && u.selecting
    );

    // block guard
    if (
      this.selectedCards.length === 3 ||
      user.coolDown ||
      someoneElseIsSelecting
    ) {
      user.send(Messages.ERROR, ErrorMessages.CLICK_IS_BLOCKED);
      return user.send(Messages.SELECTED_CARDS, this.selectedCards);
    }

    if (!user.selecting) {
      user.selecting = true;
      this.blockTimer = setTimeout(() => this.checkSet(user), MAX_SELECT_TIME);
    }

    this.selectedCards.indexOf(card) == -1 && this.selectedCards.push(card);

    if (this.selectedCards.length === 3) this.checkSet(user);
  }

  checkSet(user: User | null) {
    const selectedCards = this.selectedCards.map((id) => this.cards[id]);
    const isSet2 =
      this.selectedCards.length === 3 &&
      isSet(selectedCards[0], selectedCards[1], selectedCards[2]);

    if (isSet2) {
      user && user.statistics.sets++;
      user &&
        user.statistics.setTimes.push({
          set: [...this.selectedCards],
          time: Date.now() - this.lastSetTime,
        });
      this.lastSetTime = Date.now();
    } else {
      user && user.statistics.fails++;
    }

    if (!isSet2 && user) {
      user.startCoolDown(NO_SET_COOL_DOWN);
    }

    this.blockTimer && clearTimeout(this.blockTimer);

    this.players.forEach((user) => user.send(Messages.SELECTED_SET, isSet2));

    setTimeout(
      action(() => {
        if (isSet2) {
          this.selectedCards.forEach((card) => {
            const i = this.deck.indexOf(card);
            this.deck[i] = null;
          });
          this.fillDeck();
        }
        if (user) user.selecting = false;
        this.selectedCards.length = 0;
      }),
      isSet2 ? SET_REFILL_DELAY : NO_SET_REFILL_DELAY
    );
    return isSet2;
  }

  endGame() {
    this.status = GameStatus.FINISHED;
    this.players.forEach((player) => (player.ready = false));
    this.resetTippTimer(true);
  }

  fillDeck() {
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
    this.checkOma();
    this.resetTippTimer();
  }

  checkExtraCards() {
    const deckContainsSet = this.deckContainsSet();
    if (this.pile.length === 0 && !deckContainsSet) return this.endGame();
    if (!deckContainsSet) {
      this.pile.length && this.deck.push(this.pile.pop() as number);
      this.pile.length && this.deck.push(this.pile.pop() as number);
      this.pile.length && this.deck.push(this.pile.pop() as number);
      this.checkExtraCards();
    }
  }

  deckContainsSet() {
    const deck = this.deck.filter((card) => card !== null) as number[];
    if (deck.length < 3) return undefined;
    return getCombinations(deck, 3).find((combination) =>
      isSet(
        this.cards[combination[0]],
        this.cards[combination[1]],
        this.cards[combination[2]]
      )
    );
  }

  containsOma = false;
  checkOma() {
    const deck = this.deck.filter((card) => card !== null) as number[];
    this.containsOma = getCombinations(deck, 3).some((combination) =>
      isOma(
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
    this.selectedCards.length = 0;
    this.pile = shuffleArray(Array.from(this.cards.keys()));
    this.players.forEach((user) => (user.statistics = new Statistics()));

    this.fillDeck();
    this.status = GameStatus.RUNNING;
    this.resetTippTimer();
    this.lastSetTime = Date.now();
  }

  tippIsAvailable = false;
  tippTimer: NodeJS.Timeout | null = null;
  tippIndex = 0;
  sendTipp() {
    if (!this.tippIsAvailable || this.selectedCards.length === 3) return;
    const set = this.deckContainsSet();
    if (set) {
      if (
        this.selectedCards.some((card) =>
          set.some((setCard) => setCard !== card)
        )
      ) {
        //another set is already selected
        this.selectedCards.length = 0;
      }
      this.selectedCards.push(set[this.tippIndex++ % set.length]);
      if (this.selectedCards.length === 3) this.checkSet(null);
    }
    this.resetTippTimer();
  }

  resetTippTimer(stop = false) {
    this.tippIsAvailable = false;
    this.tippTimer && clearTimeout(this.tippTimer);
    if (stop) return;
    this.tippTimer = setTimeout(
      () => (this.tippIsAvailable = true),
      TIPP_WAIT_TIME
    );
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
  highlightedCards: computed,
  status: observable,
  players: observable,
  clickCard: action,
  startGame: action,
  endGame: action,
  playerList: computed,
  tippIsAvailable: observable,
  sendTipp: action,
  containsOma: observable,
  checkSet: action,
  allPlayersReady: computed,
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
