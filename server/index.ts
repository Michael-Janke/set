import * as express from "express";
import * as expressWs from "express-ws";
import websocket from "./websocket";

let appBase = express();
let wsInstance = expressWs(appBase);
let { app } = wsInstance;

export const DEBUG = process.env.NODE_ENV !== "production";

app.use(express.static("../build"));

app.ws("/", websocket);

//start our server
app.listen(process.env.PORT || 8080, () => {
  console.log(`Server started on port ${process.env.PORT || 8080} :) :)`);
});
