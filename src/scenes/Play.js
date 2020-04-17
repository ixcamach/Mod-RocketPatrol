class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        //load images/title sprite
        this.load.image('cross', './assets/cross.png');
        this.load.image('ghost', './assets/ghost.png');
        this.load.image('sky', './assets/sky.png');
        this.load.image('spike', './assets/spike.png');
        this.load.image('spike1.2', './assets/spike1.2.png');
        // fix explosion
        this.load.spritesheet('ash', './assets/ash.png', {frameWidth: 64, frameHeight: 64, startFrame: 0, endFrame: 9});
    }

    create() {
        //place tile sprite
        this.sky = this.add.tileSprite(0, 0, 640, 480, 'sky').setOrigin(0, 0);

        // white rectangle borders
        //this.add.rectangle(5, 5, 630, 32, 0xFFFFFF).setOrigin(0, 0);
        //this.add.rectangle(5, 443, 630, 32, 0xFFFFFF).setOrigin(0, 0);
        //this.add.rectangle(5, 5, 32, 455, 0xFFFFFF).setOrigin(0, 0);
        //this.add.rectangle(603, 5, 32, 455, 0xFFFFFF).setOrigin(0, 0);
        this.add.image(320, 20, 'spike');
        this.add.image(320, 462, 'spike');
        this.add.image(620, 255, 'spike1.2');
        this.add.image(20, 255, 'spike1.2');


        // green UI bckground
        //this.add.rectangle(37, 42, 566, 64, 0XAFC3C3).setOrigin(0, 0);

        // add rocket(p1)
        this.p1Cross = new Cross(this, game.config.width/2, 431, 'cross').setScale(0.5, 0.5).setOrigin(0, 0.4);

        // add spaceships x3
        this.ghost01 = new Ghost(this, game.config.width +192, 150, 'ghost', 0, 30).setOrigin(0, 0);
        this.ghost02 = new Ghost(this, game.config.width +96, 196, 'ghost', 0, 20).setOrigin(0, 0);
        this.ghost03 = new Ghost(this, game.config.width, 260, 'ghost', 0, 10).setOrigin(0, 0);

        //define keyboard keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        // animation config
        this.anims.create({
            key: 'ash',
            frames: this.anims.generateFrameNumbers('ash', {start: 0, end: 9, first: 0}),
            frameRate: 30
        });

        //score
        this.p1Score = 0;
        //score display
        let scoreConfig = {
            fontFamily: 'SpookyBooah',
            fontSize: '28px',
            //backgroundColor: '#F3B141',
            color: '#FFFF00',
            align: 'left',
            padding: {
                top: 0,
                bottom: 5,
            },
            fixedWidth: 100
        }
        this.scoreLeft = this.add.text(69, 54, this.p1Score, scoreConfig);

        //game over flag
        this.gameOver = false;
        
        //60 second play clock
        scoreConfig.fixedWidth = 0;

        this.clock = this.time.delayedCall(game.settings.gameTimer, () => { 
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, '(F) ire to Restart or <- for Menu', scoreConfig).setOrigin(0.5);
            this.gameOver = true;
        }, null, this);

        //display clock
        {
            console.log('create');
            this.initialTime = game.settings.gameTimer/1000;
        
            text = this.add.text(32, 32, 'Countdown: ' + formatTime(this.initialTime));
        
            timedEvent = this.time.addEvent({ delay: 1000, callback: onEvent, callbackScope: this, loop: true});
        }

    }

    update() {
        // check key input for restart
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyF)) {
            this.scene.restart(this.p1Score);
        }
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
        }
        // scroll starfield
        this.sky.tilePositionX -= 3;

        if (!this.gameOver) {
        //update rocket
        this.p1Cross.update();
        // update spaceship
        this.ghost01.update();
        this.ghost02.update();
        this.ghost03.update();
    }
        //check collisions
        if (this.checkCollision(this.p1Cross, this.ghost03)) {
            this.p1Cross.reset();
            this.ghostScatter(this.ghost03);
        }
        if (this.checkCollision(this.p1Cross, this.ghost02)) {
            this.p1Cross.reset();
            this.ghostScatter(this.ghost02);
        }
        if (this.checkCollision(this.p1Cross, this.ghost01)) {
            this.p1Cross.reset();
            this.ghostScatter(this.ghost01);
        }
    }

        checkCollision(cross, ghost) {
            // simple AABB checking
            if (cross.x < ghost.x + ghost.width &&
                cross.x + cross.width > ghost.x &&
                cross.y < ghost.y + ghost.height &&
                cross.height + cross.y > ghost.y) {
                    return true;
            } else {
                return false;
            }
        }

        ghostScatter(ghost) {
            ghost.alpha = 0;     //temporarily hide ship
            //create explosion sprite at ship's position
            let boom = this.add.sprite(ghost.x, ghost.y, 'ash').setOrigin(0, 0);
            boom.anims.play('ash');     //play explode animation
            boom.on('animationcomplete', () => {        //callback after animation completes
                ghost.reset();       //reset ship position
                ghost.alpha = 1;     //make ship visible again
                boom.destroy();     //remove explosion sprite
            });
            // score increment and repaint
            this.p1Score += ghost.points;
            this.scoreLeft.text = this.p1Score;

            this.sound.play('sfx_explosion');
        }

}
        // display clock text
        var text;
        var timedEvent;
        function formatTime(seconds){
                //min
                minutes = Math.floor(seconds/60);
                //secs
                partInSeconds = seconds%60;
                //add left zeroes to secs
                partInSeconds = partInSeconds.toString().padStart(2, '0');
                //returns time
                return `${minutes}:${partInSeconds}`;
           
        }
        
        function onEvent () {
            if (!this.gameOver) {
            this.initialTime -= 1; //one sec
            text.setText('Countdown: ' + formatTime(this.initialTime));
        } else {
            this.clock = false;
        }
        }