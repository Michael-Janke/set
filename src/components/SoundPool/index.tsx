import success from "./success.mp3";
import failure from "./failure.mp3";
import error from "./error.mp3";
import click from "./click.mp3";
import deck from "./deck.mp3";
import endGame from "./endGame.mp3";

export enum Sounds {
  SUCCESS = "success",
  FAILURE = "failure",
  ERROR = "error",
  CLICK = "click",
  DECK = "deck",
  ENDGAME = "endGame",
}

class SoundPool {
  sounds: { [key in Sounds]: string } = {
    success,
    failure,
    error,
    click,
    deck,
    endGame,
  };
  player: { [key: string]: HTMLAudioElement } = {};
  initiated = false;
  init() {
    if (this.initiated) return;
    Object.entries(this.sounds).forEach(
      ([key, url]) => (this.player[key] = new Audio(url))
    );
    this.initiated = true;
  }

  play(sound: Sounds) {
    if (!this.initiated) this.init();
    if (!this.player[sound]) return console.error(sound, " not available");
    this.player[sound].currentTime = 0;
    this.player[sound].play();
    return this.player[sound];
  }
}

const SoundPoolInstance = new SoundPool();
export default SoundPoolInstance;
