import { Sprite } from "./sprite.js";
import { Vector2, Spring, getRandomFloat } from "./math.js";
import { ShotgunShell } from "./aesthetics.js";

export class Crosshair extends Sprite {
    constructor(size) {
        super("assets/images/crosshair.png", new Vector2(0, 0), new Vector2(size, size), 1);
    }

    update(dt, mousePos) {
        this.position = mousePos;
    }

    render(dt, ctx) {
        super.render(dt, ctx);
        ctx.globalCompositeOperation = 'difference';
        ctx.fillStyle = "#fff";
        ctx.fillRect(this.position.x - 5, this.position.y - 5, 10, 10)
    }
}

export class Shotgun extends Sprite {
    constructor(width) {
        super("assets/images/shotgun.png", new Vector2(0, 0), new Vector2(width, width / 162 * 295), 2);
        this.anchorPoint = new Vector2(0.5, 1.5);
        this.target = new Vector2(0, 0);
        
        // Two audio instances to allow for overlapping fire sounds
        this.shootAudio = new Audio("assets/audio/shoot.wav");
        this.shootAudio.preservesPitch = false;
        this.shootAudio.volume = 0.3;

        this.shootAudio2 = new Audio("assets/audio/shoot.wav");
        this.shootAudio2.preservesPitch = false;
        this.shootAudio2.volume = 0.3

        // Hooks's law spring, allows for convincing recoil effect
        this.spring = new Spring();
        this.spring.setDamper(0.65);
        this.spring.setSpeed(12);
        this.spring.setTarget(0);

        this.element.style.backgroundColor = "#fff";
        this.curShot = 0;
        this.lastShot = 0;

        // Passive shotgun viewbobbing
        // Also increases with a higher combo
        this.breathTimer = 0;
        this.breathingRate = 1;
    }

    update(dt, mousePos) {
        this.breathingRate = 1 + (this.game.combo / 50)
        this.target = mousePos;
        super.update(dt, mousePos);
    }

    onMouseClick(mousePos) {
        const now = performance.now();
        if (now - this.lastShot < 200) { return; }

        console.log(`Shotgun shot at X: ${this.target.x} Y: ${this.target.y}`)
        
        const targets = this.game.getTargetsAtPosition(this.target);

        targets.forEach(element => {
            element.kill();
            this.game.addCombo();
        });

        if (targets.length == 0) {
            this.game.resetCombo();
        }

        this.curShot += 1;
        this.lastShot = now;
        this.spring.impulse(8);
        this.game.renderer.zoomSpring.impulse(2);

        const aud = this.curShot % 2 == 0 ? this.shootAudio2 : this.shootAudio
        aud.pause();
        aud.playbackRate = getRandomFloat(0.95, 1.05);
        aud.currentTime = 0;
        aud.play();

        // Shotgun shell
        const dir = this.curShot % 2 == 0 ? 1 : -1;
        const localOffset = new Vector2(64 * dir, -412);
        const cos = Math.cos(this.rotation);
        const sin = Math.sin(this.rotation);

        const rotatedOffset = new Vector2(
            localOffset.x * cos - localOffset.y * sin,
            localOffset.x * sin + localOffset.y * cos
        );

        const shellSpawnPos = this.position.add(rotatedOffset);
        const shell = new ShotgunShell(shellSpawnPos, new Vector2(64, 128), this.zindex + 1);

        shell.velocity = new Vector2(getRandomFloat(512, 600) * dir, -getRandomFloat(450, 650))
        shell.angularVelocity = getRandomFloat(5, 15) * dir;

        this.game.addElement(shell);
    }

    render(dt, ctx) {
 
        const vw = 1920;
        const vh = 1080;

        const mouseXPerc = this.target.x / vw;
        const mouseYPerc = this.target.y / vh;
        const mult = mouseYPerc > 0.35 ? mouseYPerc - 0.35 : 0;

        // console.log(this.spring.getPosition());
        this.breathTimer += (dt / 1000) * this.breathingRate * 1.75;

        const breathing = Math.sin(this.breathTimer) * 8;

        this.position = new Vector2(
            (vw * 0.5) + (0.5 * mouseXPerc - 0.25) * vw,
            // vh * 0.5
            ((vh * 1.3) + (0.35 * mult) * vh) + breathing
        )

        this.spriteOffset = new Vector2(
            0,
            this.spring.getPosition()
        )

        const deltaX = this.target.x - this.position.x;
        const deltaY = this.target.y - this.position.y;
        let angle = Math.atan2(deltaY, deltaX);
        angle += (Math.PI / 2);

        this.rotation = angle;
        super.render(dt, ctx);
    }
}

// class ShotgunSprite {
//     constructor(size) {
//         this.sizeX = size;
//         this.sizeY = size / 391 * 458;

//         this.posX = 0;
//         this.posY = 0;

//         this.element = new Image(this.sizeX, this.sizeY);
//         this.element.src = "assets/images/shotgun.png";
//         this.element.classList.add("shotgun-image");


//         this.update(0, 0);
//     }

//     update(clientX, clientY, crosshairX, crosshairY) {
//         const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
//         const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
        
//         this.posX = clientX * 0.5 - (this.sizeX / 2) + (vw * 0.25);
//         this.posY = vh - (this.sizeY / 3);

//         const yCheck = crosshairX < this.posX ? Math.min(crosshairY, this.posY - 1) : crosshairY;

//         let rot = 0.125 + (Math.atan2(yCheck - this.posY, crosshairX - this.posX) + Math.PI / 2) * 0.75 ;
//         console.log(rot, crosshairX, crosshairY, this.posX, this.posY, yCheck);

//         this.element.style.left = this.posX + "px";
//         this.element.style.bottom = -(this.sizeY / 3) + "px";
//         this.element.style.transform = `rotate(${rot}rad)`;
//     }
// }

// class Shotgun {
//     constructor() {
//         this.cooldown = 2;

//         this.shootAudio = new Audio("assets/audio/shoot.wav");
//         this.crosshair = new Crosshair(96);
//         this.sprite = new ShotgunSprite(420);

//         this.lastShot = 0;

//         document.body.appendChild(this.crosshair.element);
//         document.body.appendChild(this.sprite.element);

//         document.onpointermove = (event) => {
//             const {clientX, clientY} = event;
//             this.mouseMoved(clientX, clientY);
//         };
//     }

//     mouseMoved(clientX, clientY) {
//         this.crosshair.update(clientX, clientY);
//         this.sprite.update(clientX, clientY, this.crosshair.posX, this.crosshair.posY);
//     }

//     shoot() {
//         const now = performance.now();

//         if ((now - this.lastShot) < this.cooldown) {
//             return;
//         }

//         this.lastShot = now;
//         this.shootAudio.play();
//     }
// }

// export default Shotgun;