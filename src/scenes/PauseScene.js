// scenes/PauseScene.js

export class PauseScene extends Phaser.Scene {

    constructor() {
        super('PauseScene');
    }

    create() {
        // 创建一个半透明的黑色背景，用来“调暗”后面的游戏场景
        this.add.rectangle(0, 0, this.sys.game.config.width, this.sys.game.config.height, 0x000000, 0.7).setOrigin(0);

        const gameWidth = this.sys.game.config.width;
        const gameHeight = this.sys.game.config.height;

        // 添加“游戏已暂停”标题
        this.add.text(gameWidth / 2, gameHeight / 2 - 100, '游戏已暂停', {
            fontSize: '48px', fill: '#ffffff'
        }).setOrigin(0.5);

        // 创建“继续游戏”按钮
        const resumeButton = this.add.text(gameWidth / 2, gameHeight / 2, '继续游戏', {
            fontSize: '32px', fill: '#FFF', backgroundColor: '#333'
        }).setOrigin(0.5).setPadding(15).setInteractive();

        // 创建“保存并返回主菜单”按钮
        const saveAndExitButton = this.add.text(gameWidth / 2, gameHeight / 2 + 80, '保存并返回主菜单', {
            fontSize: '32px', fill: '#FFF', backgroundColor: '#333'
        }).setOrigin(0.5).setPadding(15).setInteractive();

        // --- 按钮事件 ---

        // 点击“继续游戏”
        resumeButton.on('pointerdown', () => {
            this.scene.stop(); // 关闭当前暂停场景
            this.scene.resume('GameScene'); // 恢复游戏场景的运行
        });

        // ======================= 修正点 =======================
        // 点击“保存并返回主菜单”
        saveAndExitButton.on('pointerdown', () => {
            // 1. 明确关闭后台的游戏场景
            this.scene.stop('GameScene');
            // 2. 关闭自己（暂停场景）
            this.scene.stop('PauseScene');
            // 3. 启动主菜单
            this.scene.start('MainMenuScene');
        });
        
        // 添加鼠标悬停效果
        [resumeButton, saveAndExitButton].forEach(button => {
            button.on('pointerover', () => button.setBackgroundColor('#555'));
            button.on('pointerout', () => button.setBackgroundColor('#333'));
        });
    }
}