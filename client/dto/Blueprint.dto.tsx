import { λParam } from "@impactium/pattern";
import { Item } from "./Item.dto";

export interface Blueprint {
  imprint: λParam.Imprint;
  rare: Rare;
  category: Category;
}

export class λBlueprint {
  imprint!: λParam.Imprint;
  rare!: Rare;
  category!: Category;

  static rare = (blueprints: Blueprint[], item: Item): Rare => blueprints.find((blueprint) => blueprint.imprint === item.imprint)?.rare ?? Rare.Common;
}

export enum Rare {
  Common = 'Common',
  Uncommon = 'Uncommon',
  Rare = 'Rare',
  Epic = 'Epic',
  Legendary = 'Legendary',
  Ancient = 'Ancient',
  Divine = 'Divine'
};

export enum Category {
  Skin = 'Skin',
  Ticket = 'Ticket',
  Resourse = 'Resourse',
  Collection = 'Collection'
};