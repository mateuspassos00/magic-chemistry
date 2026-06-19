# Magic Chemistry 🧪

Jogo educativo de combinação de elementos químicos. Feito com [Phaser 3](https://phaser.io/).

## Estrutura

```
magic-chemistry/
├── index.html
├── src/
│   ├── main.js                  # Config do Phaser e boot
│   ├── scenes/
│   │   ├── MenuScene.js         # Tela inicial
│   │   ├── GameScene.js         # Inventário + caldeirão
│   │   └── ResultScene.js       # Popup de resultado
│   ├── data/
│   │   └── substances.js        # Elementos, receitas e função findRecipe()
│   └── systems/
│       └── GameState.js         # Pontuação e descobertas
└── assets/
    ├── sprites/                 # Seus PNGs pixel-art aqui
    └── audio/                   # Sons opcionais
```

## Como rodar

O jogo usa ES Modules (`type="module"`), então precisa de um servidor HTTP local
— abrir o `index.html` direto no browser não funciona.

### Opção 1 — VS Code + Live Server
Instale a extensão **Live Server** e clique em "Go Live".

### Opção 2 — Node.js
```bash
npx serve .
```

### Opção 3 — Python
```bash
python -m http.server 8000
```

## Adicionando assets

1. Coloque seus sprites PNG em `assets/sprites/`.
2. No `GameScene.preload()`, carregue cada um:
   ```js
   this.load.image('potion_blue', 'assets/sprites/potion_blue.png');
   this.load.image('lab_bg',      'assets/sprites/lab_bg.png');
   this.load.image('cauldron',    'assets/sprites/cauldron.png');
   ```
3. Substitua os `this.add.rectangle(...)` pelos `this.add.image(...)` ou `this.add.sprite(...)` correspondentes.

### Onde encontrar sprites pixel-art gratuitos
- https://itch.io/game-assets/free/tag-pixel-art (busque "alchemy", "potion", "RPG UI")
- https://opengameart.org

## Adicionando novas substâncias

Edite `src/data/substances.js`:

```js
// Novo elemento base
{ id: 'sulfur', label: 'Enxofre (S)', sprite: 'potion_yellow2', tint: 0xffee58 },

// Nova receita
{
  ingredients: ['hydrogen', 'sulfur'],
  result: 'h2s',
  formula: 'H₂S',
  label: 'Ácido Sulfídrico',
  stars: 2,
  description: 'Gás tóxico com cheiro característico de ovo podre...',
  image: 'result_h2s',
},
```

`findRecipe()` compara conjuntos (não importa a ordem em que os elementos foram adicionados).

## Deploy

O jogo é um arquivo HTML estático. Para publicar:
- **GitHub Pages**: suba o repositório e ative Pages na branch `main`.
- **Netlify / Vercel**: arraste a pasta — funciona sem configuração.
