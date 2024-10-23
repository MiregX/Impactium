import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ApplicationService } from '../application/application.service';
import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { Configuration } from '@impactium/config';
import { λWebSocket } from '@impactium/pattern';

@Injectable()
@WebSocketGateway({
  path: '/api/ws',
  cors: {
    origin: Configuration.isProductionMode() ? 'https://impactium.fun' : 'http://localhost:3000',
    methods: ['*'],
    credentials: true,
  },
})
export class SocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    @Inject(forwardRef(() => ApplicationService))
    private readonly applicationService: ApplicationService
  ) {}

  @WebSocketServer() server!: Server;

  afterInit(server: Server) {}

  async handleConnection(client: Socket) {
    client.emit(λWebSocket.updateApplicationInfo, await this.applicationService.info());

    client.on(λWebSocket.blueprints, async () => {
      client.emit(λWebSocket.blueprints, await this.applicationService.getBlueprints());
    });
  }

  handleDisconnect(client: Socket) {}
}
