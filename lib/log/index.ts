export enum color {
  red = "\u001b[31m",
  green = "\u001b[32m",
  yellow = "\u001b[33m",
  blue = "\u001b[34m",
  purple = "\u001b[35m",
  cyan = "\u001b[36m",
  white = "\u001b[0m"
}

interface _log {
  prefix?: {
    color: color,
    title: string
  },
  message: {
    color?: color
  }
}

export const log = (...args: any) => {
  const _color = args.pop();

  let message = '';
  for (const arg of args) {
    if (typeof arg === 'string') {
      message += arg;
    } else {
      const formattedJson = JSON.stringify(arg, null, 2);
      message += formattedJson;
    }
  }

  const _timestamp = formatDate()

  console.log(color.blue
               + "["
               + color.cyan
               + args[0]
               + color.blue
               + "]"
               + color.white
               + ` - `
               + `${_timestamp.date} ${_timestamp.time}`
               + color[_color]
               + message
               + color.white
              );
}

// [Nest] 708  - 20.04.2024, 16:14:29     LOG [NestApplication] Nest application successfully started +690ms

function formatDate() {
  const date = new Date();

  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear().toString();

  return {
    time: `${hours}:${minutes}:${seconds}`,
    hour: `${hours}`,
    shortTime: `${hours}:${minutes}`,
    date: `${day}.${month}.${year}`,
    shortDate: `${hours}:${minutes} ${day}.${month}`
  };
}