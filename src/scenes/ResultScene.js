// ResultScene is launched as an overlay on top of GameScene (scene.launch).
// It receives { recipe, isNew } via scene init data.

export default class ResultScene extends Phaser.Scene {
  constructor() {
    super({ key: 'ResultScene' });
  }

  init(data) {
    this._recipe = data.recipe;
    this._isNew  = data.isNew;
  }

  preload() {
    // Pre-load result images in GameScene.preload() instead, since this
    // scene is launched dynamically.  They'll already be in the cache.
  }

  create() {
    const { width, height } = this.scale;
    const recipe = this._recipe;

    // --- Dim overlay ---
    this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.65)
      .setInteractive();   // swallow clicks

    // --- Card ---
    const cardW = 460, cardH = 360;
    const cardX = width / 2, cardY = height / 2;

    this.add.image(cardX, cardY, 'result_card').setDisplaySize(cardW + 30, cardH + 30);

    // --- Stars ---
    const starSpacing = 54;
    const starStartX  = cardX - starSpacing;
    for (let i = 0; i < 3; i++) {
      const filled = i < recipe.stars;
      this.add.text(starStartX + i * starSpacing, cardY - cardH / 2 - 20, '★', {
        fontSize: '40px',
        color: filled ? '#f5d742' : '#cccccc',
      }).setOrigin(0.5);
    }

    // --- Formula + name ---
    // this.add.text(cardX, cardY - 130, `${recipe.label} — ${recipe.formula}`, {
    //   fontSize: '20px', fontFamily: 'monospace', color: '#111111', fontStyle: 'bold',
    // }).setOrigin(0.5);

    this.add.text(cardX, cardY - 140, `${recipe.label}`, {
      fontSize: '20px', fontFamily: 'monospace', color: '#111111', fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.text(cardX, cardY - 115, `${recipe.formula}`, {
      fontSize: '14px', fontFamily: 'monospace', color: '#111111',
    }).setOrigin(0.5);

    if (this._isNew) {
      this.add.text(cardX, cardY - 95, '✨ Nova descoberta!', {
        fontSize: '13px', fontFamily: 'monospace', color: '#e67e22',
      }).setOrigin(0.5);
    }

    // --- Description ---
    this.add.text(cardX, cardY - 30, recipe.description, {
      fontSize: '14px', fontFamily: 'monospace', color: '#111111',
      wordWrap: { width: cardW - 48 }, align: 'center', lineSpacing: 6,
    }).setOrigin(0.5);

    // --- Result image --- 140x70
    this.add.image(cardX, cardY + 80, recipe.image).setDisplaySize(210, 105);   

    // --- Success animation ---
    this._playSuccessParticles(cardX, cardY - cardH / 2);

    // --- Next / Close button ---
    this._makeButton(cardX + cardW / 2 - 80, cardY + cardH / 2 - 24, 'Continuar →', () => {
      this.scene.stop('ResultScene');
      this.scene.resume('GameScene');
    });

    // --- Close X ---
    this.add.text(cardX + cardW / 2 - 16, cardY - cardH / 2 + 16, '✕', {
      fontSize: '18px', color: '#888888',
    }).setOrigin(0.5).setInteractive({ useHandCursor: true })
      .on('pointerup', () => {
        this.scene.stop('ResultScene');
        this.scene.resume('GameScene');
      });
  }

  _makeButton(x, y, label, onClick) {
    const btn = this.add.rectangle(x, y, 150, 36, 0xcfb32e)
      .setInteractive({ useHandCursor: true });
    this.add.text(x, y, label, {
      fontSize: '14px', fontFamily: 'monospace', color: '#000000',
    }).setOrigin(0.5);
    btn.on('pointerover', () => btn.setFillStyle(0xf5d742));
    btn.on('pointerout',  () => btn.setFillStyle(0xcfb32e));
    btn.on('pointerup',   onClick);
  }

  _playSuccessParticles(cx, cy) {
    // Simple burst of colored circles — replace with a Phaser particle emitter
    // once you have a particle texture loaded.
    const colors = [0xf5d742, 0x00ff88, 0xff6699, 0x44aaff];
    for (let i = 0; i < 12; i++) {
      const angle  = (i / 12) * Math.PI * 2;
      const radius = 60;
      const px = cx + Math.cos(angle) * 20;
      const py = cy + Math.sin(angle) * 20;
      const p  = this.add.circle(px, py, 6, Phaser.Utils.Array.GetRandom(colors)).setDepth(30);

      this.tweens.add({
        targets: p,
        x: cx + Math.cos(angle) * radius,
        y: cy + Math.sin(angle) * radius,
        alpha: 0,
        duration: 800,
        ease: 'Quad.Out',
        onComplete: () => p.destroy(),
      });
    }
  }
}
