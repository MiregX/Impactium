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

export const SortRoles = (a: Role | null, b: Role | null) => a === null ? 1 : (b === null ? -1 : Object.values(Role).indexOf(a) - Object.values(Role).indexOf(b));

export const MainRole = [Role.Carry, Role.Mid, Role.Offlane, Role.SemiSupport, Role.FullSupport];

export const SecondaryRole = [Role.Coach, Role.Rotation];