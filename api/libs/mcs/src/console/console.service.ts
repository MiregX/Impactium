import {
  Injectable,
  Inject,
  OnModuleDestroy,
  OnModuleInit,
  forwardRef,
} from '@nestjs/common';
import { pterosocket } from 'pterosocket';
import { TelegramService } from '../telegram/telegram.service';
import type { Online, Statistics } from './console.dto'
import { PlayerService } from '@api/main/player/player.service';
import { RedisService } from '@api/main/redis/redis.service';

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
    @Inject(forwardRef(() => PlayerService))
    private readonly playerService: PlayerService,
    private readonly redisService: RedisService,
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
      
      this.server.on("console_output", (message: string) => this.output(this.fixMessage(message)));
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
        let skipped: boolean = false;
  
        const output = (message: string) => {
          if (!skipped) return skipped = true;

          if (!expect) resolve(message);
  
          messages.push(message);
          if (messages.length === expect) resolve(messages);
        };
  
        this.server.on("console_output", (message: string) => output(this.fixMessage(message)));
      });
    } catch (_) {
      await this.connect();
      return await this.command(command, expect);
    }
  }
  
  output(message: string) {
    if (message.startsWith('[Not Secure]')) return

    this.handlePlayerActivity(message);
  }

  count(message: string): Online {
    const players = message.substring(9).split(', ');
    this.players.online.list = players.map(p => p.split(' ')[1]);
    this.players.online.count = players.length;
    return this.players.online
  }
  
  async getDatabasePlayers(): Promise<string[]> {
    return this.players.database = await this.playerService.getAllPlayersNicknames()
  }

  async getWhitelistPlayers(): Promise<string[]> {
    const players: string[] = await this.command('whitelist list').then((message: string) => {
      return message.replace(/^[^:]+: /, "").split(', ');
    });
    return this.players.whitelist = players;
  }

  async syncWhitelist() {
    await this.getDatabasePlayers();
    await this.getWhitelistPlayers();
    let isChanged = false;

    this.players.whitelist.forEach(player => {
      const existPlayer = this.players.database.find(nickname => nickname.toLowerCase() === player.toLowerCase())
      if (!existPlayer) {
        this.command(`whitelist remove ${player}`);
        isChanged = true
      }
    });

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

  private handlePlayerActivity(message: string) {
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

  private fixMessage(message: string): string {
    return message.replace(/\x1b\[\d+m/g, '').substring(17)
  }
}
