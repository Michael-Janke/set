import React, { useContext } from "react";
import Card from "common/Card";
import Game from "Model/Game";
import { observer } from "mobx-react";

import "./CardHighlightIndicator.css";
import { background } from "components/Player";

const CardHighlightIndicator = ({ card }: { card: Card }) => {
  const game = useContext(Game);
  return (
    <div className="highligt-indicator">
      {game.highlightedCards[card.id]?.map((id) => {
        const player = game.getPlayerById(id);
        return (
          <div
            key={id}
            className="initials"
            style={background(player?.color || ["red", "green"], false, false)}
          >
            {(player?.name || "❤")[0].toLocaleUpperCase()}
          </div>
        );
      })}
    </div>
  );
};

export default observer(CardHighlightIndicator);
