import React, { useState, useContext } from "react";
import { GAME_ID_LENGTH } from "../common/gameStatus";
import CodeInput from "components/CodeInput";

import "./CreateOrJoinGame.css";
import { ErrorMessages, ErrorText } from "common/messages";
import Game from "Model/Game";
import { useObserver } from "mobx-react";

export default function CreateOrJoinGame({
  onCreate,
  onJoin,
}: {
  onCreate: () => void;
  onJoin: (code: string) => void;
}) {
  const [code, setCode] = useState(window.location.hash);

  return (
    <div className="container">
      <div className="box">
        <div className="text">Ein neues Spiel erstellen</div>
        <div className="button button-create" onClick={() => onCreate()}>
          <span>Spiel erstellen</span>
        </div>
      </div>

      <div className="box">
        <div className="text">Einem Spiel beitreten</div>
        <div className="smallText">
          Erfrage den Code bei deinem Freund, mit dem du spielen willst.
        </div>

        <Error />
        <CodeInput
          value={code}
          onChange={(value) => setCode(value)}
          onEnter={() => code.length === GAME_ID_LENGTH && onJoin(code)}
        />

        {code.length === GAME_ID_LENGTH && (
          <div className="button button-create" onClick={() => onJoin(code)}>
            <span>Spiel beitreten</span>
          </div>
        )}
      </div>
    </div>
  );
}

const Error = () => {
  const game = useContext(Game);
  return useObserver(() => (
    <>
      {game.error === ErrorMessages.GAME_NOT_EXIST && (
        <div className="error">{ErrorText.de[game.error]}</div>
      )}
    </>
  ));
};
