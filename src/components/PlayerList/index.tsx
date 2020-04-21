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
        <Observer key={item.id}>
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
                    ...background(
                      player.color,
                      player.selecting,
                      !player.connected
                    ),
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

export default observer(PlayerList);
