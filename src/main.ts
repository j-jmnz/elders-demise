/** @type {import('../typings/phaser')} */

import { LoadScene } from './scenes/loadScene';
import { MenuScene } from './scenes/menuScene';
import { LVL1Scene } from './scenes/lvl1';

let game = new Phaser.Game({
    width: 800,
    height: 600,
    scene: [LoadScene, MenuScene, LVL1Scene],
    render: {
        pixelArt: true
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: true
        }
    }
});
