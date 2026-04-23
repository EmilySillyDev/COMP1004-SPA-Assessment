import { Sprite } from "./sprite.js";
import { getRandomFloat, getRandomInt, Vector2 } from "./math.js";

export function getTargetImage(targetInfo) {
    const assets = targetInfo.assets.images || ["images/missing.png"];
    const image = assets[getRandomInt(0, assets.length)];
    return `/assets/${image}`
}

export async function loadTargetAsync(targetName) {
    try {
        const response = fetch(`/assets/targets/${targetName}.json`);
        
        if (!response.ok) {
            throw new Error(`Unable to fetch target '${targetName}', Response: ${response.status}`);
        }

        const result = response.json();
        const info = {
            "name": result.name,
            "type": result.type,
            "size": new Vector2(result.sizeX, result.sizeY),
            "assets": result.assets,
            "targetProps": result.targetProps
        }

        return info
    } catch (err) {
        console.error(err.message);
    }
}

export function resolveTargetType(type) {
    switch (type) {
        case "Physics":
            return PhysicsTarget;
        case "Static":
            return StaticTarget;
        case "Button":
            return ButtonTarget;
        default:
            return StaticTarget;
    }
}

export class StaticTarget extends Sprite {
    constructor(targetInfo, position) {
        super(
            getTargetImage(targetInfo),
            position,
            targetInfo.size,
            0
        )


        this.name = targetInfo.name

        this.targetProps = targetInfo.targetProps
        this.alive = true;

        this.dieSound = new Audio(`/assets/${targetInfo.assets.killsound || "audio/killsound.wav"}`);
        this.dieSound.volume = 1;

        this.damageSound = new Audio(`/assets/audio/damage.wav`);
        this.damageSound.volume = 0.25;
    }

    initProps() {

    }

    positionInBounds(position) {
        // Translate point into the target's local space then rotate by -rotation
        const dx = position.x - this.position.x;
        const dy = position.y - this.position.y;
        const theta = this.rotation || 0;
        const cos = Math.cos(theta);
        const sin = Math.sin(theta);

        // Rotate by -theta: local = R(-theta) * (dx,dy)
        const localX = dx * cos + dy * sin;
        const localY = -dx * sin + dy * cos;

        const halfW = this.size.x / 2;
        const halfH = this.size.y / 2;

        return localX >= -halfW && localX <= halfW && localY >= -halfH && localY <= halfH;
    }

    escaped() {
        this.game.escaped++;
        this.game.resetCombo();
        this.game.damagePlayer();
        this.damageSound.play();
        this.destroy();
    }

    kill() {
        if (!this.alive) return;
        this.alive = false;
        this.dieSound.play();
        this.destroy();
        this.game.targetsHit++;
    }
}

export class PhysicsTarget extends StaticTarget {
    constructor(targetInfo, position) {
        super(targetInfo, position)
        this.velocity = new Vector2(0, 0);
        this.angularVelocity = 0;
        this.gravity = 1;
    }

    initProps(spawner) {
        /*
        "minVelX": 350,
        "maxVelX": 650,
        "minVelY": 750,
        "maxVelY": 1000,
        "gravity": 1
        */

        const xVel = getRandomInt(this.targetProps.minVelX, this.targetProps.maxVelX) * (spawner.flipped ? -1 : 1);
        const yVel = -getRandomInt(this.targetProps.minVelY, this.targetProps.maxVelY);
        this.gravity = this.targetProps.gravity;
        this.velocity = new Vector2(xVel, yVel);
        this.angularVelocity = getRandomFloat(10, 20) * Math.PI / 180 * (Math.random() > 0.5 ? -1 : 1);

    }

    update(dt, mousepos) {
        super.update(dt, mousepos)
        const grav = this.gravity * 981;
        this.velocity = this.velocity.add(new Vector2(0, grav * (dt / 1000)));
        this.position = this.position.add(this.velocity.multiplyScalar(dt/1000));
        this.rotation += this.angularVelocity * (dt / 1000);

        if (this.position.y > (1080 + this.size.y)) {
            this.escaped()
        }
    }

    
}

// Used for UI elements
export class ButtonTarget extends StaticTarget {
    kill() {
        super.kill();
        console.log("waa", this.targetProps.level)
        this.game.loadLevel(this.targetProps.level);
    }
}