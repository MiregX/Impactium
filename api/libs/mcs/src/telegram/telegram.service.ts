import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Telegraf, Markup } from 'telegraf';

@Injectable()
export class TelegramService
extends Telegraf
implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super(process.env.TELEGRAM_API_KEY);
  }

  async onModuleInit() {
    await this.telegram.getMe();
  }

  async onModuleDestroy() {}
  
  async editPinnedMessage({count, list}) {
    try {
      await this.telegram.editMessageText(
        process.env.CHANNEL_ID,
        parseInt(process.env.MESSAGE_ID),
        null,
        `Сейчас на сервере:\n`,
        Markup.inlineKeyboard([
          Markup.button.callback(`Онлайн: ${count} / 50`, 'onlineButtonCallback'),
        ])
      );
    } catch (_) {}
  }
}
