import React, { useState, useContext, useEffect } from "react";
import { GAME_ID_LENGTH } from "../common/gameStatus";
import CodeInput from "components/CodeInput";

import "./CreateOrJoinGame.css";
import { ErrorMessages } from "common/messages";
import Game from "Model/Game";
import Error from "components/Error";
import Button from "components/Button";

export default function CreateOrJoinGame() {
  const [code, setCode] = useState(window.location.hash);
  const game = useContext(Game);

  return (
    <div className="container">
      <div className="box">
        <div className="text">Ein neues Spiel erstellen</div>
        <Button onClick={() => game.createGame()}>Spiel erstellen</Button>
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
          <Button onClick={() => game.joinGame(code)}>Spiel beitreten</Button>
        )}
      </div>
    </div>
  );
}
