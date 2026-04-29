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

export const AVAILABLE_TRACKS = {
    MEOW: {
        "src": "Meow Colon Three - Intro.ogg",
        "name": "Meow Colon Three",
        "author": "SuzuDumb",
        "bpm": 189 / 2,

        "loopSrc": "Meow Colon Three - Loop.ogg",
        "loopBPM": 189,

        "censoredLyrics": {
            [22.304]: "AY LIL ##### COME LOOK AT THESE PLAYS",
            [24.824]: "####### UP THE STUDI'",
            [27.4]: "####BOY MAD THAT BROKIE GETTIN' PAID",
            [32.43]: "ALL THESE ####### PUSSIES ON MY ####",
            [35]: "HOTTEST MOTHER###### IN THE CRIB",
            [36.525]: "SWEAR THAT #### ON GANG",
            [37.554]: "I KNOW YOU MET YO ####### ON MY ####",
            [39.072]: "",
            [40.064]: "",
            [40.770]: "",

            [71.123 + 22.304]: "AY LIL ##### COME LOOK AT THESE PLAYS",
            [71.123 + 24.824]: "####### UP THE STUDI'",
            [71.123 + 27.4]: "####BOY MAD THAT BROKIE GETTIN' PAID",
            [71.123 + 32.43]: "ALL THESE ####### PUSSIES ON MY ####",
            [71.123 + 35]: "HOTTEST MOTHER###### IN THE CRIB",
            [71.123 + 36.525]: "SWEAR THAT #### ON GANG",
            [71.123 + 37.554]: "I KNOW YOU MET YO ####### ON MY ####",
            [71.123 + 39.072]: "",
            [71.123 + 40.064]: "",
            [71.123 + 40.770]: ""
        },

        "lyrics": [
            ["GRAB THE WHOLE EIGHTH", 20.402],
            ["TAKE IT TO THE FACE", 21.402],
            ["AY LIL BITCH COME LOOK AT ALL THESE PLAYS", 22.304],
            ["THAT THE GREMLIN MADE", 23.824],
            ["FUCKIN' UP THE STUDI'", 24.824],
            ["WHERE I SAY", 25.7],
            ["ALL THE THINGS YOU HATE", 26.453],
            ["FUCKBOY MAD THAT BROKIE GETTIN' PAID", 27.4],
            ["YEAH I'M MAKIN' CHANGE", 29.0],
            ["(WOO)", 30.22],
            ["I'M IN A CAGE LIKE ITS MMA", 30.6],
            ["ALL THESE FUCKIN' PUSSIES ON MY DICK", 32.43],
            ["IMMA LET EM' HANG", 34.068],
            ["HOTTEST MOTHERFUCKER IN THE CRIB", 35],
            ["SWEAR THAT SHIT ON GANG", 36.525],
            ["I KNOW YOU MET YO BITCHES ON MY DICK", 37.554],
            ["IMMA LEAVE HER GAPED", 39.072],
            ["OPEN ON MY", 40.064],
            ["COUCH", 40.770],
            ["", 43],

            ["GRAB THE WHOLE EIGHTH", 71.123 + 20.402],
            ["TAKE IT TO THE FACE", 71.123 + 21.402],
            ["AY LIL BITCH COME LOOK AT ALL THESE PLAYS", 71.123 + 22.304],
            ["THAT THE GREMLIN MADE", 71.123 + 23.824],
            ["FUCKIN' UP THE STUDI'", 71.123 + 24.824],
            ["WHERE I SAY", 71.123 + 25.7],
            ["ALL THE THINGS YOU HATE", 71.123 + 26.453],
            ["FUCKBOY MAD THAT BROKIE GETTIN' PAID", 71.123 + 27.4],
            ["YEAH I'M MAKIN' CHANGE", 71.123 + 29.0],
            ["(WOO)", 71.123 + 30.22],
            ["I'M IN A CAGE LIKE ITS MMA", 71.123 + 30.6],
            ["ALL THESE FUCKIN' PUSSIES ON MY DICK", 71.123 + 32.43],
            ["IMMA LET EM' HANG", 71.123 + 34.068],
            ["HOTTEST MOTHERFUCKER IN THE CRIB", 71.123 + 35],
            ["SWEAR THAT SHIT ON GANG", 71.123 + 36.525],
            ["I KNOW YOU MET YO BITCHES ON MY DICK", 71.123 + 37.554],
            ["IMMA LEAVE HER GAPED", 71.123 + 39.072],
            ["OPEN ON MY", 71.123 + 40.064],
            ["COUCH", 71.123 + 40.770],
            ["", 71.123 + 43]
        ]
    }
}