import { ConflictException, Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthMethodService } from './addon/auth.interface';
import { createHash, createHmac, UUID } from 'crypto';
import { AuthPayload } from './addon/auth.entity';
import { TelegramService } from '@api/mcs/telegram/telegram.service';
import { λUtils } from '@impactium/utils';

@Injectable()
export class TelegramAuthService implements AuthMethodService {
  constructor(
    private readonly authService: AuthService,
    private readonly telegramService: TelegramService,
  ) {}
  
  async getUrl(uuid?: UUID) {
    const isExist = uuid && await this.telegramService.getPayload(uuid);
    if (isExist) throw new ConflictException;

    await this.telegramService.setPayload(uuid!);
    return `https://t.me/${process.env.TELEGRAM_API_ID}?start=${uuid}`
  }

  async callback(payload: AuthPayload, uuid?: UUID): Promise<`Bearer ${string}`> {
    if (uuid) Object.assign(payload, await this.telegramService.getPayload(uuid));

    payload.uid = await this.authService.getPayload(uuid) as string || undefined;
    return this.authService.register(payload);
  }

  async postCallback(uuid: UUID, uid?: string) {
    const payload = await this.telegramService.getPayload(uuid);

    if (typeof payload === 'boolean') return λUtils.home();

    payload.uid = uid ? uid : await this.authService.getPayload(uuid) as string || undefined;
    return this.authService.register(payload);
  }

  validate({ hash, ...obj }: Record<string, string>) {
    const dataCheckString = Object.keys(obj)
      .sort()
      .map(key => key + '=' + obj[key])
      .join('\n');

    const secretKey = createHash('sha256').update(process.env.TELEGRAM_API_KEY!).digest();
    
    return hash === createHmac('sha256', secretKey).update(dataCheckString).digest('hex');
  }
}
