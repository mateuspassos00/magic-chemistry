import GameState from '../systems/GameState.js';

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  preload() {
    // Load your background, wizard sprite, logo, etc.
    // Example (replace paths with your actual assets):
    this.load.image('menu_bg', 'assets/sprites/dark_forest.png');
    this.load.image('wizard', 'assets/sprites/wizard.png');
    this.load.image('cat', 'assets/sprites/cat.png');
    this.load.image('creator1', 'assets/sprites/c1.png');
    this.load.image('creator2', 'assets/sprites/c2.png');
  }

  create() {
    // Initialise shared state in the registry so all scenes can access it.
    if (!this.registry.get('gameState')) {
      this.registry.set('gameState', new GameState());
    }

    const { width, height } = this.scale;

    // --- Background ---    
    this.add.image(0, 50, 'menu_bg').setOrigin(0).setScale(.6);

    // --- Title ---
    this.add.text(width / 2, 100, 'Magic Chemistry', {
      fontSize: '42px',
      fontFamily: 'monospace',
      color: '#f5d742',
      stroke: '#000000',
      strokeThickness: 6,
    }).setOrigin(0.5);

    // --- Wizard sprite ---    
    this.add.sprite(390, 340, 'wizard').setScale(0.5).flipX = true;

    // --- Cat sprite ---    
    this.add.sprite(260, 410, 'cat').setScale(0.15);

    // --- Buttons ---
    this._makeButton(width - 180, 260, 'Jogar',  () => this.scene.start('GameScene'));
    this._makeButton(width - 180, 330, 'Sobre',  () => this._showAbout());

    // --- Score display (persists if player returns to menu) ---
    const state = this.registry.get('gameState');
    this.add.text(16, height - 28, `Pontos: ${state.score}  |  Descobertas: ${state.discoveredCount}`, {
      fontSize: '14px', fontFamily: 'monospace', color: '#aaaaaa',
    });
  }

  _makeButton(x, y, label, onClick) {
    const btn = this.add.rectangle(x, y, 160, 44, 0xf5d742).setInteractive({ useHandCursor: true });
    this.add.text(x, y, label, {
      fontSize: '18px', fontFamily: 'monospace', color: '#000000', fontStyle: 'bold',
    }).setOrigin(0.5);

    btn.on('pointerover',  () => btn.setFillStyle(0xffe066));
    btn.on('pointerout',   () => btn.setFillStyle(0xf5d742));
    btn.on('pointerdown',  () => btn.setFillStyle(0xcfb32e));
    btn.on('pointerup',    onClick);
  }

  _showAbout() {
    const { width, height } = this.scale;
    const overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.7)
      .setInteractive();  // blocks clicks through

    const box = this.add.rectangle(width / 2, height / 2, 580, 300, 0x1a1a2e)
      .setStrokeStyle(2, 0xf5d742);

    const text = this.add.text(width / 2, height / 2 - 110, 'Criadores', {
      fontSize: '21px',
      fontFamily: 'monospace',
      color: '#f5d742',
      stroke: '#000000',
      strokeThickness: 6,
    }).setOrigin(0.5);
    
    // const text = this.add.text(width / 2, height / 2 - 60,
    //   'Magic Chemistry\n\nCombine elementos químicos para\ndescobrir substâncias e aprender\nsobre suas propriedades!\n\nProjeto final — Informática na Educação',
    //   { fontSize: '14px', fontFamily: 'monospace', color: '#ffffff', align: 'center' }
    // ).setOrigin(0.5);

    const c1 = this.add.image(width / 2 - 200, height / 2, 'creator1').setDisplaySize(130, 140);
    const c2 = this.add.image(width / 2 - 50,height / 2, 'creator2').setDisplaySize(130, 140);

    const close = this.add.text(width / 2, height / 2 + 100, '[ Fechar ]', {
      fontSize: '16px', fontFamily: 'monospace', color: '#f5d742',
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    close.on('pointerup', () => { overlay.destroy(); box.destroy(); text.destroy(); close.destroy(); c1.destroy(); c2.destroy()});
  }
}
