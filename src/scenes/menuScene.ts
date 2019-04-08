import { CONSTANTS } from '../constants';

export class MenuScene extends Phaser.Scene {
    titleSong!: Phaser.Sound.BaseSound;
    keys: Phaser.GameObjects.Image;

    constructor() {
        super({
            key: CONSTANTS.SCENES.MENU
        });
    }

    create() {
        // play audio files
        this.titleSong = this.sound.add('title_song', {
            loop: true,
            volume: 0.7
        });

        this.titleSong.play();
        // create logo, buttons, and background
        this.add.image(0, 0, 'title_background').setOrigin(0);
        this.add.image(400, 300 * 0.7, 'logo').setScale(0.35);

        this.keys = this.add.image(165, this.game.renderer.height * 0.6, 'keys').setScale(0.15);
        this.keys.visible = false;

        let playButton = this.add
            .image(this.game.renderer.width / 2, this.game.renderer.height * 0.7, 'play_button')
            .setScale(0.1);

        let controlsButton = this.add
            .image(this.game.renderer.width / 2, this.game.renderer.height * 0.81, 'controls_button')
            .setScale(0.1);

        // playbutton interactivity
        playButton.setInteractive();

        playButton.on('pointerover', () => {
            this.sound.play('button_hover');
            playButton.setScale(0.12);
        });

        playButton.on('pointerout', () => {
            playButton.setScale(0.1);
        });

        playButton.on('pointerup', () => {
            this.sound.play('button_select');
            this.time.addEvent({
                delay: 750,
                callback: () => {
                    this.titleSong.stop();
                    this.scene.start(CONSTANTS.SCENES.LVL1);
                },
                callbackScope: this
            });
        });

        /// control button interactivity
        controlsButton.setInteractive();

        controlsButton.on('pointerover', () => {
            this.sound.play('button_hover');
            controlsButton.setScale(0.12);
        });

        controlsButton.on('pointerout', () => {
            controlsButton.setScale(0.1);
            this.keys.setVisible(false);
        });

        controlsButton.on('pointerup', () => {
            this.sound.play('button_select');
            this.keys.visible === false ? this.keys.setVisible(true) : this.keys.setVisible(false);
        });
    }
}
