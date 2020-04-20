//Spaceship prefab
class Spaceship extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, pointValue) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this); //add to existing scene, displayList, updateList
        //store pointValue
        this.points = pointValue;
        this.speed = 2;
        //assigns value of 0 or 1 to direction 
        this.direction = Math.floor((Math.random() * 2));
    }

    update() {
        if(this.direction == 0) {
            //move spaceship left
            this.x -= this.speed;
            //wraparound from left to right edge
            if (this.x <= 0-this.width) {
                this.reset();
            }
        }
        else {
            //move spaceship right
            this.x += this.speed;
            //wraparound from right to left edge
            if (this.x >= game.config.width)
                this.reset();
        }
    }

    reset() {
        this.direction = Math.floor((Math.random() * 2));
        if(this.direction == 0) {
            this.x = game.config.width;
        }
        else {
            this.x = 0;
        }
    }


}