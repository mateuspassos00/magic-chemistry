// Singleton-style state shared across all scenes via the Phaser registry.
// Access it in any scene with:  this.registry.get('gameState')

export default class GameState {
  constructor() {
    this.score = 0;
    this.discovered = new Set();   // result ids the player has found
    this.cauldron   = [];          // element ids currently dropped in
  }

  addToCauldron(elementId) {
    if (!this.cauldron.includes(elementId)) {
      this.cauldron.push(elementId);
    }
  }

  clearCauldron() {
    this.cauldron = [];
  }

  registerDiscovery(recipe) {
    const isNew = !this.discovered.has(recipe.result);
    this.discovered.add(recipe.result);
    if (isNew) {
      this.score += recipe.stars * 100;
    }
    return isNew;
  }

  get discoveredCount() {
    return this.discovered.size;
  }
}
