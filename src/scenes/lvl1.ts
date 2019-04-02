import { CONSTANTS } from '../constants';

export class LVL1Scene extends Phaser.Scene {
    //@ts-ignore
    meriel: Phaser.Physics.Arcade.Sprite;
    //@ts-ignore
    wizard: Phaser.Physics.Arcade.Sprite;
    //@ts-ignore
    keyboard: Phaser.Input.Keyboard;
    //@ts-ignore
    level1: object;
    terrain: object;
    backgroundLayer: object;
    //@ts-ignore
    blockedLayer: object;

    constructor() {
        super({
            key: CONSTANTS.SCENES.LVL1
        });
    }
    preload() {
        // load in level1 image and json
        this.load.tilemapTiledJSON('level1', './assets/level1.json');

        this.load.spritesheet('dungeon', './assets/dungeon.png', {
            frameWidth: 16,
            frameHeight: 16
        });


        this.load.on('load', (file: Phaser.Loader.File) => {
            console.log(file.src);
        });

        
    }

    create() {
        // create tilemap and tilesetimage
        this.level1 = this.make.tilemap({ key: 'level1'});
        //add tileset image
        this.terrain = this.level1.addTilesetImage('dungeon');

        // create map layers
        this.backgroundLayer = this.level1.createStaticLayer('Background', this.terrain, 0, 0);

        this.blockedLayer = this.level1.createStaticLayer('Blocked', this.terrain, 0, 0);
        this.blockedLayer.setCollisionByExclusion([-1]);

        // add tileEvent to change scene
        this.blockedLayer.setTileLocationCallback(24, 4, 1, 1, ()=> {
            this.scene.start(CONSTANTS.SCENES.MENU);
        })

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
                this.meriel.setVelocityX(64);
                this.meriel.play('meriel_rightW', true);
            } else if (this.keyboard.A.isDown === true) {
                this.meriel.setVelocityX(-64);
                this.meriel.play('meriel_leftW', true);
            } else if (this.keyboard.D.isUp && this.keyboard.A.isUp) {
                this.meriel.setVelocityX(0);
            }

            if (this.keyboard.S.isDown === true) {
                this.meriel.setVelocityY(64);
                this.meriel.play('meriel_downW', true);
            } else if (this.keyboard.W.isDown === true) {
                this.meriel.setVelocityY(-64);
                this.meriel.play('meriel_upW', true);
            } else if (this.keyboard.S.isUp && this.keyboard.W.isUp) {
                this.meriel.setVelocityY(0);
            }
        }
    }
}
