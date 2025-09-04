// scenes/MainMenuScene.js

export class MainMenuScene extends Phaser.Scene {

    constructor() {
        super('MainMenuScene');
    }

    create() {
        // 1. 添加背景和标题
        const gameWidth = this.sys.game.config.width;
        const gameHeight = this.sys.game.config.height;
        this.add.image(gameWidth / 2, gameHeight / 2, 'menu').setDisplaySize(gameWidth, gameHeight);
        this.add.text(gameWidth / 2, gameHeight / 2 - 150, '社会主义新农村建设', {
            fontSize: '64px', fill: '#ffffff', stroke: '#000000', strokeThickness: 6
        }).setOrigin(0.5);

        // --- 2. 智能创建菜单按钮 ---
        const allSaves = this.loadAllSaves();
        const mostRecentSave = this.findMostRecentSave(allSaves);

        let firstButton;
        // 情况A：如果存在任何存档
        if (mostRecentSave) {
            firstButton = this.add.text(gameWidth / 2, gameHeight / 2, '继续游戏', {
                fontSize: '32px', fill: '#FFF', backgroundColor: '#333'
            }).setOrigin(0.5).setPadding(15).setInteractive();

            // 点击“继续”，直接加载最新的存档
            firstButton.on('pointerdown', () => {
                this.scene.start('GameScene', {
                    saveSlot: mostRecentSave.slot,
                    loadSave: true
                });
            });
        }
        // 情况B：如果没有任何存档
        else {
            firstButton = this.add.text(gameWidth / 2, gameHeight / 2, '新游戏', {
                fontSize: '32px', fill: '#FFF', backgroundColor: '#333'
            }).setOrigin(0.5).setPadding(15).setInteractive();

            // 点击“新游戏”，跳转到存档管理界面，让玩家选择一个槽位
            firstButton.on('pointerdown', () => {
                 // 检查玩家是否看过开场动画
                    const hasPlayedIntro = localStorage.getItem('hasPlayedIntro') === 'true';

                    // 如果没看过，就先去播放过场动画
                    if (!hasPlayedIntro) {
                        this.scene.start('CutsceneScene');
                    } 
                    // 如果已经看过了，就直接去存档管理界面
                    else {
                        this.scene.start('SavesScene');
                    }
                    });
        }

        // “存档管理”按钮，总是存在
        const savesButton = this.add.text(gameWidth / 2, gameHeight / 2 + 80, '存档管理', {
            fontSize: '32px', fill: '#FFF', backgroundColor: '#333'
        }).setOrigin(0.5).setPadding(15).setInteractive();

        savesButton.on('pointerdown', () => {
            this.scene.start('SavesScene');
        });

        // 添加鼠标悬停效果
        [firstButton, savesButton].forEach(button => {
            button.on('pointerover', () => button.setBackgroundColor('#555'));
            button.on('pointerout', () => button.setBackgroundColor('#333'));
        });
    }
    
    // 辅助函数：加载所有存档
    loadAllSaves() {
        const savedData = localStorage.getItem('myFarmAllSlots');
        if (savedData) { return JSON.parse(savedData); }
        return []; // 如果没有存档，返回空数组
    }

    // 辅助函数：找到最近一次的存档
    findMostRecentSave(allSaves) {
        // 过滤出所有有数据的存档
        const existingSaves = allSaves.filter(s => s.hasData);

        // 如果没有存档，返回null
        if (existingSaves.length === 0) {
            return null;
        }

        // 使用 sort 对存档按 lastSave 时间戳进行降序排序，第一个就是最新的
        existingSaves.sort((a, b) => b.lastSave - a.lastSave);
        return existingSaves[0];
    }
}