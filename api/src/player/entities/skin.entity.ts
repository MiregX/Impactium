import { Skin } from '@prisma/client'

export class ReducedSkinEntity {
  constructor({ title, icon, source }: SkinEntity) {
    return {
      title,
      icon,
      source 
    }
  }
}

export class SkinEntity implements Skin {
  title: string;
  icon: string;
  source: string;
  uid: string;

  reduce() {
    return new ReducedSkinEntity(this);
  }
}