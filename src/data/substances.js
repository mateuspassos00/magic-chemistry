// Base substances (aqueous solutions and common lab reagents).
// 'sprite' refers to a key loaded in preload(). 'tint' is the placeholder color.
export const ELEMENTS = [
  { id: 'hcl',       label: 'HCl',         subtitle: 'Ácido Clorídrico',    sprite: 'potion_clear',   tint: 0xe0f7fa },
  { id: 'h2so4',     label: 'H₂SO₄',       subtitle: 'Ácido Sulfúrico',     sprite: 'potion_yellow',  tint: 0xfff59d },
  { id: 'naoh',      label: 'NaOH',         subtitle: 'Hidróxido de Sódio',  sprite: 'potion_white',   tint: 0xf5f5f5 },
  { id: 'nh3',       label: 'NH₃',          subtitle: 'Amônia',              sprite: 'potion_ltblue',  tint: 0xb3e5fc },
  { id: 'agno3',     label: 'AgNO₃',        subtitle: 'Nitrato de Prata',    sprite: 'potion_silver',  tint: 0xe0e0e0 },
  { id: 'ki',        label: 'KI',           subtitle: 'Iodeto de Potássio',  sprite: 'potion_orange',  tint: 0xffe0b2 },
  { id: 'cuso4',     label: 'CuSO₄',        subtitle: 'Sulfato de Cobre',    sprite: 'potion_blue',    tint: 0x4fc3f7 },
  { id: 'naoh2',     label: 'NaOH',         subtitle: 'Hidróxido de Sódio',  sprite: 'potion_white2',  tint: 0xeeeeee },
  { id: 'fe',        label: 'Fe',           subtitle: 'Ferro (limalha)',      sprite: 'potion_grey',    tint: 0x9e9e9e },
  { id: 'na2co3',    label: 'Na₂CO₃',       subtitle: 'Carbonato de Sódio',  sprite: 'potion_beige',   tint: 0xd7ccc8 },
  { id: 'pb_no3_2',  label: 'Pb(NO₃)₂',    subtitle: 'Nitrato de Chumbo',   sprite: 'potion_green',   tint: 0xc8e6c9 },
  { id: 'kmno4',     label: 'KMnO₄',        subtitle: 'Permanganato de Pot.',sprite: 'potion_purple',  tint: 0xce93d8 },
  { id: 'h2o2',      label: 'H₂O₂',         subtitle: 'Água Oxigenada',      sprite: 'potion_pink',    tint: 0xf8bbd0 },
  { id: 'na2so4',    label: 'Na₂SO₄',       subtitle: 'Sulfato de Sódio',    sprite: 'potion_ltgrey',  tint: 0xf5f5f5 },
  { id: 'bacl2',     label: 'BaCl₂',        subtitle: 'Cloreto de Bário',    sprite: 'potion_red',     tint: 0xef9a9a },
];

// Each recipe is matched as an unordered SET of ingredient ids.
// 'type' is informational (used for flavor / grouping).
// 'visual' describes the observable phenomenon — great for educational flavor text.
// 'stars': 1 = easy/common, 2 = intermediate, 3 = rare/complex.
export const RECIPES = [

  // ── Acid-base neutralizations ──────────────────────────────────────────────
  {
    ingredients: ['hcl', 'naoh'],
    result: 'nacl_water',
    formula: 'NaCl + H₂O',
    label: 'Cloreto de Sódio',
    type: 'neutralização',
    visual: 'A solução torna-se neutra e aquece levemente.',
    stars: 1,
    description:
      'Reação de neutralização clássica entre um ácido forte e uma base forte. ' +
      'O produto é sal de cozinha dissolvido em água.',
    image: 'result_nacl',
  },
  {
    ingredients: ['h2so4', 'naoh'],
    result: 'na2so4_water',
    formula: 'Na₂SO₄ + H₂O',
    label: 'Sulfato de Sódio',
    type: 'neutralização',
    visual: 'Solução incolor e neutra com liberação de calor.',
    stars: 2,
    description:
      'O sulfato de sódio é usado na indústria têxtil e de papel. ' +
      'A reação é altamente exotérmica — cuidado ao manusear H₂SO₄ concentrado.',
    image: 'result_na2so4',
  },
  {
    ingredients: ['hcl', 'nh3'],
    result: 'nh4cl',
    formula: 'NH₄Cl',
    label: 'Cloreto de Amônio',
    type: 'neutralização',
    visual: 'Fumaça branca densa se forma ao aproximar os frascos.',
    stars: 2,
    description:
      'Quando os gases se encontram, formam uma névoa branca de cloreto de amônio — ' +
      'um dos experimentos mais espetaculares da química básica. ' +
      'O sal resultante é usado em pilhas secas e como fertilizante.',
    image: 'result_nh4cl',
  },

  // ── Precipitações ──────────────────────────────────────────────────────────
  {
    ingredients: ['agno3', 'hcl'],
    result: 'agcl',
    formula: 'AgCl↓ + HNO₃',
    label: 'Cloreto de Prata',
    type: 'precipitação',
    visual: 'Precipitado branco e caseoso forma-se imediatamente.',
    stars: 2,
    description:
      'O cloreto de prata (AgCl) é praticamente insolúvel em água e precipita ao instante. ' +
      'Essa reação é usada em análise química para identificar a presença de íons cloreto (Cl⁻) ' +
      'numa solução desconhecida.',
    image: 'result_agcl',
  },
  {
    ingredients: ['pb_no3_2', 'ki'],
    result: 'pbi2',
    formula: 'PbI₂↓ + KNO₃',
    label: 'Iodeto de Chumbo',
    type: 'precipitação',
    visual: 'Precipitado amarelo-ouro brilhante cai pela solução como flocos de ouro.',
    stars: 3,
    description:
      'O iodeto de chumbo(II) forma cristais amarelo-dourados que afundam lentamente, ' +
      'criando o efeito chamado de "chuva de ouro". É usado em pesquisa de células solares.',
    image: 'result_pbi2',
  },
  {
    ingredients: ['bacl2', 'na2so4'],
    result: 'baso4',
    formula: 'BaSO₄↓ + NaCl',
    label: 'Sulfato de Bário',
    type: 'precipitação',
    visual: 'Precipitado branco e denso torna a solução leitosa.',
    stars: 2,
    description:
      'Por ser opaco a raios-X e inerte no organismo, o sulfato de bário é utilizado como contraste em exames ' +
      'radiológicos do trato digestivo.',
    image: 'result_baso4',
  },
  {
    ingredients: ['cuso4', 'naoh'],
    result: 'cu_oh_2',
    formula: 'Cu(OH)₂↓ + Na₂SO₄',
    label: 'Hidróxido de Cobre',
    type: 'precipitação',
    visual: 'Precipitado azul-celeste gelatinoso forma-se na solução azul do sulfato.',
    stars: 2,
    description:
      'O hidróxido de cobre(II) precipita como uma massa gelatinosa azul-celeste. ' +
      'É o princípio do Reagente de Fehling, usado para detectar açúcares redutores ' +
      'em análises de alimentos.',
    image: 'result_cu_oh_2',
  },

  // ── Redox / troca de cor ───────────────────────────────────────────────────
  {
    ingredients: ['cuso4', 'fe'],
    result: 'feso4_cu',
    formula: 'FeSO₄ + Cu↓',
    label: 'Cobre Metálico + Sulfato de Ferro',
    type: 'redox',
    visual: 'A solução azul torna-se verde; cobre avermelhado deposita-se no ferro.',
    stars: 2,
    description:
      'O ferro é mais reativo que o cobre e "rouba" os íons Cu²⁺ da solução. ' +
      'A solução azul do sulfato de cobre vai esverdeando conforme o Fe²⁺ se forma, ' +
      'e cobre metálico se deposita sobre o prego de ferro.',
    image: 'result_feso4_cu',
  },
  {
    ingredients: ['kmno4', 'h2o2'],
    result: 'mn2_o2',
    formula: 'Mn²⁺ + O₂↑ + H₂O',
    label: 'Descoloração do Permanganato',
    type: 'redox',
    visual: 'A solução púrpura intensa descolore-se completamente com efervescência de O₂.',
    stars: 3,
    description:
      'O permanganato de potássio (KMnO₄) é um oxidante forte de cor púrpura intensa. ' +
      'A água oxigenada o reduz a Mn²⁺ (quase incolor), liberando oxigênio gasoso.',
    image: 'result_mn2_o2',
  },
  {
    ingredients: ['cuso4', 'nh3'],
    result: 'cu_nh3_complex',
    formula: '[Cu(NH₃)₄]²⁺',
    label: 'Complexo Tetraminacobre',
    type: 'complexação',
    visual: 'A solução azul-claro transforma-se num azul royal intenso e translúcido.',
    stars: 3,
    description:
      'Com excesso de amônia, os íons Cu²⁺ formam um complexo de coordenação ' +
      'tetraamminacopper(II) — responsável por uma das cores mais belas da química. ' +
      'É um exemplo clássico de formação de complexos em química inorgânica.',
    image: 'result_cu_complex',
  },

  // ── Produção de gás ────────────────────────────────────────────────────────
  {
    ingredients: ['na2co3', 'h2so4'],
    result: 'na2so4_co2',
    formula: 'Na₂SO₄ + H₂O + CO₂↑',
    label: 'Dióxido de Carbono',
    type: 'gás',
    visual: 'Efervescência vigorosa — bolhas de CO₂ sobem pela solução.',
    stars: 1,
    description:
      'O ácido sulfúrico desloca o CO₂ do carbonato de sódio. ' +
      'A efervescência é idêntica à de um refrigerante. ' +
      'Essa reação é usada em extintores de incêndio do tipo químico úmido.',
    image: 'result_co2_gas',
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
