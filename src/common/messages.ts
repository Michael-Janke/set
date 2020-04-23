export enum Messages {
  CARDS = "cards",
  DECK = "deck",
  SELECTED_CARDS = "selectedCards",
  STATUS = "status",
  CLICK_CARD = "clickCard",
  START_GAME = "startGame",
  END_GAME = "endGame",
  CREATE_GAME = "createGame",
  JOIN_GAME = "joinGame",
  ABORT_GAME = "abortGame",
  LEAVE_GAME = "leaveGame",
  USER_ID = "userId",
  ERROR = "error",
  GAME_ID = "gameId",
  USER_NAME = "userName",
  PUBLIC_ID = "publicId",
  PLAYERS = "players",
  SET_READINESS = "setReadiness",
  READY = "ready",
  KICK = "kick",
  SELECTED_SET = "selectedSet",
  HIGHLIGHTED_CARDS = "highlightedCards",
  HIGHLIGHT_CARDS = "highlightCards",
  OWNER = "owner",
  TIPP_AVAILABLE = "tippAvailable",
  SEND_TIPP = "sendTipp",
  CONTAINS_OMA = "containsOma",
  ALL_PLAYERS_READY = "allPlayersReady",
  COUNTDOWN = "countdown",
}

export enum ErrorMessages {
  GAME_NOT_EXIST = "GAME_NOT_EXIST",
  PERMISSION_DENIED = "PERMISSION_DENIED",
  NOT_ALL_PLAYERS_READY = "NOT_ALL_PLAYERS_READY",
  CLICK_IS_BLOCKED = "CLICK_IS_BLOCKED",
}

export const ErrorText: {
  [key: string]: { [key in keyof typeof ErrorMessages]: string };
} = {
  de: {
    GAME_NOT_EXIST: "Das Spiel existiert nicht",
    PERMISSION_DENIED: "Fehlende Berechtigung",
    NOT_ALL_PLAYERS_READY: "Nicht alle Spieler sind bereit",
    CLICK_IS_BLOCKED: "Du musst leider warten",
  },
};
