import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

global.MutationObserver = class {
  constructor(callback) {}
  disconnect() {}
  observe(element, initObject) {}
};

global.ResizeObserver = class {
  constructor(callback) {}
  disconnect() {}
  observe(element, initObject) {}
};

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});
