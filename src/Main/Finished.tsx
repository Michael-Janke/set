import React, { useContext } from "react";
import Game from "Model/Game";
import { useObserver } from "mobx-react";

import "./GameLobby.css";
import PlayerList from "components/PlayerList";
import ReadyButton from "components/ReadyButton";
import { ErrorMessages } from "common/messages";
import Error from "components/Error";

export default function Finished() {
  const game = useContext(Game);

  return useObserver(() => (
    <div className="lobby">
      <div className="centered-row">
        <span className="input-container">
          <div className="label">Name:</div>
          <input
            className="input"
            value={game.userName}
            onChange={(event) => game.setName(event.target.value)}
          />
        </span>

        <ReadyButton />
      </div>

      <div className="box">
        <PlayerList />

        <Error filter={ErrorMessages.NOT_ALL_PLAYERS_READY} />
        <div
          className="button button-create green"
          onClick={() => game.startGame()}
        >
          <span>Spiel neu starten</span>
        </div>
        <div className="button button-create" onClick={() => game.leaveGame()}>
          <span>Spiel beenden</span>
        </div>
      </div>
    </div>
  ));
}
