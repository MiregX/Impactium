import { λParam } from "@impactium/pattern";
import { Item } from "./Item.dto";

export interface Blueprint {
  imprint: λParam.Imprint;
  rare: Rare;
  category: Category;
}

export enum Rare {
  Divine = 'Divine',
  Ancient = 'Ancient',
  Legendary = 'Legendary',
  Epic = 'Epic',
  Rare = 'Rare',
  Uncommon = 'Uncommon',
  Common = 'Common'
};

export enum Category {
  Resourse = 'Resourse',
  Scroll = 'Scroll',
  Spellbook = 'Spellbook',
  Book = 'Book',
  Ingot = 'Ingot',
  Crystal = 'Crystal',
  Skin = 'Skin',
  Ticket = 'Ticket'
};