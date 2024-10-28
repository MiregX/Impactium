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

interface Options {
  hour?: boolean;
  day?: boolean;
  month?: boolean;
  year?: boolean;
}

export class λUtils {
  public static array = <K extends unknown>(unknown: Arrayed<K>): K[] => Array.isArray(unknown) ? unknown : (typeof unknown === 'undefined' ? [] : [unknown]);

  public static var = (str: string) => `var(--${str})`;

  public static image = async (str: string, fs: typeof import('fs'), path: typeof import('path')): Promise<string> => fs.promises.readFile(path.join(process.cwd(), str), 'utf-8') || '';
  
  private static fix = (number: number | false) => number.toString().padStart(2, '0');
  
  public static readableDate = (date: Date | number | string, options: Options = {}): string => {
    const { hour = true, day = true, month = true, year = true } = options;
    date = new Date(date);
  
    const dateParts = [
      day ? this.fix(date.getUTCDate()) : null,
      month ? this.fix(date.getUTCMonth() + 1) : null,
      year ? date.getUTCFullYear().toString() : null
    ].filter(Boolean).join('.');
  
    const time = hour ? `${this.fix(date.getUTCHours())}:${this.fix(date.getUTCMinutes())}` : '';
  
    return `${time} ${dateParts}`.trim();
  }
  
  public static ui = (path: string) => `https://cdn.impactium.fun/ui/${path}${path.split('.').pop() ? '' : '.svg'}`;
  
  public static home = () => ({ url: Configuration.getClientLink() });
  
  public static capitalize = (str: string) => str?.substring(0, 1).toUpperCase() + str?.substring(1);
}

export type Arrayed<K> = K | K[];

export function λthrow(Exception: new () => Error): never {
  throw new Exception();
}
