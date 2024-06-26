globalThis.useClasses = (...classNames: Array<string | Array<string | string[]>>): string => {
  const flatten = (arr: Array<string | Array<string | string[]>>): string[] => 
    arr.reduce((acc: string[], item: string | Array<string | string[]>) =>
      Array.isArray(item)
        ? acc.concat(flatten(item))
        : acc.concat(item)
    , []);

  return flatten(classNames).join(' ');
};
