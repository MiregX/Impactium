import { λIcon } from "@/lib/utils";

export enum Role {
  Carry = 'Carry',
  Mid = 'Mid',
  Offlane = 'Offlane',
  SemiSupport = 'SemiSupport',
  FullSupport = 'FullSupport',
  Rotation = 'Rotation',
  Coach = 'Coach'
}

export const RoleIcons: Record<Role, λIcon> = {
  [Role.Carry]: 'Sword',
  [Role.Mid]: 'Crosshair',
  [Role.Offlane]: 'Shield',
  [Role.SemiSupport]: 'HandCoins',
  [Role.FullSupport]: 'HandHeart',
  [Role.Rotation]: 'RefreshCcw',
  [Role.Coach]: 'Flag',
}

export const MainRole = [Role.Carry, Role.Mid, Role.Offlane, Role.SemiSupport, Role.FullSupport];

export const SecondaryRole = [Role.Coach, Role.Rotation];