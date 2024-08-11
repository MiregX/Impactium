import { Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthMethodService } from './addon/auth.interface';
import { createHash, createHmac, UUID } from 'crypto';
import { AuthPayload } from './addon/auth.entity';

@Injectable()
export class TelegramAuthService implements Omit<AuthMethodService, 'getUrl'> {
  constructor(
    private readonly authService: AuthService,
  ) {}

  async callback(payload: AuthPayload) {
    return this.authService.register(payload);
  }

  validate({ hash, ...obj }: Record<string, string>) {
    const dataCheckString = Object.keys(obj)
      .sort()
      .map(key => key + '=' + obj[key])
      .join('\n');

    const secretKey = createHash('sha256').update(process.env.TELEGRAM_API_KEY).digest();
    
    return hash === createHmac('sha256', secretKey).update(dataCheckString).digest('hex');
  }
}
