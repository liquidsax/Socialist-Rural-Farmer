// scenes/CutsceneScene.js
//过场动画1-来信
export class CutsceneScene extends Phaser.Scene {

    constructor() {
        super('CutsceneScene');
    }

    init(data) {
        // 接收从主菜单传来的存档槽位信息，以便稍后传递
        this.saveSlot = data.saveSlot;
    }

    create() {
        const gameWidth = this.sys.game.config.width;
        const gameHeight = this.sys.game.config.height;

        // 添加一个半透明的黑色背景，突出信件
        this.add.rectangle(0, 0, gameWidth, gameHeight, 0x000000, 0.7).setOrigin(0);

        // ======================= 修正部分开始 =======================

        // 1. 先创建信纸图片，保持其原始尺寸以便计算
        const letter = this.add.image(gameWidth / 2, gameHeight / 2, 'letter');

        // 2. 定义内边距
        const padding = -50;

        // 3. 动态计算文字可以显示的最大宽度
        const wordWrapWidth = letter.displayWidth - (padding * 2);
        
        // 4. 【先】定义文本样式 (textStyle)
        const textStyle = {
            fontSize: '28px',
            fill: '#333333',
            wordWrap: { 
                width: wordWrapWidth // 使用我们动态计算出的宽度
            },
            lineSpacing: 10,
            align: 'left' // 文字左对齐
        };
        
        // 信件的内容
        const letterContent = `
        
        
        

        
        亲爱的同志：

        时代在召唤，
        乡村正振兴。
        
        鉴于你出色的能力与
        坚定的信念，组织决定委派
        你前往一线，负责新农村
        的建设工作。那里有广阔
        的天地，等待你去耕耘；
        有淳朴的人民，期待你的带领。
        
        这不仅是一份工作，
        更是一份沉甸甸的责任。
        希望你不负韶华，
        不负使命，
        用你的智慧和汗水，
        在那片土地上书写
        新的篇章。
        
        期待你的好消息！
        
                                                你的领导
                                                1955年6月4日`;
        
        // 5. 【后】创建文本对象 (text)，并使用上面定义好的样式
        const text = this.add.text(letter.x, letter.y, letterContent, textStyle).setOrigin(0.5);

        // ======================= 修正部分结束 =======================


        // --- 动画效果 ---

        // 准备动画：现在再把它们都设置为不可见
        letter.setScale(0);
        text.setAlpha(0);

        // 1. 信纸从小到大“弹出”
        this.tweens.add({
            targets: letter,
            scale: 1, // 恢复到图片的原始大小
            duration: 800,
            ease: 'Power2',
            onComplete: () => {
                // 2. 信纸弹出后，文字“淡入”
                this.tweens.add({
                    targets: text,
                    alpha: 1,
                    duration: 1200,
                    ease: 'Sine.easeIn',
                    onComplete: () => {
                        // 3. 文字显示后，增加一个“点击继续”的提示
                        const continueText = this.add.text(gameWidth / 2, gameHeight - 70, '【点击任意处继续】', {
                            fontSize: '24px', fill: '#FFFFFF'
                        }).setOrigin(0.5).setAlpha(0);

                        // 提示文字闪烁效果
                        this.tweens.add({
                            targets: continueText,
                            alpha: 1,
                            duration: 700,
                            ease: 'Sine.easeInOut',
                            yoyo: true,
                            loop: -1
                        });

                        // 4. 设置整个场景可交互，等待玩家点击
                        this.input.once('pointerdown', () => {
                            this.cameras.main.fadeOut(1000, 0, 0, 0);
                        });
                    }
                });
            }
        });
        
        // 监听淡出完成事件
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
            localStorage.setItem('hasPlayedIntro', 'true');
            this.scene.start('GameScene', {
                saveSlot: 0,       // 明确指定使用第一个存档槽
                loadSave: false    // 明确告诉GameScene这是【新游戏】，不是加载
            });
        });
    }
}