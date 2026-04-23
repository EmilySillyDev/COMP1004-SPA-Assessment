import { Sprite } from "./sprite.js";
import { Vector2, Spring, getRandomFloat } from "./math.js";
import { ShotgunShell } from "./aesthetics.js";

export class Crosshair extends Sprite {
    constructor(size) {
        super("/assets/images/crosshair.png", new Vector2(0, 0), new Vector2(size, size), 1);
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
        super("/assets/images/shotgun.png", new Vector2(0, 0), new Vector2(width, width / 162 * 295), 2);
        this.anchorPoint = new Vector2(0.5, 1.5);
        this.target = new Vector2(0, 0);
        
        // Two audio instances to allow for overlapping fire sounds
        this.shootAudio = new Audio("/assets/audio/shoot.wav");
        this.shootAudio.preservesPitch = false;

        this.shootAudio2 = new Audio("/assets/audio/shoot.wav");
        this.shootAudio2.preservesPitch = false;

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

    added() {
        super.added();
        this.shootAudio.volume = 0.3 * this.game.sfxVolume;
        this.shootAudio2.volume = 0.3 * this.game.sfxVolume;
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
