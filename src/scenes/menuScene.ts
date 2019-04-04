import { CONSTANTS } from '../constants';

export class MenuScene extends Phaser.Scene {
    constructor() {
        super({
            key: CONSTANTS.SCENES.MENU
        });
    }
    create() {
        // create buttons and background
        this.add.image(0, 0, 'title_background').setOrigin(0);

        let playButton = this.add
            .image(this.game.renderer.width / 2, this.game.renderer.height * 0.7, 'play_button')
            .setScale(0.1);

        let controlsButton = this.add
            .image(this.game.renderer.width / 2, this.game.renderer.height * 0.81, 'controls_button')
            .setScale(0.1);

        // playbutton interactivity
        playButton.setInteractive();

        playButton.on('pointerover', () => {
            playButton.setScale(0.13);
        });

        playButton.on('pointerout', () => {
            playButton.setScale(0.1);
        });

        playButton.on('pointerup', () => {
            this.scene.start(CONSTANTS.SCENES.BATTLE);
        });

        /// control button interactivity
        controlsButton.setInteractive();

        controlsButton.on('pointerover', () => {
            controlsButton.setScale(0.13);
        });

        controlsButton.on('pointerout', () => {
            controlsButton.setScale(0.1);
        });
    }
}
