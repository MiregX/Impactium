// 📑 Identifier
export const IdentifierBase = /^(?!.*[-_]{2,})[a-z0-9][-a-z0-9_]{1,30}[a-z0-9]$/i;
export class Identifier {
  static base: RegExp = IdentifierBase;
  static Indent: RegExp = Identifier.base;
  static Username: RegExp = Identifier.base;
  static Code: RegExp = Identifier.base;

  static test(value: string): boolean {
    return Identifier.base.test(value);
  }
}

export const DisplayNameBase = /^[\s\S]{3,48}$/;
export class DisplayName {
  static base: RegExp = DisplayNameBase;
  
  static test(value: string): boolean {
    return DisplayName.base.test(value);
  }
}
export const cookieSettings = {
  maxAge: 1000 * 60 * 60 * 24 * 7,
  path: '/',
}

export type λIteration = 1 | 2 | 4 | 8 | 16 | 32 | 64 | 128 | 256 | 512 | 1024 | 2048;

export const λIterations: Record<`_${λIteration}`, λIteration> = {
_1: 1,
_2: 2,
_4: 4,
_8: 8,
_16: 16,
_32: 32,
_64: 64,
_128: 128,
_256: 256,
_512: 512,
_1024: 1024,
_2048: 2048
} as const;


export enum λCookie {
  redirectedToBypass = 'redirectedToBypass',
  Authorization = 'Authorization',
  language = '_language'
}

export enum λError {
  indent_invalid_format = 'indent_invalid_format',
  invalid_joinable_field = 'invalid_joinable_field',
  username_invalid_format = 'username_invalid_format',
  internal_server_error = 'internal_server_error',
  displayName_invalid_format = 'displayName_invalid_format',
  displayName_is_same = 'displayName_is_same',
  team_invite_not_found = 'team_invite_not_found',
  team_invite_used = 'team_invite_used',
  team_invite_expired = 'team_invite_expired',
  team_is_close_to_everyone = 'team_is_close_to_everyone',
  user_not_found = 'user_not_found',
  user_is_already_team_member = 'user_is_already_team_member'
}

export enum λCache {
  TeamList = 'team_list',
  TeamIndentGet = 'team_indent_get',
  TournamentCodeGet = 'tournament_code_get'
}

export const SECOND = 1000;
export const MINUTE = SECOND * 60;
export const HOUR = MINUTE * 60;
export const DAY = HOUR * 24;
export const WEEK = DAY * 7;
export const MONTH = DAY * 30;
export const YEAR = MONTH * 12;