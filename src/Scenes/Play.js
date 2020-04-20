class Play extends Phaser.Scene{
    constructor() {
        super("playScene");
    }

    preload() {
        //load image/tile sprite
        this.load.image('rocket', './assets/rocket.png');
        this.load.image('spaceship', './assets/spaceship.png');
        this.load.image('starfield', './assets/starfield.png');
   
        //load spritesheet
        this.load.spritesheet('explosion', './assets/explosion.png', 
        {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
        
        //load music
        this.load.audio('bgMusic', 'assets/ADarkWinter.mp3');
    }

    create() {
        this.add.text(20, 20, "Rocket Patrol Play");

        //play music
        var music = this.sound.add('bgMusic');
        music.play( {loop:true} );

        //place the sprite
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0,0);

        //white rectangle borders
        this.add.rectangle(5, 5, 630, 32, 0xFFFFFF).setOrigin(0,0);
        this.add.rectangle(5, 443, 630, 32, 0xFFFFFF).setOrigin(0,0);
        this.add.rectangle(5, 5, 32, 455, 0xFFFFFF).setOrigin(0,0);
        this.add.rectangle(603, 5, 32, 455, 0xFFFFFF).setOrigin(0,0);
        
        //green UI background
        this.add.rectangle(37, 42, 566, 64, 0x00FF00).setOrigin(0,0);
        
        //add rocket (p1)
        this.p1rocket = new Rocket(this, game.config.width/2 - 8, 431, 'rocket').setScale(.5,.5).setOrigin(0,0);

        //add spaceships(x3)
        this.ship01 = new Spaceship(this, game.config.width + 192, 132, 'spaceship', 0, 30).setOrigin(0,0);
        this.ship02 = new Spaceship(this, game.config.width + 96, 196, 'spaceship', 0, 20).setOrigin(0,0);
        this.ship03 = new Spaceship(this, game.config.width, 260, 'spaceship', 0, 10).setOrigin(0,0);


        //define keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        var pointer = this.input.activePointer;

        //animation config
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', {start: 0, end: 9, first: 0}),
            frameRate: 30
        });

        //score
        this.p1Score = 0;

        // score display
        this.scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        this.scoreLeft = this.add.text(69, 54, this.p1Score, this.scoreConfig);
        
        //time display
        let timeConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        this.timeRight = this.add.text(480, 54, 60, timeConfig);

        // game over flag
        this.gameOver = false;

        /*
        // 60-second play clock
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(60000, () => {
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, '(F)ire to Restart', scoreConfig).setOrigin(0.5);
            this.gameOver = true;
        }, null, this);
        */
        //speed increase at 30sec
        this.speedIncrease = this.time.delayedCall(30000, () => {
            this.ship01.speed += 2.5;
            this.ship02.speed += 2.5;
            this.ship03.speed += 2.5;
        }, null, this);   
    }

    update() {
        console.log(this.p1rocket.x);
        //game over at timeout
        if(this.timeRight.text <= 0) {
            this.scoreConfig.fixedWidth = 0;
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', this.scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, '(F)ire to Restart', this.scoreConfig).setOrigin(0.5);
            this.gameOver = true;
        }
        else {
            //update timer
            this.timeRight.text = 60 - Math.floor(this.time.now/1000) + this.p1Score/10;
        }

        //check key input for restart
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyF)) {
            this.scene.restart(this.p1score);
        }

        //scroll starfield
        this.starfield.tilePositionX -= 4; //scroll tile sprite
        
        if(!this.gameOver) {
            this.p1rocket.update();           //update rocket sprite
            this.ship01.update();            //update spaceships (x3)
            this.ship02.update();
            this.ship03.update();
        }   

        //check collisions 
        if (this.checkCollision(this.p1rocket, this.ship03)) {
            this.p1rocket.reset();
            this.shipExplode(this.ship03);
        }
        if (this.checkCollision(this.p1rocket, this.ship02)) {
            this.p1rocket.reset();
            this.shipExplode(this.ship02);
        }
        if (this.checkCollision(this.p1rocket, this.ship01)) {
            this.p1rocket.reset();
            this.shipExplode(this.ship01);
        }

        //move rocket with mouse pointer
        this.input.on('pointermove', function (pointer) {
            this.p1rocket.x = Phaser.Math.Clamp(pointer.x, 47, 578);
        }, this);
    }

    checkCollision(rocket, ship) {
        //simple AABB checking
        if (rocket.x < ship.x + ship.width &&
            rocket.x + rocket.width > ship.x &&
            rocket.y < ship.y + ship.height && 
            rocket.height + rocket.y > ship.y) {
                return true;
            } else {
                return false;
            }
    }

    shipExplode(ship) {
        ship.alpha = 0;                         // temporarily hide ship
        
        // create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode');             // play explode animation
        boom.on('animationcomplete', () => {    // callback after animation completes
            ship.reset();                       // reset ship position
            ship.alpha = 1;                     // make ship visible again
            boom.destroy();       
            this.sound.play('sfx_explosion');              // remove explosion sprite
        });    

        // score increment and repaint
        this.p1Score += ship.points;
        this.scoreLeft.text = this.p1Score; 
    }
}