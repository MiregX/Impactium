import {
  Controller,
  Get,
  Post,
  UseGuards,
  Param,
  Body,
  Redirect
} from '@nestjs/common';
import { AuthGuard } from '@api/main/auth/addon/auth.guard';
import { PaymentService } from './payment.service';
import { CoinbaseService } from './coinbase.service';
@Controller('payment')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly coinbaseService: CoinbaseService
  ) {}

  @Get('top-up')
  @UseGuards(AuthGuard)
  @Redirect()
  async topUp() {
    const charge = await this.coinbaseService.createCharge(321, 'USDT', 'Тестовый платёж');
    return { url: charge.hosted_url };
  }

  @Post('post/:type/:indent')
  @UseGuards(AuthGuard)
  post(
  ) {
  }
}