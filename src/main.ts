/** @type {import('../typings/phaser')} */

import { LoadScene } from './scenes/loadScene';
import { MenuScene } from './scenes/menuScene';
import { LVL1Scene } from './scenes/lvl1Scene';
import { LVL2Scene } from './scenes/lvl2Scene';
import { BattleScene } from './scenes/battleScene';

let game = new Phaser.Game({
    width: 800,
    height: 600,
    scene: [LoadScene, MenuScene, LVL1Scene, LVL2Scene, BattleScene],
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
