import { Game } from "./engine.js";
import { Vector2, getRandomInt } from "./math.js";
import { Shotgun, Crosshair } from "./shotgun.js";
import { Sprite } from "./sprite.js";

const game = new Game(false);

game.addElement(new Sprite(
    "/assets/images/hills.png",
    new Vector2(960, 540),
    new Vector2(1920 * 1.1, 1080 * 1.1),
    -1
));

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
        "minVelX": 350,
        "maxVelX": 650,
        "minVelY": 750,
        "maxVelY": 1000,
        "gravity": 1
    }
})

game.addTarget({
    "name": "StartTarget",
    "type": "Button",
    
    "size": new Vector2(256, 256),

    "assets": {
        "images": ["images/target.png"]
    },
        
    "targetProps": {
        "spreadX": 0,
        "spreadY": 0,
        "level": "endless"
    }
})

game.addLevel({
    "name": "endless",
    "targets": [
        {
            "type": "Cat",
            "xPos": 0,
            "yPos": 512,
            "count": -1,
            "flipped": false,
            "spawnDelay": 750,
            "spawnDelayDeviation": 150
        },

        {
            "type": "Cat",
            "xPos": 1920,
            "yPos": 512,
            "count": -1,
            "flipped": true,
            "spawnDelay": 750,
            "spawnDelayDeviation": 150
        }
    ]
})

game.addLevel({
    "name": "menu",
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

// setInterval(function() {
//     const c = new Cat(new Vector2(0, 512), 256);
//     c.velocity = new Vector2(getRandomInt(350, 650), -getRandomInt(750, 1000));
//     game.addElement(c);

//     const c2 = new Cat(new Vector2(1920, 512), 256);
//     c2.velocity = new Vector2(-getRandomInt(350, 650), -getRandomInt(750, 1000));
//     game.addElement(c2);
// }, 750)