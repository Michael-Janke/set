import React, { useContext } from "react";
import { animated } from "react-spring";
import "./Player.css";
import Game from "Model/Game";
import { observer } from "mobx-react";
import ReadyIcon from "components/ReadyIcon";
import { GameStatus } from "common/gameStatus";
import Score from "components/Score";
import "./Player.css";

type PlayerProps = {
  id: string;
  style: any;
};

function Player({ id, style }: PlayerProps) {
  const game = useContext(Game);
  const player = game.players.find((player) => player.id === id);
  const owner = game.players.find((player) => player.owner);
  if (!player) return <div />;

  return (
    <animated.div className="player-container">
      <animated.div
        className="player"
        key={id}
        style={{
          ...style,
          ...background(player.color, player.selecting, !player.connected),
        }}
      >
        <div className="name-container">
          <span className="name">{player.name} </span>
        </div>
        {(game.status === GameStatus.LOBBY ||
          game.status === GameStatus.FINISHED) && (
          <ReadyIcon ready={player.ready} />
        )}
        {game.status === GameStatus.FINISHED && <Score score={player.sets} />}
        {game.status === GameStatus.RUNNING && (
          <Score score={player.fails} className="fail" />
        )}
        {game.status === GameStatus.RUNNING && <Score score={player.sets} />}
      </animated.div>
      {game.status === GameStatus.FINISHED &&
        owner &&
        player &&
        game.publicId === owner.id &&
        !player.owner && (
          <div className="kick-button" onClick={() => game.kick(player.id)}>
            Spieler entfernen
          </div>
        )}
    </animated.div>
  );
}

export const background = (
  colors: string[],
  selecting: boolean,
  disconected: boolean
) => {
  const override =
    (selecting && "rgb(198, 40, 40)") || (disconected && "#eeeeee");
  return {
    background: `linear-gradient(135deg, ${override || colors[0]} 0%, ${
      override || colors[1]
    } 100%)`,
  };
};

export default observer(Player);
