import {Game, Vector2} from "./engine.js";
import {Shotgun, Crosshair} from "./shotgun.js";

const game = new Game(false);

game.addElement(new Shotgun(256));
game.addElement(new Crosshair(96));

game.start();