import React, { useContext } from "react";
import Game from "Model/Game";
import { useObserver } from "mobx-react";

import "./GameLobby.css";
import PlayerList from "components/PlayerList";
import ReadyButton from "components/ReadyButton";
import { ErrorMessages } from "common/messages";
import Error from "components/Error";
import Button from "components/Button";
import { GameStatus } from "common/gameStatus";

export default function Lobby() {
  const game = useContext(Game);

  return useObserver(() => (
    <div className="lobby">
      {game.status === GameStatus.LOBBY && (
        <div className="box">
          <div className="text">Der Spielcode</div>

          <div className="game-id">{game.gameId}</div>
          <div className="button-row">
            <Button
              green={true}
              onClick={() => copyStringToClipboard(window.location.href)}
            >
              Link in Ablage kopieren
            </Button>
            <Button
              green={true}
              onClick={() =>
                window.open(
                  "https://wa.me/?text=" +
                    encodeURIComponent(
                      "Spiel mit mir ne Runde Set. " + window.location.href
                    )
                )
              }
            >
              Per WhatsApp einladen
            </Button>
          </div>
        </div>
      )}

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
        <div className="button-row">
          <Button onClick={() => game.leaveGame()}>Spiel verlassen</Button>
          <Button
            onClick={() => game.startGame()}
            green={game.players.every((p) => p.ready)}
          >
            Spiel {game.status === GameStatus.FINISHED ? "neu" : ""}starten
          </Button>
        </div>
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
