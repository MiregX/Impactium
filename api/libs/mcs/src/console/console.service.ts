import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { pterosocket } from 'pterosocket';
import { TelegramService } from '../telegram/telegram.service';
import type { Online, Statistics } from './console.dto'
import { PlayerService } from '@api/main/player/player.service';

interface Players {
  online: Online
  whitelist?: string[],
  database?: string[],
  lastStatsFetch?: Date,
  stats?: Statistics[]
}

@Injectable()
export class ConsoleService implements OnModuleInit, OnModuleDestroy {
  private server: pterosocket;
  players: Players;
  
  constructor(
    private readonly telegramService: TelegramService,
    private readonly playerService: PlayerService,
  ) {
    this.server = new pterosocket(
      process.env.MINECAFT_SERVER_ORIGIN,
      process.env.MINECAFT_SERVER_TOKEN,
      process.env.MINECAFT_SERVER_ID,
      false // Отключаем автосоединение
    );
    
    this.players = {
      online: {
        list: [],
        count: 0
      }
    }
  }
  
  async onModuleInit() {
    await this.connect();
  }
  
  async onModuleDestroy() {
    await this.server.disconnect();
  }
  
  async connect() {
    try {
      await this.server.connect(); 
      
      this.server.on("start", () => {
        this.command('list');
      });
      
      this.server.on("console_output", (msg: string) => {
        this.output(msg)
      });
    } catch (_) {
      console.log(_);
      await this.connect();
    }
  }

  async command(command: string, expect?: number): Promise<string | string[]> {
    try {
      this.server.writeCommand(command);
      return new Promise((resolve) => {
        const messages: string[] = [];
  
        const handleOutput = (msg: string) => {
          const cleanedMsg = msg.replace(/\x1b\[\d+m/g, '');
          if (!expect) {
            resolve(cleanedMsg);
          }

          messages.push(cleanedMsg);
          if (messages.length === expect) {
            resolve(messages);
          }
        };
  
        this.server.on("console_output", handleOutput);
      });
    } catch (error) {
      await this.connect();
      return await this.command(command, expect);
    }
  }  
  
  output(message: string) {
    message = message.replace(/\x1b\[\d+m/g, '').substring(17);
    if (message.startsWith('[Not Secure]')) return

    this.handlePlayerActivity(message);
  }

  handlePlayerActivity(message) {
    if (message.endsWith('joined the game')) {
      this.players.online.count++;
      this.telegramService.editPinnedMessage(this.players.online)
    }
    
    if (message.endsWith('left the game')) {
      this.players.online.count--;
      this.telegramService.editPinnedMessage(this.players.online);
    }
    
    if (message.startsWith('Players:')) {
      this.telegramService.editPinnedMessage(this.count(message));
    }
  }

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

  count(message: string): Online {
    console.log(message)
    const players = message.substring(9).split(', ');
    this.players.online.list = players.map(p => p.split(' ')[1]);
    this.players.online.count = players.length;
    return this.players.online
  } 
  
  async getDatabasePlayers() {
    return this.players.database = await this.playerService.getAllPlayersNicknames()
  }

  async getWhitelistPlayers(): Promise<string[]> {
    const players: string[] = await this.command('whitelist list').then((message: string) => {
      return message.replace(/^[^:]+: /, "").split(', ');
    });
    return this.players.whitelist = players;
  }

  async syncWhitelist() {
    // Синхронизирует список игроков MongoBD --> Whitelist
    await this.getDatabasePlayers();
    await this.getWhitelistPlayers();
    let isChanged = false;

    // Цикл для удаления игроков с вайтлиста, если игрок есть в вайтлисте но нет в бд
    this.players.whitelist.forEach(player => {
      if (this.players.database.find(nickname => nickname.toLowerCase() === player.toLowerCase())) return 
      this.command(`whitelist remove ${player}`);
      isChanged = true
    });

    // Цикл для добавления игроков в вайтлист, если игрок есть в бд но нет в вайтлисте
    this.players.database.forEach(nickname => {
      const existPlayer = this.players.whitelist.find(player => player.toLowerCase() === nickname.toLowerCase())
      if (!existPlayer) {
        this.command(`whitelist add ${nickname}`);
        isChanged = true
      }
    });
    
    if (isChanged) {
      this.command('whitelist reload');
      await this.getWhitelistPlayers();
    }
  }

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
