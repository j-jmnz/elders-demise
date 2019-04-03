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

        let playButton = this.add.image(
            this.game.renderer.width / 2,
            this.game.renderer.height / 2,
            'play_button'
        );

        // playbutton interactivity
        playButton.setInteractive();

        playButton.on('pointerover', () => {
            playButton.setScale(1.2);
        });

        playButton.on('pointerout', () => {
            playButton.setScale(1);
        });

        playButton.on('pointerup', () => {
            this.scene.start(CONSTANTS.SCENES.BATTLE);
        });
    }
}
