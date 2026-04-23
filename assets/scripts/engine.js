import { Render } from "./render.js";
import { Vector2 } from "./math.js";
import { Level } from "./level.js";
import { StaticTarget } from "./target.js";
import { Sprite } from "./sprite.js";
import { FadeTextLabel, HealthCounter } from "./ui.js";
import { LyricHandler } from "./music.js";
import { UserSettings } from "./userdata.js";

export class Game {
    constructor(debug) {
        this.debug = debug
        this.renderer = new Render(this)
        this.gameObjects = [];
        this.uiObjects = [];
        this.targetsHit = 0;
        this.combo = 0;
        this.highestCombo = 0;
        this.health = 0;
        this.escaped = 0;
        this.levels = [];
        this.targets = [];
        this.currentLevel = undefined;
        this.difficulty = "hard";
        this.userSettings = new UserSettings();

        this.lastUpdate = performance.now();
        this.mouseDown = false;
        this.priorMouseDown = false;
        this.mousePos = new Vector2(1920 / 2, 250)

        this.musicStart = 0;
        this.bpm = 0;
        this.bumpIntensity = 0;

        this.lyrics = null;
        this.lyricIndex = 0;
        this.lyricTiming = 0;

        this.musicTiming = 0;
        this.sfxVolume = 0.5;
    }

    getCurrentLyric() {
        if (this.lyrics === null) return "";
        return this.lyrics.getCurrentLyric();
    }

    setLyrics(lyrics, censored, track) {

        if (this.lyrics) {
            delete this.lyrics;
        }

        this.lyrics = new LyricHandler(this, lyrics, censored, track);
    }

    announceGamemode() {
        if (!this.currentLevel) return;
        if (this.currentLevel.noAnnounce) return;
        const label = new FadeTextLabel();
        label.text = `${this.currentLevel.name} - ${this.difficulty}`.toUpperCase();
        label.fontColour = "#F00"
        label.textAlign = "right";
        label.position = new Vector2(1920 - 96, 128);
        this.addUiElement(label);

        const healthLabel = new HealthCounter();
        game.addUiElement(healthLabel)
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

    damagePlayer() {
        if (this.health > 0) {
            this.health -= 1;
        }

        if (this.health <= 0) {
            this.unloadLevel();
        }
    }

    setMusicBump(bpm, intensity) {
        this.bpm = bpm;
        this.bumpIntensity = intensity;
        this.musicStart = performance.now();
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

        this.setLyrics(null);
        this.setMusicBump(null);
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
        this.health = lvlObj.playerHealth;

        this.announceGamemode();
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

    gameLoop(now) {
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
            this.updateElement(e, dt, sendClick, sendRelease, removalQueue);
        });
        removalQueue.forEach((e) => {
            const idx = this.gameObjects.indexOf(e);
            if (idx !== -1) {
                this.gameObjects.splice(idx, 1);
            }
        });

        this.lyrics?.update(dt);
        this.renderer.render(now);
        requestAnimationFrame((n) => {this.gameLoop(n)});
    };

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

        this.lastUpdate = performance.now();
        requestAnimationFrame((n) => {this.gameLoop(n)});
    }

    addElement(element) {
        element.setGame(this);
        this.gameObjects.push(element);
        element.added();

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

