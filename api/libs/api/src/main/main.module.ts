import { ApplicationModule } from '@api/main/application/application.module';
import { PrismaModule } from '@api/main/prisma/prisma.module';
import { UserModule } from '@api/main/user/user.module';
import { AuthModule } from '@api/main/auth/auth.module';
import { Module } from '@nestjs/common';
import { SocketModule } from '../socket/socket.module';
import { TelegramModule } from '@api/mcs/telegram/telegram.module';

@Module({
  imports: [
    ApplicationModule,
    AuthModule,
    UserModule,
    PrismaModule,
    TelegramModule,
    SocketModule
  ]
})
export class MainModule { }
