import { λParam } from "@impactium/pattern";
import { Item } from "./Item.dto";

export interface Blueprint {
  imprint: λParam.Imprint;
  rare: Rare;
  category: Category;
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