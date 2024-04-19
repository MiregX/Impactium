import { Injectable } from '@nestjs/common';
import { pterosocket } from 'pterosocket';

@Injectable()
export class ConsoleService {
  private server: pterosocket;

  constructor() {
    this.launch();
  }

  async launch() {
    try {
      if (this.server?.ws) {
        this.server?.close();
      }
      
      this.server = new pterosocket(
        process.env.MINECAFT_SERVER_ORIGIN,
        process.env.MINECAFT_SERVER_TOKEN,
        process.env.MINECAFT_SERVER_ID,
        false
      );
  
      await this.server.connect(); 
      
      this.server.on("start", () => {
        console.log("WS Соединение с панелью управления установлено!");
        this.command('list');
      });

      // this.server.on("console_output", (msg: string) => { this.output(msg.replace(/\x1b\[\d+m/g, '')) })
    } catch (error) {
      console.log(error);
      await this.launch();
    }
  }

  async command(command, isQuiet = false) {
    try {
      if (!this.server.ws) {
        throw 'Pterosocket lost his WebSocket. Creating new one.'
      }
      this.server.writeCommand(command);
      // if (!isQuiet) log(`[MC] -> ${command}`, 'g');
      return true;
    } catch (error) {
      await this.launch();
      return await this.command(command, isQuiet);
    }
  }

  // output(message) {
  //   const messageHaveWarn = message.slice(0, 17).includes('WARN')
  //   const messageHaveError = message.slice(0, 17).includes('ERROR');
  //   const messageHaveInfo = !message.slice(0, 17).includes('INFO');
  //   if (messageHaveWarn || messageHaveError || messageHaveInfo || message.substring(17).startsWith('[Not Secure]')) {
  //     return;
  //   }

  //   message = message.substring(17)

  //   if (message.endsWith('joined the game')) {
  //     this.players.online.count++;
  //     this.players.online.list.push(message.split(' ')[0]);
  //     this.telegramBot.editMessage(this.players.online)
  //   }

  //   if (message.endsWith('left the game')) {
  //     this.players.online.count--;
  //     this.players.online.list = this.players.online.list.filter(p => p !== message.split(' ')[0]);
  //     this.telegramBot.editMessage(this.players.online);
  //   }

  //   if (message.startsWith('Players:')) {
  //     console.log(message);
  //     this.checkOnline(message);
  //   }

  //   if (message.endsWith('issued server command: /x')) {
  //     applyAchievementEffect(message.split(" ")[0]);
  //   }

  //   if (message.startsWith('[AuthMe]') && this.messagesWaitlist.includes(message) ) {

  //   }
  // }

  // async restart() {
  //   try {
  //     this.command('title @a times 20 160 20');
  //     this.command('title @a subtitle {"text":"\u0421\u0435\u0440\u0432\u0435\u0440 \u0431\u0443\u0434\u0435\u0442 \u043f\u0435\u0440\u0435\u0437\u0430\u0433\u0440\u0443\u0436\u0435\u043d \u0447\u0435\u0440\u0435\u0437 1 \u043c\u0438\u043d\u0443\u0442\u0443"}');
  //     setTimeout(() => {
  //       this.command('title @a title {"text":"Restart"}');
  //     }, 500);
  //     setTimeout(() => {
  //       this.command('kickall');
  //       setTimeout(() => {
  //         this.command('restart');
  //       }, 1000);
  //     }, 60000);
  //   } catch (error) {
  //     await this.launch();
  //     return await this.restart();
  //   }
  // }

  // checkOnline(message) {
  //   const players = message.substring(9).split(', ');
  //   this.players.online.list = players.map(p => p.split(' ')[1]);
  //   this.players.online.count = players.length;
  //   this.telegramBot.editMessage(this.players.online);
  // }
  
  // async getDatabasePlayers() {
  //   // Для получения списка игроков с базы данных на сервере
  //   // Результат возвращается масивом строк
  //   // а также присваивается в **this.players.database**
  //   const Players = await getDatabase("minecraftPlayers");
  //   const distinctNicknames = await Players.find({}, { _id: 0, nickname: 1 }).toArray();
  //   this.players.database = distinctNicknames.map(player => player.nickname).filter(n => n);
  //   return this.players.database;
  // }

  // async getWhitelistPlayers() {
  //   // Для получения списка игроков с вайтлиста на сервере
  //   // Использует SFTP для подключения к ноде, и выкачивает файл
  //   // Результат возвращается масивом обьектов, где есть name и uuid
  //   // а также присваивается в **this.players.whitelist**
  //   try {
  //     await this.sftp.connect();
  //     const players = await this.sftp.read('whitelist.json');
  //     await this.sftp.close();
  //     this.players.whitelist = JSON.parse(players);
  //   } catch (error) {
  //     console.log(error);
  //   } finally {
  //     return this.players.whitelist;
  //   }
  // }

  // async updateWhitelist() {
  //   // Синхронизирует список игроков MongoBD --> Whitelist
  //   await this.getDatabasePlayers();
  //   await this.getWhitelistPlayers();
  //   let isChanged = false;

  //   // Цикл для удаления игроков с вайтлиста, если игрок есть в вайтлисте но нет в бд
  //   this.players.whitelist.forEach(player => {
  //     if (this.players.database.find(nickname => nickname.toLowerCase() === player.name.toLowerCase())) return 
  //     this.command(`whitelist remove ${player.name}`);
  //     isChanged = true  
  //   });

  //   // Цикл для добавления игроков в вайтлист, если игрок есть в бд но нет в вайтлисте
  //   this.players.database.forEach(nickname => {
  //     const existPlayer = this.players.whitelist.find(player => player.name.toLowerCase() === nickname.toLowerCase())
  //     if (existPlayer) return 
  //     this.command(`whitelist add ${nickname}`);
  //     isChanged = true
  //   });
  //   // Если был добавлен хоть один игрок - перезагружаем вайтлист
  //   if (isChanged) {
  //     this.command('whitelist reload');
  //     await this.getWhitelistPlayers();
  //   }
  // }

  // async fetchStats() {
  //   // Обновляем обьект статистики по адресу **this.players.stats**
  //   // используя SFTP соединение, и поиск каждого игрока по нику -> uuid -> файл
  //   // Проверка осуществляется раз в 10 минут. Не раньше
  //   if (Date.now() - this.players.lastStatsFetch < 1000 * 60 * 10) return this.players.stats
  //   try {
  //     // Константим игроков, с серверного вайтлиста
  //     const players = await this.getWhitelistPlayers();
  //     const results = [];
  
  //     // Дожидаемся подключения и начинаем цикл
  //     await this.sftp.connect()
  //     for (const player of players) {
  //       try {
  //         // Пытаемся прочесть файл с ноды
  //         const result = await this.sftp.read(`world/stats/${player.uuid}.json`);
  //         const stats = JSON.parse(result).stats;
  //         if (!stats) continue;
  //         player.stats = stats;
  //         results.push(player);
  //       } catch (error) {
  //         // Ошибка возникает когда файла нет
  //         continue;
  //       }
  //     }
      
  //     // Закрываем соединение и присваиваем результат в адреса
  //     await this.sftp.close()
  //     this.players.stats = results;
  //     this.players.lastStatsFetch = Date.now(); 
  //     return results;
  //     // В случае ошибки возвращаем пустой массив
  //   } catch (error) { return [] }
  // }

  // async applyEffect({nickname, achievement, oldAchievement}) {
  //   const achievementsMap = {
  //     casual: 'haste',
  //     defence: 'resistance',
  //     killer: 'strength',
  //     event: 'speed',
  //     donate: 'speed',
  //     hammer: 'speed'
  //   }
  //   this.command(`effect clear ${nickname} minecraft:${achievementsMap[oldAchievement]}`);
  //   this.command(`effect give ${nickname} minecraft:${achievementsMap[achievement]} infinite 1 true`);
  // }
}
