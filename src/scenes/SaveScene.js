// scenes/SavesScene.js

export class SavesScene extends Phaser.Scene {

    constructor() {
        super('SavesScene');
    }

    create() {
        // 1. 添加背景
        const gameWidth = this.sys.game.config.width;
        const gameHeight = this.sys.game.config.height;
        this.add.image(gameWidth / 2, gameHeight / 2, 'menu').setDisplaySize(gameWidth, gameHeight);

        // 2. 添加标题
        this.add.text(gameWidth / 2, gameHeight / 2 - 150, '存档管理', {
            fontSize: '64px', fill: '#ffffff', stroke: '#000000', strokeThickness: 6
        }).setOrigin(0.5);

        // --- 3. 动态创建存档槽位UI (和之前MainMenuScene的逻辑一样) ---
        const allSaves = this.loadAllSaves();
        
        allSaves.forEach((saveData, index) => {
            const yPos = gameHeight / 2 - 20 + index * 80;
            let textToShow;
            const hasData = saveData.hasData;

            if (hasData) {
                const saveDate = new Date(saveData.lastSave).toLocaleString();
                textToShow = `存档 ${index + 1} - [${saveDate}]`;
            } else {
                textToShow = `[ 新游戏 - 存档槽 ${index + 1} ]`;
            }
            
            const slotButton = this.add.text(gameWidth / 2, yPos, textToShow, {
                fontSize: '28px', fill: '#FFF', backgroundColor: '#333', align: 'center'
            }).setOrigin(0.5).setPadding(15).setInteractive();

            slotButton.on('pointerdown', () => {
                this.scene.start('GameScene', { saveSlot: index, loadSave: hasData });
            });
            
            slotButton.on('pointerover', () => slotButton.setBackgroundColor('#555'));
            slotButton.on('pointerout', () => slotButton.setBackgroundColor('#333'));
        });

        // 4. 添加“返回”按钮
        const backButton = this.add.text(120, gameHeight - 50, '返回主菜单', {
            fontSize: '24px', fill: '#FFF'
        }).setOrigin(0.5).setPadding(10).setInteractive();

        backButton.on('pointerdown', () => {
            this.scene.start('MainMenuScene');
        });

        backButton.on('pointerover', () => backButton.setFill('#FF0'));
        backButton.on('pointerout', () => backButton.setFill('#FFF'));
    }
    
    // 辅助函数：从localStorage加载所有存档数据
    loadAllSaves() {
        const savedData = localStorage.getItem('myFarmAllSlots');
        if (savedData) { return JSON.parse(savedData); }
        return [
            { slot: 0, hasData: false, lastSave: null },
            { slot: 1, hasData: false, lastSave: null },
            { slot: 2, hasData: false, lastSave: null },
        ];
    }
}