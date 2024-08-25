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

@Injectable()
@WebSocketGateway({
  path: '/api/ws',
  cors: {
    origin: Configuration.getClientLink(),
    methods: ['*'],
    credentials: true,
  },
})
export class SocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    @Inject(forwardRef(() => ApplicationService))
    private readonly applicationService: ApplicationService
  ) {}

  @WebSocketServer() server: Server;

  afterInit(server: Server) {}

  handleConnection(client: Socket) {
    client.emit('stateUpdate', this.applicationService.info());
  }

  handleDisconnect(client: Socket) {}
}
