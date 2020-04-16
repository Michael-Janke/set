import Card, { Fill, Color, Shape, Number, isSet } from "../src/Model/Card";
import { $enum } from "ts-enum-util";
import { observable, computed, action, decorate } from "mobx";

const NORMAL_CARD_COUNT = 12;

class Game {
  constructor() {
    this.generateFullDeck();
  }

  cards: Card[] = [];
  deck: (number | null)[] = [];
  pile: number[] = [];
  selectedCards: number[] = [];
  status: string = "LOBBY";

  clickCard(card: number) {
    this.selectedCards.indexOf(card) >= 0
      ? this.selectedCards.splice(this.selectedCards.indexOf(card), 1)
      : this.selectedCards.push(card);
    this.checkSet();
  }

  checkSet() {
    if (this.selectedCards.length !== 3) return;
    const selectedCards = this.selectedCards.map((id) => this.cards[id]);
    if (isSet(selectedCards[0], selectedCards[1], selectedCards[2])) {
      this.selectedCards.forEach((card) => {
        const i = this.deck.indexOf(card);
        this.deck[i] = null;
      });
      this.fillDeck();
    }
    this.selectedCards.length = 0;
  }

  endGame() {
    this.status = "FINISHED";
  }

  fillDeck() {
    if (this.pile.length === 0 && !this.deckContainsSet())
      return this.endGame();

    const cardsOnDeck = this.deck.filter((card) => card !== null) as number[];

    //fill deck with new cards upto 12
    const fill = NORMAL_CARD_COUNT - cardsOnDeck.length;
    if (fill > 0)
      for (let i = 0; i < fill; i++) {
        this.pile.length && this.deck.push(this.pile.pop() || null);
      }

    this.checkExtraCards();
    //if there are extra cards and free spaces, consolidate them
    if (
      this.deck.length > cardsOnDeck.length &&
      this.deck.length > NORMAL_CARD_COUNT
    ) {
      for (let i = this.deck.length - 1; i >= NORMAL_CARD_COUNT; i--) {
        const nextFreeSpace = this.deck.indexOf(null);
        if (nextFreeSpace >= 0) {
          this.deck[nextFreeSpace] = this.deck.pop() || null;
        }
      }

      if (this.deck.indexOf(null) >= 0)
        this.deck.length = this.deck.indexOf(null);
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

  startGame() {
    if (this.status === "STARTED") return;
    this.deck.length = 0;
    this.pile = shuffleArray(Array.from(this.cards.keys()));
    observable(this.deck).replace(this.pile.splice(0, NORMAL_CARD_COUNT));
    this.fillDeck();
    this.status = "STARTED";
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
  clickCard: action,
  startGame: action,
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
