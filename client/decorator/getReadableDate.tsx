interface Options {
  hour?: boolean;
  day?: boolean;
  month?: boolean;
  year?: boolean;
}

const fix = (number: number | false) => number ? number.toString().padStart(2, '0') : null;

export const getReadableDate = (date: Date | number | string, options: Options = {}): string => {
  const { hour = true, day = true, month = true, year = true } = options;
  date = new Date(date);
  const array = [
    day ? fix(date.getUTCDate()) : null,
    month ? fix(date.getUTCMonth() + 1) : null,
    year ? date.getUTCFullYear().toString() : null
  ];
  return `${fix(date.getUTCHours())}:${fix(date.getUTCMinutes()) || '00'} ` + array.filter(n => n).join('.');
}
