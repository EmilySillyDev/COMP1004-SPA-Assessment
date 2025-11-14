import { Vector2, getRandomInt } from "./math.js"
import { resolveTargetType } from "./target.js";

export class SpawningWave { 
    constructor(level, spawnInfo) {
        this.level = level;
        this.targetType = spawnInfo.type;

        this.active = true;
        this.flipped = spawnInfo.flipped;
        this.position = new Vector2(spawnInfo.xPos, spawnInfo.yPos);

        this.lastSpawn = Date.now();
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

        const now = Date.now();
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
        if ((Date.now() - this.lastSpawn) < this.spawnTime) return;
        this.spawn()
    }
}

export class Level {
    constructor(game, name, levelInfo) {
        this.game = game;
        this.name = name;
        this.levelInfo = levelInfo;

        this.gameObjects = [];
        this.spawners = [];

        this.levelInfo.targets.forEach((spawnInfo) => {
            const spawner = new SpawningWave(
                this,
                spawnInfo,
                // targetInfo.type,
                // new Vector2(targetInfo.xPos, targetInfo.yPos),
                // targetInfo.count,
                // targetInfo.flipped,
                // targetInfo.spawnDelay,
                // targetInfo
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