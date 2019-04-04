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
    goblinAttackAnim!: Phaser.Animations.Animation;
    graceTime!: object;
    gracePeriod!: number;

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

        //death
        this.anims.create({
            key: 'goblin_death',
            frameRate: 1,
            frames: this.anims.generateFrameNames('enemies', {
                prefix: 'gob_5_8_crouch(',
                suffix: ').png',
                start: 1,
                end: 4
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
        this.meriel.graceTime = false;
        this.meriel.health = 10;
        this.meriel.alive = true;
        this.meriel
            .setSize(15, 23)
            .setScale(2.5)
            .setCollideWorldBounds(true)
            .play('meriel_idle')
            .setFlipX(true);

        // create meriel's health text
        this.meriel.healthText = this.add.text(12, 50, `HP ${this.meriel.health}`, {
            fontSize: '32px',
            fill: '#fff'
        });

        // create goblin sprite
        this.goblin = this.physics.add.sprite(
            this.game.renderer.width * 0.8,
            this.game.renderer.height * 0.78,
            'enemies',
            'gob_5_8_idle1(1).png'
        );
        this.goblin.health = 10;
        this.goblin.graceTime = false;
        this.goblin.alive = true;
        this.goblin
            .setSize(20, 23)
            .setImmovable(true)
            .setCollideWorldBounds(true)
            .setScale(3.5)
            .play('goblin_idle');

        //create goblin's health text
        this.goblin.healthText = this.add.text(685, 50, `HP ${this.goblin.health}`, {
            fontSize: '32px',
            fill: '#fff'
        });

        // create keyboard inputs and assign to WASDKL
        this.keyboard = this.input.keyboard.addKeys('W, A, S, D, K, L');

        // //collisions
        this.physics.add.collider(this.meriel, this.goblin, () => {
            //if goblin attack animation meriel tints and takes damage
            if (this.goblin.anims.currentAnim.key === 'goblin_attack') {
                this.onHit(this.goblin, this.meriel);
                // on death
                if (this.meriel.health < 1) {
                    this.meriel.alive = false;
                    this.meriel.y += 0.5;
                    this.meriel.play('goblin_death');
                }
            }
            // if meriel attack anim goblin tints and takes damage
            if (this.meriel.anims.currentAnim.key === 'meriel_attack2') {
                this.onHit(this.meriel, this.goblin);
                //on death
                if (this.goblin.health < 1) {
                    this.goblin.alive = false;
                    this.goblin.y += 0.5;
                    this.goblin.play('goblin_death');
                }
            }
        });

        this.physics.add.collider(this.meriel, this.blockedLayer);

        // goblin move randomizer

        this.randMove = this.time.addEvent({
            delay: 2000,
            callback: () => {
                if (this.goblin.alive) {
                    this.move(this.goblin);
                }
            },
            callbackScope: this,
            loop: true
        });

        console.log(this.goblin);
    }

    update() {
        // background scrolling
        this.forestField.tilePositionX += 0.5;

        //keyboard animations interaction
        if (this.meriel.active) {
            //walking animations
            if (this.keyboard.D.isDown === true) {
                this.meriel.setFlipX(true);
                this.meriel.setVelocityX(120);
                this.meriel.play('meriel_rightW', true);
            } else if (this.keyboard.A.isDown === true) {
                this.meriel.setFlipX(false);
                this.meriel.setVelocityX(-120);
                this.meriel.play('meriel_rightW', true);
            } else if (this.keyboard.D.isUp && this.keyboard.A.isUp) {
                this.meriel.setVelocityX(0);
                this.meriel.anims.chain('meriel_idle');
            }
            if (this.keyboard.K.isDown === true) {
                this.meriel.setSize(28, 23).setOffset(10, 10);
                this.meriel.play('meriel_attack2', true);
                this.meriel.anims.chain('meriel_idle');
                this.time.addEvent({
                    delay: 700,
                    callback: () => {
                        this.meriel.setSize(15, 23).setOffset(15, 10);
                    },
                    callbackScope: this
                });
            }
        }

        if (!this.goblin.alive) {
            this.time.addEvent({
                delay: 6500,
                callback: () => {
                    this.scene.start(CONSTANTS.SCENES.LVL2);
                },
                callbackScope: this
            });
        }
    }

    move(sprite) {
        const randNumber1 = Math.floor(Math.random() * 2 + 1);
        const randNumber2 = Math.floor(Math.random() * 2 + 1);

        if (randNumber1 === 1) {
            sprite.setVelocityX(100);
            sprite.play('goblin_walk', true);
            sprite.anims.chain('goblin_idle');

            if (randNumber2 === 1) {
                sprite.setSize(28, 23).setOffset(10, 10);
                sprite.play('goblin_attack');
                sprite.anims.chain('goblin_idle');
                this.time.addEvent({
                    delay: 700,
                    callback: () => {
                        sprite.setSize(20, 23).setOffset(15, 10);
                    },
                    callbackScope: this
                });
            }
        } else if (randNumber1 === 2) {
            sprite.setFlipX(false);
            sprite.setVelocityX(-100);
            sprite.play('goblin_walk', true);
            sprite.anims.chain('goblin_idle');

            if (randNumber2 === 1) {
                sprite.setSize(28, 23).setOffset(10, 10);
                sprite.play('goblin_attack');
                sprite.anims.chain('goblin_idle');
                this.time.addEvent({
                    delay: 700,
                    callback: () => {
                        sprite.setSize(20, 23).setOffset(15, 10);
                    },
                    callbackScope: this
                });
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

    onHit(attacker: Phaser.Physics.Arcade.Sprite, receiver: Phaser.Physics.Arcade.Sprite) {
        this.gracePeriod = 2000;

        if (attacker.graceTime == false) {
            // set hit immunity
            attacker.graceTime = true;
            setTimeout(() => {
                attacker.graceTime = false;
            }, this.gracePeriod);

            // diminish hp
            receiver.health--;
            receiver.healthText.setText(`HP ${receiver.health}`);

            // tint and untint sprite
            receiver.tint = 0xff0000;
            this.time.addEvent({
                delay: 500,
                callback: () => (receiver.tint = 0xffffff),
                callbackScope: this
            });
        }
    }
}
