import * as ws from "ws";
import * as express from "express";

export default function websocket(ws: ws, req: express.Request) {
  ws.on("message", function(msg) {
    ws.send("got:" + msg);
  });
  console.log("socket", req);
}
