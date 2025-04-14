import { ApplicationModule } from 'src/application/application.module';
import { PrismaModule } from 'src/prism/prisma.module';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';
import { Module } from '@nestjs/common';
import { SocketModule } from '../socket/socket.module';
import { TelegramModule } from 'src/telegram/telegram.module';

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
