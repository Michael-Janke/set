import React, { useState, useContext, useEffect } from "react";
import { GAME_ID_LENGTH } from "../common/gameStatus";
import CodeInput from "components/CodeInput";

import "./CreateOrJoinGame.css";
import { ErrorMessages } from "common/messages";
import Game from "Model/Game";
import Error from "components/Error";

export default function CreateOrJoinGame() {
  const [code, setCode] = useState(window.location.hash);
  useEffect(() => {
    const updateCode = () => setCode(window.location.hash);

    window.addEventListener("hashchange", updateCode, false);
    return () => {
      window.removeEventListener("hashchange", updateCode);
    };
  }, []);
  const game = useContext(Game);

  return (
    <div className="container">
      <div className="box">
        <div className="text">Ein neues Spiel erstellen</div>
        <div className="button button-create" onClick={() => game.createGame()}>
          <span>Spiel erstellen</span>
        </div>
      </div>

      <div className="box">
        <div className="text">Einem Spiel beitreten</div>
        <div className="smallText">
          Erfrage den Code bei deinem Freund, mit dem du spielen willst.
        </div>

        <Error filter={ErrorMessages.GAME_NOT_EXIST} />
        <CodeInput
          value={code}
          onChange={(value) => setCode(value)}
          onEnter={() => code.length === GAME_ID_LENGTH && game.joinGame(code)}
        />

        {code.length === GAME_ID_LENGTH && (
          <div
            className="button button-create"
            onClick={() => game.joinGame(code)}
          >
            <span>Spiel beitreten</span>
          </div>
        )}
      </div>
    </div>
  );
}
