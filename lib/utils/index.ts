import { MaybeArray } from '@impactium/types';
import { twMerge } from 'tailwind-merge'
import { type ClassValue, clsx } from 'clsx'

export function capitalize(str: string) {
  return str?.substring(0, 1).toUpperCase() + str?.substring(1)
};

export function between(num: number, min: number, max: number) {
  return num >= min && num <= max;
};

export function toArray<K extends unknown>(unknown: MaybeArray<K>): K[] {
  return Array.isArray(unknown) ? unknown : (typeof unknown === 'undefined' ? [] : [unknown]);
};

export function λthrow(Exception: new () => Error): never {
  throw new Exception();
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}