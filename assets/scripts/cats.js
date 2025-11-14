import { PhysicsSprite } from "./engine.js";
import { Vector2, getRandomInt } from "./math.js";



export class Cat extends PhysicsSprite {
    constructor(position, size) {
        const catIdx = getRandomInt(1, 5);

        super(
            `assets/images/cats/cat${catIdx}.png`,
            position,
            new Vector2(size, size),
            0
        );

        // this.gravity = 0.5;
        this.die = new Audio("assets/audio/killsound.wav");
        this.die.volume = 1;
        this.alive = true;
        this.catIdx = catIdx;
    }

    onMouseClick(mousePos) {
        if (!this.alive) { return; }

        const leftPos = this.position.x - this.size.x / 2;
        const rightPos = this.position.x + this.size.x / 2;
        const bottomPos = this.position.y + this.size.x / 2;
        const topPos = this.position.y - this.size.y / 2;

        const inX = mousePos.x >= leftPos && mousePos.x <= rightPos;
        const inY = mousePos.y >= topPos && mousePos.y <= bottomPos;

        if (!inX) { return; }
        if (!inY) { return; }

        this.die.play();
        this.alive = false;
        this.visible = false;
        this.destroy();
    }

    render(dt) {
        super.render(dt);
    }
}