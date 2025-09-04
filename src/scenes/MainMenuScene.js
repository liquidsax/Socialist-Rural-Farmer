export class MainMenuScene extends Phaser.Scene {

    constructor() {
        super('MainMenuScene');
    }

    preload() {
        // 主菜单也需要背景图
        // this.load.image('menu', 'assets/menu.png');
    }

    create() {
        // 1. 添加背景
        const gameWidth = this.sys.game.config.width;
        const gameHeight = this.sys.game.config.height;
        const bg = this.add.image(gameWidth / 2, gameHeight / 2, 'menu');
        bg.setDisplaySize(gameWidth, gameHeight);

        // 2. 添加游戏标题
        this.add.text(gameWidth / 2, gameHeight / 2 - 150, '社会主义新农村建设', {
            fontSize: '64px', fill: '#ffffff', stroke: '#000000', strokeThickness: 6
        }).setOrigin(0.5);

        // --- 3. 动态创建存档槽位UI ---
        const allSaves = this.loadAllSaves(); // 首先，加载所有存档的数据
        
        allSaves.forEach((saveData, index) => {
            // 计算每个按钮的垂直位置
            const yPos = gameHeight / 2 - 20 + index * 80;
            let textToShow;
            const hasData = saveData.hasData;

            // 根据槽位是否有数据，决定显示的文字
            if (hasData) {
                // 将时间戳格式化为本地日期和时间
                const saveDate = new Date(saveData.lastSave).toLocaleString();
                textToShow = `存档 ${index + 1} - [${saveDate}]`;
            } else {
                textToShow = `[ 新游戏 - 存档槽 ${index + 1} ]`;
            }
            
            // 创建代表该存档槽的按钮
            const slotButton = this.add.text(gameWidth / 2, yPos, textToShow, {
                fontSize: '28px', 
                fill: '#FFF', 
                backgroundColor: '#333',
                align: 'center'
            }).setOrigin(0.5).setPadding(15).setInteractive();

            // 为每个按钮添加独立的点击事件
            slotButton.on('pointerdown', () => {
                // 启动游戏场景，并传递【槽位ID】和【是否加载】的关键信息
                this.scene.start('GameScene', { 
                    saveSlot: index, 
                    loadSave: hasData 
                });
            });
            
            // 添加鼠标悬停效果
            slotButton.on('pointerover', () => slotButton.setBackgroundColor('#555'));
            slotButton.on('pointerout', () => slotButton.setBackgroundColor('#333'));
        });
        
        // --- 4. 保留“设置”和“退出”按钮 (可选) ---
        // 我们将它们放在存档列表下方

        const settingsButton = this.add.text(gameWidth - 120, gameHeight - 50, '设置', {
            fontSize: '24px', fill: '#FFF'
        }).setOrigin(0.5).setPadding(10).setInteractive();

        const exitButton = this.add.text(120, gameHeight - 50, '退出', {
            fontSize: '24px', fill: '#FFF'
        }).setOrigin(0.5).setPadding(10).setInteractive();

        settingsButton.on('pointerdown', () => {
            alert('设置功能正在开发中！');
        });

        exitButton.on('pointerdown', () => {
            this.cameras.main.fadeOut(500, 0, 0, 0);
            this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
                this.add.text(gameWidth / 2, gameHeight / 2, '感谢游玩！\n请关闭浏览器标签页。', {
                    fontSize: '40px', fill: '#FFF', align: 'center'
                }).setOrigin(0.5);
            });
        });
    }
    
    // 辅助函数：从localStorage加载所有存档数据
    loadAllSaves() {
        const savedData = localStorage.getItem('myFarmAllSlots');
        if (savedData) {
            return JSON.parse(savedData);
        }

        // 如果连主存档文件都没有，就创建一个包含3个空槽位的默认结构
        console.log('未找到任何存档文件，创建新的存档结构。');
        return [
            { slot: 0, hasData: false, lastSave: null },
            { slot: 1, hasData: false, lastSave: null },
            { slot: 2, hasData: false, lastSave: null },
        ];
    }
}