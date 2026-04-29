import { BackgroundElement, Cloud } from "./aesthetics.js";
import { Game } from "./engine.js";
import { Vector2, getRandomInt } from "./math.js";
import { Shotgun, Crosshair } from "./shotgun.js";
import { FadeTextLabel, FPSCounter, HealthCounter, TextLabel } from "./ui.js";
import { AVAILABLE_TRACKS, LyricLabel } from "./music.js";

let game;

const DEFAULT_TARGETS = [
    {
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
    },
    
    {
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
    },
]

const ENDLESS = {
    "name": "endless",
    "music": AVAILABLE_TRACKS["MEOW"],
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
}

const MENU_LEVEL = {
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
}

function createStart(levelName, difficulty) {
    return {
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
            "level": levelName,
            "difficulty": difficulty
        }
    }
}

function startGame() {
    const gameContainer = document.getElementById("canvas-container");
    if (!gameContainer) {
        throw Error("Unable to find suitable game container");
    }

    gameContainer.classList.add("active-game-container");

    if (game !== undefined) {
        throw Error("A game is already running.");
    }

    game = new Game(false);

    DEFAULT_TARGETS.forEach((t) => {
        game.addTarget(t);
    });

    game.addTarget(createStart("endless", "hard"));
    game.addLevel(ENDLESS);
    game.addLevel(MENU_LEVEL);
    game.start();
    game.loadLevel("menu");

    const welcomeLabel = new FadeTextLabel();
    welcomeLabel.text = "Shoot the Target to Start!";
    game.addUiElement(welcomeLabel);
}

// Allows for use on onclick in HTML elements
window.startGame = startGame;