import { BackgroundElement, Cloud } from "./aesthetics.js";
import { Game } from "./engine.js";
import { Vector2, getRandomInt } from "./math.js";
import { Shotgun, Crosshair } from "./shotgun.js";
import { FadeTextLabel, FPSCounter, HealthCounter, TextLabel } from "./ui.js";
import { LyricLabel } from "./music.js";
import { AVAILABLE_LEVELS } from "./level.js";
import { SettingsInput, UserSettings } from "./userdata.js";

let game;
let targetMap;
let targetDifficulty;

const settings = new UserSettings();

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

function endGame() {
    game = undefined;

    const gameContainer = document.getElementById("canvas-container");
    if (!gameContainer) {
        throw Error("Unable to find suitable game container");
    }

    gameContainer.classList.remove("active-game-container");
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

    game = new Game(settings, endGame, false);

    DEFAULT_TARGETS.forEach((t) => {
        game.addTarget(t);
    });

    game.addTarget(createStart(targetMap, targetDifficulty));
    
    AVAILABLE_LEVELS.forEach((level) => {
        game.addLevel(level);
    })

    game.start();
    game.loadLevel("menu");

    const welcomeLabel = new FadeTextLabel();
    welcomeLabel.text = "Shoot the Target to Start!";
    game.addUiElement(welcomeLabel);
}

function changeMap(mapName, difficulty) {
    targetMap = mapName || targetMap;
    targetDifficulty = difficulty || targetDifficulty;

    const label = document.getElementById("selected-map");
    if (label) {
        const name = targetMap.charAt(0).toUpperCase() + targetMap.slice(1);
        label.textContent = `Currently Selected: ${name} (${targetDifficulty.toUpperCase()})`
    }

}

changeMap("endless", "normal"); // Default map settings

const frame = document.getElementById("user-settings");
const settingsInput = new SettingsInput(frame, settings); // allow for user input

// Allows for use on onclick in HTML elements
window.startGame = startGame;
window.changeMap = changeMap;

// Extra debugging, allows for console access
// i.e. `getGame().debug = true;`
window.getGame = () => { return game; }
window.getSettings = () => { return settings; }