import React from "react";
import "./GameLobby.css";
import PlayerList from "components/PlayerList";
import Deck from "components/Deck";

import "./Game.css";
import GameControl from "components/GameControl";
import Grandma from "components/Grandma";

export default function Lobby() {
  return (
    <div className="game-container">
      <div className="game-bar">
        <PlayerList />
        <GameControl />
        <Grandma />
      </div>

      <Deck />
    </div>
  );
}
