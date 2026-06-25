import { ELEMENTS, findRecipe } from '../data/substances.js';

const INVENTORY_X   = 185;   // center-x of the inventory panel
const INVENTORY_Y   = 110;    // top of first slot
const SLOT_HEIGHT   = 55;
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
    this.load.image('inventory',      'assets/sprites/inventory.png');
    this.load.image('result_card', 'assets/sprites/result_card.png');
    
    // CAULDRON + EFFECTS
    this.load.image('cauldron',    'assets/sprites/cauldron.png');
    this.load.image('bubbles',    'assets/sprites/bubbles.png');
    this.load.image('particle', 'assets/sprites/particle.png');
    
    // POTIONS
    this.load.image('potion_green', 'assets/sprites/Bubbly Brew Bottle - GREEN - 0000.png');
    this.load.image('potion_blue', 'assets/sprites/Big Vial - BLUE - 0000.png');
    this.load.image('potion_red', 'assets/sprites/Encased Potion - BROWN_RED - 0000.png');
    this.load.image('potion_pink', 'assets/sprites/red_diy.png');
    this.load.image('potion_black', 'assets/sprites/Round Potion - BLACK - 0000.png');
    this.load.image('potion_yellow', 'assets/sprites/Small Vial - YELLOW - 0000.png');
    this.load.image('potion_purple', 'assets/sprites/Large Jar - PURPLE - 0000.png');
    this.load.image('potion_clear', 'assets/sprites/Encased Potion - BROWN_GREEN - 0000.png');
    this.load.image('potion_white', 'assets/sprites/Large Jar - TEAL - 0000.png');
    this.load.image('potion_white2', 'assets/sprites/Large Bottle - BLACK - 0000.png');
    this.load.image('potion_silver', 'assets/sprites/Small Vial - ORANGE - 0000.png');
    this.load.image('potion_orange', 'assets/sprites/Encased Potion - LIME_PURPLE - 0000.png');
    this.load.image('potion_ltblue', 'assets/sprites/green_diy.png');
    this.load.image('potion_ltgrey', 'assets/sprites/Bubbly Brew Bottle - GREEN - 0000.png');
    this.load.image('potion_grey', 'assets/sprites/Bubbly Brew Bottle - BROWN - 0000.png');
    this.load.image('potion_beige', 'assets/sprites/blue_diy.png');

    // SOLUTIONS
    this.load.image('result_nacl', 'assets/solutions/nacl.jpg');
    this.load.image('result_na2so4', 'assets/solutions/sodium_sulphate.jpg');
    this.load.image('result_nh4cl', 'assets/solutions/ammonium_chloride.jpg');
    this.load.image('result_agcl', 'assets/solutions/silver_chloride.jpg');
    this.load.image('result_pbi2', 'assets/solutions/lead_iodide.jpg');
    this.load.image('result_baso4', 'assets/solutions/barium_sulphate.jpg');
    this.load.image('result_cu_oh_2', 'assets/solutions/copper_hydroxide.jpg');
    this.load.image('result_feso4_cu', 'assets/solutions/copper_redox.jpg');
    this.load.image('result_mn2_o2', 'assets/solutions/permanganate_decomp.jpg');
    this.load.image('result_cu_complex', 'assets/solutions/copper_sulphate_ammonia.jpg');
    this.load.image('result_co2_gas', 'assets/solutions/sodium_carbonate_sulfuric_acid.jpg');

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
      { fontSize: '14px', fontFamily: 'monospace', color: '#f5d742' }
    );

    // --- Brew button ---
    this._makeBrewButton();

    // --- Back to menu ---
    this.add.text(width - 12, height - 28, '[ Menu ]', {
      fontSize: '14px', fontFamily: 'monospace', color: '#f5d742',
    }).setOrigin(1, 0).setInteractive({ useHandCursor: true })
      .on('pointerup', () => this.scene.start('MenuScene'));      
  }

  // ─── Inventory panel ────────────────────────────────────────────────────────

  _drawInventoryPanel() {
    const PANEL_X    = 75;
    const PANEL_Y    = 30;
    const PANEL_W    = 220;
    const VISIBLE_H  = 420;   // height of the visible window
    const CONTENT_H  = ELEMENTS.length * SLOT_HEIGHT;

    this.add.image(PANEL_X - 30, PANEL_Y + 30, 'inventory')
      .setOrigin(0, 0)
      .setScale(.85);

    // --- Scrollable container (holds all slots) ---
    this._inventoryContainer = this.add.container(0, 0);

    ELEMENTS.forEach((_, i) => {
      const sy = INVENTORY_Y + i * SLOT_HEIGHT;
      const bg = this.add.rectangle(PANEL_X + 25, sy, PANEL_W - 45, SLOT_HEIGHT - 5, 0x4a3000)
        .setOrigin(0)
        .setStrokeStyle(1, 0x8b6914);
      this._inventoryContainer.add(bg);
    });

    // --- Mask: clips the container to the panel bounds ---
    const maskShape = this.add.graphics();
    maskShape.fillRect(PANEL_X + 20, PANEL_Y + 85, PANEL_W - 40, VISIBLE_H - 85);    
    maskShape.setAlpha(0);
    this._inventoryContainer.setMask(
      new Phaser.Display.Masks.GeometryMask(this, maskShape)
    );

    // --- Scroll state ---
    const maxScroll = Math.max(0, CONTENT_H - VISIBLE_H + 77);
    let scrollY = 0;

    const applyScroll = (dy) => {
      scrollY = Phaser.Math.Clamp(scrollY + dy, 0, maxScroll);
      this._inventoryContainer.setY(-scrollY);
      // Keep element icons/labels in sync — they're added to the container
      // inside _createElementSlot(), so they move automatically.
    };

    // Mouse wheel
    this.input.on('wheel', (_ptr, _objs, _dx, dy) => applyScroll(dy * 0.6));

    // Touch / click-drag on the panel
    let dragStartY = null;
    let dragStartScroll = 0;

    this.input.on('pointerdown', (p) => {
      if (p.x < PANEL_X + PANEL_W) {
        dragStartY     = p.y;
        dragStartScroll = scrollY;
      }
    });

    this.input.on('pointermove', (p) => {
      if (dragStartY === null || !p.isDown) return;
      applyScroll(dragStartScroll + (dragStartY - p.y) - scrollY);
    });

    this.input.on('pointerup', () => { dragStartY = null; });

    // --- Scrollbar track + thumb (visual feedback) ---
    const trackX = PANEL_X + PANEL_W - 8;
    const trackY = PANEL_Y + 85;
    const trackH = VISIBLE_H - 77;

    this.add.rectangle(trackX, trackY, 4, trackH, 0x1a0f00).setOrigin(0.5, 0);

    const thumbH    = Math.max(30, (VISIBLE_H / CONTENT_H) * trackH);
    const scrollThumb = this.add.rectangle(trackX, trackY, 6, thumbH, 0xd4a017)
      .setOrigin(0.5, 0);

    // Update thumb position whenever scroll changes
    this._updateScrollThumb = () => {
      const ratio = maxScroll > 0 ? scrollY / maxScroll : 0;
      scrollThumb.setY(trackY + ratio * (trackH - thumbH));
    };

    // Hook applyScroll to also update the thumb
    const _baseApply = applyScroll;
    // Patch: call thumb update after every scroll
    this.input.off('wheel');
    this.input.on('wheel', (_ptr, _objs, _dx, dy) => {
      _baseApply(dy * 0.6);
      this._updateScrollThumb();
    });
    this.input.on('pointermove', (p) => {
      if (dragStartY === null || !p.isDown) return;
      _baseApply(dragStartScroll + (dragStartY - p.y) - scrollY);
      this._updateScrollThumb();
    });
  }

  // ─── Element draggables ─────────────────────────────────────────────────────

  _createElementSlot(element, index) {
    const x = INVENTORY_X;
    const y = INVENTORY_Y + index * SLOT_HEIGHT + SLOT_HEIGHT / 2;

    const icon = this.add.sprite(x - 30, y, element.sprite)
      .setInteractive({ useHandCursor: true });

    const index_list = [3,9,12]; // List of indexes to scale down the icons
    if (index_list.includes(index)) icon.setScale(0.1);

    const label = this.add.text(x + 6, y, element.label, {
      fontSize: '11px', fontFamily: 'monospace', color: '#eeeeee', wordWrap: { width: 90 },
    }).setOrigin(0, 0.5);

    this._inventoryContainer.add([icon, label]);

    // icon.on('pointerover', () => this._showTooltip(element.label, x + 50, y));
    // icon.on('pointerout',  () => this._hideTooltip());
    icon.on('pointerdown', (pointer) => this._startDrag(pointer, element, x - 30, y));

    this._elementObjects.push({ element, icon, label });
  }

  _startDrag(pointer, element, originX, originY) {
    // Create a temporary drag ghost    
    const ghost = this.add.sprite(originX + 100000, originY + 100000, element.sprite)
      .setDepth(10);    

    const ids_to_scale = ['nh3', 'na2co3', 'h2o2'];
    if (ids_to_scale.includes(element.id)) ghost.setScale(0.1);

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
      // this.tweens.add({
      //   targets: ghost,
      //   x: originX, y: originY,
      //   duration: 200,
      //   ease: 'Back.Out',
      //   onComplete: () => ghost.destroy(),
      // });
      
      ghost.destroy();
    }
  }

  // ─── Cauldron ───────────────────────────────────────────────────────────────

  _drawCauldron() {    
    this.add.image(CAULDRON_X, CAULDRON_Y, 'cauldron')
      .setScale(0.2);

    this.add.image(CAULDRON_X, CAULDRON_Y - 57, 'bubbles')
      .setScale(0.27);
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
    const emitter = this.add.particles(fromX, fromY, 'particle', {
      speed: { min: 40, max: 80 },
      angle: { min: 200, max: 340 },   // shoot upward/sideways
      scale: { start: 0.6, end: 0 },
      alpha: { start: 1, end: 0 },
      tint: [0x00ff88, 0x44aaff, 0xffd700],
      lifespan: 800,
      quantity: 8,
      emitting: false,   // fire once, don't loop
    });

    emitter.explode();   // burst on drop
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
      fontSize: '12px', fontFamily: 'monospace', color: '#f5d742',
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
