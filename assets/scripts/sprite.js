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

        this.anchorPoint = new Vector2(0.5, 0.5);
        this.spriteOffset = new Vector2;
        this.visible = true;

        this.element = new Image(size.x, size.y);
        this.element.src = this.imagePath;
        this.element.classList.add("sprite");
    }

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

    render(dt) {

    }

    addToBody() {

    }
}