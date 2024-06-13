import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PrismaModule } from '@api/main/prisma/prisma.module';
import { UserModule } from '@api/main/user/user.module';
import { PaymentService } from './payment.service';
import { AuthModule } from '../auth/auth.module';
import { CoinbaseService } from './coinbase.service';

@Module({
  controllers: [PaymentController],
  imports: [PrismaModule, UserModule, AuthModule],
  providers: [PaymentService, CoinbaseService],
  exports: [],
})
export class TransactionModule {}
