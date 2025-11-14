import { Render } from "./render.js";
import { Vector2 } from "./math.js";
import { Level } from "./level.js";

export class Sprite { 
    constructor(path, position, size, zindex) {
        this.imagePath = path;
        this.destroying = false;
        
        this.position = position || new Vector2(32, 32);
        this.size = size || new Vector2(32, 32);
        this.rotation = 0;
        this.flipX = false;
        this.flipY = false;
        this.zindex = zindex

        this.anchorPoint = new Vector2(0.5, 0.5);
        this.spriteOffset = new Vector2;
        this.visible = true;

        this.element = new Image(size.x, size.y);
        this.element.src = this.imagePath;
        this.element.classList.add("sprite");
    }

    setGame(g) { this.game = g; }
    isASprite() { return true; }
    onMouseClick() {}
    onMouseRelease() {}

    destroy() {
        if (this.destroying) {return;}
        this.destroying = true;
    }
    
    update(dt, mousePos) {

    }

    render(dt) {

    }

    addToBody() {

    }
}

export class PhysicsSprite extends Sprite {
    constructor(path, position, size, zindex) {
        super(path, position, size, zindex);
        this.velocity = new Vector2(0, 0);
        this.gravity = 1;
    }

    update(dt) {
        const grav = this.gravity * 981;
        this.velocity = this.velocity.add(new Vector2(0, grav * (dt / 1000)));
        this.position = this.position.add(this.velocity.multiplyScalar(dt/1000));
    }
}

export class Game {
    constructor(debug) {
        this.debug = debug
        this.renderer = new Render(this)
        this.gameObjects = [];
        this.levels = [];
        this.currentLevel = undefined;

        this.lastUpdate = Date.now();
        this.mouseDown = false;
        this.priorMouseDown = false;
        this.mousePos = new Vector2(0, 0)
    }

    addLevel(level) {
        const exists = this.levels.find((l) => {
            return l.name == level.name;
        })

        if (exists) {
            console.error(`Level of name ${level.name} already exists`);
            return;
        }

        this.levels.push(level)
    }

    unloadLevel() {
        if (!this.currentLevel) return;

        this.currentLevel.unload();
        this.currentLevel = null;
    }

    loadLevel(levelName) {
        const level = this.levels.find((l) => {
            return l.name == levelName;
        })

        if (!level) {
            console.error(`Level of name ${levelName} doesn't exist`);
            return
        }

        const lvlObj = new Level(this, levelName, level);
        this.currentLevel = lvlObj;
    }

    start() {
        document.addEventListener("mousedown", (e) => {
            if (e.button != 0) {return;}
            this.mouseDown = true;
        })

        document.addEventListener("mouseup", (e) => {
            if (e.button != 0) {return;}
            this.mouseDown = false;
        })

        document.onpointermove = (event) => {
            // const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
            // const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
            // var rect = canvas.getBoundingClientRect();
            const {clientX, clientY} = event;
            this.mousePos = this.renderer.getMousePos(new Vector2(clientX, clientY));

            // this.mousePos = new Vector2(
            //     clientX / vw * 1920,
            //     clientY / vh * 1080
            // );
        };

        setInterval(() => {
            const now = Date.now();
            const dt = now - this.lastUpdate;
            this.lastUpdate = now;

            if (this.currentLevel) {
                this.currentLevel.update(dt);
            }

            const sendClick = this.mouseDown && !this.priorMouseDown;
            const sendRelease = !this.mouseDown && this.priorMouseDown;
            this.priorMouseDown = this.mouseDown;
            
            const removalQueue = [];

            this.gameObjects.forEach((e) => {
                if (e.destroying) {
                    removalQueue.push(e);
                    return;
                }

                e.update(dt, this.mousePos);

                if (sendClick) {
                    e.onMouseClick(this.mousePos);
                } else if (sendRelease) {
                    e.onMouseRelease(this.mousePos);
                }
            })

            removalQueue.forEach((e) => {
                const idx = this.gameObjects.indexOf(e);
                if (idx) {
                    this.gameObjects.splice(idx, 1);
                }
            })

        }, 1);

        this.renderer.render(performance.now())
    }

    addElement(element) {
        element.setGame(this);
        this.gameObjects.push(element);

        this.gameObjects.sort((a, b) => {
            return a.zindex - b.zindex;
        })

        element.addToBody();
    }

    onMouseClick() {}
    onMouseRelease() {}
}

