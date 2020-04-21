import React, { useContext } from "react";
import { useTransition } from "react-spring";
import "./Player.css";
import Game from "Model/Game";
import { observer } from "mobx-react";
import Player from "components/Player";

function PlayerList() {
  const game = useContext(Game);
  const transitions = useTransition(game.players, (item) => item.id, {
    from: { opacity: 0, width: 0 },
    enter: [{ opacity: 1, width: 200 }],
    leave: [{ opacity: 0, width: 0 }],
  });
  return (
    <div className="players">
      {transitions.map(({ item, props: { ...rest } }) => (
        <Player key={item.id} id={item.id} style={rest} />
      ))}
    </div>
  );
}

export default observer(PlayerList);
