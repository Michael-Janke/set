import success from "./success.mp3";
import failure from "./failure.mp3";

export enum Sounds {
  SUCCESS = "success",
  FAILURE = "failure",
}

class SoundPool {
  sounds: { [key: string]: string } = { success, failure };
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
