// Регулярное выражение Indent используется для проверки соответствия идентификаторов определенному шаблону.
// Оно обеспечивает выполнение следующих критериев:
// 1. Идентификатор не содержит двух или более подряд идущих дефисов (-) или подчеркиваний (_).
// 2. Идентификатор состоит из строчных и прописных букв, цифр, дефисов и подчеркиваний.
// 3. Идентификатор должен начинаться с буквы или цифры.
// 4. Длина идентификатора должна быть от 3 до 32 символов включительно.
// 5. Идентификатор должен заканчиваться буквой или цифрой.

// Пояснение компонентов регулярного выражения:
// ^(?!.*[-_]{2,})        : Утверждает, что строка не содержит двух или более подряд идущих дефисов или подчеркиваний в любой части строки.
// [a-z0-9]               : Идентификатор должен начинаться с буквы (a-z) или цифры (0-9).
// [-a-z0-9_]{1,30}       : Идентификатор может содержать от 1 до 30 символов, включая строчные буквы (a-z), цифры (0-9), дефисы (-) и подчеркивания (_).
// [a-z0-9]$              : Идентификатор должен заканчиваться буквой (a-z) или цифрой (0-9).
// /i                     : Флаг 'i' делает регулярное выражение нечувствительным к регистру, что позволяет использовать прописные буквы (A-Z).

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

export enum cookiePattern {
  redirectedToBypass = 'redirectedToBypass',
  Authorization = 'Authorization',
  language = '_language'
}

export enum λError {
  indent_invalid_format = 'indent_invalid_format',
  invalid_joinable_field = 'invalid_joinable_field',
  username_invalid_format = 'username_invalid_format'
}