import { BackgroundElement, Cloud } from "./aesthetics.js";
import { Game } from "./engine.js";
import { Vector2, getRandomInt } from "./math.js";
import { Shotgun, Crosshair } from "./shotgun.js";
import { FadeTextLabel, FPSCounter, HealthCounter, TextLabel } from "./ui.js";

import { LyricLabel } from "./music.js";

const game = new Game(false);
window.game = game;

game.addElement(new BackgroundElement(
    "/assets/images/hills.png",
    new Vector2(960, 540),
    new Vector2(1920 * 1.1, 1080 * 1.1),
    1
));

const clouds = [
    new Cloud(new Vector2(-278, 128), new Vector2(556, 187), 3, 100),
    new Cloud(new Vector2(850, 196), new Vector2(556, 200).multiplyScalar(0.85), 2, 75, new Vector2(-278 * 0.85, 196)),
    new Cloud(new Vector2(1500, 196), new Vector2(556, 200).multiplyScalar(1.25), 4, 50, new Vector2(-278 * 1.25, 196)),
    new Cloud(new Vector2(1200, 220), new Vector2(556, 187), 3, 100, new Vector2(-278, 220))
]

clouds.forEach((c) => {
    game.addElement(c);
})

game.addElement(new Shotgun(256));
game.addElement(new Crosshair(96));
    
game.addTarget({
    "name": "Target",
    "type": "Static",
    
    "size": new Vector2(256, 256),

    "assets": {
        "images": ["images/target.png"]
    },
        
    "targetProps": {
        "spreadX": 1664,
        "spreadY": 384
    }
})

game.addTarget({
    "name": "Cat",
    "type": "Physics",
    
    "size": new Vector2(256, 256),

    "assets": {
        "images": [
            "images/cats/cat1.png",
            "images/cats/cat2.png",
            "images/cats/cat3.png",
            "images/cats/cat4.png",
            "images/cats/cat5.png"
        ]
    },

    "targetProps": {
        "minVelX": 450,
        "maxVelX": 850,
        "minVelY": 750,
        "maxVelY": 1250,
        "gravity": 1
    }
})

game.addTarget({
    "name": "StartTarget",
    "type": "Button",
    
    "size": new Vector2(256, 256),

    "assets": {
        "images": ["images/target.png"],
        "killsound": "audio/shatter.wav"
    },
        
    "targetProps": {
        "spreadX": 0,
        "spreadY": 0,
        "level": "endless"
    }
})

game.addLevel({
    "name": "endless",
    // "playerHealth": 87231638671263,
    // "music": {
    //     "src": "airwaves.wav",
    //     "name": "AIRWAVES",
    //     "author": "Toby Fox",
    //     "bpm": 140,
    // },

    "music": {
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
    },

    "targets": [
        {
            "type": "Cat",
            "xPos": -256,
            "yPos": 800,
            "count": -1,
            "flipped": false,
            "spawnDelay": 750,
            "spawnDelayDeviation": 150
        },

        {
            "type": "Cat",
            "xPos": 1920 + 256,
            "yPos": 800,
            "count": -1,
            "flipped": true,
            "spawnDelay": 750,
            "spawnDelayDeviation": 150
        }
    ]
})

game.addLevel({
    "name": "menu",
    "noAnnounce": true,

    "targets": [
        {
            "type": "StartTarget",
            "xPos": 960,
            "yPos": 512,
            "count": 1,
            "flipped": false,
            "spawnDelay": 0,
        }
    ]
})

game.start();
game.loadLevel("menu")

const fpsCounter = new FPSCounter();

const welcomeLabel = new FadeTextLabel();
welcomeLabel.text = "Shoot the Target to Start!";

const targetLabel = new TextLabel();
targetLabel.position = new Vector2(96, 996)
targetLabel.text = function(){
    return `Targets Hit: ${game.targetsHit}`;
};

const comboLabel = new TextLabel();
comboLabel.position = new Vector2(96, 996 - comboLabel.fontSize - 16)
comboLabel.text = function(){
    return `Combo: ${game.combo} (${Math.max(game.combo, game.highestCombo)})`;
};

const missLabel = new TextLabel();
missLabel.position = new Vector2(1920 - 96, 996)
missLabel.textAlign = "right";
missLabel.text = function(){
    return `Misses: ${game.escaped}`;
};


const lyricLabel = new LyricLabel();

// const lyricLabel = new TextLabel();
// lyricLabel.position = new Vector2(1920 / 2, 800);
// lyricLabel.textAlign = "center";
// lyricLabel.fontColour = "rgb(255, 32, 32)"
// lyricLabel.static = true;
// lyricLabel.bold = true;
// lyricLabel.text = function() {
//     return game.getCurrentLyric();
// }

game.addUiElement(welcomeLabel);
game.addUiElement(targetLabel);
game.addUiElement(comboLabel);
game.addUiElement(missLabel);
game.addUiElement(fpsCounter);
game.addUiElement(lyricLabel)