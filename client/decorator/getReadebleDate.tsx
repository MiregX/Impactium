interface Options {
  day?: boolean
  month?: boolean
  year?: boolean
}

const fix = (number: number | false) => number ? number.toString().padStart(2, '0') : null;

export const getReadebleDate = (date: Date, options: Options = {}) => {
  const { day = true, month = true, year = true } = options;
  date = new Date(date);
  const array = [
    day && date.getUTCDay(),
    month && date.getUTCMonth(),
    year && date.getUTCFullYear()
  ];
  return array.filter(n => n).map(number => fix(number)).join('.');
}