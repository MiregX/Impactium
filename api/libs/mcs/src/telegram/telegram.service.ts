import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Telegraf, Context } from 'telegraf';

@Injectable()
export class TelegramService extends Telegraf implements OnModuleInit, OnModuleDestroy {
  constructor() {
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
    this.start((ctx) => ctx.reply('Welcome! Send me a message in the format start?login=[number]'));
    
    this.on('text', async (ctx) => {
      const messageText = ctx.message.text;
      const match = messageText.match(/^start\?login=(\d+)$/);
      
      if (match) {
        const userId = parseInt(match[1], 10);
        try {
          const user = await this.telegram.getChat(userId);
          const photos = await this.telegram.getUserProfilePhotos(userId);
          const photoUrl = photos.total_count > 0 ? await this.getPhotoUrl(photos.photos[0][0].file_id) : 'No photo available';

          console.log(user);
          console.log(photos);
          console.log(photoUrl);
          
          ctx.reply('');
        } catch (error) {
          ctx.reply('Could not retrieve user information. Make sure the user ID is correct.');
        }
      } else {
        ctx.reply('Invalid format. Please use the format start?login=[number].');
      }
    });
  }

  async getPhotoUrl(fileId: string): Promise<string> {
    const file = await this.telegram.getFile(fileId);
    return `https://api.telegram.org/file/bot${process.env.TELEGRAM_API_KEY}/${file.file_path}`;
  }
}
