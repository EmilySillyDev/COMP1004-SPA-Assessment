export class Vector2 {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    add(other) {
        return new Vector2(
            this.x + other.x,
            this.y + other.y
        );
    }

    sub(other) {
        return new Vector2(
            this.x - other.x,
            this.y - other.y
        );
    }

    multiply(other) {
        return new Vector2(
            this.x * other.x,
            this.y * other.y
        );
    }

    multiplyScalar(mult) {
        return new Vector2(
            this.x * mult,
            this.y * mult
        );
    }

    dot(other) {
        return (this.x * other.x) + (this.y * other.y)
    }
}

export class Sprite { 
    constructor(path, position, size, zindex) {
        this.imagePath = path;
        
        this.position = position || new Vector2(32, 32);
        this.size = size || new Vector2(32, 32);
        this.rotation = 0;
        this.flipX = false;
        this.flipY = false;

        this.anchorPoint = new Vector2(0.5, 0.5);
        this.visible = true;

        this.element = new Image(size.x, size.y);
        this.element.src = this.imagePath;
        this.element.classList.add("sprite");
        this.element.style.zIndex = zindex;
    }

    isASprite() { return true; }
    onMouseClick() {}
    onMouseRelease() {}

    update(dt, mousePos) {

    }

    render(dt) {
        this.element.style.top = this.position.y - (this.size.y * this.anchorPoint.y) + "px";
        this.element.style.left = this.position.x - (this.size.x * this.anchorPoint.x) + "px";
        this.element.style.display = this.visible ? "block" : "none";
        this.element.style.transform = `rotate(${this.rotation}rad) scale(${this.flipX ? -1 : 1}, ${this.flipY ? -1 : 1})`;

    }

    addToBody() {
        document.body.appendChild(this.element);
    }
}

export class Game {
    constructor() {
        this.gameObjects = [];

        this.lastUpdate = Date.now();
        this.mouseDown = false;
        this.priorMouseDown = false;
        this.mousePos = new Vector2(0, 0)
    }

    start() {
        document.addEventListener("mousedown", () => {
            this.mouseDown = true;
        })

        document.addEventListener("mouseup", () => {
            this.mouseDown = false;
        })

        document.onpointermove = (event) => {
            const {clientX, clientY} = event;
            this.mousePos = new Vector2(clientX, clientY);
        };

        setInterval(() => {
            const now = Date.now();
            const dt = now - this.lastUpdate;

            const sendClick = this.mouseDown && !this.priorMouseDown;
            const sendRelease = !this.mouseDown && this.priorMouseDown;
            this.priorMouseDown = this.mouseDown;

            this.gameObjects.forEach((e) => {
                e.update(dt, this.mousePos);

                if (sendClick) {
                    e.onMouseClick(this.mousePos);
                } else if (sendRelease) {
                    e.onMouseRelease(this.mousePos);
                }
            })

            this.gameObjects.forEach((e) => {
                e.render(dt);
            })
        }, 1);
    }

    addElement(element) {
        this.gameObjects.push(element);
        element.addToBody();
    }

    onMouseClick() {}
    onMouseRelease() {}
}

