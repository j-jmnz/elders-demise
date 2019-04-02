/** @type {import('../typings/phaser')} */

import { LoadScene } from './scenes/loadScene';
import { MenuScene } from './scenes/menuScene';
import { PlayScene } from './scenes/playScene';

let game = new Phaser.Game({
    width: 800,
    height: 600,
    scene: [LoadScene, MenuScene, PlayScene],
    render: {
        pixelArt: true
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    }
});
