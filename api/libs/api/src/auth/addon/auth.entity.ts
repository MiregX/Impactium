import DiscordOauth2 = require('discord-oauth2');
import { CreateLoginDto } from '@api/main/user/addon/login.dto';

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
  email?: string,
}