import { CONSTANTS } from '../constants';

export class LVL2Scene extends Phaser.Scene {
    meriel!: Phaser.Physics.Arcade.Sprite;
    wizard!: Phaser.Physics.Arcade.Sprite;
    keyboard!: Phaser.Input.Keyboard;
    level2!: object;
    terrain!: object;
    backgroundLayer!: object;
    blockedLayer!: object;
    outside: any;

    constructor() {
        super({
            key: CONSTANTS.SCENES.LVL2
        });
    }
    preload() {
        // load in level1 image and json
        // this.load.spritesheet('terrain', './assets/terrain.png', {
        //     frameWidth: 16,
        //     frameHeight: 16
        // });

        // this.load.spritesheet('outside', './assets/outside.png', {
        //     frameWidth: 16,
        //     frameHeight: 16
        // });

        this.load.spritesheet('level2_std', './assets/level2_std.png', {
            frameWidth: 16,
            frameHeight: 16
        });
        
        this.load.tilemapTiledJSON('level2', './assets/level2_2.json');

        // create meriel animations
        this.anims.create({
            key: 'meriel_downW',
            frameRate: 4,
            frames: this.anims.generateFrameNames('characters', {
                prefix: 'meriel_down_walk',
                suffix: '.png',
                start: 1,
                end: 2
            })
        });

        this.anims.create({
            key: 'meriel_upW',
            frameRate: 4,
            frames: this.anims.generateFrameNames('characters', {
                prefix: 'meriel_up_walk',
                suffix: '.png',
                start: 1,
                end: 2
            })
        });

        this.anims.create({
            key: 'meriel_rightW',
            frameRate: 4,
            frames: this.anims.generateFrameNames('characters', {
                prefix: 'meriel_right_walk',
                suffix: '.png',
                start: 1,
                end: 2
            })
        });

        this.anims.create({
            key: 'meriel_leftW',
            frameRate: 4,
            frames: this.anims.generateFrameNames('characters', {
                prefix: 'meriel_left_walk',
                suffix: '.png',
                start: 1,
                end: 2
            })
        });

        // create wiz animation
        this.anims.create({
            key: 'wiz_idle',
            frameRate: 6,
            repeat: -1,
            frames: this.anims.generateFrameNames('characters', {
                prefix: 'wiz_pose',
                suffix: '.png',
                start: 1,
                end: 3
            })
        });


        this.load.on('load', (file: Phaser.Loader.File) => {
            console.log(file.src);
        });

        
    }

    create() {
        // create tilemap and tilesetimage
        this.level2 = this.make.tilemap({ key: 'level2'});
        //add tileset image
        this.terrain = this.level2.addTilesetImage('level2_std');
        


        // create map layers
        this.backgroundLayer = this.level2.createStaticLayer('Background', this.terrain, 0, 0)
        this.blockedLayer = this.level2.createStaticLayer('Blocked', this.terrain, 0, 0)

        this.blockedLayer.setCollisionByExclusion([-1]);

        // add tileEvent to change scene
        // this.blockedLayer.setTileLocationCallback(24, 4, 1, 1, ()=> {
        //     this.scene.start(CONSTANTS.SCENES.MENU);
        // })

        //create elf animation
        
        
        //create meriel sprite
        this.meriel = this.physics.add.sprite(
            this.game.renderer.width * 0.2,
            this.game.renderer.height * 0.9,
            'characters',
            'meriel_down_stand.png'
        );
        this.meriel
            .setScale(1.5)
            .setCollideWorldBounds(true)
            .setSize(18, 30)
            .setOffset(0, 0);

        //create wizard sprite

        this.wizard = this.physics.add.sprite(
            this.game.renderer.width / 2,
            this.game.renderer.height / 2,
            'characters',
            'wiz_down_stand.png'
        );
        this.wizard
            .setScale(1.5)
            .setImmovable(true)
            .setSize(24, 30)
            .setOffset(0, 0)
            .play('wiz_idle');

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
