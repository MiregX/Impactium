export const Indent: RegExp = /^(?!.*[-_]{2,})[a-z0-9][-a-z0-9_]{1,30}[a-z0-9]$/i;
export const DisplayName: RegExp = /^[\s\S]{3,48}$/;
export const cookieSettings = {
  maxAge: 1000 * 60 * 60 * 24 * 7,
  path: '/',
}