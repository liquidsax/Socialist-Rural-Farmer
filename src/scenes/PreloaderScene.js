// scenes/PreloaderScene.js

export class PreloaderScene extends Phaser.Scene {

    constructor() {
        super('PreloaderScene');
    }

    preload() {
        // 1. 显示一个加载中的背景和logo (可选)
        this.add.text(this.sys.game.config.width / 2, this.sys.game.config.height / 2 - 50, '游戏加载中...', {
            fontSize: '48px',
            fill: '#ffffff'
        }).setOrigin(0.5);

        // 2. 创建一个进度条
        const progressBar = this.add.graphics();
        const progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(this.sys.game.config.width / 2 - 160, this.sys.game.config.height / 2, 320, 50);

        // 3. 监听加载进度事件
        this.load.on('progress', (value) => {
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(this.sys.game.config.width / 2 - 150, this.sys.game.config.height / 2 + 10, 300 * value, 30);
        });

        // 4. 监听加载完成事件
        this.load.on('complete', () => {
            progressBar.destroy();
            progressBox.destroy();
        });

        // --- 5. 在这里加载【整个游戏】的所有资源！ ---
        // 菜单资源
        this.load.image('menu', 'assets/sun_menu.png'); 

        // 游戏资源
        this.load.image('farm', 'assets/farmland.png'); // 请确保这里的路径和文件名是您最终确定的
        this.load.image('plot', 'assets/none.png');
        this.load.image('sprout', 'assets/seed.png');
        this.load.image('carrot', 'assets/ripe.png');
        this.load.image('letter', 'assets/letter.png');
        this.load.image('menu_background', 'assets/sun_menu.png');
        this.load.image('button_banner', 'assets/redButton.png');
        // 未来还可以加: this.load.audio('bgm', 'assets/music.mp3');
    }

    create() {
        // 当所有资源加载完毕后，这个函数会被调用
        console.log('所有资源加载完毕，即将进入主菜单...');
        this.scene.start('MainMenuScene');
    }
}