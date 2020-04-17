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
}

export enum ErrorMessages {
  GAME_NOT_EXIST = "GAME_NOT_EXIST",
}

export const ErrorText: {
  [key: string]: { [key in keyof typeof ErrorMessages]: string };
} = {
  de: {
    GAME_NOT_EXIST: "Das Spiel existiert nicht",
  },
};
