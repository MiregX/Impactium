import { twMerge } from 'tailwind-merge'
import { type ClassValue, clsx } from 'clsx'

export function between(num: number, min: number, max: number) {
  return num >= min && num <= max;
};

export function toArray<K extends unknown>(unknown: K | K[]): K[] {
  return Array.isArray(unknown) ? unknown : (typeof unknown === 'undefined' ? [] : [unknown]);
};

export function λthrow(Exception: new () => Error): never {
  // @ts-ignore
  throw Exception;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}