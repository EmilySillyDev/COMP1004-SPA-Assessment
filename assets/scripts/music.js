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
            return this.game.getCurrentLyric();
        }
    }

    render(dt, ctx) {
        super.render(dt, ctx);
    }
}

export class LyricHandler {
    constructor(game, lyrics, censored, track) {
        this.lyricIndex = 0;
        this.lyricTiming = 0;
        this.lastSeconds = 0;
        this.lyrics = lyrics;
        this.censored = censored;
        this.track = track;
        this.game = game;
    }

    getCurrentLyric() {
        if (this.lyrics === null) return "";
        if (this.lyrics.length === 0) return "";
        if (!this.track) return "ERROR: NO TRACK, LYRICS LOADED";

        const seconds = this.track.currentTime;
        let currentLyric = "";

        if (this.musicTiming < this.lyricTiming) {
            this.lyricIndex = 0;
            this.lyricTiming = 0;
        }

        for (let i = this.lyricIndex; i < this.lyrics.length; i++) {
            const value = this.lyrics[i];
            const reqSecs = value[1];
            let lyric = value[0];

            if (this.game.userSettings.getSetting("censored") && this.censored && reqSecs in this.censored) {
                lyric = this.censored[reqSecs]
            }

            if (seconds < reqSecs) {
                break;
            }

            currentLyric = lyric;
            this.lyricIndex = i;
            this.lyricTiming = reqSecs;
        }

        return currentLyric;
    }

    update(dt) {
        this.musicTiming = this.track?.currentTime || 0;
    }
}