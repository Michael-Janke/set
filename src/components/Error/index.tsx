import React, { useContext } from "react";
import Game from "Model/Game";
import { observer } from "mobx-react";
import { ErrorMessages, ErrorText } from "common/messages";

import "./error.css";

const Error = ({ filter }: { filter: ErrorMessages }) => {
  const game = useContext(Game);
  if (game.error !== filter) return null;
  return <div className="error">{ErrorText.de[game.error]}</div>;
};

export default observer(Error);
