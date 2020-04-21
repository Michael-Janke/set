import React, { useContext } from "react";
import Game from "Model/Game";
import { useObserver } from "mobx-react";

import "./GameLobby.css";
import PlayerList from "components/PlayerList";
import ReadyButton from "components/ReadyButton";
import { ErrorMessages } from "common/messages";
import Error from "components/Error";
import Button from "components/Button";

export default function Lobby() {
  const game = useContext(Game);

  return useObserver(() => (
    <div className="lobby">
      <div className="box">
        <div className="text">Der Spielcode</div>
        <div>
          <span className="game-id">{game.gameId}</span>
        </div>
        <Button onClick={() => copyStringToClipboard(window.location.href)}>
          Link kopieren
        </Button>
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
        <div className="text">Die Lobby</div>

        <PlayerList />

        <Error filter={ErrorMessages.NOT_ALL_PLAYERS_READY} />
        <Button
          onClick={() => game.startGame()}
          green={game.players.every((p) => p.ready)}
        >
          Spiel starten
        </Button>
      </div>
    </div>
  ));
}

function copyStringToClipboard(str: string) {
  // Temporäres Element erzeugen
  var el = document.createElement("textarea");
  // Den zu kopierenden String dem Element zuweisen
  el.value = str;
  // Element nicht editierbar setzen und aus dem Fenster schieben
  el.setAttribute("readonly", "");
  el.style.position = "absolute";
  el.style.left = "-9999px";
  document.body.appendChild(el);
  // Text innerhalb des Elements auswählen
  el.select();
  // Ausgewählten Text in die Zwischenablage kopieren
  document.execCommand("copy");
  // Temporäres Element löschen
  document.body.removeChild(el);
}
