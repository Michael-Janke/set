import React, { useContext } from "react";
import "./index.css";
import Deck from "./Deck.container";
import { useObserver } from "mobx-react";

import Game from "../Model/Game";

export default function Main() {
  const game = useContext(Game);
  return (
    <div className="main">
      {useObserver(() => (
        <>
          {game.status === "STARTED" && <Deck />}
          {game.status === "LOBBY" && (
            <button onClick={() => game.startGame()}>Starten</button>
          )}
        </>
      ))}
    </div>
  );
}
