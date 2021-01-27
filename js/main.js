"use strict";

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const width = canvas.width = 288;
const height = canvas.height = 512;

class Ground {

    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.image = new Image();
    }

    draw = () => {
        ctx.drawImage(this.image, this.x, this.y);
    }
}

class Foreground extends Ground {

    constructor(x, y, image) {
        super(x, y);
        this.image.src = image;
    }
}

class Background extends Ground {

    constructor(x, y, image) {
        super(x, y);
        this.image.src = image;
    }
}

class Bird {

    constructor(x, y, velY, image) {
        this.x = x;
        this.y = y;
        this.velY = velY;
        this.image = new Image();
        this.image.src = image;
    }
}

class Game {

    static background = new Background(0, 0, "img/background.png");
    static foreground = new Foreground(0, 0, "img/foreground.png");
    static bird = new Bird(width / 3, height / 2, 5, "img/bird.png");

    static draw = () => {

        this.background.draw();

        requestAnimationFrame(this.draw)
    }
}

Game.draw();