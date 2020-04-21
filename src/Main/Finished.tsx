import React, { useContext } from "react";
import Game from "Model/Game";
import { useObserver } from "mobx-react";
import PlayerList from "components/PlayerList";
import ReadyButton from "components/ReadyButton";
import { ErrorMessages } from "common/messages";
import Error from "components/Error";

import "./GameLobby.css";
import "./Finished.css";

export default function Finished() {
  const game = useContext(Game);

  return useObserver(() => (
    <div className="lobby finished">
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
        <div className="player-list">
          <PlayerList />
        </div>

        <Error filter={ErrorMessages.NOT_ALL_PLAYERS_READY} />
        <div className="button-row">
          <div
            className="button button-create green"
            onClick={() => game.startGame()}
          >
            <span>Spiel neu starten</span>
          </div>
          <div
            className="button button-create"
            onClick={() => game.leaveGame()}
          >
            <span>Spiel beenden</span>
          </div>
        </div>
      </div>
    </div>
  ));
}
