import React, { useContext } from "react";
import { useObserver } from "mobx-react-lite";
import "./App.css";
import Main from "./Main";
import Game from "./Model/Game";
import Connecting from "./Connecting";

function App() {
  const game = useContext(Game);
  return useObserver(() => (
    <div className="App">
      {!game.connected && <Connecting />}
      {game.connected && <Main />}
    </div>
  ));
}

export default App;
