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
    collidingEnemy: Array;
    goblin3: any;
    goblin2: Phaser.Physics.Arcade.Sprite;

    constructor() {
        super({
            key: CONSTANTS.SCENES.LVL2
        });
    }

    init(data) {
        if (data.hasOwnProperty('playerX') === true) {
            this.playerX = data.playerX;
            this.playerY = data.playerY;
            this.collidingEnemy = data.collidingEnemy;
        } else if (data.hasOwnProperty('playerX') === false) {
            this.playerX = this.game.renderer.width * 0.2;
            this.playerY = this.game.renderer.height * 0.9;
            this.collidingEnemy = [];
        }
    }

    preload() {
        this.scene.bringToTop(CONSTANTS.SCENES.LVL2);

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
        // create audio isntance and play audio file
        this.lvl2Song = this.sound.add('lvl2_song', {
            loop: true,
            volume: 0.7
        });

        this.lvl2Song.play();
        // create tilemap and tilesetimage
        this.level2 = this.make.tilemap({ key: 'level2' });

        //add tileset image
        this.terrain = this.level2.addTilesetImage('level2_std');

        // create map layers
        this.backgroundLayer = this.level2.createStaticLayer('Background', this.terrain, 0, 0);
        this.blockedLayer = this.level2.createStaticLayer('Blocked', this.terrain, 0, 0);

        this.blockedLayer.setCollisionByExclusion([-1]);

        // add tileEvent to change scene
        this.blockedLayer.setTileLocationCallback(9, 35, 1, 1, () => {
            // this.scene.start(CONSTANTS.SCENES.LVL1);
            // console.log(CONSTANTS.SCENES.LVL1);
        });

        //create meriel sprite
        this.meriel = this.physics.add.sprite(
            this.playerX,
            this.playerY,
            'characters',
            'meriel_up_stand.png'
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
            .setSize(15, 23)
            .setOffset(1, 0);

        ////// create goblins groups
        // goblin2
        this.goblin2 = this.physics.add.sprite(
            this.game.renderer.width * 0.69,
            this.game.renderer.height * 0.69,
            'enemies',
            'gob_5_8_idle1(1).png'
        );
        this.goblin2
            .setImmovable(true)
            .setCollideWorldBounds(true)
            .setScale(1.5)
            .setSize(15, 23)
            .setOffset(1, 0);

        // goblin3
        this.goblin3 = this.physics.add.sprite(
            this.game.renderer.width * 0.2,
            this.game.renderer.height * 0.2,
            'enemies',
            'gob_5_8_idle1(1).png'
        );
        this.goblin3
            .setImmovable(true)
            .setCollideWorldBounds(true)
            .setScale(1.5)
            .setSize(15, 23)
            .setOffset(1, 0);

        // create keyboard inputs and assign to WASD
        this.keyboard = this.input.keyboard.addKeys('W, A, S, D');

        // //collisions
        this.physics.add.collider(this.meriel, this.blockedLayer);

        this.physics.add.collider(this.meriel, this.goblin, () => {
            this.lvl2Song.stop();
            this.collidingEnemy.push('goblin')
            this.scene.start(CONSTANTS.SCENES.BATTLE, {
                playerX: this.meriel.x,
                playerY: this.meriel.y,
                collidingEnemy: this.collidingEnemy
            });
        });

        this.physics.add.collider(this.meriel, this.goblin2, () => {
            this.lvl2Song.stop();
            this.collidingEnemy.push('goblin2')
            this.scene.start(CONSTANTS.SCENES.BATTLE, {
                playerX: this.meriel.x,
                playerY: this.meriel.y,
                collidingEnemy: this.collidingEnemy
            });
        });

        this.physics.add.collider(this.meriel, this.goblin3, () => {
            this.lvl2Song.stop();
            this.collidingEnemy.push('goblin3')
            this.scene.start(CONSTANTS.SCENES.BATTLE, {
                playerX: this.meriel.x,
                playerY: this.meriel.y,
                collidingEnemy: this.collidingEnemy
            });
        });

        this.physics.add.collider(this.blockedLayer, this.goblin);
        this.physics.add.collider(this.blockedLayer, this.goblin2);
        this.physics.add.collider(this.blockedLayer, this.goblin3);

        // goblin move randomizer
        this.randMove = this.time.addEvent({
            delay: 1000,
            callback: () => this.move(this.goblin),
            callbackScope: this,
            loop: true
        });

        this.randMove = this.time.addEvent({
            delay: 1500,
            callback: () => this.move(this.goblin2),
            callbackScope: this,
            loop: true
        });

        this.randMove = this.time.addEvent({
            delay: 2000,
            callback: () => this.move(this.goblin3),
            callbackScope: this,
            loop: true
        });


        // despawn colliding enemy after battle scene
        if (this.collidingEnemy.some(el => el === 'goblin')) {
            this.goblin.setVisible(false);
            this.goblin.disableBody(true)
        } else if (this.collidingEnemy.some(el => el === 'goblin2')) {
            this.goblin2.setVisible(false);
            this.goblin2.disableBody(true)

        } else if (this.collidingEnemy.some(el => el === 'goblin3')) {
            this.goblin3.setVisible(false);
            this.goblin3.disableBody(true)
        }
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
