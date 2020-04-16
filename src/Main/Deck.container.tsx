import React, { useContext, useEffect, useState } from "react";
import useMeasure from "react-use-measure";
import { observer, Observer } from "mobx-react";
import { reaction } from "mobx";

import Game from "../Model/Game";
import Deck from "./Deck";
import { bestLayoutFor } from "./helper";

const DeckContainer = () => {
  const game = useContext(Game);
  const [ref, bounds] = useMeasure();
  const [length, setLength] = useState(game.deck.length);

  const ratio = bounds.width / (bounds.height / 1.5);
  const [cols, rows] = bestLayoutFor(length, ratio);

  const width = Math.min(
    bounds.width / (cols + (cols - 1) * 0.1),
    bounds.height / (rows * 1.5 + (rows - 1) * 0.1)
  );

  useEffect(() =>
    reaction(
      () => game.deck.length,
      () => setLength(game.deck.length)
    )
  );

  return (
    <div ref={ref} className="deck">
      {width > 0 && (
        <Deck
          cols={cols}
          rows={rows}
          width={width}
          onSelect={(i) => game.selectCard(i)}
        />
      )}
    </div>
  );
};

export default DeckContainer;
