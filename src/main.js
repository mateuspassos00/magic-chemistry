import MenuScene from './scenes/MenuScene.js';
import GameScene from './scenes/GameScene.js';
import ResultScene from './scenes/ResultScene.js';

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 560,
  pixelArt: true,          // crisp pixel-art rendering
  backgroundColor: '#0d1117',
  scene: [MenuScene, GameScene, ResultScene],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
};

new Phaser.Game(config);