import React, { useContext } from "react";
import Card from "Model/Card";
import Game from "Model/Game";
import { observer } from "mobx-react";

import "./CardHighlightIndicator.css";

const CardHighlightIndicator = ({ card }: { card: Card }) => {
  const game = useContext(Game);
  return (
    <div className="highligt-indicator">
      {game.highlightedCards[card.id]?.map((initials) => {
        return (
          <div key={initials} className="initials">
            {initials}
          </div>
        );
      })}
    </div>
  );
};

export default observer(CardHighlightIndicator);
