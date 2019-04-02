import { CONSTANTS } from '../constants';

export class LVL2Scene extends Phaser.Scene {
    meriel!: Phaser.Physics.Arcade.Sprite;
    wizard!: Phaser.Physics.Arcade.Sprite;
    keyboard!: Phaser.Input.Keyboard;
    level2!: object;
    terrain!: object;
    backgroundLayer!: object;
    blockedLayer!: object;

    constructor() {
        super({
            key: CONSTANTS.SCENES.LVL2
        });
    }
    preload() {
        // load in level1 image and json
        this.load.tilemapTiledJSON('level2', './assets/level2.json');

        this.load.spritesheet('terrain', './assets/terrain.png', {
            frameWidth: 16,
            frameHeight: 16
        });

        this.load.spritesheet('outside', './assets/outside.png', {
            frameWidth: 16,
            frameHeight: 16
        });


        this.load.on('load', (file: Phaser.Loader.File) => {
            console.log(file.src);
        });

        
    }

    create() {
        // create tilemap and tilesetimage
        this.level2 = this.make.tilemap({ key: 'level2'});
        //add tileset image
        this.level2.addTilesetImage('terrain');
        this.terrain = this.level2.addTilesetImage('outside');


        // create map layers
        this.backgroundLayer = this.level2.createStaticLayer('Background', this.terrain, 0, 0);

        this.blockedLayer = this.level2.createStaticLayer('Blocked', this.terrain, 0, 0);
        this.blockedLayer.setCollisionByExclusion([-1]);

        // add tileEvent to change scene
        // this.blockedLayer.setTileLocationCallback(24, 4, 1, 1, ()=> {
        //     this.scene.start(CONSTANTS.SCENES.MENU);
        // })

        //create elf animation
        
        this.anims.create({
            key: 'meriel_downW',
            frames: this.anims.generateFrameNumbers('meriel', { start: 1, end: 2 }),
            frameRate: 5,
            repeat: 1
        });

        this.anims.create({
            key: 'meriel_leftW',
            frames: this.anims.generateFrameNumbers('meriel', { start: 7, end: 8 }),
            frameRate: 5,
            repeat: 1
        });

        this.anims.create({
            key: 'meriel_rightW',
            frames: this.anims.generateFrameNumbers('meriel', { start: 16, end: 17 }),
            frameRate: 5,
            repeat: 1
        });

        this.anims.create({
            key: 'meriel_upW',
            frames: this.anims.generateFrameNumbers('meriel', { start: 23, end: 24 }),
            frameRate: 5,
            repeat: 1
        });

        //create meriel sprite
        this.meriel = this.physics.add.sprite(
            this.game.renderer.width / 2,
            this.game.renderer.height * 0.7,
            'meriel',
            0
        );
        this.meriel
            .setScale(1.2)
            .setCollideWorldBounds(true)
            .setSize(20, 38)
            .setOffset(2, 0);
        
        //create wizard animation and sprite
        

        this.wizard = this.physics.add.staticImage(
            this.game.renderer.width / 2,
            this.game.renderer.height / 2,
            'wizard_m',
        );
        this.wizard
            .setScale(1.5)
            .setImmovable(true)
            .setSize(24, 42)
            .setOffset(-3, -4);

        // create keyboard inputs and assign to WASD
        this.keyboard = this.input.keyboard.addKeys('W, A, S, D');

        // //collisions
        this.physics.add.collider(this.meriel, this.blockedLayer);
    }

    update() {
        this.physics.world.collide(this.meriel, this.wizard);

        if (this.meriel.active) {
            if (this.keyboard.D.isDown === true) {
                this.meriel.setVelocityX(80);
                this.meriel.play('meriel_rightW', true);
            } else if (this.keyboard.A.isDown === true) {
                this.meriel.setVelocityX(-80);
                this.meriel.play('meriel_leftW', true);
            } else if (this.keyboard.D.isUp && this.keyboard.A.isUp) {
                this.meriel.setVelocityX(0);
            }

            if (this.keyboard.S.isDown === true) {
                this.meriel.setVelocityY(80);
                this.meriel.play('meriel_downW', true);
            } else if (this.keyboard.W.isDown === true) {
                this.meriel.setVelocityY(-80);
                this.meriel.play('meriel_upW', true);
            } else if (this.keyboard.S.isUp && this.keyboard.W.isUp) {
                this.meriel.setVelocityY(0);
            }
        }
    }
}
