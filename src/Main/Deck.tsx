import React, { useState, useEffect } from "react";
import { useSprings, animated, interpolate } from "react-spring";
import useMeasure from "react-use-measure";
import { $enum } from "ts-enum-util";

import CardModel, { Fill, Color, Shape, Number } from "../Model/Card";
import "./Deck.css";
import Card from "./Card";

function shuffleArray(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function generateFullDeck() {
  const cards: CardModel[] = [];
  $enum(Fill).forEach(fill =>
    $enum(Color).forEach(color =>
      $enum(Shape).forEach(shape =>
        $enum(Number).forEach(number =>
          cards.push(
            new CardModel({
              shape,
              fill,
              number,
              color
            })
          )
        )
      )
    )
  );
  shuffleArray(cards);
  return cards;
}

function getAllProductsOf(n: number) {
  let products: number[][] = [];
  let a = Math.floor(Math.sqrt(n));
  let b = Math.ceil(Math.sqrt(n));
  for (; a >= 1; a--) {
    for (; a * b < n; b++);
    products.push([a, b]);
    products.push([b, a]);
  }
  return products;
}

function bestLayoutFor(n: number, ratio: number) {
  const products = getAllProductsOf(n);
  const scoreOfProducts = products.map(([a, b]) =>
    Math.abs(a / b - ratio || 0)
  );
  const bestProductIndex = scoreOfProducts.indexOf(
    Math.min(...scoreOfProducts)
  );

  return products[bestProductIndex];
}

export default function Deck() {
  const [ref, bounds] = useMeasure();
  const [deck, setDeck] = useState<CardModel[]>(generateFullDeck());

  const ratio = bounds.width / (bounds.height / 1.5);
  const [cols, rows] = bestLayoutFor(deck.length, ratio);

  const width = Math.min(
    bounds.width / (cols + (cols - 1) * 0.1),
    bounds.height / (rows * 1.5 + (rows - 1) * 0.1)
  );

  const position: (i: number) => { x: number; y: number } = (i: number) => ({
    x: (i % cols) * (width * 1.1),
    y: Math.floor(i / cols) * (width * 1.6),
    scale: width / 100
  });

  const [props, set] = useSprings(deck.length, i => ({
    ...position(i),
    from: { x: 0, y: 0 }
  }));

  useEffect(() => {
    set(position);
  }, [width]);

  return (
    <div ref={ref} className="deck">
      {props.map(({ x, y, scale }, i) => {
        return (
          <animated.div
            key={i}
            className={"cardWrapper"}
            style={{
              transform: interpolate(
                [x, y, scale],
                (xn, yn, scale) =>
                  `translate3d(${xn}px, ${yn}px, 0) scale(${scale})`
              )
            }}
          >
            <Card card={deck[i]} />
          </animated.div>
        );
      })}
    </div>
  );
}
