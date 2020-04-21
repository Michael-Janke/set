import React, { useContext, useLayoutEffect, useState } from "react";
import Game from "Model/Game";
import { observer } from "mobx-react";
import "./Grandma.css";
import { ReactComponent as GrandmaSVG } from "./grandmother.svg";
import { autorun } from "mobx";

function Grandma() {
  const game = useContext(Game);
  const [oma, setOma] = useState(false);

  useLayoutEffect(
    () =>
      autorun(() => {
        setOma(game.containsOma);
      }),
    []
  );

  return (
    <div className={"grandma " + (oma ? "visible" : "")}>
      <GrandmaSVG />
    </div>
  );
}

export default observer(Grandma);
