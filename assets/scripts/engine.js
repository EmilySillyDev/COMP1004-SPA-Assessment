import { Render } from "./render.js";
import { Vector2 } from "./math.js";
import { Level } from "./level.js";
import { StaticTarget } from "./target.js";

export class Game {
    constructor(debug) {
        this.debug = debug
        this.renderer = new Render(this)
        this.gameObjects = [];
        this.uiObjects = [];
        this.targetsHit = 0;
        this.combo = 0;
        this.highestCombo = 0;
        this.escaped = 0;
        this.levels = [];
        this.targets = [];
        this.currentLevel = undefined;

        this.lastUpdate = Date.now();
        this.mouseDown = false;
        this.priorMouseDown = false;
        this.mousePos = new Vector2(0, 0)

        this.musicStart = 0;
        this.bpm = 0;
        this.bumpIntensity = 0;
    }

    addCombo() {
        this.combo++;
    }

    resetCombo() {
        if (this.combo > this.highestCombo) {
            this.highestCombo = this.combo;
        }

        this.combo = 0;
    }

    setMusicBump(bpm, intensity) {
        this.bpm = bpm;
        this.bumpIntensity = intensity;
        this.musicStart = Date.now();
    }

    addTarget(targetInfo) {
        const exists = this.targets.find((t) => {
            return t.name == targetInfo.name;
        })

        this.targets.push(targetInfo);
    }

    getTarget(targetName) {
        const target = this.targets.find((t) => {
            return t.name == targetName;
        })

        if (target) return target
        throw new Error(`Target of name ${targetName} doesn't exist`)
        
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

        this.unloadLevel();

        const lvlObj = new Level(this, levelName, level);
        this.currentLevel = lvlObj;
    }

    getTargetsAtPosition(position) {
        const targets = [];

        this.gameObjects.forEach((e) => {
            if (!(e instanceof StaticTarget)) return;
            if (!e.positionInBounds(position)) return;
            targets.push(e)
        })

        return targets;
    }

    updateElement(e, dt, sendClick, sendRelease, removalQueue) {
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
            const {clientX, clientY} = event;
            this.mousePos = this.renderer.getMousePos(new Vector2(clientX, clientY));
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
                this.updateElement(e, dt, sendClick, sendRelease, removalQueue)
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
    }

    addUiElement(element) {
        element.setGame(this);
        element.created();
        this.uiObjects.push(element);
    }

    onMouseClick() {}
    onMouseRelease() {}
}

