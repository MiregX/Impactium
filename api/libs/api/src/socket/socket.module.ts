import { forwardRef, Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { ApplicationModule } from '../application/application.module';

@Module({
  providers: [SocketGateway],
  imports: [forwardRef(() => ApplicationModule)], 
  exports: [SocketGateway]
})
export class SocketModule {}
