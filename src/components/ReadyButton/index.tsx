import React, { useContext } from "react";
import { observer } from "mobx-react";
import Game from "Model/Game";

import "./ReadyButton.css";
import ReadyIcon from "components/ReadyIcon";

const ReadyButton = () => {
  const game = useContext(Game);
  return (
    <div
      className={"ready-button-container " + (game.ready ? "" : "not-ready")}
      onClick={() => game.setReadiness(!game.ready)}
    >
      <span className="ready-button-text">
        {["bin bereit", "bin nicht bereit"][game.ready ? 0 : 1]}
      </span>
      <div className="ready-button">
        <ReadyIcon ready={game.ready} />
      </div>
    </div>
  );
};

export default observer(ReadyButton);
