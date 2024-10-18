import DiscordOauth2 = require('discord-oauth2');
import { CreateLoginDto } from '@api/main/user/addon/login.dto';
import { Optional } from '@impactium/pattern';

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

export type AuthResult = `Bearer ${string}`
