"use strict";

const canvas = document.querySelector("canvas");
const buttonPlay = document.querySelector("button");
const ctx = canvas.getContext("2d");

canvas.width = 288;
canvas.height = 512;

const FOREGROUND_HEIGHT = 115;
const PIPE_HEIGHT = 240;
const PIPE_WIDTH = 52;
const SPACE = 100;

const TEXT_FONT = "40px Impact";
const FILL_STYLE = "#FFF";

/**
 * Mother abstract class
 */
class Item {

    /**
     * Used by childen class
     * @param {*} x x position
     * @param {*} y y position
     * @param {*} image item image
     */
    constructor(x, y, image) {
        this.x = x;
        this.y = y;
        this.image = new Image();
        this.image.src = image;
    }

    /**
     * Draw item
     */
    draw() {
        ctx.drawImage(this.image, this.x, this.y);
    }
}

/**
 * Represent foreground object
 */
class Foreground extends Item {

    /**
     * Init a foreground
     * @param {*} x x position
     * @param {*} y y position
     * @param {*} image foreground image
     */
    constructor(x, y, image) {
        super(x, y, image);
    }
}

/**
 * Represent background object
 */
class Background extends Item {

    /**
     * Init a background
     * @param {*} x x position
     * @param {*} y y position
     * @param {*} image foreground image
     */
    constructor(x, y, image) {
        super(x, y, image);
    }
}

/**
 * Represent pipes
 */
class Pipes {

    /**
     * Init top and bottom pipes
     * @param {*} x 
     * @param {*} y 
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.pipeTop = new Image();
        this.pipeBottom =  new Image();
        this.pipeTop.src = "img/pipeTop.png";
        this.pipeBottom.src = "img/pipeBottom.png";
    }

    /**
     * Draw top and bottom pipes
     */
    draw() {
		ctx.drawImage(this.pipeTop, this.x, this.y);
		ctx.drawImage(this.pipeBottom, this.x, this.y + PIPE_HEIGHT + SPACE);
    }

}

/**
 * Represent bird player
 */
class Bird extends Item {

    /**
     * Init a bird player
     * @param {*} x x position
     * @param {*} y y position
     * @param {*} velY velocity player
     * @param {*} image image player
     */
    constructor(x, y, velY, image) {
        super(x, y, image);
        this.velY = velY;
        this.alive = true;
    }

    /**
     * Add controls to move bird
     */
    setControls() {
        canvas.addEventListener("click", () => {
            this.up();
        });
    }

    /**
     * Check if bird tounch bottom or pipes
     * @param {*} pipe pipe to check
     */
    checkCollision(pipe) {
        if (this.x + this.image.width >= pipe.x && this.x <= pipe.x + pipe.pipeTop.width
            && (this.y <= pipe.y + pipe.pipeTop.height
            || this.y + this.image.height >= pipe.y + PIPE_HEIGHT + SPACE) 
            || this.y + this.image.height >= canvas.height - FOREGROUND_HEIGHT) {
            this.alive = false;
        }
    }

    /**
     * Draw player bird
     */
    draw() {
        ctx.drawImage(this.image, this.x, this.y);
    }

    /**
     * Player bird move to top
     */
    up() {
        if (this.y - this.image.height > 0) {
            this.y -= this.velY;
            Sound.playFly();
        }
    }

    /**
     * Gravity
     */
    down() {
        this.y += 1.5;
    }
}

/**
 * Utils class to play sound
 */
class Sound {

    /**
     * Fly sound when player bird jump
     */
    static fly = new Audio("sounds/fly.mp3");

    /**
     * Score sound when player bird go between pipes
     */
    static score = new Audio("sounds/score.mp3");

    /**
     * Play fly sound
     */
    static playFly() {
        this.fly.play();
    }

    /**
     * Play score sound
     */
    static playScore() {
        this.score.play();
    }
}

/**
 * Utils class to write text on game
 */
class Writer {

    /**
     * Write "Play" text 
     */
    static writePlay() {
        ctx.font = TEXT_FONT;
	    ctx.fillStyle = FILL_STYLE;
	    ctx.strokeStyle = "#000";
        ctx.fillText("Play", canvas.width / 2.6, canvas.height / 2);
        ctx.strokeText("Play", canvas.width / 2.6, canvas.height / 2);
        ctx.fill();
        ctx.stroke();
    }

    /**
     * Write score during game
     * @param {*} score 
     */
    static writeScore(score) {
        ctx.font = TEXT_FONT;
	    ctx.fillStyle = FILL_STYLE;
	    ctx.strokeStyle = "#000";
        ctx.fillText(score, canvas.width / 2.1, 50);
        ctx.strokeText(score, canvas.width / 2.1, 50);
        ctx.fill();
        ctx.stroke();
    }

    /**
     * Write "You loose" if player bird 
     * touch bottom or pipes
     */
    static writeLoose() {
        ctx.font = TEXT_FONT;
	    ctx.fillStyle = FILL_STYLE;
	    ctx.strokeStyle = "red";
        ctx.fillText("You loose", canvas.width / 5, canvas.height / 2);
        ctx.strokeText("You loose", canvas.width / 5, canvas.height / 2);
        ctx.fill();
        ctx.stroke();
    }
}

/**
 * Utils class to launch game
 */
class Game {

    static background = new Background(0, 0, "img/background.png");
    static foreground = new Foreground(0, canvas.height - FOREGROUND_HEIGHT, "img/foreground.png");
    static bird = new Bird(canvas.width / 3, canvas.height / 2, 50, "img/bird.png");
    static play = false;
    static pipes = [];
    static score = 0;

    /**
     * Add a couple of pipes in pipes array
     */
    static init = () => {
        this.pipes.push(new Pipes(canvas.width, 0));
    }

    /**
     * Launch game if player
     * click on "Play" text
     */
    static launch = () => {
        canvas.addEventListener('click', (event) => {
            if (event.clientX >= 120 && event.clientX <= 190
                && event.clientY >= 230 && event.clientY <= 265) {
                this.play = true;
                this.bird.setControls();
            }
        });
    }

    /**
     * Loop game
     */
    static draw = () => {

        this.background.draw();

        if (this.play) {
            
            for (let i = 0; i < this.pipes.length; i++) {

                this.pipes[i].draw();
                this.pipes[i].x--;
                this.bird.checkCollision(this.pipes[i]);

                // Add pipes if current pipe is at left
                if (this.pipes[i].x === 0) {
                    this.pipes.push(
                        new Pipes(
                            canvas.width, 
                            Math.floor(Math.random() * PIPE_HEIGHT) - PIPE_HEIGHT
                        )
                    );
                }

                // Destroy pipe who's out of screen
                if (this.pipes[i].x + this.pipes[i].pipeTop.width < 0) {
                    this.pipes.splice(i, 1);
                }

                // If bird pass pipes 
                if (this.pipes[i].x === this.bird.x) {
                    this.score++;
                    Sound.playScore();
                }
            }

            // Apply gravity
            this.bird.down();

        } else {
            Writer.writePlay();
        }

        this.foreground.draw();
        Writer.writeScore(this.score);        
        this.bird.draw();

        if (this.bird.alive) {
            requestAnimationFrame(this.draw)
        } else {
            Writer.writeLoose();

            if (window.confirm("New game ?")) {
                location.reload();
            }
        }
    }
}

Game.launch();
Game.init();
Game.draw();