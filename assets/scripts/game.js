import Shotgun from "./shotgun.js";

class Game {
    constructor() {
        this.shotgun = new Shotgun();
    }

    start() {
        document.addEventListener("mousedown", () => {
            this.onClick();
        })
    }

    onClick() {
        console.log("shooting");
        this.shotgun.shoot();
    }
}

export default Game;