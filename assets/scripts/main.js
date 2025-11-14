import { Game, Sprite } from "./engine.js";
import { Vector2, getRandomInt } from "./math.js";
import { Shotgun, Crosshair } from "./shotgun.js";
import { Cat } from "./cats.js";

const game = new Game(false);

game.addElement(new Sprite(
    "/assets/images/hills.png",
    new Vector2(960, 540),
    new Vector2(1920, 1080),
    -1
));

game.addElement(new Shotgun(256));
game.addElement(new Crosshair(96));
game.addElement(new Cat(new Vector2(0, 0), 256))

game.start();

setInterval(function() {
    const c = new Cat(new Vector2(0, 512), 256);
    c.velocity = new Vector2(getRandomInt(350, 650), -getRandomInt(750, 1000));
    game.addElement(c);

    const c2 = new Cat(new Vector2(1920, 512), 256);
    c2.velocity = new Vector2(-getRandomInt(350, 650), -getRandomInt(750, 1000));
    game.addElement(c2);
}, 750)