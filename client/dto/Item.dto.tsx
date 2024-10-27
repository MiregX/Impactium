import { λParam } from "@impactium/pattern";
import { Blueprint, Category, Rare } from "./Blueprint.dto";

export interface Item {
  id: string;
  uid: string;
  imprint: λParam.Imprint;
  amount: number;
}

export class λItem {
  static rare = (blueprints: Blueprint[], item: Item): Rare =>
    blueprints.find((blueprint) =>
      blueprint.imprint === item.imprint)?.rare
    ?? Rare.Common;
  
  static category = (blueprints: Blueprint[], item: Item): Category =>
    blueprints.find((blueprint) =>
      blueprint.imprint === item.imprint)?.category
    ?? Category.Resourse;

  static findByRare = (blueprints: Blueprint[], items: Item[], rare: Rare): Item[] =>
    items.filter((item) =>
      λItem.rare(blueprints, item) === rare);

  static findByCategory = (blueprints: Blueprint[], items: Item[], category: Category): Item[] =>
    items.filter((item) =>
      λItem.category(blueprints, item) === category);

  static filter = (blueprints: Blueprint[], items: Item[], filter: ItemFilter): Item[] =>
    items.filter((item) =>
      (filter.rare && filter.rare.length ? filter.rare.includes(λItem.rare(blueprints, item)) : true) &&
      (filter.category && filter.category.length ? filter.category.includes(λItem.category(blueprints, item)) : true));

  static sort = (blueprints: Blueprint[], items: Item[]): Item[] =>
    items.sort((a, b) =>
      Object.values(Rare).indexOf(λItem.rare(blueprints, a)) - Object.values(Rare).indexOf(λItem.rare(blueprints, b)));
}

export interface ItemFilter {
  rare: Rare[];
  category: Category[];
}
