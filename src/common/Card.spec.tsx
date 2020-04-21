import Card, { Shape, Color, Fill, Number, isSet } from "./Card";

it("it detects a Set", () => {
  const card1 = new Card(
    {
      shape: Shape.Wave,
      color: Color.Red,
      fill: Fill.Dotted,
      number: Number.One,
    },
    0
  );
  const card2 = new Card(
    {
      shape: Shape.Square,
      color: Color.Red,
      fill: Fill.Dotted,
      number: Number.One,
    },
    0
  );
  const card3 = new Card(
    {
      shape: Shape.Round,
      color: Color.Red,
      fill: Fill.Dotted,
      number: Number.One,
    },
    0
  );
  const card4 = new Card(
    {
      shape: Shape.Round,
      color: Color.Green,
      fill: Fill.Dotted,
      number: Number.Two,
    },
    0
  );
  const card5 = new Card(
    {
      shape: Shape.Round,
      color: Color.Purple,
      fill: Fill.Dotted,
      number: Number.Three,
    },
    0
  );
  expect(isSet(card1, card2, card3)).toEqual(true);
  expect(isSet(card1, card2, card4)).toEqual(false);
  expect(isSet(card1, card3, card4)).toEqual(false);
  expect(isSet(card3, card4, card5)).toEqual(true);
});
