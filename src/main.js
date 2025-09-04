// 导入场景
import { PreloaderScene } from './scenes/PreloaderScene.js'; // 导入新场景
import { MainMenuScene } from './scenes/MainMenuScene.js';
import { GameScene } from './scenes/GameScene.js';
import { PauseScene } from './scenes/PauseScene.js';

const config = {
    type: Phaser.AUTO,
    title: 'Rising Farm',
    description: '',
    parent: 'game-container',
    width: 1280,
    height: 720,
    backgroundColor: '#000000',
    pixelArt: false,
    scene: [
        PreloaderScene, // !!! 把 PreloaderScene 作为第一个启动的场景 !!!
        MainMenuScene, 
        GameScene,
        PauseScene
    ],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
}

new Phaser.Game(config);
            