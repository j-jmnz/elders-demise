import { CONSTANTS } from '../constants';

export class LVL2Scene extends Phaser.Scene {
    meriel!: Phaser.Physics.Arcade.Sprite;
    wizard!: Phaser.Physics.Arcade.Sprite;
    keyboard!: Phaser.Input.Keyboard;
    level2!: Phaser.Tilemaps.Tilemap;
    terrain!: object;
    backgroundLayer!: Phaser.Tilemaps.DynamicTilemapLayer;
    blockedLayer!: object;
    outside: any;
    goblins!: Phaser.Physics.Arcade.Group;
    goblin!: Phaser.Physics.Arcade.Sprite;
    randMove: Phaser.Time.TimerEvent;
    debugGraphics: Phaser.GameObjects.Graphics;

    constructor() {
        super({
            key: CONSTANTS.SCENES.LVL2
        });
    }
    preload() {
        this.load.spritesheet('level2_std', './assets/level2_std.png', {
            frameWidth: 16,
            frameHeight: 16
        });

        this.load.tilemapTiledJSON('level2', './assets/level2_2.json');

        /////////// create meriel animations
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

        /////// create goblin animations
        this.anims.create({
            key: 'goblin_downW',
            frameRate: 4,
            frames: this.anims.generateFrameNames('characters', {
                prefix: 'goblin_down_walk',
                suffix: '.png',
                start: 1,
                end: 2
            })
        });

        this.anims.create({
            key: 'goblin_upW',
            frameRate: 4,
            frames: this.anims.generateFrameNames('characters', {
                prefix: 'goblin_up_walk',
                suffix: '.png',
                start: 1,
                end: 2
            })
        });

        this.anims.create({
            key: 'goblin_rightW',
            frameRate: 4,
            frames: this.anims.generateFrameNames('characters', {
                prefix: 'goblin_right_walk',
                suffix: '.png',
                start: 1,
                end: 2
            })
        });

        this.anims.create({
            key: 'goblin_leftW',
            frameRate: 4,
            frames: this.anims.generateFrameNames('characters', {
                prefix: 'goblin_left_walk',
                suffix: '.png',
                start: 1,
                end: 2
            })
        });
    }

    create() {
        // create tilemap and tilesetimage
        this.level2 = this.make.tilemap({ key: 'level2' })
       
        //add tileset image
        this.terrain = this.level2.addTilesetImage('level2_std')
        
        // create map layers
        this.backgroundLayer = this.level2.createStaticLayer('Background', this.terrain, 0, 0);
        this.blockedLayer = this.level2.createStaticLayer('Blocked', this.terrain, 0, 0);
        
        this.blockedLayer.setCollisionByExclusion([-1]);
        
        // add tileEvent to change scene
        this.blockedLayer.setTileLocationCallback(9, 35, 1, 1, () => {
            this.scene.start(CONSTANTS.SCENES.LVL1);
            console.log(CONSTANTS.SCENES.LVL1);
        });

        //create meriel sprite
        this.meriel = this.physics.add.sprite(
            this.game.renderer.width * 0.2,
            this.game.renderer.height * 0.88,
            'characters',
            'meriel_down_stand.png'
        );
        this.meriel
            .setScale(1.5)
            .setCollideWorldBounds(true)
            .setSize(15, 23)
            .setOffset(0, 1);

        // create goblin sprite
        this.goblin = this.physics.add.sprite(
            this.game.renderer.width * 0.5,
            this.game.renderer.height * 0.5,
            'enemies',
            'gob_5_8_idle1(1).png'
        );
        this.goblin
            .setImmovable(true)
            .setCollideWorldBounds(true)
            .setScale(1.5)

        // create goblins groups
        this.goblins = this.physics.add.group({ immovable: true });
        this.goblins.add(this.physics.add.sprite(
            200,
            200,
            'characters',
            'goblin_left_walk1.png'
        ));

        
        // create keyboard inputs and assign to WASD
        this.keyboard = this.input.keyboard.addKeys('W, A, S, D');

        // //collisions
        this.physics.add.collider(this.meriel, this.blockedLayer);

        this.physics.add.collider(this.meriel, this.goblins, ()=> {
            this.scene.transition({
                target: CONSTANTS.SCENES.BATTLE
            })
        });

        this.physics.add.collider(this.blockedLayer, this.goblin);

        // goblin move randomizer
        this.randMove = this.time.addEvent({
            delay: 2000,
            callback: () => this.move(this.goblin),
            callbackScope: this,
            loop: true
        });

    }

    update() {
        if (this.meriel.active) {
            if (this.keyboard.D.isDown === true) {
                this.meriel.setVelocityX(100);
                this.meriel.play('meriel_rightW', true);
            } else if (this.keyboard.A.isDown === true) {
                this.meriel.setVelocityX(-100);
                this.meriel.play('meriel_leftW', true);
            } else if (this.keyboard.D.isUp && this.keyboard.A.isUp) {
                this.meriel.setVelocityX(0);
            }

            if (this.keyboard.S.isDown === true) {
                this.meriel.setVelocityY(100);
                this.meriel.play('meriel_downW', true);
            } else if (this.keyboard.W.isDown === true) {
                this.meriel.setVelocityY(-100);
                this.meriel.play('meriel_upW', true);
            } else if (this.keyboard.S.isUp && this.keyboard.W.isUp) {
                this.meriel.setVelocityY(0);
            }
        }
    }

    move(sprite) {
        const randNumber1 = Math.floor(Math.random() * 4 + 1);

        if (randNumber1 === 1) {
            sprite.setVelocityX(100);
            sprite.play('goblin_rightW', true);
        } else if (randNumber1 === 2) {
            sprite.setVelocityX(-100);
            sprite.play('goblin_leftW', true);
        } else if (randNumber1 === 3) {
            sprite.setVelocityY(-100);
            sprite.play('goblin_upW', true);
        } else if (randNumber1 === 4) {
            sprite.setVelocityY(100);
            sprite.play('goblin_downW', true);
        }

        this.time.addEvent({
            delay: 500,
            callback: () => {
                sprite.setVelocity(0);
            },
            callbackScope: this
        });
    }
}
