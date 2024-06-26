export function useApperand(state: Record<string, any>, keys: string[]): any {
  return keys[0] in state ? state[keys[0]] : (keys[1] in state ? state[keys[1]] : null);
}
