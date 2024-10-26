import { Configuration } from '@impactium/config'

export class OmitObject {
  static omit<T extends object, K extends keyof T>(obj: T, ...keys: K[]): Omit<T, K> {
    const result = { ...obj };

    for (const key of keys) {
      delete result[key];
    }

    return result as Omit<T, K>;
  }
}

export class λUtils {
  public static array = <K extends unknown>(unknown: Arrayed<K>): K[] => Array.isArray(unknown) ? unknown : (typeof unknown === 'undefined' ? [] : [unknown]);

  public static var = (str: string) => `var(--${str})`;

  public static image = async (str: string, fs: typeof import('fs'), path: typeof import('path')): Promise<string> => fs.promises.readFile(path.join(process.cwd(), str), 'utf-8') || '';
}

export type Arrayed<K> = K | K[];

export function ui(path: string) {
  return `https://cdn.impactium.fun/ui/${path}.svg`
}

export function home() {
  return { url: Configuration.getClientLink() }
}

export const capitalize = (str: string) => str?.substring(0, 1).toUpperCase() + str?.substring(1);

export function λthrow(Exception: new () => Error): never {
  throw new Exception();
}
