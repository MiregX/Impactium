import { λIcon } from "@/lib/utils";

export enum Roles {
  Carry = 'Carry',
  Mid = 'Mid',
  Offlane = 'Offlane',
  SemiSupport = 'SemiSupport',
  FullSupport = 'FullSupport',
  Rotation = 'Rotation',
  Coach = 'Coach'
}

export const RolesIcons: Record<Roles, λIcon> = {
  [Roles.Carry]: 'Sword',
  [Roles.Mid]: 'Crosshair',
  [Roles.Offlane]: 'Shield',
  [Roles.SemiSupport]: 'HandCoins',
  [Roles.FullSupport]: 'HandHeart',
  [Roles.Rotation]: 'RefreshCcw',
  [Roles.Coach]: 'Flag',
}

export const MainRoles = [Roles.Carry, Roles.Mid, Roles.Offlane, Roles.SemiSupport, Roles.FullSupport];

export const SecondaryRoles = [Roles.Coach, Roles.Rotation];