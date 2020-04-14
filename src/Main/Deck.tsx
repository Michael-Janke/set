import React, { useState, useEffect, useContext } from "react";
import { useSprings, animated, interpolate } from "react-spring";
import { useDrag } from "react-use-gesture";
import useMeasure from "react-use-measure";
import { useObserver } from "mobx-react-lite";
import { autorun, reaction, observe } from "mobx";

import CardModel from "../Model/Card";
import "./Deck.css";
import Card from "./Card";
import Game from "../Model/Game";

import { bestLayoutFor } from "./helper";

export default function Deck() {
  const [ref, bounds] = useMeasure();
  const [force, forceUpdate] = useState(false);
  const game = useContext(Game);

  const ratio = bounds.width / (bounds.height / 1.5);
  const [cols, rows] = bestLayoutFor(game.deck.length, ratio);

  const width = Math.min(
    bounds.width / (cols + (cols - 1) * 0.1),
    bounds.height / (rows * 1.5 + (rows - 1) * 0.1)
  );

  const position: (
    i: number
  ) => { x: number; y: number; scale: number; width: number } = (
    i: number
  ) => ({
    x: (i % cols) * (width * 1.1),
    y: Math.floor(i / cols) * (width * 1.6),
    scale: width / 100,
    width,
    z: 1,
  });

  const [props, set] = useSprings(game.cards.length, (i) => ({
    ...position(game.deck.indexOf(i)),
    from: { x: 0, y: 0, opacity: 0 },
  }));

  const bind = useDrag(({ args: [index], down }) => {
    if (!down) {
      game.selectCard(game.cards[index] as CardModel);
    }
  });

  const update = () => {
    set((i) => {
      const active = game.deck.indexOf(i) >= 0;
      if (!active) return { opacity: 0 };
      const selected = game.selectedCards.indexOf(i) >= 0;
      const scale = selected ? 1.2 : 1; // Active cards lift up a bit
      const z = selected ? 2 : 1;
      const o = position(game.deck.indexOf(i));
      return {
        scale: o.scale * scale,
        x: o.x - ((scale - 1) * width) / 2,
        y: o.y - ((scale - 1) * width * 1.5) / 2,
        z,
        opacity: 1,
      };
    });
  };

  observe(game.deck, update);
  observe(
    game.cards,
    () => {
      console.log("cards changed", JSON.stringify(game.cards));
      //forceUpdate(!force);
    },
    false
  );
  observe(game.selectedCards, update);
  useEffect(update, [width]);

  return useObserver(() => {
    return (
      <div ref={ref} className="deck">
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
              {...bind(i)}
            >
              <Card card={game.cards[i]} />
            </animated.div>
          );
        })}
      </div>
    );
  });
}
