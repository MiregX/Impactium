import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { TelegramService } from '@api/mcs/telegram/telegram.service';
import { AuthService } from './auth.service';

@Injectable()
export class TelegramAuthService {

  constructor(
    private readonly authService: AuthService,
    private readonly telegramService: TelegramService
  ) {}

  async getUrl(uuid: string) {
    const isExist = await this.telegramService.getPayload(uuid);
    if (isExist) throw new ConflictException;

    await this.telegramService.setPayload(uuid);
    return `https://t.me/impactium_bot?start=${uuid}`
  }

  async callback(uuid: string) {
    const payload = await this.telegramService.getPayload(uuid);
    if (typeof payload === 'boolean') throw new BadRequestException;

    return this.authService.register(payload);
  }
}
