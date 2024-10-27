import { λParam } from '@impactium/pattern';
import { Category, Prisma, Rare } from '@prisma/client';

export const blueprints: Record<λParam.Imprint, Prisma.BlueprintCreateInput> = {
  advanced_scroll: {
    imprint: 'advanced_scroll',
    category: Category.Scroll,
    rare: Rare.Epic
  },
  darkness_spellbook: {
    imprint: 'darkness_spellbook',
    category: Category.Spellbook,
    rare: Rare.Legendary
  },
  glowshroom: {
    imprint: 'glowshroom',
    category: Category.Resourse,
    rare: Rare.Common
  },
  moondust: {
    imprint: 'moondust',
    category: Category.Resourse,
    rare: Rare.Common
  },
  thunder_crystal: {
    imprint: 'thunder_crystal',
    category: Category.Crystal,
    rare: Rare.Ancient
  },
  advanced_spellbook: {
    imprint: 'advanced_spellbook',
    category: Category.Spellbook,
    rare: Rare.Legendary
  },
  dryed_nightshade: {
    imprint: 'dryed_nightshade',
    category: Category.Resourse,
    rare: Rare.Common
  },
  gold_ingot: {
    imprint: 'gold_ingot',
    category: Category.Ingot,
    rare: Rare.Uncommon
  },
  moonlit_pearl: {
    imprint: 'moonlit_pearl',
    category: Category.Resourse,
    rare: Rare.Common
  },
  thunder_scroll: {
    imprint: 'thunder_scroll',
    category: Category.Scroll,
    rare: Rare.Epic
  },
  ancient_tablet: {
    imprint: 'ancient_tablet',
    category: Category.Resourse,
    rare: Rare.Common
  },
  earth_crystal: {
    imprint: 'earth_crystal',
    category: Category.Crystal,
    rare: Rare.Ancient
  },
  golden_apple: {
    imprint: 'golden_apple',
    category: Category.Resourse,
    rare: Rare.Common
  },
  mythril_ingot: {
    imprint: 'mythril_ingot',
    category: Category.Ingot,
    rare: Rare.Uncommon
  },
  thunder_spellbook: {
    imprint: 'thunder_spellbook',
    category: Category.Spellbook,
    rare: Rare.Legendary
  },
  apple: {
    imprint: 'apple',
    category: Category.Resourse,
    rare: Rare.Common
  },
  earth_scroll: {
    imprint: 'earth_scroll',
    category: Category.Scroll,
    rare: Rare.Epic
  },
  griffin_wing: {
    imprint: 'griffin_wing',
    category: Category.Resourse,
    rare: Rare.Common
  },
  ogre_toenail: {
    imprint: 'ogre_toenail',
    category: Category.Resourse,
    rare: Rare.Common
  },
  troll_tooth: {
    imprint: 'troll_tooth',
    category: Category.Resourse,
    rare: Rare.Common
  },
  basic_book: {
    imprint: 'basic_book',
    category: Category.Book,
    rare: Rare.Common
  },
  earth_spellbook: {
    imprint: 'earth_spellbook',
    category: Category.Spellbook,
    rare: Rare.Legendary
  },
  holy_book: {
    imprint: 'holy_book',
    category: Category.Book,
    rare: Rare.Uncommon
  },
  old_book: {
    imprint: 'old_book',
    category: Category.Book,
    rare: Rare.Uncommon
  },
  water: {
    imprint: 'water',
    category: Category.Resourse,
    rare: Rare.Common
  },
  basic_scroll: {
    imprint: 'basic_scroll',
    category: Category.Scroll,
    rare: Rare.Rare
  },
  earthbound_rock: {
    imprint: 'earthbound_rock',
    category: Category.Resourse,
    rare: Rare.Common
  },
  ice_crystal: {
    imprint: 'ice_crystal',
    category: Category.Crystal,
    rare: Rare.Ancient
  },
  parchment: {
    imprint: 'parchment',
    category: Category.Resourse,
    rare: Rare.Common
  },
  water_berry: {
    imprint: 'water_berry',
    category: Category.Resourse,
    rare: Rare.Common
  },
  basic_spellbook: {
    imprint: 'basic_spellbook',
    category: Category.Spellbook,
    rare: Rare.Epic
  },
  elven_dew: {
    imprint: 'elven_dew',
    category: Category.Resourse,
    rare: Rare.Common
  },
  ice_scroll: {
    imprint: 'ice_scroll',
    category: Category.Scroll,
    rare: Rare.Epic
  },
  phoenix_feather: {
    imprint: 'phoenix_feather',
    category: Category.Resourse,
    rare: Rare.Common
  },
  water_crystal: {
    imprint: 'water_crystal',
    category: Category.Crystal,
    rare: Rare.Ancient
  },
  basilisk_scale: {
    imprint: 'basilisk_scale',
    category: Category.Resourse,
    rare: Rare.Common
  },
  enchanted_obsidian: {
    imprint: 'enchanted_obsidian',
    category: Category.Resourse,
    rare: Rare.Divine
  },
  ice_spellbook: {
    imprint: 'ice_spellbook',
    category: Category.Spellbook,
    rare: Rare.Legendary
  },
  royal_book: {
    imprint: 'royal_book',
    category: Category.Book,
    rare: Rare.Uncommon
  },
  water_scroll: {
    imprint: 'water_scroll',
    category: Category.Scroll,
    rare: Rare.Epic
  },
  bone: {
    imprint: 'bone',
    category: Category.Resourse,
    rare: Rare.Common
  },
  fabric: {
    imprint: 'fabric',
    category: Category.Resourse,
    rare: Rare.Common
  },
  light_crystal: {
    imprint: 'light_crystal',
    category: Category.Crystal,
    rare: Rare.Ancient
  },
  shadow_root: {
    imprint: 'shadow_root',
    category: Category.Resourse,
    rare: Rare.Common
  },
  wind_crystal: {
    imprint: 'wind_crystal',
    category: Category.Crystal,
    rare: Rare.Ancient
  },
  bronze_ingot: {
    imprint: 'bronze_ingot',
    category: Category.Ingot,
    rare: Rare.Uncommon
  },
  fairy_pollen: {
    imprint: 'fairy_pollen',
    category: Category.Resourse,
    rare: Rare.Common
  },
  light_scroll: {
    imprint: 'light_scroll',
    category: Category.Scroll,
    rare: Rare.Epic
  },
  silk: {
    imprint: 'silk',
    category: Category.Resourse,
    rare: Rare.Common
  },
  wind_scroll: {
    imprint: 'wind_scroll',
    category: Category.Scroll,
    rare: Rare.Epic
  },
  colorful_coral: {
    imprint: 'colorful_coral',
    category: Category.Resourse,
    rare: Rare.Common
  },
  fire_berry: {
    imprint: 'fire_berry',
    category: Category.Resourse,
    rare: Rare.Common
  },
  light_spellbook: {
    imprint: 'light_spellbook',
    category: Category.Spellbook,
    rare: Rare.Legendary
  },
  silver_ingot: {
    imprint: 'silver_ingot',
    category: Category.Ingot,
    rare: Rare.Uncommon
  },
  wind_spellbook: {
    imprint: 'wind_spellbook',
    category: Category.Spellbook,
    rare: Rare.Legendary
  },
  crab_claw: {
    imprint: 'crab_claw',
    category: Category.Resourse,
    rare: Rare.Divine
  },
  fire_crystal: {
    imprint: 'fire_crystal',
    category: Category.Crystal,
    rare: Rare.Ancient
  },
  magestone: {
    imprint: 'magestone',
    category: Category.Resourse,
    rare: Rare.Common
  },
  siren_scale: {
    imprint: 'siren_scale',
    category: Category.Resourse,
    rare: Rare.Common
  },
  wolf_fur: {
    imprint: 'wolf_fur',
    category: Category.Resourse,
    rare: Rare.Common
  },
  dark_mushroom: {
    imprint: 'dark_mushroom',
    category: Category.Resourse,
    rare: Rare.Common
  },
  fire_scroll: {
    imprint: 'fire_scroll',
    category: Category.Scroll,
    rare: Rare.Epic
  },
  mandrake_root: {
    imprint: 'mandrake_root',
    category: Category.Resourse,
    rare: Rare.Common
  },
  slime_ball: {
    imprint: 'slime_ball',
    category: Category.Resourse,
    rare: Rare.Common
  },
  darkness_crystal: {
    imprint: 'darkness_crystal',
    category: Category.Crystal,
    rare: Rare.Ancient
  },
  fire_spellbook: {
    imprint: 'fire_spellbook',
    category: Category.Spellbook,
    rare: Rare.Legendary
  },
  medicinal_herb: {
    imprint: 'medicinal_herb',
    category: Category.Resourse,
    rare: Rare.Common
  },
  sprite_wing: {
    imprint: 'sprite_wing',
    category: Category.Resourse,
    rare: Rare.Epic
  },
  darkness_scroll: {
    imprint: 'darkness_scroll',
    category: Category.Scroll,
    rare: Rare.Epic
  },
  ghost_essence: {
    imprint: 'ghost_essence',
    category: Category.Resourse,
    rare: Rare.Uncommon
  },
  milk_bottle: {
    imprint: 'milk_bottle',
    category: Category.Resourse,
    rare: Rare.Common
  },
  sugar_cane: {
    imprint: 'sugar_cane',
    category: Category.Resourse,
    rare: Rare.Common
  },
};
