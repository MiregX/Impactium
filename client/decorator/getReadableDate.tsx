interface Options {
  hour?: boolean;
  day?: boolean;
  month?: boolean;
  year?: boolean;
}

const fix = (number: number | false) => number.toString().padStart(2, '0');

export const getReadableDate = (date: Date | number | string, options: Options = {}): string => {
  const { hour = true, day = true, month = true, year = true } = options;
  date = new Date(date);

  const dateParts = [
    day ? fix(date.getUTCDate()) : null,
    month ? fix(date.getUTCMonth() + 1) : null,
    year ? date.getUTCFullYear().toString() : null
  ].filter(Boolean).join('.');

  const time = hour ? `${fix(date.getUTCHours())}:${fix(date.getUTCMinutes())}` : '';

  return `${time} ${dateParts}`.trim();
}

