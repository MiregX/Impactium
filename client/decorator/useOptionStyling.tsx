globalThis.useOptionStyling = (options: Record<string, any> | undefined, base: Record<string, string>): string => options ? Object.keys(options)
  .filter(key => options[key])
  .map(key => base[key])
  .join(' ') : '';
