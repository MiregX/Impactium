import DiscordOauth2 = require('discord-oauth2');
<<<<<<< Updated upstream:api/libs/api/src/auth/addon/auth.entity.ts
import { CreateLoginDto } from '@api/main/user/addon/login.dto';
import { Optional } from '@impactium/types';
import { UserEntity } from '@api/main/user/addon/user.entity';
=======
import { CreateLoginDto } from 'src/user/addon/login.dto';
import { Optional } from '@impactium/types';
import { UserEntity } from 'src/user/addon/user.entity';
>>>>>>> Stashed changes:api/src/auth/addon/auth.entity.ts

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

export type _AuthPayload = DiscordAuthPayload | GoogleAuthPayload;

export interface AuthPayload extends CreateLoginDto {
  uid?: string;
  email?: Optional;
}

export type RequiredAuthPayload<T extends keyof AuthPayload> = Omit<AuthPayload, T> & Required<Pick<AuthPayload, T>>;

export type Payload = {
  uid: UserEntity['uid'];
}

export type Token = `Bearer ${string}`
