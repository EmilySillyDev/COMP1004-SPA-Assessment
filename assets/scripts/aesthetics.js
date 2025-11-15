import { Vector2 } from "./math.js";
import { Sprite } from "./sprite.js";

export class BackgroundElement extends Sprite {
    constructor(path, position, size, zindex) {
        super(path, position, size, -zindex)
        this.impulseMultiplier = 0.25;
    }
}

export class MovingBackgroundElement extends BackgroundElement {
    constructor(path, position, size, zindex, speed, wraps, ogPos) {
        super(path, position, size, zindex);
        this.speed = speed;
        this.wraps = wraps;
        this.ogPos = ogPos || this.position;
    }

    update(dt, mousePos) {
        const move = this.speed * (dt / 1000);
        this.position = new Vector2(this.position.x + move, this.position.y);

        if (this.position.x > (1920 + (this.size.x / 2))) {
            this.position = this.ogPos;
        }

        super.update(dt, mousePos)
    }
}

export class Cloud extends MovingBackgroundElement {
    constructor(position, size, zindex, speed, ogPos) {
        super("/assets/images/cloud.png", position, size, zindex, speed, true, ogPos)
        this.static = true;
    }
}

export class ShotgunShell extends Sprite {
    constructor(position, size, zindex) {
        super("/assets/images/shell.png", position, size, zindex);
        this.velocity = new Vector2(0, 0);
        this.angularVelocity = 0;
        this.gravity = 2;
        this.shellScale = 0.65
        this.ogSize = this.size;
        this.size = this.ogSize.multiplyScalar(this.shellScale);
    }

    update(dt, mousepos) {

        this.shellScale = Math.min(this.shellScale + dt / 1000, 1.1)
        this.size = this.ogSize.multiplyScalar(this.shellScale);

        const grav = this.gravity * 981;
        this.velocity = this.velocity.add(new Vector2(0, grav * (dt / 1000)));
        this.position = this.position.add(this.velocity.multiplyScalar(dt/1000));
        this.rotation += this.angularVelocity * (dt / 1000);

        if (this.position.y > (1080 + this.size.y)) {
            this.destroy();
        }

        super.update(dt, mousepos);
    }
}
