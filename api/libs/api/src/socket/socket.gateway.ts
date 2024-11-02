import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ApplicationService } from '../application/application.service';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Configuration } from '@impactium/config';
import { λWebSocket } from '@impactium/pattern';
import { Logger } from '../application/addon/logger.service';
import { WebSocketEmitDefinitions, WebSocketOnDefinitions } from '@impactium/types';

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

  @WebSocketServer() server!: Server<WebSocketOnDefinitions, WebSocketEmitDefinitions>;

  afterInit(server: Server) {}

  async handleConnection(client: Socket<WebSocketOnDefinitions, WebSocketEmitDefinitions>) {
    client.on(λWebSocket.updateApplicationInfo, async () => {
      const application = await this.applicationService.info()
      client.emit(λWebSocket.updateApplicationInfo, application);
      return application;
    });

    // client.on(λWebSocket.blueprints, await this.applicationService.getBlueprints());

    client.on(λWebSocket.command, () => client.emit(λWebSocket.history, (() => Logger.history())()));
  }

  handleDisconnect(client: Socket) {}
}
