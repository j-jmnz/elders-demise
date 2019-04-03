import { CONSTANTS } from '../constants';

export class BattleScene extends Phaser.Scene {
    meriel!: Phaser.Physics.Arcade.Sprite;
    wizard!: Phaser.Physics.Arcade.Sprite;
    keyboard!: Phaser.Input.Keyboard;
    level1!: object;
    terrain!: object;
    backgroundLayer!: object;
    blockedLayer!: object;
    lich!: Phaser.Physics.Arcade.Sprite;
    randMove!: object;
    forestField!: Phaser.GameObjects.TileSprite;
    forestBot!: Phaser.GameObjects.Image;
    goblin!: Phaser.Physics.Arcade.Sprite;

    constructor() {
        super({
            key: CONSTANTS.SCENES.BATTLE
        });
    }
    preload() {
        // load background and bot layer tilemap and images
        this.load.spritesheet('forest_bot', './assets/forest_bot.png', {
            frameWidth: 16,
            frameHeight: 16
        });
        this.load.tilemapTiledJSON('battle', './assets/battle.json');
        this.load.image('forest', './assets/forest.png');

        // load attack atlas and image
        this.load.atlas('attacks', './assets/attacks.png', './assets/attacks.json');

        this.load.atlas(
            'attacks_enemies',
            './assets/attacks_enemies.png',
            './assets/attacks_enemies.json'
        );

        ///// create meriel animations
        // walk
        this.anims.create({
            key: 'meriel_rightW',
            frameRate: 4,
            frames: this.anims.generateFrameNames('characters', {
                prefix: '5_6_walk(',
                suffix: ').png',
                start: 1,
                end: 2
            })
        });

        //idle
        this.anims.create({
            key: 'meriel_idle',
            frameRate: 4,
            repeat: -1,
            frames: this.anims.generateFrameNames('characters', {
                prefix: '5_6_idle1(',
                suffix: ').png',
                start: 1,
                end: 3
            })
        });

        //attack
        this.anims.create({
            key: 'meriel_attack2',
            frameRate: 4,
            frames: this.anims.generateFrameNames('characters', {
                prefix: '5_6_atk2(',
                suffix: ').png',
                start: 1,
                end: 3
            })
        });

        /////// create goblin animations
        //idle
        this.anims.create({
            key: 'goblin_idle',
            frameRate: 4,
            repeat: -1,
            frames: this.anims.generateFrameNames('enemies', {
                prefix: 'gob_5_8_idle1(',
                suffix: ').png',
                start: 1,
                end: 3
            })
        });

        //walk
        this.anims.create({
            key: 'goblin_walk',
            frameRate: 4,
            frames: this.anims.generateFrameNames('enemies', {
                prefix: 'gob_5_8_walk(',
                suffix: ').png',
                start: 1,
                end: 3
            })
        });

        //attack
        this.anims.create({
            key: 'goblin_attack',
            frameRate: 4,
            frames: this.anims.generateFrameNames('enemies', {
                prefix: 'gob_5_8_atk2(',
                suffix: ').png',
                start: 1,
                end: 3
            })
        });

        this.load.on('load', (file: Phaser.Loader.File) => {
            console.log(file.src);
        });
    }

    create() {
        // add forest backkground tilesprite
        this.forestField = this.add.tileSprite(0, -200, 928, 793, 'forest').setOrigin(0);

        // create tilemap and tilesetimage
        this.battle = this.make.tilemap({ key: 'battle' });

        //add tileset image
        this.forestBot = this.battle.addTilesetImage('forest_bot');
        // create layers
        this.blockedLayer = this.battle.createStaticLayer('Blocked', this.forestBot, 0, 0);
        this.blockedLayer.setCollisionByExclusion([-1]);
        this.blockedLayer.setDepth(1);

        //create meriel sprite
        this.meriel = this.physics.add.sprite(
            this.game.renderer.width * 0.2,
            this.game.renderer.height * 0.81,
            'characters',
            '5_6_idle1(1).png'
        );
        this.meriel
            .setSize(15, 23)
            .setScale(2.5)
            .setCollideWorldBounds(true)
            .play('meriel_idle')
            .setFlipX(true)

        // create goblin sprite
        this.goblin = this.physics.add.sprite(
            this.game.renderer.width * 0.8,
            this.game.renderer.height * 0.78,
            'enemies',
            'gob_5_8_idle1(1).png'
        );
        this.goblin
            .setSize(15, 23)
            .setImmovable(true)
            .setCollideWorldBounds(true)
            .setScale(3.5)
            .play('goblin_idle')

        // create keyboard inputs and assign to WASDKL
        this.keyboard = this.input.keyboard.addKeys('W, A, S, D, K, L');

        // //collisions
        this.physics.add.collider(this.meriel, this.goblin, (meriel, goblin) => {});
        this.physics.add.collider(this.meriel, this.blockedLayer);

        // goblin move randomizer
        this.randMove = this.time.addEvent({
            delay: 2000,
            callback: () => this.move(this.goblin),
            callbackScope: this,
            loop: true
        });
    }

    update() {
        // background scrolling
        this.forestField.tilePositionX += 0.5;

        //keyboard animations interaction
        if (this.meriel.active) {
            //walking animations
            if (this.keyboard.D.isDown === true) {
                this.meriel.setFlipX(true);
                this.meriel.setVelocityX(80);
                this.meriel.play('meriel_rightW', true);
            } else if (this.keyboard.A.isDown === true) {
                this.meriel.setFlipX(false);
                this.meriel.setVelocityX(-80);
                this.meriel.play('meriel_rightW', true);
            } else if (this.keyboard.D.isUp && this.keyboard.A.isUp) {
                this.meriel.setVelocityX(0);
                this.meriel.anims.chain('meriel_idle');
            }
            if (this.keyboard.K.isDown === true) {
                this.meriel.play('meriel_attack2', true);
                this.meriel.anims.chain('meriel_idle');
            }
        }
    }

    move(sprite) {
        const randNumber1 = Math.floor(Math.random() * 2 + 1);
        const randNumber2 = Math.floor(Math.random() * 2 + 1);

        if (randNumber1 === 1) {
            sprite.setFlipX(true);
            sprite.setVelocityX(100);
            sprite.play('goblin_walk', true);
            sprite.anims.chain('goblin_idle');

            if (randNumber2 === 1) {
                sprite.play('goblin_attack')
                sprite.anims.chain('goblin_idle');

            }

        } else if (randNumber1 === 2) {
            sprite.setFlipX(false);
            sprite.setVelocityX(-100);
            sprite.play('goblin_walk', true);
            sprite.anims.chain('goblin_idle');

            if (randNumber2 === 1) {
                sprite.play('goblin_attack')
                sprite.anims.chain('goblin_idle');

            }
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
