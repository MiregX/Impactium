import { AuthPayload } from '@api/main/auth/addon/auth.entity';
import { dataset } from '@api/main/redis/redis.dto';
import { RedisService } from '@api/main/redis/redis.service';
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Telegraf, Context } from 'telegraf';

@Injectable()
export class TelegramService extends Telegraf implements OnModuleInit, OnModuleDestroy {
  constructor(
    private readonly redisService: RedisService,
  ) {
    super(process.env.TELEGRAM_API_KEY);
  }

  async onModuleInit() {
    await this.telegram.getMe();
    this.setupBotCommands();
  }

  async onModuleDestroy() {
    this.stop('SIGINT');
  }

  setupBotCommands() {
    this.start(async (ctx) => {
      const code = ctx.message.text.split(' ')[1]; // Получаем параметр после /start
      if (!code) {
        return await ctx.reply('Хуй на');
      }

      const payload = await ctx.getChat();
      const user: AuthPayload = {
        id: payload.id.toString(),
        displayName: payload['first_name'],
        lang: 'ru',
        type: 'telegram'
      }
      console.log(payload);
      console.log(user);
      const login = await this.redisService.get(dataset.telegram_logins + ':' + code);
      if (login) {
        await this.redisService.set(dataset.telegram_logins + ':' + code, JSON.stringify(user));
        await ctx.reply(`Готово, можете возвращаться на сайт: https://impactium.fun/`);
      }
    });

    this.launch()
  }

  private async getPhotoUrl(fileId: string): Promise<string> {
    const file = await this.telegram.getFile(fileId);
    return `https://api.telegram.org/file/bot${process.env.TELEGRAM_API_KEY}/${file.file_path}`;
  }
  
  async getLoginUrl(): Promise<string> {
    const code = this.generateLoginCode();

    const isExist = await this.redisService.get(`telegram_logins:${code}`);
    if (isExist) {
      return await this.getLoginUrl();
    } else {
      await this.redisService.setex(`telegram_logins:${code}`, 300, 'true');
      return `https://t.me/impactium_bot?start=${code}`;
    }
  }

  generateLoginCode(): string {
    const min = 100000;
    const max = 999999;
    return String(Math.floor(Math.random() * (max - min + 1)) + min);
  }

  callback(code) {
    throw new Error('Method not implemented.');
  }
}
