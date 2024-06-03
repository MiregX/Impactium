import { AuthPayload } from '@api/main/auth/addon/auth.entity';
import { dataset } from '@api/main/redis/redis.dto';
import { RedisService } from '@api/main/redis/redis.service';
import { Configuration } from '@impactium/config';
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { LoginType } from '@prisma/client';
import { Telegraf } from 'telegraf';

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
      const uuid = ctx.message.text.split(' ')[1];
      const hasLogin = await this.getPayload(uuid)
      if (!uuid || !hasLogin) {
        return await ctx.reply('Даже не пытайся меня наебать...');
      }

      const payload: AuthPayload = await ctx.getChat().then(async data => {  
        const file = await ctx.telegram.getFile(data.photo.small_file_id);

        return {
          id: data.id.toString(),
          displayName: `${data['first_name']}${data['last_name'] ? ` ${data['last_name']}` : ''}`,
          lang: 'ru',
          type: LoginType.telegram,
          avatar: `https://api.telegram.org/file/bot${this.telegram.token}/${file.file_path}`
        }
      });

      await this.setPayload(uuid, payload);
      ctx.reply(`Готово, у тебя есть 5 минут чтобы вернуться на сайт: ${Configuration.getClientLink()}`);
    });

    this.launch()
  }

  async getPayload(uuid: string): Promise<boolean | AuthPayload> {
    const payload = await this.redisService.get(this.getCacheFolder(uuid));
    try {
      return JSON.parse(payload);
    } catch (_) {
      return !!payload
    }
  }

  async setPayload(uuid: string, payload?: AuthPayload) {
    await this.redisService.setex(this.getCacheFolder(uuid), 300, JSON.stringify(payload) || uuid);
  }

  private getCacheFolder(uuid: string) {
    return `${dataset.telegram_logins}:${uuid}`
  }

  async _latency() {
    const start = process.hrtime.bigint();
    await this.telegram.getMe();
    const end = process.hrtime.bigint();

    return  Number(end - start) / 1e6;
  }
}
