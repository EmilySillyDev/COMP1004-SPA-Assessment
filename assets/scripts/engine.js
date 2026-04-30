import { BackgroundElement, Cloud } from "./aesthetics.js";
import { Render } from "./render.js";
import { Vector2 } from "./math.js";
import { Level } from "./level.js";
import { StaticTarget } from "./target.js";
import { Sprite } from "./sprite.js";
import { Shotgun, Crosshair } from "./shotgun.js";
import { FadeTextLabel, HealthCounter, FPSCounter, TextLabel } from "./ui.js";
import { LyricHandler, LyricLabel } from "./music.js";
import { UserSettings } from "./userdata.js";

export class Game {
    constructor(settings, endCallback, debug) {
        this.debug = debug
        this.active = false;
        this.endFlag = false;
        this.endTimer = 5000;
        this.endCallback = endCallback;

        this.renderer = new Render(this)
        this.gameObjects = [];
        this.uiObjects = [];
        this.targetsHit = 0;
        this.combo = 0;
        this.whiffs = 0;
        this.highestCombo = 0;
        this.health = 0;
        this.escaped = 0;
        this.levels = [];

        this.targets = [];

        this.currentLevel = undefined;
        this.difficulty = "hard";
        this.userSettings = settings;

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

        this.setUpGame();
    }

    setUpGame() {
        this.addElement(new BackgroundElement(
            "assets/images/hills.png",
            new Vector2(960, 540),
            new Vector2(1920 * 1.1, 1080 * 1.1),
            1
        ));

        const clouds = [
            new Cloud(new Vector2(-278, 128), new Vector2(556, 187), 3, 100),
            new Cloud(new Vector2(850, 196), new Vector2(556, 200).multiplyScalar(0.85), 2, 75, new Vector2(-278 * 0.85, 196)),
            new Cloud(new Vector2(1500, 196), new Vector2(556, 200).multiplyScalar(1.25), 4, 50, new Vector2(-278 * 1.25, 196)),
            new Cloud(new Vector2(1200, 220), new Vector2(556, 187), 3, 100, new Vector2(-278, 220))
        ]
        
        clouds.forEach((c) => {
            this.addElement(c);
        })
        
        this.addElement(new Shotgun(256));
        this.addElement(new Crosshair(96));
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


                
    }

    showGameUI() {
        if (!this.currentLevel) return;
        if (this.currentLevel.noAnnounce) return;

        const healthLabel = new HealthCounter();
        this.addUiElement(healthLabel)

        const targetLabel = new TextLabel();
        targetLabel.position = new Vector2(96, 996)
        targetLabel.text = function(){
            return `Targets Hit: ${this.game.targetsHit}`;
        };
        
        const comboLabel = new TextLabel();
        comboLabel.position = new Vector2(96, 996 - comboLabel.fontSize - 16)
        comboLabel.text = function(){
            return `Combo: ${this.game.combo} (${Math.max(this.game.combo, this.game.highestCombo)})`;
        };
        
        const missLabel = new TextLabel();
        missLabel.position = new Vector2(1920 - 96, 996)
        missLabel.textAlign = "right";
        missLabel.text = function(){
            return `Misses: ${this.game.escaped}`;
        };

        const whiffLabel = new TextLabel();
        whiffLabel.position = new Vector2(1920 - 96, 996 - whiffLabel.fontSize - 16);
        whiffLabel.textAlign = "right";
        whiffLabel.text = function(){
            return `Whiffs: ${this.game.whiffs}`;
        };

        const lyricLabel = new LyricLabel();

        this.addUiElement(whiffLabel);
        this.addUiElement(targetLabel);
        this.addUiElement(comboLabel);
        this.addUiElement(missLabel);
        this.addUiElement(lyricLabel);
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

    whiffShot() {
        this.whiffs++;
    }

    damagePlayer() {
        if (this.health > 0) {
            this.health -= 1;
        }

        if (this.health <= 0) {
            this.userDied();
            this.unloadLevel();
        }
    }

    userDied() {
        const stats = {
            Hits: this.targetsHit,
            Whiffs: this.whiffs,
            Misses: this.escaped,
            HighestCombo: this.highestCombo
        }

        // We need to display these stats to the user.
        // And then, after a few seconds, kill the game
        this.endFlag = true;

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

    loadLevel(levelName, difficulty) {

        // difficulty = difficulty || "hard";
        this.difficulty = difficulty || "hard";

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
        this.showGameUI();
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

        if (this.endFlag) {
            this.endTimer -= dt;
            if (this.endTimer <= 0) {
                this.stop();
            }
        }

        if (this.active) {
            requestAnimationFrame((n) => {this.gameLoop(n)});
        }
    };

    start() {
        if (this.active) {
            throw Error("The game is already active.");
        }

        this.active = true;

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

    stop() {
        if (!this.active) return;
        this.unloadLevel();

        this.gameObjects.forEach((element) => {
            element.destroy();
        })

        this.active = false;

        if (this.endCallback) {
            this.endCallback();
        }
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

