// Ghost prefab
class Ghost extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, pointValue) {
        super(scene, x, y, texture, frame);

        scene.add.existing(this);// add to an existng scene, displayList, updateList
        this.points = pointValue;
    }

    update() {
// move spacehsip left
        this.x -= game.settings.ghostSpeed;
        // wraparound screen bounds
        if(this.x <= 0 - this.width){
            this.x = game.config.width;
        }

    }

    reset() {
        this.x = game.config.width;
    }
}