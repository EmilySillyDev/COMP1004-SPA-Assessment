import { Render } from "./render.js";

export class Vector2 {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    add(other) {
        return new Vector2(
            this.x + other.x,
            this.y + other.y
        );
    }

    sub(other) {
        return new Vector2(
            this.x - other.x,
            this.y - other.y
        );
    }

    multiply(other) {
        return new Vector2(
            this.x * other.x,
            this.y * other.y
        );
    }

    multiplyScalar(mult) {
        return new Vector2(
            this.x * mult,
            this.y * mult
        );
    }

    dot(other) {
        return (this.x * other.x) + (this.y * other.y)
    }
}

// Javascript implementation of Nevermoore engine's spring module
// Uses Hooke's law to make realistic spring/recoil
export class Spring {
    constructor() {
        this.position = 0;
        this.velocity = 0
        this.target = 0;
        this.speed = 1;
        this.damper = 1;
        this.time = Date.now();
    }

    setPosition(position) {
        const now = Date.now();
        const {pos, vel} = this.positionVelocity(now);
        this.position = position;
        this.velocity = vel;
        this.time = now;
    }

    getPosition() {
        return this.positionVelocity(Date.now()).pos;
    }

    setVelocity(velocity) {
        const now = Date.now();
        const {pos, vel} = this.positionVelocity(now);
        this.position = pos;
        this.velocity = velocity;
        this.time = now;
    }

    getVelocity() {
        return this.positionVelocity(Date.now()).vel;
    }

    setTarget(target) {
        const now = Date.now();
        const {pos, vel} = this.positionVelocity(now);
        this.position = pos;
        this.velocity = vel;
        this.target = target;
        this.time = now;
    }

    getTarget() {
        return this.target;
    }

    setSpeed(speed) {
        const now = Date.now();
        const {pos, vel} = this.positionVelocity(now);
        this.position = pos;
        this.velocity = vel;
        this.speed = speed < 0 ? 0 : speed;
        this.time = now;
    }

    getSpeed() {
        return this.speed;
    }

    setDamper(damper) {
        const now = Date.now();
        const {pos, vel} = this.positionVelocity(now);
        this.position = pos;
        this.velocity = vel;
        this.damper = damper
        this.time = now;
    }

    getDamper() {
        return this.speed;
    }

    impulse(velocity) {
        this.setVelocity(this.getVelocity() + velocity)
        // this.velocity += velocity;
    }

    positionVelocity(now) {
        const p0 = this.position;
        const v0 = this.velocity;

        const dt = (now - this.time) / 1000;
        const t = this.speed * dt;
        const damp2 = this.damper * this.damper;

        let h, cos, sin;

        // Dampering Calculation
        if (damp2 < 1) {
            h = Math.sqrt(1 - damp2);
            const exp = Math.exp(-this.damper * t);
            cos = exp * Math.cos(h * t);
            sin = exp * Math.sin(h * t);
        } else if (damp2 == 1) {
            h = 1;
            const exp = Math.exp(-this.damper * t) / h;
            cos = exp;
            sin = exp * t;
        } else {
            h = Math.sqrt(damp2 - 1);
            const u = Math.exp((-this.damper + h) * t) / (2 * h);
		    const v = Math.exp((-this.damper - h) * t) / (2 * h);
		    cos = u + v;
            sin = u - v;
        }

        // Position
        const a0 = (h * cos) + (this.damper * sin);
        const a1 = 1 - a0;
        const a2 = sin / this.speed;

        // Velocity
        const b0 = (-this.speed * sin);
        const b1 = (this.speed * sin);
        const b2 = (h * cos) - (this.damper * sin);

        // return Position, Velocity
        return {
            pos: a0 * p0 + a1 * this.target + a2 * v0,
            vel: b0 * p0 + b1 * this.target + b2 * v0
        }
    }
}

export class Sprite { 
    constructor(path, position, size, zindex) {
        this.imagePath = path;
        
        this.position = position || new Vector2(32, 32);
        this.size = size || new Vector2(32, 32);
        this.rotation = 0;
        this.flipX = false;
        this.flipY = false;

        this.anchorPoint = new Vector2(0.5, 0.5);
        this.spriteOffset = new Vector2;
        this.visible = true;

        this.element = new Image(size.x, size.y);
        this.element.src = this.imagePath;
        this.element.classList.add("sprite");
        this.element.style.zIndex = zindex;
    }

    isASprite() { return true; }
    onMouseClick() {}
    onMouseRelease() {}

    update(dt, mousePos) {

    }

    render(dt) {
        // this.element.style.top = this.position.y - (this.size.y * this.anchorPoint.y) + "px";
        // this.element.style.left = this.position.x - (this.size.x * this.anchorPoint.x) + "px";
        // this.element.style.display = this.visible ? "block" : "none";
        // this.element.style.transform = `scale(${this.flipX ? -1 : 1}, ${this.flipY ? -1 : 1}) rotate(${this.rotation}rad) `;
        // this.element.style.transformOrigin = `${this.anchorPoint.x * 100}% ${this.anchorPoint.y * 100}%`

    }

    addToBody() {
        // document.body.appendChild(this.element);
    }
}

export class Game {
    constructor(debug) {
        this.debug = debug
        this.renderer = new Render(this)
        this.gameObjects = [];

        this.lastUpdate = Date.now();
        this.mouseDown = false;
        this.priorMouseDown = false;
        this.mousePos = new Vector2(0, 0)
    }

    start() {
        document.addEventListener("mousedown", () => {
            this.mouseDown = true;
        })

        document.addEventListener("mouseup", () => {
            this.mouseDown = false;
        })

        document.onpointermove = (event) => {
            const {clientX, clientY} = event;
            this.mousePos = new Vector2(clientX, clientY);
        };

        setInterval(() => {
            const now = Date.now();
            const dt = now - this.lastUpdate;

            const sendClick = this.mouseDown && !this.priorMouseDown;
            const sendRelease = !this.mouseDown && this.priorMouseDown;
            this.priorMouseDown = this.mouseDown;

            this.gameObjects.forEach((e) => {
                e.update(dt, this.mousePos);

                if (sendClick) {
                    e.onMouseClick(this.mousePos);
                } else if (sendRelease) {
                    e.onMouseRelease(this.mousePos);
                }
            })

            this.renderer.render()
        }, 1);
    }

    addElement(element) {
        this.gameObjects.push(element);
        element.addToBody();
    }

    onMouseClick() {}
    onMouseRelease() {}
}

