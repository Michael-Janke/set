import React from "react";
import "./index.css";
import Deck from "./Deck";
import Game from "../Model/Game";

export default function Main() {
  console.log(new Game());
  return (
    <div className="main">
      <Deck />
    </div>
  );
}
