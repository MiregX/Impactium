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

export const FileExtensionBase: RegExp = /\.(jpg|jpeg|png|gif)$/;
export class FileExtension {
  static base: RegExp = FileExtensionBase;

  static test(value: string): boolean {
    return FileExtension.base.test(value);
  }

  static acceptable = (size: number): boolean => size ? size <= 1024 * 1024 : false;
}

export type λIteration = 0 | 1 | 2 | 4 | 8 | 16 | 32 | 64 | 128 | 256 | 512 | 1024 | 2048;

export const λIterations: Record<`_${λIteration}`, λIteration> = {
_0: 0,
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

export type Grid = Partial<Record<λIteration, 1 | 2 | 3>>;

export enum λCookie {
  redirectedToBypass = 'redirectedToBypass',
  Authorization = 'Authorization',
  language = '_language'
}

export enum λError {
  // Identifier
  username_not_provided = 'username_not_provided',
  username_invalid_format = 'username_invalid_format',
  username_taken = 'username_taken',

  indent_not_provided = 'indent_not_provided',
  indent_invalid_format = 'indent_invalid_format',
  indent_taken = 'indent_taken',

  code_not_provided = 'code_not_provided',
  code_invalid_format = 'code_invalid_format',
  code_taken = 'code_taken',

  // DisplayName
  display_name_invalid_format = 'display_name_invalid_format',
  display_name_is_same = 'display_name_is_same',

  // Internal
  internal_server_error = 'internal_server_error',
  team_invite_not_found = 'team_invite_not_found',
  team_invite_used = 'team_invite_used',
  team_invite_expired = 'team_invite_expired',
  team_is_close_to_everyone = 'team_is_close_to_everyone',
  user_not_found = 'user_not_found',
  user_is_already_team_member = 'user_is_already_team_member',
  user_is_already_tournament_member = 'user_is_already_tournament_member',
  data_scroll_locked = 'data-scroll-locked',
  multiple_files_error = 'multiple_files_error',
  file_invalid_format_or_size = "file_invalid_format_or_size",
  joinable_invalid_field = "joinable_invalid_field",
  username_is_same = "username_is_same",
  team_already_exists = "team_already_exists",
  team_limit = "team_limit",
  team_member_with_exact_role_already_exist = "team_member_with_exact_role_already_exist",
  too_many_qrcodes = "too_many_qrcodes",
  team_is_free_to_join = "team_is_free_to_join",
  tournament_iterations_invalid_format = "tournament_iterations_invalid_format",
  tournament_already_exists = "tournament_already_exists",
  tournament_limit = "tournament_limit",
}

export enum λCache {
  TeamList = 'team_list',
  TeamIndentGet = 'team_indent_get',
  TournamentCodeGet = 'tournament_code_get'
}

export namespace λParam {
  const Code = Symbol('Code');
  export type Code = string & { readonly [Code]: unique symbol };

  const Indent = Symbol('Indent');
  export type Indent = string & { readonly [Indent]: unique symbol };

  const Username = Symbol('Username');
  export type Username = string & { readonly [Username]: unique symbol };
}

export class PowerOfTwo { 
  static is = (n: number): boolean => n > 0 && (n & (n - 1)) === 0;

  static next(n: number): λIteration {
    if (n <= 0) return 0;
    
    if (this.is(n)) return n as λIteration;
    
    let power = 1;
    while (power < n) {
      power <<= 1;
    }
    
    return power as λIteration;
  }

  static prev = (n: λIteration): λIteration => (n >> 1) as λIteration;
}

export const SECOND = 1000;
export const MINUTE = SECOND * 60;
export const HOUR = MINUTE * 60;
export const DAY = HOUR * 24;
export const WEEK = DAY * 7;
export const MONTH = DAY * 30;
export const YEAR = MONTH * 12;