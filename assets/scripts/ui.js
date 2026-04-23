import { Vector2 } from "./math.js"

export class UIBase {
    constructor() {
        this.transparency = 0;
        this.static = false;
    }

    created() {

    }

    destroy() {

    }

    setGame(game) {
        this.game = game;
    }

    render(dt, ctx) {
        ctx.globalAlpha = 1 - this.transparency;
    }
}

export class Frame extends UIBase {
    constructor() {
        this.size = new Vector2(50, 50);
        this.position = new Vector2(0, 0);
        this.fillColour = "#fff";
    }

    setGame(game) {
        this.game = game;
    }

    render(dt, ctx) {
        ctx.fillStyle = this.fillColour;

        ctx.fillRect(
            this.position.x,
            this.position.y,
            this.size.x,
            this.size.y
        )
    }
}

export class TextLabel extends UIBase {
    constructor() {
        super()

        this.position = new Vector2(128, 128);
        this.fontSize = 64;
        this.fontFamily = "consolas";
        this.fontColour = "#fff";
        this.fontStroke = "transparent"; 
        this.bold = false;
        this.italic = false;
        this.text = "Hello, World."
        this.textAlign = "left"
    }

    render(dt, ctx) {
        super.render(dt, ctx);
        ctx.fillStyle = this.fontColour;
        ctx.textAlign = this.textAlign;
        ctx.font = `${this.bold ? "bold" : ""} ${this.italic ? "italic" : ""} ${this.fontSize}px ${this.fontFamily}`;

        const text = typeof(this.text) == "function" ? this.text() : this.text;
        ctx.fillText(text, this.position.x, this.position.y);
    }
}

export class HealthCounter extends TextLabel {
    constructor() {
        super()
        this.text = "0";
        this.position = new Vector2(96 + 185, 128);
        this.fontSize = 48;
        this.size = new Vector2(256, 128);
        this.image = new Image(this.size.x, this.size.y);
        this.image.src = "/assets/images/health.png";
        this.image.classList.add("sprite");
        this.textAlign = "right";
    }

    render(dt, ctx) {
        
        ctx.drawImage(
            this.image,
            this.position.x - (this.size.x * 0.15) + (this.size.x * -0.7),
            this.position.y - (this.size.y * 0.685) + (this.size.y * 0),
            256,
            128
        );
        
        this.text = `${this.game.health}`;
        super.render(dt, ctx);
    }
}


export class FPSCounter extends TextLabel {
    constructor() {
        super();
        this.text = "FPS: 0";
        this.fontColour = "#F00";
        this.fontSize = 12;
        this.position = new Vector2(8, 16);
        this.lastFPSUpdate = undefined;
        this.updateRate = 50;
        this.static = true;
    }

    render(dt, ctx) {
        super.render(dt, ctx);
        if ((this.lastFPSUpdate) && (performance.now() - this.lastFPSUpdate < this.updateRate)) return;
        this.lastFPSUpdate = performance.now();
        this.text = `FPS: ${Math.floor(1000 / dt)}`
    }
}

export class FadeTextLabel extends TextLabel {
    constructor() {
        super()
        this.fadeIn = 0.5;
        this.fadeOut = 0.5;
        this.persistLength = 3;
        this.start = performance.now();
        this.destroyOnFinish = true;
    }

    created() {
        super.created();
        this.start = performance.now();
    }

    calculateTransparency() {
        const timeline = (performance.now() - this.start) / 1000;
        const lifetime = this.fadeIn + this.persistLength + this.fadeOut;

        if (timeline > lifetime) {
            this.transparency = 1;
            
            if (this.destroyOnFinish) {
                this.destroy()
            }

            return
        }

        if (timeline > this.fadeIn && timeline < this.fadeOut) {
            this.transparency = 0;
            return;
        }
    
        if (timeline < this.fadeIn) {
            this.transparency = 1 - (timeline / this.fadeIn);
            return;
        }

        const fadeOutPerc = (timeline - this.fadeIn - this.persistLength) / this.fadeOut;
        this.transparency = fadeOutPerc;
    }

    render(dt, ctx) {
        this.calculateTransparency()
        super.render(dt, ctx);
    }
}