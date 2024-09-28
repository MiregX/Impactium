import { Configuration } from "@impactium/config";

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
}

export type Arrayed<K> = K | K[];

export function ui(path: string) {
  return `https://cdn.impactium.fun/ui/${path}.svg`
}

export function home() {
  return { url: Configuration.getClientLink() }
}

export const capitalize = (str: string) => str?.substring(0, 1).toUpperCase() + str?.substring(1);

export const λthrow = (Exception: new () => Error): never => {
  throw new Exception();
};
