import { CONSTANTS } from '../constants';

export class PlayScene extends Phaser.Scene {
    //@ts-ignore
    elf: Phaser.Physics.Arcade.Sprite;
    //@ts-ignore
    wizard: Phaser.Physics.Arcade.Sprite;
    //@ts-ignore
    keyboard: Phaser.Input.Keyboard;
    //@ts-ignore
    backgroundLayer: object;
    //@ts-ignore
    blockedLayer: object;

    constructor() {
        super({
            key: CONSTANTS.SCENES.PLAY
        });
    }
    preload() {
        // load in level1 image and json
        this.load.spritesheet('dungeon_tileset', './assets/dungeon_tileset.png', {
            frameWidth: 16,
            frameHeight: 16
        });

        this.load.tilemapTiledJSON('level1', './assets/level1.json');

        
    }

    create() {
        //create tilemap and tilesetimage
        let level1 = this.add.tilemap('level1');

        let terrain = level1.addTilesetImage('dungeon_tileset');

        // create map layers
        this.backgroundLayer = level1.createStaticLayer('Background', [terrain], 0, 0);

        this.blockedLayer = level1.createStaticLayer('Blocked', [terrain], 0, 0);

        //create elf animation
        this.anims.create({
            key: 'elf_iddle',
            frames: this.anims.generateFrameNumbers('elf_m', { start: 1, end: 4 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'elf_run',
            frames: this.anims.generateFrameNumbers('elf_m', { start: 4, end: 8 }),
            frameRate: 10,
            repeat: 1
        });

        //create elf sprite
        this.elf = this.physics.add.sprite(
            this.game.renderer.width / 2,
            this.game.renderer.height * 0.9,
            'elf_m',
            1
        );
        this.elf
            .setScale(1.5)
            .setCollideWorldBounds(true)
            .setSize(20, 28)
            .setOffset(0, 8);

        //create wizard animation and sprite
        this.anims.create({
            key: 'wizard_iddle',
            frames: this.anims.generateFrameNumbers('wizard_m', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.wizard = this.physics.add.sprite(
            this.game.renderer.width / 2,
            this.game.renderer.height / 2,
            'wizard_m',
            1
        );
        this.wizard
            .setScale(1.5)
            .play('wizard_iddle')
            .setImmovable(true)
            .setSize(20, 28)
            .setOffset(0, 8);

        // create keyboard inputs and assign to WASD
        this.keyboard = this.input.keyboard.addKeys('W, A, S, D');

        // //collisions
    }

    update() {
        this.physics.world.collide(this.elf, this.wizard);

        if (this.elf.active) {
            if (this.keyboard.D.isDown === true) {
                this.elf.setVelocityX(64);
                this.elf.play('elf_run', true);
            } else if (this.keyboard.A.isDown === true) {
                this.elf.setVelocityX(-64);
                this.elf.play('elf_run', true);
            } else if (this.keyboard.D.isUp && this.keyboard.A.isUp) {
                this.elf.setVelocityX(0);
            }

            if (this.keyboard.S.isDown === true) {
                this.elf.setVelocityY(64);
                this.elf.play('elf_run', true);
            } else if (this.keyboard.W.isDown === true) {
                this.elf.setVelocityY(-64);
                this.elf.play('elf_run', true);
            } else if (this.keyboard.D.isUp && this.keyboard.A.isUp) {
                this.elf.setVelocityY(0);
            }
        }
    }
}
