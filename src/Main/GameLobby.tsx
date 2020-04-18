import React, { useContext } from "react";
import Game from "Model/Game";
import { useObserver } from "mobx-react";

import "./GameLobby.css";
import PlayerList from "components/PlayerList";
import ReadyButton from "components/ReadyButton";
import { ErrorMessages } from "common/messages";
import Error from "components/Error";

export default function Lobby() {
  const game = useContext(Game);

  return useObserver(() => (
    <div className="lobby">
      <div className="box">
        <div className="text">Der Spielcode lautet</div>
        <div>
          <span className="game-id">{game.gameId}</span>
        </div>
        <span className="explain">
          Spieler mit diesem Link einladen:{" "}
          <input
            className="link"
            value={window.location.href}
            readOnly={true}
            autoFocus={true}
            onClick={(event) => {
              (event.target as HTMLInputElement).select();
              (event.target as HTMLInputElement).setSelectionRange(
                0,
                99999
              ); /*For mobile devices*/
              document.execCommand("copy");
            }}
          />
        </span>
      </div>

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
        <div className="text" style={{ paddingBottom: 15 }}>
          Spieler in der Lobby
        </div>

        <PlayerList />

        <Error filter={ErrorMessages.NOT_ALL_PLAYERS_READY} />
        <div className="button button-create" onClick={() => game.startGame()}>
          <span>Spiel starten</span>
        </div>
      </div>
    </div>
  ));
}
