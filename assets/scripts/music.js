import {TextLabel} from "./ui.js";
import { Vector2, getRandomInt } from "./math.js";

export class LyricLabel extends TextLabel {
    constructor(lyrics) {
        super();
        this.position = new Vector2(1920 / 2, 800);
        this.textAlign = "center";
        this.fontColour = "rgb(255, 32, 32)"
        this.static = true;
        this.bold = true;

        this.text = () => {
            return this.game.lyrics.getCurrentLyric()
        }
    }

    render(dt, ctx) {
        super.render(dt, ctx);
    }
}

export class LyricHandler {
    constructor(lyrics, track) {
        this.lyricIndex = 0;
        this.lyricTiming = 0;
        this.lyrics = lyrics;
        this.track = track
    }

    getCurrentLyric() {
        return "no lyric :(";
    }

    update(dt) {
        const seconds = this.track.currentTime;
    }
}