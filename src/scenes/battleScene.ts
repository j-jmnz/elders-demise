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
    forestField: Phaser.GameObjects.TileSprite;
    forestBot!: Phaser.GameObjects.Image;

    constructor() {
        super({
            key: CONSTANTS.SCENES.BATTLE
        });
    }
    preload() {
        
        this.load.spritesheet('forest_bot', './assets/forest_bot.png', {
            frameWidth: 16,
            frameHeight: 16
        });
        
        this.load.tilemapTiledJSON('battle', './assets/battle.json');

        this.load.image('forest', './assets/forest.png');
        

        // create meriel animations
        
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

        this.blockedLayer = this.battle.createStaticLayer('Blocked', this.forestBot, 0, 0);
        this.blockedLayer.setCollisionByExclusion([-1])
        this.blockedLayer.setDepth(1);
        


        //create meriel sprite
        this.meriel = this.physics.add.sprite(
            this.game.renderer.width * 0.2,
            this.game.renderer.height * 0.85,
            'characters',
            'meriel_right_stand.png'
        );
        this.meriel
            .setScale(2.5)
            .setCollideWorldBounds(true)
            .setSize(18, 24)
            .setOffset(0, 0);

        // create lich sprite
        this.lich = this.physics.add.sprite(
            this.game.renderer.width / 2,
            this.game.renderer.height * 0.3,
            'enemies',
            'monster_lich-0.png'
        );
        this.lich
            .setImmovable(true)
            .setCollideWorldBounds(true)
            .setScale(0.5)
            .setVisible(true);

        // create keyboard inputs and assign to WASD
        this.keyboard = this.input.keyboard.addKeys('W, A, S, D');

        // //collisions
        

        this.physics.add.collider(this.meriel, this.lich, (meriel, lich) => {
            
        });

        this.physics.add.collider(this.meriel, this.blockedLayer);

        // lich move randomizer
        this.randMove = this.time.addEvent({
            delay: 1000,
            callback: () => this.move(this.lich),
            callbackScope: this,
            loop: true
        });
    }

    update() {
        this.forestField.tilePositionX += 0.5;


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
        }
    }

    move(sprite) {
        const randNumber = Math.floor(Math.random() * 2 + 1);
        randNumber === 1
            ? sprite.setVelocityX(50)
            : randNumber === 2
            ? sprite.setVelocityX(-50)
            : null;

        this.time.addEvent({
            delay: 500,
            callback: () => {
                sprite.setVelocity(0);
            },
            callbackScope: this
        });
    }
}
