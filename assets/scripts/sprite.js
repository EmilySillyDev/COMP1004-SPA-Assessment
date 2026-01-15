import { Vector2 } from "./math.js";

export class Sprite { 
    constructor(path, position, size, zindex) {
        this.imagePath = path;
        this.destroying = false;
        
        this.position = position || new Vector2(32, 32);
        this.size = size || new Vector2(32, 32);
        this.rotation = 0;
        this.flipX = false;
        this.flipY = false;
        this.zindex = zindex
        this.static = false;
        this.impulseMultiplier = 1;

        this.anchorPoint = new Vector2(0.5, 0.5);
        this.spriteOffset = new Vector2;
        this.visible = true;

        this.element = new Image(size.x, size.y);
        this.element.src = this.imagePath;
        this.element.classList.add("sprite");

        this.frameSize = new Vector2(this.element.naturalWidth, this.element.naturalHeight);
        this.frameOffset = new Vector2(0, 0);

        this.animated = false;
        this.animationFrames = 0;
        this.animationDelay = 0;
        this.animationTimer = 0;
        this.atlasWidth = 0;
    }

    added() {}
    setGame(g) { this.game = g; }
    isASprite() { return true; }
    onMouseClick() {}
    onMouseRelease() {}

    destroy() {
        if (this.destroying) {return;}
        this.destroying = true;
    }
    
    update(dt, mousePos) {

    }

    render(dt, ctx) {
        if (this.animated) {
            this.animationTimer += dt;

            if (this.animationTimer > this.animationDelay * this.animationFrames) {
                this.animationTimer = 0;
            }

            const frameIdx = Math.floor(this.animationTimer / this.animationDelay) % this.animationFrames;

            const col = Math.floor(frameIdx / this.atlasWidth);
            const row = frameIdx % this.atlasWidth

            this.frameOffset = new Vector2(
                row * this.frameSize.x,
                col * this.frameSize.y
            )

            ctx.drawImage(
                this.element,
                this.frameOffset.x, this.frameOffset.y, this.frameSize.x, this.frameSize.y,
                this.position.x - (this.size.x * this.anchorPoint.x) + (this.size.x * this.spriteOffset.x),
                this.position.y - (this.size.y * this.anchorPoint.y) + (this.size.y * this.spriteOffset.y),
                this.size.x,
                this.size.y
            );

            if (this.game.debug) {
                ctx.fillStyle = "#f00"
                ctx.font = "12px consolas";
                ctx.fillText(`F: ${frameIdx}`, 8 + this.position.x + this.size.x / 2, this.position.y + this.size.x / 2 - 18)
                ctx.fillText(`AT: ${Math.floor(this.animationTimer)}`, 8 + this.position.x + this.size.x / 2, this.position.y + this.size.x / 2 - 2)
            }


        } else {
            ctx.drawImage(
                this.element,
                this.position.x - (this.size.x * this.anchorPoint.x) + (this.size.x * this.spriteOffset.x),
                this.position.y - (this.size.y * this.anchorPoint.y) + (this.size.y * this.spriteOffset.y),
                this.size.x,
                this.size.y
            );
        }


    }

    addToBody() {

    }
}