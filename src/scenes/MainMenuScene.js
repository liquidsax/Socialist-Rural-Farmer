// scenes/MainMenuScene.js

// 从我们的UI工厂文件中导入函数
import { createMenuButton } from '../utils/UIFactory.js';

export class MainMenuScene extends Phaser.Scene {

    constructor() {
        super('MainMenuScene');
    }

    // preload() 方法现在是空的，因为所有资源都在 PreloaderScene 中加载
    preload() {}

    create() {
        // 1. 设置新的背景
        const gameWidth = this.sys.game.config.width;
        const gameHeight = this.sys.game.config.height;
        this.add.image(gameWidth / 2, gameHeight / 2, 'menu_background').setDisplaySize(gameWidth, gameHeight);

        // 2. 设计新的标题
        this.add.text(gameWidth / 2, gameHeight * 0.3, '社会主义新农村建设', {
            fontFamily: '"Microsoft YaHei", "SimHei", "Heiti SC", sans-serif',
            fontSize: '72px',
            fill: '#bb281b', // 革命红
            stroke: '#f8e4a8', // 丰收黄描边
            strokeThickness: 4,
            shadow: {
                offsetX: 2,
                offsetY: 2,
                color: '#000000',
                blur: 5,
                stroke: true,
                fill: true
            }
        }).setOrigin(0.5);

        // --- 3. 使用新的UI工厂函数，智能创建所有菜单按钮 ---
        const allSaves = this.loadAllSaves();
        const mostRecentSave = this.findMostRecentSave(allSaves);

        const buttonYStart = gameHeight * 0.55;
        const buttonSpacing = 100;

        // 根据是否有存档，决定第一个按钮的文本和功能
        if (mostRecentSave) {
            // 创建“继续游戏”按钮
            createMenuButton(this, gameWidth / 2, buttonYStart, '继续游戏', () => {
                this.scene.start('GameScene', {
                    saveSlot: mostRecentSave.slot,
                    loadSave: true
                });
            });
        } else {
            // 创建“新游戏”按钮
            createMenuButton(this, gameWidth / 2, buttonYStart, '新游戏', () => {
                const hasPlayedIntro = localStorage.getItem('hasPlayedIntro') === 'true';
                if (!hasPlayedIntro) {
                    this.scene.start('CutsceneScene');
                } else {
                    this.scene.start('SavesScene');
                }
            });
        }

        // 创建“存档管理”按钮
        createMenuButton(this, gameWidth / 2, buttonYStart + buttonSpacing, '存档管理', () => {
            this.scene.start('SavesScene');
        });
        
        // 创建“设置”按钮
        createMenuButton(this, gameWidth / 2, buttonYStart + buttonSpacing * 2, '设置', () => {
            alert('设置功能正在开发中！');
        });
    }
    
    // --- 辅助函数 (保持不变) ---
    loadAllSaves() {
        const savedData = localStorage.getItem('myFarmAllSlots');
        if (savedData) { return JSON.parse(savedData); }
        return [];
    }
    
    findMostRecentSave(allSaves) {
        const existingSaves = allSaves.filter(s => s.hasData);
        if (existingSaves.length === 0) return null;
        existingSaves.sort((a, b) => b.lastSave - a.lastSave);
        return existingSaves[0];
    }
}