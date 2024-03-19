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
  lastLogin: "discord"
}

export interface GoogleAuthPayload extends GoogleAuthParams {
  lastLogin: "google";
}

export type LoginPayload = DiscordAuthPayload | GoogleAuthPayload;

export class CreateUserDto implements Prisma.UserCreateInput {
  lastLogin: $Enums.LoginType;
  email?: string;
  logins?: Prisma.LoginCreateNestedManyWithoutUserInput;
  player?: Prisma.PlayerCreateNestedOneWithoutUserInput;
}

export class CreateLoginDto implements Prisma.LoginCreateInput {
  id?: string;
  type: $Enums.LoginType;
  avatar?: string;
  displayName: string;
  locale: string;
  user: Prisma.UserCreateNestedOneWithoutLoginsInput;
}

// 20616
// vrhcXPK