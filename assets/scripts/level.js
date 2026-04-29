import { Vector2, getRandomInt } from "./math.js"
import { resolveTargetType } from "./target.js";
import { AVAILABLE_TRACKS } from "./music.js";

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

        this.activeTargets = [];
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
        this.activeTargets.push(t);
    }

    stop() {
        this.active = false;

        this.activeTargets.forEach(element => {
            element.destroy()
        });

        this.activeTargets = [];
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
        this.playerHealth = levelInfo.playerHealth || 20;

        this.levelInfo = levelInfo;

        this.gameObjects = [];
        this.spawners = [];

        if (levelInfo.music) {
            this.music = new Audio(`/assets/audio/music/${levelInfo.music.src}`);
            this.music.volume = 0.45 * (this.game.userSettings.getSetting("musVolume") / 100);
            this.music.autoplay = true;
            this.music.loop = levelInfo.music.loopSrc ? false : true;
            this.music.play();

            if (levelInfo.music.loopSrc) {

                let looped = false;
                this.music.onended = (e) => {
                    if (looped) return;
                    looped = true;
                    this.music2.play()
                    
                    if (levelInfo.music.loopBPM) {
                        this.game.setMusicBump(levelInfo.music.loopBPM, 1);
                    }
                }
                
                this.music2 = new Audio(`/assets/audio/music/${levelInfo.music.loopSrc}`);
                this.music2.volume = 0.45 * (this.game.userSettings.getSetting("musVolume") / 100);
                this.music2.loop = true;

                this.game.setLyrics(levelInfo.music.lyrics || [], levelInfo.music.censoredLyrics || {}, this.music2);
            } else {
                this.game.setLyrics(levelInfo.music.lyrics || [], levelInfo.music.censoredLyrics || {}, this.music);
            }

            if (levelInfo.music.bpm) {
                this.game.setMusicBump(levelInfo.music.bpm, 0.5);
            }
        }

        const targets = this.levelInfo.targets[this.game.difficulty] || this.levelInfo.targets["hard"];

        if (targets) {
            targets.forEach((spawnInfo) => {
                const spawner = new SpawningWave(
                    this,
                    spawnInfo
                )

                this.spawners.push(spawner);
            })
        }


    }

    unload() {
        this.spawners.forEach((element) => {
            element.stop();
        })

        if (this.music) {
            this.music.pause();
            this.music.currentTime = 0;
        }

        if (this.music2) {
            this.music2.pause();
            this.music2.currentTime = 0;
        }

    }


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

export const AVAILABLE_LEVELS = [
    {
        "name": "menu",
        "noAnnounce": true,

        "targets": {
            hard: [
                {
                    "type": "StartTarget",
                    "xPos": 960,
                    "yPos": 512,
                    "count": 1,
                    "flipped": false,
                    "spawnDelay": 0,
                }
            ]
        }
    },

    {
        "name": "endless",
        "music": AVAILABLE_TRACKS["MEOW"],
        "targets": {
            impossible: [
                {
                    "type": "Cat",
                    "xPos": -256,
                    "yPos": 800,
                    "count": -1,
                    "flipped": false,
                    "spawnDelay": 400,
                    "spawnDelayDeviation": 100
                },
        
                {
                    "type": "Cat",
                    "xPos": 1920 + 256,
                    "yPos": 800,
                    "count": -1,
                    "flipped": true,
                    "spawnDelay": 400,
                    "spawnDelayDeviation": 100
                }
            ],

            hard: [
                {
                    "type": "Cat",
                    "xPos": -256,
                    "yPos": 800,
                    "count": -1,
                    "flipped": false,
                    "spawnDelay": 750,
                    "spawnDelayDeviation": 150
                },
        
                {
                    "type": "Cat",
                    "xPos": 1920 + 256,
                    "yPos": 800,
                    "count": -1,
                    "flipped": true,
                    "spawnDelay": 750,
                    "spawnDelayDeviation": 150
                }
            ],

            normal: [
                                {
                    "type": "Cat",
                    "xPos": -256,
                    "yPos": 800,
                    "count": -1,
                    "flipped": false,
                    "spawnDelay": 1250,
                    "spawnDelayDeviation": 150
                },
        
                {
                    "type": "Cat",
                    "xPos": 1920 + 256,
                    "yPos": 800,
                    "count": -1,
                    "flipped": true,
                    "spawnDelay": 1250,
                    "spawnDelayDeviation": 150
                }
            ],

            easy: [
                                {
                    "type": "Cat",
                    "xPos": -256,
                    "yPos": 800,
                    "count": -1,
                    "flipped": false,
                    "spawnDelay": 2000,
                    "spawnDelayDeviation": 150
                },
        
                {
                    "type": "Cat",
                    "xPos": 1920 + 256,
                    "yPos": 800,
                    "count": -1,
                    "flipped": true,
                    "spawnDelay": 2000,
                    "spawnDelayDeviation": 150
                }
            ]
        }
    }
];