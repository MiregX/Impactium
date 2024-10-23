import { λParam } from '@impactium/pattern';
import { Category, Prisma, Rare } from '@prisma/client';

export const blueprints: Record<λParam.Imprint, Prisma.BlueprintCreateInput> = {
  bottle: {
    imprint: 'bottle',
    category: Category.Resourse,
    rare: Rare.Common
  },
  cannon: {
    imprint: 'cannon',
    category: Category.Resourse,
    rare: Rare.Common
  },
  chest: {
    imprint: 'chest',
    category: Category.Resourse,
    rare: Rare.Common
  },
  coin: {
    imprint: 'coin',
    category: Category.Resourse,
    rare: Rare.Common
  },
  gem: {
    imprint: 'gem',
    category: Category.Collection,
    rare: Rare.Rare
  },
  knife: {
    imprint: 'knife',
    category: Category.Resourse,
    rare: Rare.Common
  },
  map: {
    imprint: 'map',
    category: Category.Resourse,
    rare: Rare.Common
  },
  obsidian: {
    imprint: 'obsidian',
    category: Category.Collection,
    rare: Rare.Rare
  },
  pistol: {
    imprint: 'pistol',
    category: Category.Resourse,
    rare: Rare.Common
  },
  ruby: {
    imprint: 'ruby',
    category: Category.Collection,
    rare: Rare.Rare
  },
  potion: {
    imprint: 'potion',
    category: Category.Resourse,
    rare: Rare.Common
  },
  beer: {
    imprint: 'beer',
    category: Category.Resourse,
    rare: Rare.Common
  }
};
