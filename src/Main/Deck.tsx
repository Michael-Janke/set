import React from 'react';
import { useSprings, animated, interpolate } from 'react-spring';
import useMeasure from 'react-use-measure';

import deckReducer from './Deck.reducer';
import './Deck.css';
import Card from './Card';

const Test: React.FC<{ style: object, hallo: string }> = ({ style }) => null;

export default function Deck() {
  const [ref, bounds] = useMeasure();
  const [state, dispatch] = React.useReducer(deckReducer, { cards: [{}] }, undefined);
  const { cards } = state;

  const [props, set] = useSprings(cards.length, (i) => ({
    x: 0,
    y: 0
  }));

  return (
    <div ref={ref} className="deck">
      {props.map(({ x, y }, i) => (
        <Card
          Component={Test}


          key={i}
          className=""
          style={{
            transform: interpolate([x, y], (xn, yn) => `translate3d(${xn}px, ${yn}px, 0)`),
          }}
        />
      ))}
    </div>
  );
}
