import React, { useContext } from "react";
import { useTransition, animated } from "react-spring";
import "./Player.css";
import Game from "Model/Game";
import { observer, Observer } from "mobx-react";
import ReadyIcon from "components/ReadyIcon";
import { GameStatus } from "common/gameStatus";
import Score from "components/Score";

function PlayerList() {
  const game = useContext(Game);
  const transitions = useTransition(game.players, (item) => item.id, {
    from: {
      opacity: 0,
      height: 0,
    },
    enter: [{ opacity: 1, height: 80 }],
    leave: [{ opacity: 0, height: 0 }],
  });
  return (
    <div className="players">
      {transitions.map(({ item, props: { ...rest } }) => (
        <animated.div className="player-container">
          <animated.div
            className="player"
            key={item.id}
            style={{
              overflow: "hidden",
              ...rest,
              ...background(parseInt(item.id)),
            }}
          >
            <ConnectedItem id={item.id} />
          </animated.div>
        </animated.div>
      ))}
    </div>
  );
}

const background = (i: number) => {
  const colors = [
    "#f6d365",
    "#fda085",
    "#f093fb",
    "#f5576c",
    "#5ee7df",
    "#b490ca",
    "#c3cfe2",
  ];
  const color1 = colors[(i * 2) % colors.length];
  const color2 =
    colors[(i * 2 + 1 + Math.floor(i / colors.length)) % colors.length];

  return {
    background: `linear-gradient(135deg, ${color1} 0%, ${color2} 100%)`,
  };
};

const ConnectedItem = observer(({ id }: { id: string }) => {
  const game = useContext(Game);
  const player = game.players.find((player) => player.id === id);
  if (!player) return null;
  return (
    <div className="name-container">
      <span className="name">{player.name} </span>
      {game.status === GameStatus.LOBBY && <ReadyIcon ready={player.ready} />}
      {game.status === GameStatus.RUNNING && (
        <Score score={player.score.sets} />
      )}
      {game.status === GameStatus.FINISHED && (
        <Score score={player.score.sets} />
      )}
    </div>
  );
});

export default observer(PlayerList);
