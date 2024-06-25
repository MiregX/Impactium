globalThis.useOptionStyling = (options: Record<string, any>, base: Record<string, string>): string => Object.keys(options)
  .filter(key => options[key])
  .map(key => base[key])
  .join(' ');
