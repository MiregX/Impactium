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

  @WebSocketServer() server: Server;

  afterInit(server: Server) {
    console.log(process.env.APP_PRODUCTION_HOST)
    console.log(process.env.APP_SYMBOLIC_HOST)
    console.log(server)
  }

  handleConnection(client: Socket) {
    client.emit('stateUpdate', this.applicationService.info());
  }

  handleDisconnect(client: Socket) {}
}
