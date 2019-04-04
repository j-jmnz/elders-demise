import { CONSTANTS } from '../constants';

export class LoadScene extends Phaser.Scene {
    constructor() {
        super({
            key: CONSTANTS.SCENES.LOAD
        });
    }
    init() {}

    preload() {
        this.input.setGlobalTopOnly(false);

        // load background images and ui
        this.load.image('title_background', './assets/preview1.png');

        this.load.image('play_button', './assets/play_button1.png');
        this.load.image('controls_button', './assets/controls_button.png');

        // load characters and enemies atlas
        this.load.atlas('characters', './assets/characters.png', './assets/characters.json');
        this.load.atlas('enemies', './assets/monsters.png', './assets/monsters.json');

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
