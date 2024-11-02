import { λLogger } from "@impactium/pattern";

const command = (str: string) => λLogger.cyan(str.padEnd(24));

export const help = `⌘ Список известных комманд:
- ${command('history')} - обновляет список комманд воиспроизведённых на сервере.
- ${command('/login {keypass}')} - позволяет авторизоватся при помощи ключ-фразы.
- ${command('/kick {indent} {code}')} - выгоняет команду с турнира.
- ${command('cls | clear')} - очищает историю.
`;