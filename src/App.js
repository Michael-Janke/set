import React, { useContext } from "react";
import { observer } from "mobx-react";
import "./App.css";
import Main from "./Main";
import Game from "./Model/Game";
import Connecting from "./Connecting";
import { ErrorBoundary } from "react-error-boundary";

const MyFallbackComponent = ({ componentStack, error }) => (
  <div>
    <p>
      <strong>Fehler</strong>
    </p>
    <p>Schade</p>
    <p>
      <strong>Error:</strong> {error.toString()}
    </p>
    <p>
      <strong>Stacktrace:</strong> {componentStack}
    </p>
  </div>
);

function App() {
  const game = useContext(Game);

  return (
    <ErrorBoundary FallbackComponent={MyFallbackComponent}>
      <div className="App">
        {!game.connected && <Connecting />}
        {game.connected && <Main />}
      </div>
    </ErrorBoundary>
  );
}

export default observer(App);
