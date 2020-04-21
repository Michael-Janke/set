import React, { useContext } from "react";
import Game from "Model/Game";
import { observer } from "mobx-react";
import "./GameControl.css";
import Button from "components/Button";

function GameControl() {
  const game = useContext(Game);
  const owner =
    game.players.find((player) => player.owner)?.id === game.publicId;

  return (
    <div className="game-control">
      {game.tippIsAvailable ? (
        <Button small={true} green={true} onClick={() => game.sendTipp()}>
          Tipp
        </Button>
      ) : (
        <Button small={true} green={true}>
          <span className="game-code">{game.gameId}</span>
        </Button>
      )}

      {owner && (
        <Button small={true} onClick={() => game.endGame()}>
          beenden
        </Button>
      )}
      <Button small={true} onClick={() => game.leaveGame()}>
        verlassen
      </Button>
    </div>
  );
}

export default observer(GameControl);
