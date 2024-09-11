export class OmitObject {
  static omit<T extends object, K extends keyof T>(obj: T, ...keys: K[]): Omit<T, K> {
    const result = { ...obj };

    for (const key of keys) {
      delete result[key];
    }

    return result as Omit<T, K>;
  }
}

export function ui(path: string) {
  return `https://cdn.impactium.fun/ui/${path}.svg`
}