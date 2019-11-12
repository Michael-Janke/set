enum Shape {
  Square,
  Round,
  Wave
}

enum Fill {
  None,
  Dotted,
  Filled
}

enum Number {
  One,
  Two,
  Three
}

enum Color {
  Green,
  Red,
  Purple
}

export default class Card {
  shape: Shape;
  fill: Fill;
  number: Number;
  color: Color;

  constructor({
    shape,
    fill,
    number,
    color
  }: {
    shape: Shape;
    fill: Fill;
    number: Number;
    color: Color;
  }) {
    this.shape = shape;
    this.fill = fill;
    this.number = number;
    this.color = color;
  }
}

export const isSet = (card1: Card, card2: Card, card3: Card) => {
  const setNumbers = [false, true, true, false, true, false, false, true]; //1,2,4,7
  const shape = (1 << card1.shape) | (1 << card2.shape) | (1 << card3.shape);
  const fill = (1 << card1.fill) | (1 << card2.fill) | (1 << card3.fill);
  const number =
    (1 << card1.number) | (1 << card2.number) | (1 << card3.number);
  const color = (1 << card1.color) | (1 << card2.color) | (1 << card3.color);
  return (
    setNumbers[shape] &&
    setNumbers[fill] &&
    setNumbers[number] &&
    setNumbers[color]
  );
};
