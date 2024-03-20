import { $Enums, Prisma } from "@prisma/client";
import DiscordOauth2 = require('discord-oauth2');

interface GoogleAuthParams {
  locale: string;
  name: string;
  sub: string;
  picture: string;
  email: string;
}

export interface DiscordAuthPayload extends DiscordOauth2.User {
  type: 'discord'
}

export interface GoogleAuthPayload extends GoogleAuthParams {
  type: 'google'
}

export type AuthPayload = DiscordAuthPayload | GoogleAuthPayload;

export class CreateUserDto implements Prisma.UserCreateInput {
  lastLogin: $Enums.LoginType;
  email?: string;
  logins?: Prisma.LoginCreateNestedManyWithoutUserInput;
  player?: Prisma.PlayerCreateNestedOneWithoutUserInput;
}

export class UpdateUserDto implements Prisma.UserUpdateInput {
  lastLogin?: Prisma.EnumLoginTypeFieldUpdateOperationsInput | $Enums.LoginType;
}

export class LoginDto implements Prisma.LoginCreateInput {
  id: string;
  type: $Enums.LoginType;
  avatar: string;
  displayName: string;
  locale: string;
  user: Prisma.UserCreateNestedOneWithoutLoginsInput;
}

// 20616
// vrhcXPK