import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { TelegramService } from '@api/mcs/telegram/telegram.service';
import { AuthService } from './auth.service';
import { AuthMethod } from './addon/auth.interface';
import { UUID } from 'crypto';

@Injectable()
export class TelegramAuthService implements AuthMethod {
  constructor(
    private readonly authService: AuthService,
    private readonly telegramService: TelegramService
  ) {}

  async getUrl(uuid: UUID) {
    const isExist = uuid && await this.telegramService.getPayload(uuid);
    if (isExist) throw new ConflictException;

    await this.telegramService.setPayload(uuid);
    return `https://t.me/${process.env.TELEGRAM_API_ID}?start=${uuid}`
  }

  async callback(uuid: UUID) {
    const payload = await this.telegramService.getPayload(uuid);
    if (typeof payload === 'boolean') throw new BadRequestException;

    payload.uid = await this.authService.getPayload(uuid) as string || undefined;
    return this.authService.register(payload);
  }
}
