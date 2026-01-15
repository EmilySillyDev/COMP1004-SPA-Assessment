import { Vector2, getRandomInt } from "./math.js"
import { resolveTargetType } from "./target.js";

export class SpawningWave { 
    constructor(level, spawnInfo) {
        this.level = level;
        this.targetType = spawnInfo.type;

        this.active = true;
        this.flipped = spawnInfo.flipped;
        this.position = new Vector2(spawnInfo.xPos, spawnInfo.yPos);

        this.lastSpawn = performance.now();
        this.spawnTime = spawnInfo.spawnDelay;
        this.spawnTimeDevation = spawnInfo.spawnDelayDeviation || 0;

        this.count = spawnInfo.count;
        this.infinite = this.count == -1;

        this.targetInfo = this.level.game.getTarget(this.targetType);
        this.template = resolveTargetType(this.targetInfo.type);
    }

    isActive() {
        return this.active && (this.count > 0 || this.infinite);
    }

    spawn() {
        if (this.count <= 0 && !this.infinite) {
            return; // Max spawns reached
        }

        const now = performance.now();
        this.lastSpawn = getRandomInt(now - this.spawnTimeDevation, now + this.spawnTimeDevation);
        this.count--;

        const t = new this.template(
            this.targetInfo,
            this.position
        )

        t.initProps(this);
        this.level.loadSprite(t);
    }

    update(dt) {
        if (!this.isActive()) return;
        if ((performance.now() - this.lastSpawn) < this.spawnTime) return;
        this.spawn()
    }
}

export class Level {
    constructor(game, name, levelInfo) {
        this.game = game;
        this.name = name;
        this.noAnnounce = levelInfo.noAnnounce || false;

        this.levelInfo = levelInfo;

        this.gameObjects = [];
        this.spawners = [];

        if (levelInfo.music) {
            this.music = new Audio(`assets/audio/music/${levelInfo.music.src}`);
            this.music.volume = 0.65;
            this.music.autoplay = true;
            this.music.loop = levelInfo.music.loopSrc ? false : true;
            this.music.play();

            if (levelInfo.music.loopSrc) {

                let looped = false;
                this.game.setLyrics(levelInfo.music.lyrics || []);
                this.music.onended = (e) => {
                    if (looped) return;
                    looped = true;
                    this.music2.play()

                    if (levelInfo.music.loopBPM) {
                        this.game.setMusicBump(levelInfo.music.loopBPM, 1);
                    }
                }

                this.music2 = new Audio(`assets/audio/music/${levelInfo.music.loopSrc}`);
                this.music2.volume = 0.65;
                this.music2.loop = true;
            }




            if (levelInfo.music.bpm) {
                this.game.setMusicBump(levelInfo.music.bpm, 0.5);
            }
        }

        this.levelInfo.targets.forEach((spawnInfo) => {
            const spawner = new SpawningWave(
                this,
                spawnInfo
            )

            this.spawners.push(spawner);
        })
    }

    unload() {}


    loadSprite(sprite) {
        this.gameObjects.push(sprite);
        this.game.addElement(sprite);
    }

    isComplete() {
        let complete = true;

        for (let i = 0; i < this.spawners.length; i++) {
            if (element.isActive()) {
                complete = false;
                break;
            }
        }

        return complete;
    }

    update(dt) {
        this.spawners.forEach((element) => {
            element.update(dt);
        })
    }
}