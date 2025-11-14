import { Vector2 } from "./math.js"
// import { resolveTargetType } from "./target.js";

export class SpawningWave { 
    constructor(level, targetType, position, count, flipped, spawnDelay) {
        this.level = level;
        this.targetType = targetType;

        this.active = true;
        this.position = position;

        this.lastSpawn = Date.now();
        this.spawnTime = spawnDelay;

        this.count = count;
        this.infinite = this.count == -1;

        // this.template = resolveTargetType(this.targetType);
    }

    isActive() {
        return this.active && (this.count > 0 || this.infinite);
    }

    spawn() {
        if (this.count <= 0 && !this.infinite) {
            return; // Max spawns reached
        }

        this.lastSpawn = Date.now();
        this.count--;
        console.log("Spawning", this.targetType);
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

        this.levelInfo.targets.forEach((targetInfo) => {
            const spawner = new SpawningWave(
                this,
                targetInfo.type,
                new Vector2(targetInfo.xPos, targetInfo.yPos),
                targetInfo.count,
                targetInfo.flipped,
                targetInfo.spawnDelay
            )

            this.spawners.push(spawner);
        })
    }

    loadSprite(sprite) {

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