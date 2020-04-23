import React, { useContext } from "react";
import "./index.css";
import { useObserver } from "mobx-react";

import Game from "Model/Game";
import GameUi from "./Game";
import { GameStatus } from "../common/gameStatus";
import CreateOrJoinGame from "./CreateOrJoinGame";
import Lobby from "./GameLobby";
import Countdown from "./Countdown";

export default function Main() {
  const game = useContext(Game);
  return (
    <div className="main">
      {useObserver(() => (
        <>
          {game.status === GameStatus.COUNTDOWN && <Countdown />}
          {game.status === GameStatus.RUNNING && <GameUi />}
          {(game.status === GameStatus.LOBBY ||
            game.status === GameStatus.FINISHED) && <Lobby />}
          {game.status === GameStatus.NONE && <CreateOrJoinGame />}
        </>
      ))}
    </div>
  );
}
