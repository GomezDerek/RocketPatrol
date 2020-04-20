/*
Modification Assignment Breakdown
#################################
Speed Increase             (10) TOTAL:10
Random Ship Direction      (10) TOTAL:20
Rocket Control After Fired (10) TOTAL:30
Background Music           (10) TOTAL:40
Display Time Remaining     (15) TOTAL:55
Scoring Adds Time          (25) TOTAL:80
Mouse & Click Mechanics    (25) TOTAL:105
*/
console.log('Background Music: A Dark Winter by Silent Protagonist');
let config = {
    type: Phaser.CANVAS,
    width: 640,
    height: 480,
    scene: [Menu, Play],
};

let game = new Phaser.Game(config);

//define game settings
game.settings = {
    spaceshipSpeed: 3,
    gameTimer: 6000
}

//reserve keyboard vars
let keyF, keyLEFT, keyRIGHT;

