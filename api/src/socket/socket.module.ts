import { forwardRef, Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { ApplicationModule } from '../application/application.module';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';

@Module({
  providers: [SocketGateway],
  imports: [
    forwardRef(() => ApplicationModule),
    UserModule,
    AuthModule,
  ], 
  exports: [SocketGateway]
})
export class SocketModule {}
