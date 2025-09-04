export class GameScene extends Phaser.Scene {

    constructor() {
        super('GameScene');
        // 初始化属性
        this.currentSaveSlot = 0;
        this.shouldLoadSave = false;
    }
    
    // init 方法：在场景启动时接收来自主菜单的数据
    init(data) {
        if (data && data.saveSlot !== undefined) {
            this.currentSaveSlot = data.saveSlot;
            this.shouldLoadSave = data.loadSave;
        } else {
            // 如果没有数据传来（例如直接从URL进入），提供一个默认值
            this.currentSaveSlot = 0;
            this.shouldLoadSave = false;
        }
    }

    // preload 方法：现在是空的，因为所有资源都在PreloaderScene中加载
    preload() { }

    create() {
        // 1. 设置背景
        const gameWidth = this.sys.game.config.width;
        const gameHeight = this.sys.game.config.height;
        const bgpic = this.add.image(gameWidth / 2, gameHeight / 2, 'farm');
        bgpic.setDisplaySize(gameWidth, gameHeight);

        // 2. 设置提示文字
        this.add.text(640, 50, '点击土地来种植和收获 (按ESC暂停)', { 
            fontSize: '32px', fill: '#ffffff', stroke: '#000000', strokeThickness: 4
        }).setOrigin(0.5);

        // 3. 根据init中收到的指令，加载或创建土地数据
        this.plots = this.loadPlots(this.shouldLoadSave, this.currentSaveSlot);

        // 4. 根据数据创建可视化的土地网格
        const plotSize = 150;
        const spacing = 20;
        const startX = (gameWidth - (this.plots.length * plotSize + (this.plots.length - 1) * spacing)) / 2;
        const startY = gameHeight / 2;

        this.plots.forEach((plotData, i) => {
            const x = startX + i * (plotSize + spacing);
            const y = startY;
            
            let initialTexture = 'plot';
            if (plotData.isPlanted) {
                if (Date.now() >= plotData.matureTime) {
                    initialTexture = 'carrot';
                    plotData.isMature = true;
                } else {
                    initialTexture = 'sprout';
                }
            }

            const plotSprite = this.add.sprite(x, y, initialTexture).setInteractive().setOrigin(0, 0).setDisplaySize(plotSize, plotSize);
            plotData.sprite = plotSprite;

            if (plotData.isPlanted && !plotData.isMature) {
                const remainingTime = plotData.matureTime - Date.now();
                if (remainingTime > 0) {
                    this.time.delayedCall(remainingTime, () => {
                        this.matureCrop(plotData);
                    });
                }
            }

            plotSprite.on('pointerdown', () => {
                this.onPlotClicked(plotData);
            });
        });

        // 5. 设置调试用的坐标显示器
        this.coordsText = this.add.text(10, 10, 'X: 0, Y: 0', { 
            fontSize: '16px', fill: '#ffffff', backgroundColor: '#000000'
        });

        // !!! 关键：在这里添加ESC键的监听器 !!!
        this.input.keyboard.on('keydown-ESC', () => {
            // 在退出前自动保存一次
            this.savePlots(this.currentSaveSlot);
            // 暂停当前游戏场景
            this.scene.pause();
            // 在上方启动暂停场景
            this.scene.launch('PauseScene');
        });
    }

    onPlotClicked(plotData) {
        if (!plotData.isPlanted) {
            plotData.isPlanted = true;
            plotData.sprite.setTexture('sprout');
            const growthTime = 3000;
            plotData.matureTime = Date.now() + growthTime;
            this.time.delayedCall(growthTime, () => {
                this.matureCrop(plotData);
            });
        } else if (plotData.isMature) {
            plotData.sprite.setTexture('plot');
            plotData.isPlanted = false;
            plotData.isMature = false;
            plotData.matureTime = 0;
        }
        
        // 修正点：调用多存档保存函数，并传入当前槽位ID
        this.savePlots(this.currentSaveSlot);
    }

    matureCrop(plotData) {
        if (!plotData.isMature) {
            plotData.isMature = true;
            plotData.sprite.setTexture('carrot');
            // 修正点：调用多存档保存函数
            this.savePlots(this.currentSaveSlot);
        }
    }

    // 多存档保存函数
    savePlots(slotIndex) {
        if (slotIndex === undefined) { return; } // 安全检查
        const allSaves = this.loadAllSaves();
        const dataToSave = {
            slot: slotIndex,
            hasData: true,
            lastSave: new Date().getTime(),
            plots: this.plots.map(p => ({
                id: p.id, isPlanted: p.isPlanted, isMature: p.isMature, matureTime: p.matureTime
            }))
        };
        allSaves[slotIndex] = dataToSave;
        localStorage.setItem('myFarmAllSlots', JSON.stringify(allSaves));
        console.log(`游戏进度已保存到存档槽 ${slotIndex}!`);
    }

    // 多存档加载函数
    loadPlots(shouldLoad, slotIndex) {
        const allSaves = this.loadAllSaves();
        const saveData = allSaves[slotIndex];

        if (shouldLoad && saveData && saveData.hasData) {
            console.log(`已从存档槽 ${slotIndex} 加载存档!`);
            return saveData.plots;
        }

        if (!shouldLoad) { console.log(`在存档槽 ${slotIndex} 开始新游戏。`); } 
        else { console.log(`存档槽 ${slotIndex} 为空，创建新游戏。`); }
        
        const numPlots = 5;
        let newPlots = [];
        for (let i = 0; i < numPlots; i++) { newPlots.push({ id: i, isPlanted: false, isMature: false, matureTime: 0, sprite: null }); }
        return newPlots;
    }

    // 加载所有存档的辅助函数
    loadAllSaves() {
        const savedData = localStorage.getItem('myFarmAllSlots');
        try {
            if (savedData) { return JSON.parse(savedData); }
        } catch (e) { console.error("解析存档失败，存档可能已损坏。正在创建新存档...", e); }
        
        const emptySaves = [
            { slot: 0, hasData: false, lastSave: null, plots: null },
            { slot: 1, hasData: false, lastSave: null, plots: null },
            { slot: 2, hasData: false, lastSave: null, plots: null },
        ];
        return emptySaves;
    }

    update() {
        if (this.coordsText) {
            const pointer = this.input.activePointer;
            this.coordsText.setText(['X: ' + pointer.x.toFixed(2), 'Y: ' + pointer.y.toFixed(2)]);
        }
    }
}