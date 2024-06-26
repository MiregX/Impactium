export function useApperand<T extends object>(state: T, keys: (keyof T)[]): any {
  return state[keys[0]] || state[keys[1]];
}
