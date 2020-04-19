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
    enter: [{ opacity: 1, height: 50 }],
    leave: [{ opacity: 0, height: 0 }],
  });
  return (
    <div className="players">
      {transitions.map(({ item, props: { ...rest } }) => (
        <Observer>
          {() => {
            const player = game.players.find((player) => player.id === item.id);
            const owner = game.players.find((player) => player.owner);
            if (!player) return <div />;

            return (
              <animated.div className="player-container">
                <animated.div
                  className="player"
                  key={item.id}
                  style={{
                    overflow: "hidden",
                    ...rest,
                    ...background(parseInt(player.id), player.selecting),
                  }}
                >
                  <div className="name-container">
                    <span className="name">{player.name} </span>
                    {game.status === GameStatus.FINISHED && (
                      <Score score={player.sets} />
                    )}
                    {(game.status === GameStatus.LOBBY ||
                      game.status === GameStatus.FINISHED) && (
                      <ReadyIcon ready={player.ready} />
                    )}
                    {game.status === GameStatus.RUNNING && (
                      <Score score={player.sets} />
                    )}
                  </div>
                </animated.div>
                {game.status === GameStatus.FINISHED &&
                  owner &&
                  player &&
                  game.publicId === owner.id &&
                  !player.owner && (
                    <div
                      className="kick-button"
                      onClick={() => game.kick(player.id)}
                    >
                      Spieler entfernen
                    </div>
                  )}
              </animated.div>
            );
          }}
        </Observer>
      ))}
    </div>
  );
}

const background = (i: number, selecting: boolean) => {
  const selectingColor = selecting && "rgb(198, 40, 40)";
  const colors = [
    "#f6d365",
    "#fda085",
    "#f093fb",
    "#f5576c",
    "#5ee7df",
    "#b490ca",
    "#c3cfe2",
  ];
  const color1 = selectingColor || colors[(i * 2) % colors.length];
  const color2 =
    selectingColor ||
    colors[(i * 2 + 1 + Math.floor(i / colors.length)) % colors.length];
  return {
    background: `linear-gradient(135deg, ${color1} 0%, ${color2} 100%)`,
  };
};

export default observer(PlayerList);
