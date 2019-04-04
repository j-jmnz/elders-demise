import { CONSTANTS } from '../constants';

export class LVL1Scene extends Phaser.Scene {
    meriel!: Phaser.Physics.Arcade.Sprite;
    wizard!: Phaser.Physics.Arcade.Sprite;
    keyboard!: Phaser.Input.Keyboard;
    level1!: object;
    terrain!: object;
    backgroundLayer!: object;
    blockedLayer!: object;
    lich!: Phaser.Physics.Arcade.Sprite;
    randMove!: object;
    wizText: Phaser.GameObjects.Text;

    constructor() {
        super({
            key: CONSTANTS.SCENES.LVL1
        });
    }
    preload() {
        // load in level1 image and json
        // this.load.spritesheet('dungeon', './assets/dungeon.png', {
        //     frameWidth: 16,
        //     frameHeight: 16
        // });

        // this.load.tilemapTiledJSON('level1', './assets/level1.json');

        this.load.spritesheet('dungeon_std', './assets/dungeon_std.png', {
            frameWidth: 16,
            frameHeight: 16
        });

        this.load.tilemapTiledJSON('level1', './assets/level1_1.json');

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
            frameRate: 3,
            repeat: 1,
            frames: this.anims.generateFrameNames('characters', {
                prefix: 'wiz_laugh',
                suffix: '.png',
                start: 1,
                end: 3
            })
        });

        this.anims.create({
            key: 'wiz_pose',
            frameRate: 3,
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
        // create audio isntance and play audio file
        this.lvl1Song = this.sound.add('lvl1_song', {
            loop: true,
            volume: 0.7
        });

        this.lvl1Song.play();

        // create tilemap and tilesetimage
        this.level1 = this.make.tilemap({ key: 'level1' });
        //add tileset image
        this.terrain = this.level1.addTilesetImage('dungeon_std');

        // create map layers
        this.backgroundLayer = this.level1.createStaticLayer('Background', this.terrain, 0, 0);

        this.blockedLayer = this.level1.createStaticLayer('Blocked', this.terrain, 0, 0);
        this.blockedLayer.setCollisionByExclusion([-1]);

        // add tileEvent to change scene
        this.blockedLayer.setTileLocationCallback(24, 4, 1, 1, () => {
            this.lvl1Song.stop();
            this.scene.start(CONSTANTS.SCENES.LVL2);

            console.log(CONSTANTS.SCENES.LVL2);
        });

        //create meriel sprite
        this.meriel = this.physics.add.sprite(
            this.game.renderer.width * 0.45,
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
            .setOffset(0, 0);
        // .play('wiz_idle');

        // create keyboard inputs and assign to WASD
        this.keyboard = this.input.keyboard.addKeys('W, A, S, D');

        //collisions
        this.physics.add.collider(this.meriel, this.blockedLayer);

        this.dialog();
    }

    update() {
        this.physics.world.collide(this.meriel, this.wizard);

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
        const randNumber = Math.floor(Math.random() * 4 + 1);
        randNumber === 1
            ? sprite.setVelocityX(50)
            : randNumber === 2
            ? sprite.setVelocityX(-50)
            : randNumber === 3
            ? sprite.setVelocityY(50)
            : randNumber === 2
            ? sprite.setVelocityY(-50)
            : null;

        this.time.addEvent({
            delay: 500,
            callback: () => {
                sprite.setVelocity(0);
            },
            callbackScope: this
        });
    }

    dialog() {
        // create meriel's health text
        this.time.addEvent({
            delay: 1000,
            callback: () => {
                this.wizText = this.add.text(315, 248, `   APPROACH KID`, {
                    fontSize: '20px',
                    fill: '#fff',
                    align: 'center',
                    fixedWidth: 200,
                    fixedHeight: 100,
                    maxLines: 2
                });
                this.wizard.play('wiz_idle');
            },
            callbackScope: this
        });

        this.time.addEvent({
            delay: 4000,
            callback: () => {
                this.wizText.setText(`YOUR QUEST IS ABOUT TO START`);
                this.wizard.play('wiz_idle');
            },
            callbackScope: this
        });

        this.time.addEvent({
            delay: 7000,
            callback: () => {
                this.wizText.setText(``);
            },
            callbackScope: this
        });

        this.time.addEvent({
            delay: 10000,
            callback: () => {
                this.wizText.setText(`ITS TIME FOR YOU TO PROVE YOUR WORTH`);
                this.wizard.play('wiz_idle');
            },
            callbackScope: this
        });

        this.time.addEvent({
            delay: 13000,
            callback: () => {
                this.wizText.setText(`BE TRUE TO YOUR HERO LEGACY`);
                this.wizard.play('wiz_idle');
            },
            callbackScope: this
        });

        this.time.addEvent({
            delay: 15000,
            callback: () => {
                this.wizText.setText(`AND DEFEAT THE EVIL NECROMANCER!`);
                this.wizard.play('wiz_idle');
            },
            callbackScope: this
        });

        this.time.addEvent({
            delay: 18000,
            callback: () => {
                this.wizText.setText(`HEAD TO THE DUNGEONS OF THE MAGE TOWER`);
                this.wizard.play('wiz_idle');
            },
            callbackScope: this
        });

        this.time.addEvent({
            delay: 21000,
            callback: () => {
                this.wizText.setText(`AND REDEEM THIS LAND FROM ITS HORRORS!`);
                this.wizard.play('wiz_idle');
            },
            callbackScope: this
        });

        this.time.addEvent({
            delay: 24000,
            callback: () => {
                this.wizText.setText(``);
            },
            callbackScope: this
        });

        this.time.addEvent({
            delay: 27000,
            callback: () => {
                this.wizText.setText(`    GO NOW!`);
                this.wizard.play('wiz_idle');
            },
            callbackScope: this
        });

        this.time.addEvent({
            delay: 29000,
            callback: () => {
                this.wizText.setText(``);
                this.wizard.play('wiz_pose');
            },
            callbackScope: this
        });
    }
}
