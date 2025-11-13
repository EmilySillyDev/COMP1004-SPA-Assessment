class Crosshair {
    constructor(size) {
        this.size = size;
        
        this.posX = 0;
        this.posY = 0;

        this.element = new Image(size, size);
        this.element.src = "assets/images/crosshair.png";
        this.element.classList.add("crosshair");
    }

    updateSize(size) {
        this.size = size;
        this.element.width = size;
        this.element.height = size;
    }
    
    update(clientX, clientY) {
        this.posX = clientX;
        this.posY = clientY;

        this.element.style.left = clientX - (this.size / 2) + "px";
        this.element.style.top = clientY - (this.size / 2) + "px";
    }
}

class ShotgunSprite {
    constructor(size) {
        this.sizeX = size;
        this.sizeY = size / 391 * 458;

        this.posX = 0;
        this.posY = 0;

        this.element = new Image(this.sizeX, this.sizeY);
        this.element.src = "assets/images/shotgun.png";
        this.element.classList.add("shotgun-image");


        this.update(0, 0);
    }

    update(clientX, clientY, crosshairX, crosshairY) {
        const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
        const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
        
        this.posX = clientX * 0.5 - (this.sizeX / 2) + (vw * 0.25);
        this.posY = vh - (this.sizeY / 3);

        const yCheck = crosshairX < this.posX ? Math.min(crosshairY, this.posY - 1) : crosshairY;

        let rot = 0.125 + (Math.atan2(yCheck - this.posY, crosshairX - this.posX) + Math.PI / 2) * 0.75 ;
        console.log(rot, crosshairX, crosshairY, this.posX, this.posY, yCheck);

        this.element.style.left = this.posX + "px";
        this.element.style.bottom = -(this.sizeY / 3) + "px";
        this.element.style.transform = `rotate(${rot}rad)`;
    }
}

class Shotgun {
    constructor() {
        this.cooldown = 2;

        this.shootAudio = new Audio("assets/audio/shoot.wav");
        this.crosshair = new Crosshair(96);
        this.sprite = new ShotgunSprite(420);

        this.lastShot = 0;

        document.body.appendChild(this.crosshair.element);
        document.body.appendChild(this.sprite.element);

        document.onpointermove = (event) => {
            const {clientX, clientY} = event;
            this.mouseMoved(clientX, clientY);
        };
    }

    mouseMoved(clientX, clientY) {
        this.crosshair.update(clientX, clientY);
        this.sprite.update(clientX, clientY, this.crosshair.posX, this.crosshair.posY);
    }

    shoot() {
        const now = Date.now();

        if ((now - this.lastShot) < this.cooldown) {
            return;
        }

        this.lastShot = now;
        this.shootAudio.play();
    }
}

export default Shotgun;