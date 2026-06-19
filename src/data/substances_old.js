// Base elements available in the inventory.
// 'sprite' refers to a key you'll load in your preload() calls.
// 'tint' is used to color a placeholder rectangle if sprites aren't ready yet.
export const ELEMENTS = [
  { id: 'hydrogen',  label: 'Hidrogênio (H)',  sprite: 'potion_blue',   tint: 0x4fc3f7 },
  { id: 'oxygen',    label: 'Oxigênio (O)',     sprite: 'potion_red',    tint: 0xef5350 },
  { id: 'carbon',    label: 'Carbono (C)',      sprite: 'potion_black',  tint: 0x424242 },
  { id: 'nitrogen',  label: 'Nitrogênio (N)',   sprite: 'potion_green',  tint: 0x66bb6a },
  { id: 'sodium',    label: 'Sódio (Na)',       sprite: 'potion_yellow', tint: 0xffd54f },
  { id: 'chlorine',  label: 'Cloro (Cl)',       sprite: 'potion_purple', tint: 0xce93d8 },
];

// Each recipe is a SET of element ids (order doesn't matter).
// 'stars' is the difficulty/rarity rating shown in the popup (1–3).
export const RECIPES = [
  {
    ingredients: ['hydrogen', 'oxygen'],
    result: 'water',
    formula: 'H₂O',
    label: 'Água',
    stars: 1,
    description:
      'Um dos elementos da natureza mais importantes. Em sua forma pura não tem cor (incolor), não tem cheiro (inodora) e não tem sabor (insípida).',
    image: 'result_water',
  },
  {
    ingredients: ['carbon', 'oxygen'],
    result: 'co2',
    formula: 'CO₂',
    label: 'Dióxido de Carbono',
    stars: 1,
    description:
      'Gás produzido pela respiração celular e pela queima de combustíveis. É responsável pelo efeito estufa e é absorvido pelas plantas na fotossíntese.',
    image: 'result_co2',
  },
  {
    ingredients: ['nitrogen', 'hydrogen'],
    result: 'ammonia',
    formula: 'NH₃',
    label: 'Amônia',
    stars: 2,
    description:
      'Gás incolor com odor forte e característico. Amplamente utilizado na fabricação de fertilizantes e produtos de limpeza.',
    image: 'result_ammonia',
  },
  {
    ingredients: ['sodium', 'chlorine'],
    result: 'salt',
    formula: 'NaCl',
    label: 'Sal de Cozinha',
    stars: 1,
    description:
      'Cloreto de sódio, essencial para a vida humana. Usado há milênios para temperar e conservar alimentos.',
    image: 'result_salt',
  },
  {
    ingredients: ['carbon', 'hydrogen', 'oxygen'],
    result: 'glucose',
    formula: 'C₆H₁₂O₆',
    label: 'Glicose',
    stars: 3,
    description:
      'Principal fonte de energia das células. Produzida pelas plantas durante a fotossíntese e metabolizada por todos os seres vivos.',
    image: 'result_glucose',
  },
];

// Utility: find a recipe from a SET of element ids currently in the cauldron.
export function findRecipe(elementIds) {
  const sorted = [...elementIds].sort();
  return RECIPES.find((r) => {
    const rs = [...r.ingredients].sort();
    return rs.length === sorted.length && rs.every((v, i) => v === sorted[i]);
  }) ?? null;
}
