import { ELEMENTS, findRecipe } from '../data/substances.js';

const INVENTORY_X   = 185;   // center-x of the inventory panel
const INVENTORY_Y   = 110;    // top of first slot
const SLOT_HEIGHT   = 60;
const CAULDRON_X    = 540;
const CAULDRON_Y    = 350;
const CAULDRON_R    = 90;    // drop-zone radius

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
    this._dragging    = null;   // currently dragged element object
    this._cauldronIds = [];     // element ids currently in the cauldron
  }

  preload() {    
    this.load.image('lab_bg',      'assets/sprites/bg.png');
    this.load.image('cauldron',    'assets/sprites/cauldron.png');
    this.load.image('potion_green', 'assets/sprites/Bubbly Brew Bottle - GREEN - 0000.png');
    this.load.image('potion_blue', 'assets/sprites/Big Vial - BLUE - 0000.png');
    this.load.image('potion_red', 'assets/sprites/Encased Potion - BROWN_RED - 0000.png');
    this.load.image('potion_pink', 'assets/sprites/Large Tonic - PINK - 0000.png');
    this.load.image('potion_black', 'assets/sprites/Round Potion - BLACK - 0000.png');
    this.load.image('potion_yellow', 'assets/sprites/Small Vial - YELLOW - 0000.png');
    this.load.image('potion_purple', 'assets/sprites/Large Jar - PURPLE - 0000.png');
  }

  create() {
    const { width, height } = this.scale;
    this._state = this.registry.get('gameState');

    // --- Background ---
    this.add.image(width / 2, height / 2, 'lab_bg').setScale(0.6);

    // --- Inventory panel ---
    this._drawInventoryPanel();

    // --- Cauldron ---
    this._drawCauldron();

    // --- Element slots ---
    this._elementObjects = [];
    ELEMENTS.forEach((el, i) => this._createElementSlot(el, i));

    // --- HUD ---
    this._scoreText = this.add.text(16, height - 28,
      `Pontos: ${this._state.score}  |  Descobertas: ${this._state.discoveredCount}`,
      { fontSize: '14px', fontFamily: 'monospace', color: '#aaaaaa' }
    );

    // --- Brew button ---
    this._makeBrewButton();

    // --- Back to menu ---
    this.add.text(width - 12, height - 28, '[ Menu ]', {
      fontSize: '14px', fontFamily: 'monospace', color: '#666666',
    }).setOrigin(1, 0).setInteractive({ useHandCursor: true })
      .on('pointerup', () => this.scene.start('MenuScene'));
  }

  // ─── Inventory panel ────────────────────────────────────────────────────────

  _drawInventoryPanel() {
    const panelW = 220, panelH = ELEMENTS.length * SLOT_HEIGHT + 40;
    const panelX = INVENTORY_X - panelW / 2;
    const panelY = 80;

    this.add.rectangle(panelX, panelY, panelW, panelH, 0x2d1b00).setOrigin(0)
      .setStrokeStyle(3, 0xd4a017);

    this.add.text(INVENTORY_X, panelY + 16, 'INVENTÁRIO', {
      fontSize: '13px', fontFamily: 'monospace', color: '#f5d742', fontStyle: 'bold',
    }).setOrigin(0.5, 0);

    // Slot backgrounds
    ELEMENTS.forEach((_, i) => {
      const sy = INVENTORY_Y + i * SLOT_HEIGHT + 10;
      this.add.rectangle(panelX + 10, sy, panelW - 20, SLOT_HEIGHT - 10, 0x4a3000)
        .setOrigin(0).setStrokeStyle(1, 0x8b6914);
    });
  }

  // ─── Element draggables ─────────────────────────────────────────────────────

  _createElementSlot(element, index) {
    const x = INVENTORY_X;
    const y = INVENTORY_Y + index * SLOT_HEIGHT + SLOT_HEIGHT / 2;

    // Sprite    
    const icon = this.add.sprite(x - 30, y, element.sprite)
      .setInteractive({ useHandCursor: true });

    const label = this.add.text(x + 6, y, element.label, {
      fontSize: '11px', fontFamily: 'monospace', color: '#eeeeee', wordWrap: { width: 90 },
    }).setOrigin(0, 0.5);

    // Tooltip on hover
    icon.on('pointerover', () => this._showTooltip(element.label, x + 50, y));
    icon.on('pointerout',  () => this._hideTooltip());

    // Drag start — clone the icon so the original stays in the inventory
    icon.on('pointerdown', (pointer) => this._startDrag(pointer, element, x - 30, y));

    this._elementObjects.push({ element, icon, label });
  }

  _startDrag(pointer, element, originX, originY) {
    // Create a temporary drag ghost
    // const ghost = this.add.rectangle(originX, originY, 36, 36, element.tint, 0.85)
    const ghost = this.add.sprite(originX, originY, element.sprite)
      .setDepth(10);

    this._dragging = { element, ghost, originX, originY };

    // Follow the pointer until released
    const onMove = (p) => {
      ghost.setPosition(p.x, p.y);
    };
    const onUp = (p) => {
      this.input.off('pointermove', onMove);
      this.input.off('pointerup', onUp);
      this._endDrag(p);
    };

    this.input.on('pointermove', onMove);
    this.input.on('pointerup',   onUp);
  }

  _endDrag(pointer) {
    if (!this._dragging) return;
    const { element, ghost, originX, originY } = this._dragging;
    this._dragging = null;

    const dist = Phaser.Math.Distance.Between(pointer.x, pointer.y, CAULDRON_X, CAULDRON_Y);

    if (dist <= CAULDRON_R) {
      // Dropped in cauldron
      this._addToCauldron(element, pointer.x, pointer.y);
      ghost.destroy();
    } else {
      // Snap back with a tween
      this.tweens.add({
        targets: ghost,
        x: originX, y: originY,
        duration: 200,
        ease: 'Back.Out',
        onComplete: () => ghost.destroy(),
      });
    }
  }

  // ─── Cauldron ───────────────────────────────────────────────────────────────

  _drawCauldron() {    
    this.add.image(CAULDRON_X, CAULDRON_Y, 'cauldron')
      .setScale(0.2);

    // Drop zone indicator (invisible, just for reference in debug)
    // this.add.circle(CAULDRON_X, CAULDRON_Y, CAULDRON_R, 0xffffff, 0).setStrokeStyle(1, 0x333333);

    // Label for ingredients in cauldron
    this._cauldronLabel = this.add.text(CAULDRON_X, CAULDRON_Y + 50, '', {
      fontSize: '12px', fontFamily: 'monospace', color: '#aaffaa', align: 'center',
    }).setOrigin(0.5, 0);
  }

  _addToCauldron(element, dropX, dropY) {
    if (this._cauldronIds.includes(element.id)) return;  // already in
    this._cauldronIds.push(element.id);

    // Animate a particle effect into the cauldron
    this._bubbleAnimation(dropX, dropY);

    // Update cauldron label
    this._updateCauldronLabel();
  }

  _updateCauldronLabel() {
    const names = this._cauldronIds.map(
      (id) => ELEMENTS.find((e) => e.id === id)?.label ?? id
    );
    this._cauldronLabel.setText(names.join('\n'));
  }

  _bubbleAnimation(fromX, fromY) {
    const bubble = this.add.circle(fromX, fromY, 8, 0x00ff88, 0.8).setDepth(5);
    this.tweens.add({
      targets: bubble,
      x: CAULDRON_X,
      y: CAULDRON_Y,
      alpha: 0,
      duration: 400,
      ease: 'Quad.In',
      onComplete: () => bubble.destroy(),
    });
  }

  // ─── Brew button ─────────────────────────────────────────────────────────────

  _makeBrewButton() {
    const bx = CAULDRON_X, by = CAULDRON_Y + 120;

    const btn = this.add.rectangle(bx, by, 160, 44, 0xf5d742)
      .setInteractive({ useHandCursor: true });

    this.add.text(bx, by, '🔮 Combinar', {
      fontSize: '16px', fontFamily: 'monospace', color: '#000000',
    }).setOrigin(0.5);

    btn.on('pointerover', () => btn.setFillStyle(0xffe066));
    btn.on('pointerout',  () => btn.setFillStyle(0xf5d742));
    btn.on('pointerup',   () => this._attemptBrew());

    // Clear button
    const clr = this.add.text(bx, by + 36, '[ Limpar caldeirão ]', {
      fontSize: '12px', fontFamily: 'monospace', color: '#888888',
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    clr.on('pointerup', () => {
      this._cauldronIds = [];
      this._updateCauldronLabel();
    });
  }

  _attemptBrew() {
    if (this._cauldronIds.length < 2) return;

    const recipe = findRecipe(this._cauldronIds);
    this._cauldronIds = [];
    this._updateCauldronLabel();

    if (recipe) {
      const isNew = this._state.registerDiscovery(recipe);
      this._updateHUD();
      // Pass result data to the ResultScene
      this.scene.launch('ResultScene', { recipe, isNew });
      this.scene.pause('GameScene');
    } else {
      this._showFailEffect();
    }
  }

  _showFailEffect() {
    const flash = this.add.rectangle(CAULDRON_X, CAULDRON_Y, 160, 140, 0xff0000, 0.3);
    this.tweens.add({
      targets: flash, alpha: 0, duration: 600,
      onComplete: () => flash.destroy(),
    });
    this.add.text(CAULDRON_X, CAULDRON_Y - 80, 'Combinação inválida!', {
      fontSize: '14px', fontFamily: 'monospace', color: '#ff6666',
    }).setOrigin(0.5).setDepth(5);
  }

  _updateHUD() {
    this._scoreText.setText(
      `Pontos: ${this._state.score}  |  Descobertas: ${this._state.discoveredCount}`
    );
  }

  // ─── Tooltip ─────────────────────────────────────────────────────────────────

  _showTooltip(text, x, y) {
    this._tooltipBg  = this.add.rectangle(x, y - 28, text.length * 7 + 16, 24, 0x000000, 0.8).setDepth(20);
    this._tooltipText = this.add.text(x, y - 28, text, {
      fontSize: '11px', fontFamily: 'monospace', color: '#ffffff',
    }).setOrigin(0.5).setDepth(21);
  }

  _hideTooltip() {
    this._tooltipBg?.destroy();
    this._tooltipText?.destroy();
  }
}
