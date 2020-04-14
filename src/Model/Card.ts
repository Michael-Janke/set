export enum Shape {
  Square,
  Round,
  Wave,
}

export enum Fill {
  None,
  Dotted,
  Filled,
}

export enum Number {
  One,
  Two,
  Three,
}

export enum Color {
  Green,
  Red,
  Purple,
}

interface iCard {
  shape: Shape;
  fill: Fill;
  number: Number;
  color: Color;
}

export default class Card {
  shape: Shape;
  fill: Fill;
  number: Number;
  color: Color;
  id: number;

  constructor(data: iCard, id: number) {
    const { shape, fill, number, color } = data;
    this.shape = shape;
    this.fill = fill;
    this.number = number;
    this.color = color;
    this.id = id;
  }

  isEqual(card: Card) {
    this.shape = card.shape;
    this.fill = card.fill;
    this.number = card.number;
    this.color = card.color;
  }
}

export type CardProperty = Shape | Fill | Number | Color;
const isSameOrDifferent = <T extends CardProperty>(a: T, b: T, c: T) => {
  if (a === b) return b === c; // if a = b, then b must be = c
  if (a === c) return false; // if a != b, c can't be equal either
  return b !== c; // a != b and a != c, so b must be !== c
};

export const isSet = (card1: Card, card2: Card, card3: Card) => {
  return (
    isSameOrDifferent<Shape>(card1.shape, card2.shape, card3.shape) &&
    isSameOrDifferent<Color>(card1.color, card2.color, card3.color) &&
    isSameOrDifferent<Fill>(card1.fill, card2.fill, card3.fill) &&
    isSameOrDifferent<Number>(card1.number, card2.number, card3.number)
  );
};
