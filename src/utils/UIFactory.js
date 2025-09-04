// utils/UIFactory.js

/**
 * 创建一个自适应文字大小的、带有复古风格的菜单按钮。
 * @param {Phaser.Scene} scene - 调用此函数的场景对象 (例如 this)。
 * @param {number} x - 按钮的 x 坐标。
 * @param {number} y - 按钮的 y 坐标。
 * @param {string} text - 按钮上显示的文字。
 * @param {function} onClick - 按钮被点击时要执行的回调函数。
 * @returns {Phaser.GameObjects.Container} - 创建好的按钮容器。
 */
export function createMenuButton(scene, x, y, text, onClick) {
    // 创建一个容器 (Container) 来组合图片和文字
    const container = scene.add.container(x, y);

    // 定义内边距(Padding)
    const paddingX = 60;
    const paddingY = 40;

    // 【先】创建文字对象，这样我们才能测量它
    const label = scene.add.text(0, 0, text, {
        fontFamily: '"SimSun", "FangSong", serif',
        fontSize: '32px',
        fill: '#f5f5dc',
        align: 'center'
    }).setOrigin(0.5);

    // 创建按钮的背景横幅
    const banner = scene.add.image(0, 0, 'button_banner');

    // 【关键步骤】根据文字的尺寸，来动态设定横幅的显示尺寸
    banner.setDisplaySize(label.width + paddingX, label.height + paddingY);
    
    // 将横幅和文字都添加到容器中 (先加banner，后加label)
    container.add([banner, label]);
    
    // 设置容器的尺寸和交互性
    container.setSize(banner.displayWidth, banner.displayHeight);
    container.setInteractive({ useHandCursor: true });

    // 添加交互动效
    container.on('pointerover', () => {
        banner.setTint(0xffddaa);
    });
    container.on('pointerout', () => {
        banner.clearTint();
    });
    container.on('pointerdown', () => {
        container.setScale(0.95);
    });
    container.on('pointerup', () => {
        container.setScale(1);
        onClick();
    });

    return container;
}