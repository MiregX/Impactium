import { EnvironmentKeyNotProvided } from '@api/main/application/addon/error';
import { AuthPayload } from '@api/main/auth/addon/auth.entity';
import { dataset } from '@api/main/redis/redis.dto';
import { RedisService } from '@api/main/redis/redis.service';
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { LoginType } from '@prisma/client';
import { UUID } from 'crypto';
import { Configuration } from 'src/configuration';
import { Markup, Telegraf } from 'telegraf';

@Injectable()
export class TelegramService extends Telegraf implements OnModuleInit, OnModuleDestroy {
  isActive: boolean = false;

  constructor(
    private readonly redisService: RedisService,
  ) {
    super(process.env.TELEGRAM_API_KEY ?? (() => { throw new EnvironmentKeyNotProvided('TELEGRAM_API_KEY') })());
  }

  async onModuleInit() {
    try {
      // await this.telegram.getMe();
      // this.setupBotCommands();
      this.isActive = true;
    } catch (_) {
      this.isActive = false;
    }
  }

  async onModuleDestroy() {
    this.stop('SIGINT');
  }

  setupBotCommands() {
    this.start(async (ctx) => {
      const uuid = ctx.message.text.split(' ')[1] as UUID;
      const hasLogin = await this.getPayload(uuid)
      if (!uuid || !hasLogin) {
        return await ctx.reply('Даже не пытайся меня наебать...');
      }

      const payload: AuthPayload = await ctx.getChat().then(async data => {
        const file = data.photo && await ctx.telegram.getFile(data.photo.small_file_id);

        return {
          id: data.id.toString(),
          displayName: `${data['first_name']}${data['last_name'] ? ` ${data['last_name']}` : ''}`,
          lang: 'ru',
          type: LoginType.telegram,
          avatar: file ? `https://api.telegram.org/file/bot${this.telegram.token}/${file.file_path}` : undefined
        }
      });

      await this.setPayload(uuid, payload);
      ctx.reply(
        `Готово, у тебя есть 5 минут чтобы вернуться на сайт <a href='${Configuration.link}'>Impactium</a>`,
        {
          parse_mode: 'HTML',
          ...Markup.inlineKeyboard([
            Markup.button.url('Вернуться на сайт', Configuration.isProductionMode() ? Configuration.link() : 'https://impactium.fun')
          ])
        }
      );
    });

    this.launch()
  }

  async getPayload(uuid: UUID): Promise<boolean | AuthPayload> {
    const payload = await this.redisService.get(this.getCacheFolder(uuid));

    if (!payload) return false;

    try {
      return JSON.parse(payload);
    } catch (_) {
      return !!payload
    }
  }

  async setPayload(uuid: UUID, payload?: AuthPayload) {
    await this.redisService.setex(this.getCacheFolder(uuid), 300, JSON.stringify(payload) || uuid);
  }

  private getCacheFolder(uuid: UUID) {
    return `${dataset.telegram_logins}:${uuid}`
  }

  async _latency() {
    if (!this.isActive) return 999;
    const start = process.hrtime.bigint();
    await this.telegram.getMe();
    const end = process.hrtime.bigint();

    return parseInt((Number(end - start) / 1e6).toFixed(0));
  }
}