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
        this.load.image('logo', './assets/logo1.png');
        this.load.image('play_button', './assets/play_button1.png');
        this.load.image('controls_button', './assets/controls_button.png');
        this.load.image('keys', './assets/keys.png');

        // load characters and enemies atlas
        this.load.atlas('characters', './assets/characters.png', './assets/characters.json');
        this.load.atlas('enemies', './assets/monsters.png', './assets/monsters.json');

        // load characters spritesheets
        this.load.spritesheet('meriel', './assets/meriel.png', { frameWidth: 22.59, frameHeight: 38 });

        this.load.image('wizard_m', './assets/down_stand.png');

        // load audio files
        this.load.audio('title_song', './assets/title_song.mp3');
        this.load.audio('button_hover', './assets/button_highlight.wav');
        this.load.audio('button_select', './assets/button_select.wav');
        this.load.audio('lvl1_song', './assets/lvl1_song.mp3');
        this.load.audio('lvl2_song', './assets/lvl2_song.mp3');
        this.load.audio('battle_song', './assets/battle_song.mp3');

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
