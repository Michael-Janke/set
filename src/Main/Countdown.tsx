import React, { useContext, useEffect, useState } from "react";
import Game from "Model/Game";
import { observer } from "mobx-react";

import "./Countdown.css";
import Score from "components/Score";

import { colors as shapeColors } from "components/Card/Shape";
const colors = Object.values(shapeColors);

const Countdown = () => {
  const game = useContext(Game);
  return (
    <div
      className="countdown"
      style={{ color: colors[parseInt(game.countdown) % colors.length || 0] }}
    >
      <div className="number">
        <Score score={game.countdown} placeholder={game.countdown} />
      </div>
    </div>
  );
};

export default observer(Countdown);
