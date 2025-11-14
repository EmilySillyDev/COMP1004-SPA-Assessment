import { Sprite } from "./engine.js";
import { getRandomInt } from "./math.js";

export function getTargetAsset(targetInfo) {
    const assets = targetInfo.assets || ["images/missing.png"];
    const image = assets[getRandomInt(0, assets.length - 1)];
    return `assets/${image}`
}

export async function loadTarget(targetName) {
    try {
        const response = await fetch(`assets/targets/${targetName}.json`);
        
        if (!response.ok) {
            throw new Error(`Unable to fetch target '${targetName}', Response: ${response.status}`);
        }

        const result = await response.json();
        return result;
    } catch (err) {
        console.error(err.message);
    }
}

export function resolveTargetType(type) {
    switch (type) {
        case "Physics":
            return;
            // return PhysicsSprite;
        case "Static":
            return StaticTarget;
        default:
            return Sprite;
    }
}

export class StaticTarget extends Sprite {
    constructor(targetInfo, position) {
        super(
            getTargetAsset(targetInfo),
            position,
            targetInfo.size,
            0
        )
    }
}

// export class TargetServer {
//     constructor(targets) {
//         this.targetNames = targets;
//         this.targets = {}

//         this.targetNames.forEach(element => {
//             const info = loadTarget(element);
//             if (!info) return;

//             this.targets[element] = {
//                 "class": resolveTargetType(info.type),
//                 "info": info
//             }
//         });

//         console.log(this.targets);
//     }

//     createTarget(name, levelProps) {

//     }
// }