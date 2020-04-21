import React, { useEffect, useContext, useLayoutEffect, useState } from "react";
import { useSprings, animated, interpolate } from "react-spring";
import { reaction, observe } from "mobx";

import "./Deck.css";
import Card from "../Card";
import Game from "../../Model/Game";
import CardHighlightIndicator from "components/CardHighlightIndicator";

const Deck = ({
  onSelect,
  onHover,
  width,
  cols,
  parentWidth,
}: {
  onSelect: (i: number) => void;
  onHover?: (i: number) => void;
  width: number;
  cols: number;
  rows: number;
  parentWidth: number;
}) => {
  const game = useContext(Game);
  const { cards, selectedCards, deck } = game;

  const position: (
    i: number
  ) => { x: number; y: number; scale: number; width: number } = (
    i: number
  ) => ({
    x:
      (i % cols) * (width * 1.1) +
      (parentWidth - cols * width * 1.1 + width * 0.1) / 2, //margin
    y: Math.floor(i / cols) * (width * 1.6),
    scale: Math.max(0, width / 100),
    width,
    z: 1,
    opacity: i >= 0 ? 1 : 0,
  });

  const [props, set] = useSprings(cards.length, (i) => ({
    ...position(deck.indexOf(i)),
    from: { x: 0, y: 0, opacity: 0 },
  }));

  const update = () => {
    set((i: number) => {
      const active = deck.indexOf(i) >= 0;
      if (!active) return { opacity: 0, z: 0, x: -width, y: -width * 1.5 };
      const isSelectedCards = selectedCards.indexOf(i) >= 0;
      const scale = isSelectedCards ? 1.2 : 1; // Active cards lift up a bit
      const z = isSelectedCards ? 2 : 1;
      const o = position(deck.indexOf(i));
      return {
        scale: o.scale * scale,
        x: o.x - ((scale - 1) * width) / 2,
        y: o.y - ((scale - 1) * width * 1.5) / 2,
        z,
        opacity: 1,
      };
    });
  };

  useLayoutEffect(update);
  useEffect(() => observe(selectedCards, update, true));
  useEffect(() => observe(deck, update, true));

  const [x, setX] = useState(deck.length + " " + cards.length);
  useEffect(() =>
    reaction(
      () => deck.length + " " + cards.length,
      (x) => setX(x)
    )
  );

  return (
    <>
      {props.map(({ x, y, scale, z, opacity }, i) => {
        return (
          <animated.div
            key={i}
            className={"cardWrapper"}
            style={{
              opacity,
              transform: interpolate(
                [x, y, scale, z],
                (xn, yn, scale, z) =>
                  `translate3d(${xn}px, ${yn}px, ${z}em) scale(${scale})`
              ),
              boxShadow: interpolate(
                [z],
                (z) =>
                  `0 12.5px ${z * 100 - 50}px -10px rgba(50, 50, 73, 0.4), 
                    0 10px 10px -10px rgba(50, 50, 73, 0.3)`
              ),
            }}
            onClick={() => onSelect(i)}
            onMouseEnter={onHover && (() => onHover(i))}
          >
            <Card card={cards[i]} />
            <CardHighlightIndicator card={cards[i]} />
          </animated.div>
        );
      })}
    </>
  );
};
export default Deck;
