export enum Messages {
  CARDS = "cards",
  DECK = "deck",
  SELECTED_CARDS = "selectedCards",
  STATUS = "status",
  CLICK_CARD = "clickCard",
  START_GAME = "startGame",
  CREATE_GAME = "createGame",
  JOIN_GAME = "joinGame",
  ABORT_GAME = "abortGame",
  USER_ID = "userId",
  ERROR = "error",
  GAME_ID = "gameId",
  USER_NAME = "userName",
  PLAYERS = "players",
  SET_READINESS = "setReadiness",
  READY = "ready",
}

export enum ErrorMessages {
  GAME_NOT_EXIST = "GAME_NOT_EXIST",
  PERMISSION_DENIED = "PERMISSION_DENIED",
  NOT_ALL_PLAYERS_READY = "NOT_ALL_PLAYERS_READY",
}

export const ErrorText: {
  [key: string]: { [key in keyof typeof ErrorMessages]: string };
} = {
  de: {
    GAME_NOT_EXIST: "Das Spiel existiert nicht",
    PERMISSION_DENIED: "Fehlende Berechtigung",
    NOT_ALL_PLAYERS_READY: "Nicht alle Spieler sind bereit",
  },
};
