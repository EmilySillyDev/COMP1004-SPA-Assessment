import { Spring, Vector2 } from "./math.js";

export class Render {
    constructor(game) {
        this.game = game
        this.lastRender = undefined;
        this.zoomSpring = new Spring();
        this.zoomSpring.setDamper(0.65);
        this.zoomSpring.setSpeed(12);
        this.zoomSpring.setTarget(0);

        const canvasContainer = document.getElementById("canvas-container");

        this.canvas = document.createElement("canvas");
        this.canvas.classList.add("render-canvas");
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
        const ctx = this.canvas.getContext('2d');
        ctx.canvas.width  = 1920;
        ctx.canvas.height = 1080;

        if (this.lastRender === undefined) {
            this.lastRender = now;
        }

        const dt = now - this.lastRender;
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        const scale = (this.zoomSpring.getPosition() + 1);
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

        this.game.gameObjects.forEach(element => {
            // Reset transform to identity, then apply centering+scaling per-frame
            ctx.setTransform(1,0,0,1,0,0);

            // apply zoom around the mirrored mouse origin
            ctx.translate(originX, originY);
            ctx.scale(scale, scale);
            ctx.translate(-originX, -originY);

            element.render(dt);

            const posx = element.position.x;
            const posy = element.position.y;

            ctx.translate(posx, posy);
            ctx.rotate(element.rotation);
            ctx.translate(-posx, -posy);

            if (this.game.debug) {
                ctx.fillStyle = "#f00";
                ctx.fillRect(
                    element.position.x - (element.size.x * element.anchorPoint.x) - 1,
                    element.position.y - (element.size.y * element.anchorPoint.y) - 1,
                    element.size.x + 2,
                    element.size.y + 2
                )

                // ctx.fillStyle = "transparent";
                ctx.clearRect(
                    element.position.x - (element.size.x * element.anchorPoint.x),
                    element.position.y - (element.size.y * element.anchorPoint.y),
                    element.size.x,
                    element.size.y
                )

            }

            if (element.visible) { 

                ctx.drawImage(
                    element.element,
                    element.position.x - (element.size.x * element.anchorPoint.x) + (element.size.x * element.spriteOffset.x),
                    element.position.y - (element.size.y * element.anchorPoint.y) + (element.size.y * element.spriteOffset.y),
                    element.size.x,
                    element.size.y
                );

            }

            if (this.game.debug) {
                ctx.fillStyle = "#00f";
                ctx.fillRect (
                    (element.position.x) - 4,
                    (element.position.y) - 4,
                    8,
                    8
                )
            }


            // restore identity for next element (already done at start of loop)
        });

        this.lastRender = now;
        requestAnimationFrame((s) => this.render(s), this.canvas);
    }


}