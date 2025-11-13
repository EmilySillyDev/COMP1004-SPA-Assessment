export class Render {
    constructor(game) {
        this.game = game
        this.lastRender = Date.now();
       
        this.canvas = document.createElement("canvas");
        this.canvas.classList.add("render-canvas");
        document.body.appendChild(this.canvas); 
    }

    render() {
        const ctx = this.canvas.getContext('2d');
        const now = Date.now();
        const dt = now - this.lastRender;
        this.lastRender = now;
        ctx.canvas.width  = window.innerWidth;
        ctx.canvas.height = window.innerHeight;
        // ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.game.gameObjects.forEach(element => {
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

                ctx.fillStyle = "#00f";
                ctx.fillRect (
                    (element.position.x) - 4,
                    (element.position.y) - 4,
                    8,
                    8
                )

            }

            ctx.drawImage(
                element.element,
                element.position.x - (element.size.x * element.anchorPoint.x) + (element.size.x * element.spriteOffset.x),
                element.position.y - (element.size.y * element.anchorPoint.y) + (element.size.y * element.spriteOffset.y),
                element.size.x,
                element.size.y
            );



            ctx.setTransform(1,0,0,1,0,0);
        });
    }


}