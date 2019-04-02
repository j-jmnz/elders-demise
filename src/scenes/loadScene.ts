import { CONSTANTS } from '../constants';

export class LoadScene extends Phaser.Scene {
    constructor() {
        super({
            key: CONSTANTS.SCENES.LOAD
        });
    }
    init() {}
    
    preload() {
        // load background images and ui
        this.load.image('title_background', './assets/preview.png');

        this.load.image('play_button', './assets/play_button.png');

        // load characters spritesheets
        this.load.spritesheet('meriel', './assets/meriel.png', { frameWidth: 22.59, frameHeight: 38 });

        this.load.image('wizard_m', './assets/down_stand.png');

        // create loading bar
        let loadingBar = this.add.graphics({
            fillStyle: {
                color: 0xc0c0c0
            }
        });

        //load bar

        this.load.on('progress', (percent: number) => {
            loadingBar.fillRect(
                0,
                this.game.renderer.height / 2,
                this.game.renderer.width * percent,
                50
            );
        });

        this.load.on('complete', () => {});

        this.load.on('load', (file: Phaser.Loader.File) => {
            console.log(file.src);
        });
    }

    create() {
        this.scene.start(CONSTANTS.SCENES.MENU);
    }
}
