import { Spring, Vector2 } from "./math.js";

export class Render {
    constructor(game) {
        this.game = game
        
        this.lastRender = undefined;
        this.lastUIRender = undefined;

        this.lastBump = 0;
        this.zoomSpring = new Spring();
        this.zoomSpring.setDamper(0.65);
        this.zoomSpring.setSpeed(12);
        this.zoomSpring.setTarget(0);

        this.bpmSpring = new Spring();
        this.bpmSpring.setDamper(0.65);
        this.bpmSpring.setSpeed(12);
        this.bpmSpring.setTarget(0);

        const canvasContainer = document.getElementById("canvas-container");

        this.canvas = document.createElement("canvas");
        this.canvas.oncontextmenu = function() {return false;};
        this.canvas.classList.add("render-canvas");
        this.canvas.width = 1920;
        this.canvas.height = 1080;
        this.ctx = this.canvas.getContext('2d');

        canvasContainer.appendChild(this.canvas); 
    }

    getMousePos(rawPos) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;

        return new Vector2(
            (rawPos.x - rect.left) * scaleX,
            (rawPos.y - rect.top) * scaleY
        );
    }

    render(now) {

        // Beat timing (ms per beat)
        if (this.game.bpm > 0) {
            const msPerBeat = (60 / this.game.bpm) * 1000; // ms per beat
            const songStart = this.game.musicStart;
            const elapsed = Math.max(0, now - songStart);
            const beatsElapsed = Math.floor(elapsed / msPerBeat);
            const beatTime = songStart + beatsElapsed * msPerBeat;
            if (this.lastBump < beatTime) {
                this.lastBump = beatTime;
                this.bpmSpring.impulse(0.5);
            }
        }

        if (this.lastRender === undefined) {
            this.lastRender = now;
        }

        const dt = now - this.lastRender;
        const ctx = this.ctx;

        // Minimal state reset (no resize per frame)
        ctx.setTransform(1,0,0,1,0,0);
        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = 'source-over';
        if (ctx.filter !== undefined) ctx.filter = 'none';

        ctx.fillStyle = "#87CEEB";
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        const cx = this.canvas.width / 2;
        const cy = this.canvas.height / 2;

        let originX = cx;
        let originY = cy;
        if (this.game && this.game.mousePos) {
            // `game.mousePos` is stored in canvas space already (0..1920, 0..1080)
            const mx = this.game.mousePos.x;
            const my = this.game.mousePos.y;

            if (typeof mx === 'number') originX = mx;
            if (typeof my === 'number') originY = my;
        }

        const zoomBase = this.zoomSpring.getPosition();
        this.game.gameObjects.forEach(element => {
            ctx.save();
            if (!element.static) {
                const scale = (zoomBase * element.impulseMultiplier) + 1;
                ctx.translate(originX, originY);
                ctx.scale(scale, scale);
                ctx.translate(-originX, -originY);
            }
            ctx.translate(element.position.x, element.position.y);
            ctx.rotate(element.rotation);
            ctx.translate(-element.position.x, -element.position.y);

            if (element.visible) {
                element.render(dt, ctx);
            }

            if (this.game.debug) {
                ctx.globalCompositeOperation = 'source-over';
                
                // Debug bounding box
                const bx = element.position.x - (element.size.x * element.anchorPoint.x);
                const by = element.position.y - (element.size.y * element.anchorPoint.y);
                const bw = element.size.x;
                const bh = element.size.y;

                ctx.strokeStyle = "#f00";
                ctx.lineWidth = 2;
                ctx.strokeRect(bx - 1, by - 1, bw + 2, bh + 2);

                // Debug anchor point
                ctx.fillStyle = "#00f";
                ctx.fillRect(
                    element.position.x - 4,
                    element.position.y - 4,
                    8,
                    8
                );
            }

            ctx.restore();
        });

        const uiScaleBase = this.bpmSpring.getPosition();
        const uiCx = this.canvas.width / 2;
        const uiCy = this.canvas.height / 2;

        this.game.uiObjects.forEach((element) => {
            ctx.save();
            if (!element.static) {
                const uiScale = uiScaleBase + 1;
                ctx.translate(uiCx, uiCy);
                ctx.scale(uiScale, uiScale);
                ctx.translate(-uiCx, -uiCy);
            }
            element.render(dt, ctx);
            ctx.restore();
        });

        this.lastRender = now;
    }
}