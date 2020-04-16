class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        //load images/title sprite
        this.load.image('cross', './assets/cross.png');
        this.load.image('ghost', './assets/ghost.png');
        this.load.image('sky', './assets/sky.png');
        this.load.spritesheet('scatter', './assets/scatter.png', {frameWidth: 64, frameHeight: 64, startFrame: 0, endFrame: 8});
    }

    create() {
        //place tile sprite
        this.sky = this.add.tileSprite(0, 0, 640, 480, 'sky').setOrigin(0, 0);

        // white rectangle borders
        this.add.rectangle(5, 5, 630, 32, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(5, 443, 630, 32, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(5, 5, 32, 455, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(603, 5, 32, 455, 0xFFFFFF).setOrigin(0, 0);

        // green UI bckground
        this.add.rectangle(37, 42, 566, 64, 0X00FF00).setOrigin(0, 0);

        // add rocket(p1)
        this.p1Cross = new Cross(this, game.config.width/2, 431, 'cross').setScale(0.5, 0.5).setOrigin(0, 0.4);

        // add spaceships x3
        this.ghost01 = new Ghost(this, game.config.width +192, 132, 'ghost', 0, 30).setOrigin(0, 0);
        this.ghost02 = new Ghost(this, game.config.width +96, 196, 'ghost', 0, 20).setOrigin(0, 0);
        this.ghost03 = new Ghost(this, game.config.width, 260, 'ghost', 0, 10).setOrigin(0, 0);

        //define keyboard keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        // animation config
        this.anims.create({
            key: 'scatter',
            frames: this.anims.generateFrameNumbers('scatter', {start: 0, end: 8, first: 0}),
            frameRate: 30
        });

        //score
        this.p1Score = 0;
        //score display
        let scoreConfig = {
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
        this.scoreLeft = this.add.text(69, 54, this.p1Score, scoreConfig);

        //game over flag
        this.gameOver = false;
        
        //60 second play clock
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => { 
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, '(F)ire to Restart or <- for Menu', scoreConfig).setOrigin(0.5);
            this.gameOver = true;
        }, null, this);

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
            let boom = this.add.sprite(ghost.x, ghost.y, 'scatter').setOrigin(0, 0);
            boom.anims.play('scatter');     //play explode animation
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