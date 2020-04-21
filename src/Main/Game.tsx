import React, { useContext } from "react";
import Game from "Model/Game";
import { useObserver } from "mobx-react";

import "./GameLobby.css";
import PlayerList from "components/PlayerList";
import Deck from "components/Deck";

import "./Game.css";
import GameControl from "components/GameControl";

export default function Lobby() {
  return (
    <div className="game-container">
      <div className="game-bar">
        <PlayerList />
        <GameControl />
      </div>

      <Deck />
    </div>
  );
}
