import React, { useContext } from "react";
import "./index.css";
import { useObserver } from "mobx-react";

import Game from "Model/Game";
import GameUi from "./Game";
import { GameStatus } from "../common/gameStatus";
import CreateOrJoinGame from "./CreateOrJoinGame";
import Lobby from "./GameLobby";
import Finished from "./Finished";

export default function Main() {
  const game = useContext(Game);
  return (
    <div className="main">
      {useObserver(() => (
        <>
          {game.status === GameStatus.RUNNING && <GameUi />}
          {game.status === GameStatus.LOBBY && <Lobby />}
          {game.status === GameStatus.NONE && <CreateOrJoinGame />}
          {game.status === GameStatus.FINISHED && <Finished />}
        </>
      ))}
    </div>
  );
}
