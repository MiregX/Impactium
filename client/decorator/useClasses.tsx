globalThis.useClasses = (...classNames: unknown[]): string => {
  const flatten = (arr: unknown[]): string[] =>
    arr.reduce<string[]>((acc, item) => {
      if (Array.isArray(item)) {
        acc.push(...flatten(item));
      } else if (typeof item === 'string') {
        acc.push(item);
      } else if (typeof item === 'boolean') {
        acc.push('');
      }
      return acc;
    }, []);

  return flatten(classNames).filter(Boolean).join(' ');
};
