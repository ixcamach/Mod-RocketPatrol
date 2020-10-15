//Ixel Camacho
//Spooky Booah font by Suby Studio - https://www.dafont.com/spooky-booah.font
//- Add your own (copyright-free) background music to the Play scene (10)
//- Create a new scrolling tile sprite for the background (10)
//- Allow the player to control the Rocket after it's fired (10)
//- Display the time remaining (in seconds) on the screen (15)
//- Replace the UI borders with new artwork (15)
//- Create a new title screen (15)
//- Create new artwork for all the in-game assets (rocket, spaceships, explosion) (25)
let config = {
    type: Phaser.CANVAS,
    width: 640,
    height: 480,
    scene: [ Menu, Play ],
};

let game = new Phaser.Game(config);

// reserve some keyboard variables
let keyF, keyLEFT, keyRIGHT;

//define game settings
game.settings = {
    spaceshipSpeed: 3,
    gameTimer: 60000
}